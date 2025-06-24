import React, { Suspense } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useRimMaterial } from './useRimMaterial';

interface Rim35Props {
  mesh: THREE.Mesh;
}

function Rim35Content({ mesh }: Rim35Props) {
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

function RimLoadingFallback({ mesh }: Rim35Props) {
  const material = useRimMaterial();
  
  return (
    <mesh
      geometry={mesh.geometry}
      material={material}
      position={mesh.position}
      rotation={mesh.rotation}
      scale={mesh.scale}
      receiveShadow
      visible={false} // Hide during loading to prevent the "big square"
    />
  );
}

export function Rim35({ mesh }: Rim35Props) {
  return (
    <Suspense fallback={<RimLoadingFallback mesh={mesh} />}>
      <Rim35Content mesh={mesh} />
    </Suspense>
  );
} 