import React from 'react';
import * as THREE from 'three';

interface RimStandardProps {
  mesh: THREE.Mesh;
  material: THREE.MeshPhysicalMaterial;
}

export function RimStandard({ mesh, material }: RimStandardProps) {
  return (
    <mesh
      geometry={mesh.geometry}
      material={material}
      position={mesh.position}
      rotation={mesh.rotation}
      scale={mesh.scale}
      castShadow
    />
  );
} 