'use client';

import React, { useRef, useEffect } from 'react';
import { useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';
import { ThreeEvent } from '@react-three/fiber';
import { useBikeStore } from '../../store/useBikeStore';

export interface BikeModelProps {
  modelPath: string;
  onPartClick?: (part: 'frame' | 'fork' | 'logos') => void;
}

export default function BikeModel({ 
  modelPath,
  onPartClick,
}: BikeModelProps) {
  const { scene } = useGLTF(modelPath);
  const modelRef = useRef<THREE.Group>(null);
  
  // Only subscribe to textures and colors, not the full logoTypes object
  const frameColor = useBikeStore((s) => s.frameColor);
  const forkColor = useBikeStore((s) => s.forkColor);
  const headTubeTexture = useBikeStore((s) => s.logoTypes.HEAD_TUBE.texture);
  const downTubeLeftTexture = useBikeStore((s) => s.logoTypes.DOWN_TUBE_LEFT.texture);
  const downTubeRightTexture = useBikeStore((s) => s.logoTypes.DOWN_TUBE_RIGHT.texture);

  // Collect all meshes from the scene
  const meshes: THREE.Mesh[] = [];
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      meshes.push(child);
    }
  });

  // Apply color/material logic whenever textures or colors change
  useEffect(() => {
    meshes.forEach((mesh) => {
      const material: THREE.Material = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material
      if (material instanceof THREE.MeshStandardMaterial) {
        material.metalness = 0.45;
        material.roughness = 0.1;
        material.envMapIntensity = 1.0;

        const objectName = mesh.name.toLowerCase();
        const materialName = material.name.toLowerCase();

        if (materialName === "tire" || materialName === "tan_wall") {
          // Rubber material properties
          material.metalness = 0;
          material.roughness = 0.9;
          material.envMapIntensity = 0.1;
          material.emissiveIntensity = 0;
          material.emissive.set(0x000000);

          // Set specific colors for rubber parts
          if (materialName === "tan_wall") {
            material.color.set(0x8b4513); // Saddle brown
          } else if (materialName === "tire") {
            material.color.set(0x1a1a1a); // Very dark gray
          }

          material.needsUpdate = true;
        } else if (materialName.includes("rim")) {
          // Metal rim material properties
          material.metalness = 0.8;
          material.roughness = 0.2;
          material.envMapIntensity = 0.5;
          material.emissiveIntensity = 0;
          material.emissive.set(0x000000);
          material.color.set(0x333333); // Dark gray for rim
          material.needsUpdate = true;
        }
        
        if (objectName.includes("frame")) {
          material.color.set(frameColor.hex);
        } else if (objectName.includes("fork")) {
          material.color.set(forkColor.hex);
        }
        
        // Handle specific logo material textures
        if (material.name === "TOP_TUBE") {
          if (headTubeTexture) {
            material.map = headTubeTexture;
            material.polygonOffset = true;
            material.polygonOffsetFactor = -15;
            material.transparent = true;
            material.alphaTest = 0.2;
          } else {
            material.map = null;
            material.color.set(frameColor.hex);
            material.emissive.set(frameColor.hex);
            material.emissiveIntensity = 0.1;
          }
        } 

        if (material.name === "DOWN_TUBE_LEFT") {
          if (downTubeLeftTexture) {
            material.map = downTubeLeftTexture;
            material.polygonOffset = true;
            material.polygonOffsetFactor = -1;
            material.transparent = true;
            material.alphaTest = 0.2;
          } else {
            material.map = null;
            material.color.set(frameColor.hex);
            material.emissive.set(frameColor.hex);
            material.emissiveIntensity = 0.1;
          }
        } else if (material.name === "DOWN_TUBE_RIGHT") {
          if (downTubeRightTexture) {
            material.map = downTubeRightTexture;
            material.polygonOffset = true;
            material.polygonOffsetFactor = -1;
            material.transparent = true;
            material.alphaTest = 0.2;
          } else {
            material.map = null;
            material.color.set(frameColor.hex);
            material.emissive.set(frameColor.hex);
            material.emissiveIntensity = 0.1;
          }
        } else {
          material.emissive.set(material.color.getHex());
          material.emissiveIntensity = 0.1;
        }
        material.needsUpdate = true;
      }
    });
  }, [headTubeTexture, downTubeLeftTexture, downTubeRightTexture, frameColor, forkColor, meshes]);

  // // Handle mesh clicks
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