import React from 'react';
import * as THREE from 'three';
import { useBikeStore } from '../../store/useBikeStore';
import { applyGammaToHex } from '../../utils/colorCorrections';

interface FrameForkProps {
  mesh: THREE.Mesh;
}

export function FrameFork({ mesh }: FrameForkProps) {
  const frameColor = useBikeStore((s) => s.frameColor);
  const forkColor = useBikeStore((s) => s.forkColor);
  const isFrameMetallic = useBikeStore((s) => s.isFrameMetallic);
  const frameTexture = useBikeStore((s) => s.frameTexture);
  
  const objectName = mesh.name.toLowerCase();
  const isFrame = objectName.includes("frame");
  const baseHex = isFrame ? frameColor.hex : forkColor.hex;
  const gammaHex = applyGammaToHex(baseHex);
  
  const material = new THREE.MeshPhysicalMaterial({
    metalness: 0.5,
    roughness: isFrameMetallic ? 0.15 : 0.4,
    clearcoat: 1,
    clearcoatRoughness: isFrameMetallic ? 0.5 : 1,
    color: isFrame && frameTexture.texture ? "white" : gammaHex,
    map: isFrame && frameTexture.texture ? frameTexture.texture : null,
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