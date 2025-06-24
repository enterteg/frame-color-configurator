'use client';

import React, { useEffect, useRef } from 'react';
import { useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';
import { BikePart } from './BikePart';

export interface BikeModelProps {
  modelPath: string;
}

export default function BikeModel({ modelPath }: BikeModelProps) {
  const { scene } = useGLTF(modelPath);
  const modelRef = useRef<THREE.Group>(null);
  
  // Collect all meshes from the scene
  const meshes: THREE.Mesh[] = [];
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      meshes.push(child);
    }
  });

  return (
    <Center>
      <group ref={modelRef}>
        {meshes.map((mesh) => (
          <BikePart key={mesh.uuid} mesh={mesh} />
        ))}
      </group>
    </Center>
  );
} 