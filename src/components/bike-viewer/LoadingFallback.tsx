'use client';

import React from 'react';
import { Html } from '@react-three/drei';

export default function LoadingFallback() {
  // Use <Html> so this DOM content can be rendered inside a R3F <Canvas>
  return (
    <Html center>
      <div
        className="flex flex-col items-center justify-center h-full w-full min-h-[200px] min-w-[200px]"
        role="status"
        aria-live="polite"
      >
        <div
          className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4"
        />
        <span className="text-blue-600 font-medium text-lg">Loading...</span>
      </div>
    </Html>
  );
} 