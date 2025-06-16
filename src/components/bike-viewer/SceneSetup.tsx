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
        position={[4, 8, 4]}
        intensity={0.4}
        color="#ffffff"
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        castShadow
      />

      {/* Fill Light - Softer light from the side */}
      <directionalLight
        position={[-3, 4, 2]}
        intensity={0.3}
        color="#ffffff"
        visible
      />

      {/* Rim Light - For edge definition */}
      <directionalLight
        position={[0, 2, -4]}
        intensity={0.2}
        color="#ffffff"
        visible
      />

      {/* Ambient Light - Reduced for better color saturation */}
      <ambientLight intensity={0.3} color="#ffffff" />

      {/* Environment for realistic reflections */}
      <Environment background={false} files="/scenes/studio.exr" backgroundIntensity={0.5} />

      {/* Hemisphere Light - For natural sky/ground color influence */}
      <hemisphereLight
        intensity={0.4}
        color="#ffffff"
        groundColor="#f5f5f5"
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