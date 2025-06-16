'use client';

import React from 'react';
import { Environment, OrbitControls } from '@react-three/drei';

interface SceneSetupProps {
  children: React.ReactNode;
}

export default function SceneSetup({ children }: SceneSetupProps) {
  return (
    <>
      {/* Store Display Lighting Setup */}
      {/* Key Light - Main directional light from top-front */}
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.5}
        color="#ffffff"
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Fill Light - Softer light from the side */}
      <directionalLight
        position={[-3, 5, 2]}
        intensity={0.8}
        color="#ffffff"
        visible
      />

      {/* Ambient Light - Reduced for more natural colors */}
      <ambientLight intensity={0.8} color="#ffffff" />

      {/* Environment for realistic reflections */}
      <Environment preset="city" background={false} />

      {/* Additional light for environment compensation */}
      <hemisphereLight
        intensity={1}
        color="white"
        groundColor="#f0f0f0"
        visible
      />


      {children}

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={1}
        maxDistance={3}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
        minAzimuthAngle={-Infinity}
        maxAzimuthAngle={Infinity}
      />
    </>
  );
} 