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
    metalness: 0.5,
    roughness: 1,
    color: 0x333333, // Darker gray but not black
    normalMap: carbonNormalMap,
    normalScale: new THREE.Vector2(1, 1),
  });

  return material;
} 