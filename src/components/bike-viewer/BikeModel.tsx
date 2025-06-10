'use client';

import React, { useRef, useEffect } from 'react';
import { useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';

export interface BikeModelProps {
  frameColor?: string;
  forkColor?: string;
  modelPath: string;
  canvasTexture: THREE.Texture | null;
  offsetX?: number;
  offsetY?: number;
  repeatX: number;
  repeatY: number;
  onPartClick?: (part: 'frame' | 'fork' | 'logos') => void;
  activeTab?: 'frame' | 'fork' | 'logos';
}

export default function BikeModel({ 
  frameColor = '#888888', 
  forkColor = '#666666', 
  modelPath,
  canvasTexture
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
            material.polygonOffsetFactor = -3;
            material.transparent = true;
            material.alphaTest = 0.2;
            // Remove emissive for texture materials to avoid washing out colors
            material.emissive.set('#000000');
            material.emissiveIntensity = 0;
          }
        } else {
          // For other materials, keep normal emissive settings
          material.emissive.set(material.color.getHex());
          material.emissiveIntensity = 0.1;
        }
        material.needsUpdate = true;
      }
    });
  }, [canvasTexture, frameColor, forkColor, meshes]);

  // // Handle mesh clicks
  // const handleMeshClick = (mesh: THREE.Mesh, event: ThreeEvent<MouseEvent>) => {
  //   if (!onPartClick) return;
    
  //   event.stopPropagation();
  //   const objectName = mesh.name.toLowerCase();
  //   const material = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
    
  //   if (objectName.includes("frame") || (material && 'name' in material && (material.name === "DOWN_TUBE_LEFT" || material.name === "DOWN_TUBE_RIGHT"))) {
  //     onPartClick('frame');
  //   } else if (objectName.includes("fork")) {
  //     onPartClick('fork');
  //   }
  // };

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
              // onClick={(event) => handleMeshClick(mesh, event)}
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