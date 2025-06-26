import React from 'react';
import * as THREE from 'three';
import { useBikeStore } from '../../store/useBikeStore';

function applyGammaToHex(hex: string): string {
  // Convert hex to RGB [0,1]
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const avg = (r + g + b) / 3;
  let gamma = 1;
  if (avg > 0.7) gamma = 1.15; // darken
  else if (avg < 0.3) gamma = 0.8 // lighten
  // Apply gamma correction
  const r2 = Math.pow(r, gamma);
  const g2 = Math.pow(g, gamma);
  const b2 = Math.pow(b, gamma);
  // Convert back to hex
  const toHex = (c: number) => {
    const h = Math.round(c * 255).toString(16).padStart(2, '0');
    return h;
  };
  return `#${toHex(r2)}${toHex(g2)}${toHex(b2)}`;
}

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
    metalness: 0.4,
    roughness: isFrameMetallic ? 0.15 : 0.6,
    clearcoat: 1,
    clearcoatRoughness: isFrameMetallic ? 0.3 : 1,
    color: isFrame ? "white" : gammaHex,
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