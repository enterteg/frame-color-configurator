'use client';

import React from 'react';
import { Environment, OrbitControls } from '@react-three/drei';

interface SceneSetupProps {
  children: React.ReactNode;
}

export default function SceneSetup({ children }: SceneSetupProps) {
  return (
    <>
      {/* Professional Product Photography Lighting Setup */}
      {/* Key Light - Main directional light from top-front-right */}
      <directionalLight
        position={[4, 6, 3]}
        intensity={2.5}
        color="#ffffff"
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        castShadow
      />

      {/* Fill Light - Softer light from the left to reduce harsh shadows */}
      <directionalLight
        position={[-4, 3, 2]}
        intensity={1.2}
        color="#ffffff"
      />

      {/* Rim Light - Strong back light for rim definition and separation */}
      <directionalLight
        position={[0, 1, -6]}
        intensity={2}
        color="#ffffff"
      />

      {/* Bottom Fill Light - To illuminate under-surfaces and rim interiors */}
      <directionalLight
        position={[0, -2, 3]}
        intensity={1}
        color="#ffffff"
      />

      {/* Balanced Atmospheric Lighting */}
      {/* Ambient Light - Moderate base illumination */}
      <ambientLight intensity={0.5} color="#ffffff" />

      {/* Environment for realistic reflections */}
      <Environment
        background={false}
        preset="park"
        backgroundIntensity={0.5}
        environmentIntensity={0.5}
      />

      {/* Hemisphere Light - Natural sky/ground influence */}
      <hemisphereLight
        intensity={1}
        color="#ffffff"
        groundColor="#f0f0f0"
      />

      {/* Subtle atmospheric point light from behind for depth */}
      <pointLight
        position={[0, 3, -6]}
        intensity={1}
        color="#ffffff"
        distance={20}
        decay={1}
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