import { useCarbonNormalMap } from '../../hooks/useCarbonNormalMap';
import * as THREE from 'three';

export function useRimMaterial() {
  const carbonNormalMap = useCarbonNormalMap();

  const material = new THREE.MeshPhysicalMaterial({
    metalness: 0.2,
    roughness: 1,
    color: 0x222222, // Darker gray but not black
    normalMap: carbonNormalMap,
    normalScale: new THREE.Vector2(1, 1),
  });

  return material;
} 