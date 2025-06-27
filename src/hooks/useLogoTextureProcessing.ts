import { useCallback } from 'react';
import * as THREE from 'three';
import { useBikeStore } from '../store/useBikeStore';
import { LogoType } from '../types/bike';
import { useImageProcessingCore } from './useImageProcessingCore';
import { useTextureGenerationCore } from './useTextureGenerationCore';

function useLogoTypeProcessing(logoType: LogoType) {
  const { 
    logoTypes, 
    setLogoProcessedImages, 
    setLogoTypeTexture 
  } = useBikeStore();
  const logoData = logoTypes[logoType];

  // Handle processed images update for this logo type
  const handleProcessedImagesUpdate = useCallback((processedImages: Record<string, HTMLImageElement>) => {
    setLogoProcessedImages(logoType, processedImages);
  }, [logoType, setLogoProcessedImages]);

  // Handle texture update for this logo type
  const handleTextureUpdate = useCallback((texture: THREE.Texture | null) => {
    setLogoTypeTexture(logoType, texture);
  }, [logoType, setLogoTypeTexture]);

  // Use shared image processing logic
  useImageProcessingCore({
    images: logoData.images,
    currentProcessedImages: logoData.processedImages,
    onProcessedImagesUpdate: handleProcessedImagesUpdate,
    processingKey: logoType
  });

  // Use shared texture generation logic
  useTextureGenerationCore({
    images: logoData.images, // Pass images array directly to watch for transform changes
    processedImages: logoData.processedImages,
    onTextureUpdate: handleTextureUpdate,
    // No backgroundColor for logo textures (transparent)
    generationKey: logoType
  });
}

export function useLogoTextureProcessing() {
  // Process each logo type separately (hooks can't be in loops)
  useLogoTypeProcessing('HEAD_TUBE');
  useLogoTypeProcessing('DOWN_TUBE_LEFT');
  useLogoTypeProcessing('DOWN_TUBE_RIGHT');
} 