import React from 'react';
import * as THREE from 'three';
import { useBikeStore } from '../../store/useBikeStore';

interface LogoTubeProps {
  mesh: THREE.Mesh;
}

export function LogoTube({ mesh }: LogoTubeProps) {
  const headTubeTexture = useBikeStore((s) => s.logoTypes.HEAD_TUBE.texture);
  const downTubeLeftTexture = useBikeStore((s) => s.logoTypes.DOWN_TUBE_LEFT.texture);
  const downTubeRightTexture = useBikeStore((s) => s.logoTypes.DOWN_TUBE_RIGHT.texture);

  const materialName = mesh.material instanceof THREE.Material ? mesh.material.name : '';

  // Determine which texture to use based on material name
  const texture = 
    materialName === "TOP_TUBE" ? headTubeTexture :
    materialName === "DOWN_TUBE_LEFT" ? downTubeLeftTexture :
    materialName === "DOWN_TUBE_RIGHT" ? downTubeRightTexture :
    null;

  if (!texture) {
    // If no texture is available, return the original mesh
    const originalMaterial = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
    return (
      <mesh
        geometry={mesh.geometry}
        material={originalMaterial}
        position={mesh.position}
        scale={mesh.scale}
        receiveShadow
      />
    );
  }

  // Set texture color space
  if (texture) {
    texture.colorSpace = THREE.SRGBColorSpace;
  }

  const material = new THREE.MeshPhysicalMaterial({
    map: texture,
    metalness: 1,
    roughness: 1,
    clearcoat: 1,
    clearcoatRoughness: 0,
    polygonOffset: true,
    polygonOffsetFactor: -10,
    transparent: true,
    alphaTest: 0.5,
  });

  return (
    <mesh
      geometry={mesh.geometry}
      material={material}
      position={mesh.position}
      scale={mesh.scale}
      receiveShadow
    />
  );
} 