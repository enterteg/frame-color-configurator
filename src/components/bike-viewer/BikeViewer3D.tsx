'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { RALColor } from '../../data/ralColors';
import LoadingFallback from './LoadingFallback';
import SceneSetup from './SceneSetup';
import BikeModel from './BikeModel';

interface BikeViewer3DProps {
  selectedColors: RALColor[];
  combinedModelPath?: string;
  className?: string;
  canvasTexture?: THREE.Texture | null;
  repeatX?: number;
  repeatY?: number;
  offsetX?: number;
  offsetY?: number;
  onPartClick?: (part: 'frame' | 'fork' | 'logos') => void;
}

export default function BikeViewer3D({ 
  selectedColors, 
  combinedModelPath = '/models/bike.glb',
  className = '',
  canvasTexture = null,
  repeatX = 1,
  repeatY = 1,
  offsetX = 0,
  offsetY = 0,
  onPartClick
}: BikeViewer3DProps) {
  const [frameColor, setFrameColor] = useState(selectedColors[0]?.hex || '#888888');

  // Update frameColor if selectedColors changes
  useEffect(() => {
    setFrameColor(selectedColors[0]?.hex || '#888888');
  }, [selectedColors]);

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
          toneMapping: THREE.NoToneMapping,
          toneMappingExposure: 1.0
        }}
      >
        <SceneSetup>
          <Suspense fallback={<LoadingFallback />}>
            <BikeModel
              frameColor={frameColor}
              forkColor={selectedColors[1]?.hex || '#666666'}
              modelPath={combinedModelPath}
              canvasTexture={canvasTexture}
              repeatX={repeatX}
              repeatY={repeatY}
              offsetX={offsetX}
              offsetY={offsetY}
              onPartClick={onPartClick}
            />
          </Suspense>
        </SceneSetup>
      </Canvas>
    </div>
  );
} 