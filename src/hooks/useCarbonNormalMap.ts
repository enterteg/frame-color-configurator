import { useEffect, useState } from 'react';
import * as THREE from 'three';

export function useCarbonNormalMap() {
  const [carbonNormalMap, setCarbonNormalMap] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loader = new THREE.TextureLoader();
      const carbonNormalMap = loader.load("/textures/carbon-normal.png");
      carbonNormalMap.wrapS = THREE.RepeatWrapping;
      carbonNormalMap.wrapT = THREE.RepeatWrapping;
      carbonNormalMap.repeat.set(2, 2);
      setCarbonNormalMap(carbonNormalMap);
    }
  }, []);

  return carbonNormalMap;
} 