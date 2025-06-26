'use client';

import React, { Suspense} from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import LoadingFallback from './LoadingFallback';
import SceneSetup from './SceneSetup';
import BikeModel from './BikeModel';

interface BikeViewer3DProps {
  combinedModelPath?: string;
  className?: string;
  onPartClick?: (part: 'frame' | 'fork' | 'logos') => void;
}

export default function BikeViewer3D({ 
  combinedModelPath = '/models/bike.glb',
  className = '',
}: BikeViewer3DProps) {
  return (
    <div
      className={`w-full h-full bg-gray-100 rounded-lg overflow-hidden relative ${className}`}
    >

      <Canvas
        camera={{
          position: [0, 0, 10],
          fov: 50,
        }}
        shadows="soft"
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
      >
        <SceneSetup>
          <Suspense fallback={<LoadingFallback />}>
            <BikeModel modelPath={combinedModelPath} />
          </Suspense>
        </SceneSetup>
      </Canvas>
    </div>
  );
} 