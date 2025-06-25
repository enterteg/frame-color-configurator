import React, { Suspense } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Preload the rim_35 model
useGLTF.preload('/models/rim_35.glb');

interface Rim35Props {
  mesh: THREE.Mesh;
  material: THREE.MeshPhysicalMaterial;
}

function Rim35Content({ mesh, material }: Rim35Props) {
  const { scene: rimScene } = useGLTF('/models/rim_35.glb');
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
      castShadow
    />
  );
}

function RimLoadingFallback({ mesh, material }: Rim35Props) {
  return (
    <mesh
      geometry={mesh.geometry}
      material={material}
      position={mesh.position}
      rotation={mesh.rotation}
      scale={mesh.scale}
      castShadow
      visible={false} // Hide during loading to prevent the "big square"
    />
  );
}

export function Rim35({ mesh, material }: Rim35Props) {
  return (
    <Suspense fallback={<RimLoadingFallback mesh={mesh} material={material} />}>
      <Rim35Content mesh={mesh} material={material} />
    </Suspense>
  );
} 