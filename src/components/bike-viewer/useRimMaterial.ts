import { useCarbonNormalMap } from '../../hooks/useCarbonNormalMap';
import * as THREE from 'three';

export function useRimMaterial() {
  const carbonNormalMap = useCarbonNormalMap();

  const material = new THREE.MeshPhysicalMaterial({
    metalness: 0.1,
    roughness: 0.5,
    color: 0x343434, // Darker gray but not black
    normalMap: carbonNormalMap,
    normalScale: new THREE.Vector2(0.5, 0.5),
  });

  return material;
} 