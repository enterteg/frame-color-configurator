'use client';

import React, { useRef, Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Center, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { RALColor } from '../data/ralColors';

// Color Indicators Component
interface ColorIndicatorsProps {
  frameColor: string;
  forkColor: string;
}

function ColorIndicators({ frameColor, forkColor }: ColorIndicatorsProps) {
  return (
    <div className="absolute top-4 left-4 space-y-2">
      <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded px-3 py-1">
        <div
          className="w-4 h-4 rounded border border-gray-300"
          style={{ backgroundColor: frameColor }}
        />
        <span className="text-sm text-black font-medium">Frame</span>
      </div>
      <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded px-3 py-1">
        <div
          className="w-4 h-4 rounded border border-gray-300"
          style={{ backgroundColor: forkColor }}
        />
        <span className="text-sm text-black font-medium">Fork</span>
      </div>
    </div>
  );
}

// Loading Fallback Component
function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[2, 1, 0.5]} />
      <meshStandardMaterial color="#cccccc" />
    </mesh>
  );
}

// Bike Model Component
interface BikeModelProps {
  frameColor?: string;
  forkColor?: string;
  modelPath: string;
  textureUrl?: string;
  canvasTexture: THREE.Texture | null;
  offsetX?: number;
  offsetY?: number;
  repeatX: number;
  repeatY: number;
}

function BikeModel({ 
  frameColor = '#888888', 
  forkColor = '#666666', 
  modelPath, 
  canvasTexture,
}: BikeModelProps & { canvasTexture: THREE.Texture | null, offsetX?: number, offsetY?: number }) {
  const { scene } = useGLTF(modelPath);
  const modelRef = useRef<THREE.Group>(null);
  
  // Collect all meshes from the scene
  const meshes: THREE.Mesh[] = [];
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      meshes.push(child);
    }
  });

  // Apply color/material logic whenever canvasTexture or colors change
  useEffect(() => {
    meshes.forEach((mesh) => {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      const material: THREE.Material = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material
      if (material instanceof THREE.MeshStandardMaterial) {
        material.metalness = 0.85;
        material.roughness = 0.1;
        material.envMapIntensity = 1.0;

        const objectName = mesh.name.toLowerCase();

        if (objectName.includes("frame")) {
          material.color.set(frameColor);
        } else if (objectName.includes("fork")) {
          material.color.set(forkColor);
        }
        
        if ((material.name === "DOWN_TUBE_LEFT" || material.name === "DOWN_TUBE_RIGHT") && canvasTexture) {
          material.color.set('#ffffff'); // Set to white to show texture clearly
          material.map = canvasTexture;
          material.polygonOffset = true;
          material.polygonOffsetFactor = -2;
          material.transparent = true;
          material.alphaTest = 0.5;
          // Remove emissive for texture materials to avoid washing out colors
          material.emissive.set('#000000');
          material.emissiveIntensity = 0;
        } else if (material.name === "DOWN_TUBE_LEFT" || material.name === "DOWN_TUBE_RIGHT") {
          // No texture, just use frame color
          material.color.set(frameColor);
          material.map = null;
          material.emissive.set(material.color.getHex());
          material.emissiveIntensity = 0.1;
        } else {
          // For other materials, keep normal emissive settings
          material.emissive.set(material.color.getHex());
          material.emissiveIntensity = 0.1;
        }
        material.needsUpdate = true;
      }
    });
  }, [canvasTexture, frameColor, forkColor, meshes]);

  return (
    <Center>
      <group ref={modelRef}>
        {meshes.map((mesh) => (
          <mesh
            key={mesh.uuid}
            geometry={mesh.geometry}
            material={mesh.material}
            position={mesh.position}
            scale={mesh.scale}
            castShadow
            receiveShadow
          />
        ))}
      </group>
    </Center>
  );
}

// Scene Setup Component
interface SceneSetupProps {
  children: React.ReactNode;
}

function SceneSetup({ children }: SceneSetupProps) {
  return (
    <>
      {/* Store Display Lighting Setup */}
      {/* Key Light - Main directional light from top-front */}
      <directionalLight
        position={[5, 10, 5]}
        intensity={3}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Fill Light - Softer light from the side */}
      <directionalLight position={[-3, 5, 2]} intensity={1.5} color="#ffffff" />

      {/* Ambient Light - Increased for brighter colors */}
      <ambientLight intensity={2} color="#ffffff" />

      {/* Environment for realistic reflections */}
      <Environment preset="studio" background={false} />

      {/* Additional light for environment compensation */}
      <hemisphereLight intensity={4} color="#ffffff" groundColor="#ffffff" />


      {children}

      {/* Camera controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={10}
        maxDistance={40}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
        minAzimuthAngle={-Infinity}
        maxAzimuthAngle={Infinity}
      />
    </>
  );
}

// Main BikeViewer3D Component
interface BikeViewer3DProps {
  selectedColors: RALColor[];
  combinedModelPath?: string;
  textureUrl?: string;
  className?: string;
  canvasTexture?: THREE.Texture | null;
  repeatX?: number;
  repeatY?: number;
  offsetX?: number;
  offsetY?: number;
}

export default function BikeViewer3D({ 
  selectedColors, 
  combinedModelPath = '/models/bike.glb',
  className = '',
  canvasTexture = null,
  repeatX = 1,
  repeatY = 1,
  offsetX = 0,
  offsetY = 0
}: BikeViewer3DProps) {
  const [frameColor, setFrameColor] = useState(selectedColors[0]?.hex || '#888888');

  // Update frameColor if selectedColors changes
  useEffect(() => {
    setFrameColor(selectedColors[0]?.hex || '#888888');
  }, [selectedColors]);

  return (
    <>
      <div
        className={`w-full h-full bg-gray-100 rounded-lg overflow-hidden relative ${className}`}
      >
        <Canvas
          camera={{
            position: [0, 0, 1],
            fov: 50,
          }}
          shadows="soft"
          gl={{ 
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            toneMapping: THREE.NoToneMapping,
            toneMappingExposure: 1.0
          }}
        >
          <SceneSetup>
            <Suspense fallback={<LoadingFallback />}>
              <BikeModel
                frameColor={frameColor}
                forkColor={selectedColors[1]?.hex || '#666666'}
                modelPath={combinedModelPath}
                canvasTexture={canvasTexture}
                repeatX={repeatX}
                repeatY={repeatY}
                offsetX={offsetX}
                offsetY={offsetY}
              />
            </Suspense>
          </SceneSetup>
        </Canvas>
        <ColorIndicators frameColor={frameColor} forkColor={selectedColors[1]?.hex || '#666666'} />
      </div>
    </>
  );
} 