import { useCallback } from 'react';
import * as THREE from 'three';
import { useBikeStore } from '../store/useBikeStore';
import { useImageProcessingCore } from './useImageProcessingCore';
import { useTextureGenerationCore } from './useTextureGenerationCore';
import { TEXTURE_SIZE } from '../utils/constants';

export function useFrameTextureProcessing() {
  const {
    frameTexture,
    frameColor,
    setFrameTexture,
    setFrameProcessedImages
  } = useBikeStore();

  // Handle processed images update
  const handleProcessedImagesUpdate = useCallback((processedImages: Record<string, HTMLImageElement>) => {
    setFrameProcessedImages(processedImages);
  }, [setFrameProcessedImages]);

  // Handle texture update
  const handleTextureUpdate = useCallback((texture: THREE.Texture | null) => {
    setFrameTexture(texture);
  }, [setFrameTexture]);

  // Use shared image processing logic
  useImageProcessingCore({
    images: frameTexture.images,
    currentProcessedImages: frameTexture.processedImages,
    onProcessedImagesUpdate: handleProcessedImagesUpdate,
    processingKey: 'frameTexture'
  });

  // Calculate texture offset (same as canvas calculations)
  const aspectRatio = frameTexture.aspectRatio;
  const LOGICAL_CANVAS_HEIGHT = TEXTURE_SIZE / aspectRatio;
  const STAGE_PADDING = LOGICAL_CANVAS_HEIGHT * 0.2;
  const TEXTURE_OFFSET_X = STAGE_PADDING;
  const TEXTURE_OFFSET_Y = STAGE_PADDING;

  // Use shared texture generation logic
  useTextureGenerationCore({
    images: frameTexture.images, // Pass images array directly to watch for transform changes
    processedImages: frameTexture.processedImages,
    onTextureUpdate: handleTextureUpdate,
    backgroundColor: frameColor.hex, // Frame textures have background color
    dependencies: [frameColor.hex], // Also listen to frame color changes
    generationKey: 'frameTexture',
    textureOffsetX: TEXTURE_OFFSET_X,
    textureOffsetY: TEXTURE_OFFSET_Y,
    gradient: frameTexture.gradient // Pass gradient settings
  });
} 