import React from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useRimMaterial } from './useRimMaterial';

interface Rim35Props {
  mesh: THREE.Mesh;
}

export function Rim35({ mesh }: Rim35Props) {
  const { scene: rimScene } = useGLTF('/models/rim_35.glb');
  const material = useRimMaterial();
  let geometryToUse = mesh.geometry;
  
  if (rimScene) {
    rimScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        geometryToUse = child.geometry;
      }
    });
  }

  return (
    <mesh
      geometry={geometryToUse}
      material={material}
      position={mesh.position}
      rotation={mesh.rotation}
      scale={mesh.scale}
      receiveShadow
    />
  );
} 