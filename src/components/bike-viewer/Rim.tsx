import React from 'react';
import * as THREE from 'three';
import { useBikeStore } from '../../store/useBikeStore';
import { Rim35 } from './Rim35';
import { RimStandard } from './RimStandard';
import { useRimMaterial } from './useRimMaterial';

interface RimProps {
  mesh: THREE.Mesh;
}

export function Rim({ mesh }: RimProps) {
  const rimType = useBikeStore((state) => state.rimType);
const material = useRimMaterial();

  // Route to the appropriate rim component based on type
  if (rimType === '35') {
    return <Rim35 mesh={mesh} material={material} />;
  }

  return <RimStandard mesh={mesh} material={material} />;
} 