'use client';

import React from 'react';

export default function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[2, 1, 0.5]} />
      <meshStandardMaterial color="#cccccc" />
    </mesh>
  );
} 