'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function LoadingFallback() {
  const groupRef = useRef<THREE.Group>(null);
  
  // Rotate the loading indicator
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main loading spinner */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[1, 0.1, 8, 16]} />
        <meshStandardMaterial color="#3b82f6" emissive="#1e40af" emissiveIntensity={0.2} />
      </mesh>
      
      {/* Inner spinner */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.6, 0.05, 6, 12]} />
        <meshStandardMaterial color="#60a5fa" emissive="#3b82f6" emissiveIntensity={0.1} />
      </mesh>
      
      {/* Center sphere */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#dbeafe" emissive="#93c5fd" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
} 