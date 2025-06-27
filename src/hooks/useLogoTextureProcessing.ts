import { useCallback } from 'react';
import * as THREE from 'three';
import { useBikeStore } from '../store/useBikeStore';
import { LogoType } from '../types/bike';
import { useImageProcessingCore } from './useImageProcessingCore';
import { useTextureGenerationCore } from './useTextureGenerationCore';
import { TEXTURE_SIZE } from '../utils/constants';

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

  // Calculate texture offset (same as canvas calculations)
  const aspectRatio = logoData.aspectRatio;
  const LOGICAL_CANVAS_HEIGHT = TEXTURE_SIZE / aspectRatio;
  const STAGE_PADDING = LOGICAL_CANVAS_HEIGHT * 0.2;
  const TEXTURE_OFFSET_X = STAGE_PADDING;
  const TEXTURE_OFFSET_Y = STAGE_PADDING;

  // Use shared texture generation logic
  useTextureGenerationCore({
    images: logoData.images, // Pass images array directly to watch for transform changes
    processedImages: logoData.processedImages,
    onTextureUpdate: handleTextureUpdate,
    // No backgroundColor for logo textures (transparent)
    generationKey: logoType,
    textureOffsetX: TEXTURE_OFFSET_X,
    textureOffsetY: TEXTURE_OFFSET_Y
  });
}

export function useLogoTextureProcessing() {
  // Process each logo type separately (hooks can't be in loops)
  useLogoTypeProcessing('HEAD_TUBE');
  useLogoTypeProcessing('DOWN_TUBE_LEFT');
  useLogoTypeProcessing('DOWN_TUBE_RIGHT');
} 