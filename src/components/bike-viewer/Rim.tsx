import React from 'react';
import * as THREE from 'three';
import { useBikeStore } from '../../store/useBikeStore';
import { Rim35 } from './Rim35';
import { RimStandard } from './RimStandard';

interface RimProps {
  mesh: THREE.Mesh;
}

export function Rim({ mesh }: RimProps) {
  const rimType = useBikeStore((state) => state.rimType);

  // Route to the appropriate rim component based on type
  if (rimType === '35') {
    return <Rim35 mesh={mesh} />;
  }

  return <RimStandard mesh={mesh} />;
} 