'use client';

import React from 'react';
import { OrbitControls, Environment } from '@react-three/drei';
import { degToRad } from 'three/src/math/MathUtils.js';

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
        intensity={3}
        color="#ffffff"
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Fill Light - Softer light from the side */}
      <directionalLight
        position={[-3, 5, 2]}
        intensity={1.5}
        color="#ffffff"
      />

      {/* Ambient Light - Increased for brighter colors */}
      <ambientLight intensity={2} color="#ffffff" />

      {/* Environment for realistic reflections */}
      <Environment preset="studio" background={false} />

      {/* Additional light for environment compensation */}
      <hemisphereLight
        intensity={4}
        color="#ffffff"
        groundColor="#ffffff"
      />

      {children}
      {/* <mesh receiveShadow rotation={[degToRad(-90), 0, 0]} position={[0, -10, -10]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh> */}
      {/* Camera controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={10}
        maxDistance={100}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
        minAzimuthAngle={-Infinity}
        maxAzimuthAngle={Infinity}
      />
    </>
  );
} 