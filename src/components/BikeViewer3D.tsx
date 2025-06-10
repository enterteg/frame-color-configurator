'use client';

import React, { useRef, Suspense, useEffect, useState } from 'react';
import { Canvas, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, useGLTF, Center, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { RALColor } from '../data/ralColors';

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
  onPartClick?: (part: 'frame' | 'fork' | 'logos') => void;
  activeTab?: 'frame' | 'fork' | 'logos';
}

function BikeModel({ 
  frameColor = '#888888', 
  forkColor = '#666666', 
  modelPath,
  textureUrl,
  canvasTexture,
  onPartClick
}: BikeModelProps & { canvasTexture: THREE.Texture | null, offsetX?: number, offsetY?: number }) {
  const { scene } = useGLTF(modelPath);
  const modelRef = useRef<THREE.Group>(null);
  const [baseTexture, setBaseTexture] = useState<THREE.Texture | null>(null);
  
  // Load base texture when textureUrl is provided
  useEffect(() => {
    if (textureUrl) {
      const loader = new THREE.TextureLoader();
      loader.load(
        textureUrl,
        (texture) => {
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          texture.flipY = true;
          setBaseTexture(texture);
        },
        undefined,
        (error) => {
          console.warn('Error loading base texture:', error);
        }
      );
    }
  }, [textureUrl]);
  
  // Collect all meshes from the scene
  const meshes: THREE.Mesh[] = [];
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      meshes.push(child);
    }
  });

  // Apply color/material logic whenever canvasTexture, baseTexture, or colors change
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
        
        if (material.name === "DOWN_TUBE_LEFT" || material.name === "DOWN_TUBE_RIGHT") {
          if (canvasTexture) {
            // Use the custom logo texture (from Konva)
            console.log('Applying canvas texture to', material.name); // Debug log
            material.color.set('#ffffff'); // Set to white to show texture clearly
            material.map = canvasTexture;
            material.polygonOffset = true;
            material.polygonOffsetFactor = -2;
            material.transparent = true;
            material.alphaTest = 0.5;
            // Remove emissive for texture materials to avoid washing out colors
            material.emissive.set('#000000');
            material.emissiveIntensity = 0;
          } else if (baseTexture) {
            // Use the base texture when no logo texture is available
            console.log('Applying base texture to', material.name); // Debug log
            material.color.set('#ffffff'); // Set to white to show texture clearly
            material.map = baseTexture;
            material.polygonOffset = true;
            material.polygonOffsetFactor = -2;
            material.transparent = false;
            material.alphaTest = 0.1;
            material.emissive.set('#000000');
            material.emissiveIntensity = 0;
          } else {
            // No texture, just use frame color
            console.log('Using frame color for', material.name); // Debug log
            material.color.set(frameColor);
            material.map = null;
            material.emissive.set(material.color.getHex());
            material.emissiveIntensity = 0.1;
          }
        } else {
          // For other materials, keep normal emissive settings
          material.emissive.set(material.color.getHex());
          material.emissiveIntensity = 0.1;
        }
        material.needsUpdate = true;
      }
    });
  }, [canvasTexture, baseTexture, frameColor, forkColor, meshes]);

  // Handle mesh clicks
  const handleMeshClick = (mesh: THREE.Mesh, event: ThreeEvent<MouseEvent>) => {
    if (!onPartClick) return;
    
    event.stopPropagation();
    const objectName = mesh.name.toLowerCase();
    const material = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
    
    if (objectName.includes("frame") || (material && 'name' in material && (material.name === "DOWN_TUBE_LEFT" || material.name === "DOWN_TUBE_RIGHT"))) {
      onPartClick('frame');
    } else if (objectName.includes("fork")) {
      onPartClick('fork');
    }
  };

  return (
    <Center>
      <group ref={modelRef}>
        {meshes.map((mesh) => {
          const objectName = mesh.name.toLowerCase();
          const material = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
          const isFrame = objectName.includes("frame") || (material && 'name' in material && (material.name === "DOWN_TUBE_LEFT" || material.name === "DOWN_TUBE_RIGHT"));
          const isFork = objectName.includes("fork");
          
          return (
            <mesh
              key={mesh.uuid}
              geometry={mesh.geometry}
              material={mesh.material}
              position={mesh.position}
              scale={mesh.scale}
              castShadow
              receiveShadow
              onClick={(event) => handleMeshClick(mesh, event)}
              onPointerOver={() => {
                if (isFrame || isFork) {
                  document.body.style.cursor = 'pointer';
                }
              }}
              onPointerOut={() => {
                document.body.style.cursor = 'default';
              }}
            />
          );
        })}
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
        maxDistance={100}
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
  onPartClick?: (part: 'frame' | 'fork' | 'logos') => void;
}

export default function BikeViewer3D({ 
  selectedColors, 
  combinedModelPath = '/models/bike.glb',
  textureUrl,
  className = '',
  canvasTexture = null,
  repeatX = 1,
  repeatY = 1,
  offsetX = 0,
  offsetY = 0,
  onPartClick
}: BikeViewer3DProps) {
  const [frameColor, setFrameColor] = useState(selectedColors[0]?.hex || '#888888');

  // Update frameColor if selectedColors changes
  useEffect(() => {
    setFrameColor(selectedColors[0]?.hex || '#888888');
  }, [selectedColors]);

  return (
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
              textureUrl={textureUrl}
              canvasTexture={canvasTexture}
              repeatX={repeatX}
              repeatY={repeatY}
              offsetX={offsetX}
              offsetY={offsetY}
              onPartClick={onPartClick}
            />
          </Suspense>
        </SceneSetup>
      </Canvas>
    </div>
  );
} 