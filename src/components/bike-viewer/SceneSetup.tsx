'use client';

import React from 'react';
import { Environment, OrbitControls } from '@react-three/drei';

interface SceneSetupProps {
  children: React.ReactNode;
}

export default function SceneSetup({ children }: SceneSetupProps) {
  return (
    <>
      {/* Environment for realistic reflections */}
      <Environment
        background={false}
        preset="warehouse"
        backgroundIntensity={1}
        environmentIntensity={1}
      />

      {/* Back directional light - from top back */}
      <directionalLight
        position={[-1, 2, -2]}
        intensity={4}
        color="white"
      />

      <hemisphereLight
        intensity={1}
        color="white"
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