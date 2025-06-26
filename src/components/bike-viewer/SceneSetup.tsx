'use client';

import React from 'react';
import { Environment, OrbitControls } from '@react-three/drei';
import Plate from './Plate';

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
        environmentIntensity={0.9}
        backgroundRotation={[0, 0, 0]}
      />

      {/* Back directional light - from top back */}
      <directionalLight
        position={[1, 3, -2]}
        intensity={1.5}
        color="#ffffff"
        castShadow
      />

      <directionalLight
        position={[-1, 2, 2]}
        intensity={0.5}
        color="#ffffff"
        castShadow
      />

    <ambientLight intensity={0.5} color="white" />

      {/* Display plate under the bike with height and metal-with-leaks-bl textures */}
      <Plate />

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