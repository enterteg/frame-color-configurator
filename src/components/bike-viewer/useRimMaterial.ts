import { useEffect, useState } from 'react';
import * as THREE from 'three';

export function useRimMaterial() {
  const [carbonNormalMap, setCarbonNormalMap] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    // Only load textures on the client side
    if (typeof window !== 'undefined') {
      const loader = new THREE.TextureLoader();
      const carbonNormalMap = loader.load("/textures/carbon-normal.png");
      carbonNormalMap.wrapS = THREE.RepeatWrapping;
      carbonNormalMap.wrapT = THREE.RepeatWrapping;
      carbonNormalMap.repeat.set(2, 2);
      
      setCarbonNormalMap(carbonNormalMap);
    }
  }, []);

  const material = new THREE.MeshPhysicalMaterial({
    metalness: 0.3,
    roughness: 0.5,
    envMapIntensity: 1.5,
    clearcoat: 0,
    clearcoatRoughness: 0.1,
    color: 0x222222, // Darker gray but not black
    normalMap: carbonNormalMap,
    normalScale: new THREE.Vector2(0.5, 0.5),
  });

  return material;
} 