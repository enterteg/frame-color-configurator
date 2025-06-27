import { useCallback } from 'react';
import * as THREE from 'three';
import { useBikeStore } from '../store/useBikeStore';
import { useImageProcessingCore } from './useImageProcessingCore';
import { useTextureGenerationCore } from './useTextureGenerationCore';

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

  // Use shared texture generation logic
  useTextureGenerationCore({
    images: frameTexture.images, // Pass images array directly to watch for transform changes
    processedImages: frameTexture.processedImages,
    onTextureUpdate: handleTextureUpdate,
    backgroundColor: frameColor.hex, // Frame textures have background color
    dependencies: [frameColor.hex], // Also listen to frame color changes
    generationKey: 'frameTexture'
  });
} 