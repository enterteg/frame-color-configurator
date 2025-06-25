import React from 'react';
import * as THREE from 'three';
import { useBikeStore } from '../../store/useBikeStore';

interface FrameForkProps {
  mesh: THREE.Mesh;
}

export function FrameFork({ mesh }: FrameForkProps) {
  const frameColor = useBikeStore((s) => s.frameColor);
  const forkColor = useBikeStore((s) => s.forkColor);
  
  const objectName = mesh.name.toLowerCase();
  
  const material = new THREE.MeshPhysicalMaterial({
    metalness: 0.8,
    roughness: 1,
    clearcoat: 1,
    clearcoatRoughness: 0,
    color: objectName.includes("frame") ? frameColor.hex : forkColor.hex
  });

  return (
    <mesh
      geometry={mesh.geometry}
      material={material}
      position={mesh.position}
      scale={mesh.scale}
      castShadow
    />
  );
} 