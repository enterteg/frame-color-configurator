import React from 'react';
import * as THREE from 'three';
import { useRimMaterial } from './useRimMaterial';

interface RimStandardProps {
  mesh: THREE.Mesh;
}

export function RimStandard({ mesh }: RimStandardProps) {
  const material = useRimMaterial();

  return (
    <mesh
      geometry={mesh.geometry}
      material={material}
      position={mesh.position}
      rotation={mesh.rotation}
      scale={mesh.scale}
      receiveShadow
    />
  );
} 