import { useEffect } from 'react';
import { TextureImage } from '@/types/bike';
import { generateImageTexture } from '../utils/generateImageTexture';
import { TEXTURE_SIZE } from '../utils/constants';
import * as THREE from 'three';

interface UseTextureGenerationCoreProps {
  images: TextureImage[]; // Direct images array to watch for transform changes
  processedImages: Record<string, HTMLImageElement>;
  onTextureUpdate: (texture: THREE.Texture | null) => void;
  backgroundColor?: string;
  dependencies?: unknown[]; // Additional dependencies to watch (e.g., frameColor)
  generationKey: string; // Unique key for this generation instance
  textureOffsetX?: number; // Offset for texture capture area
  textureOffsetY?: number; // Offset for texture capture area
}

export function useTextureGenerationCore({
  images,
  processedImages,
  onTextureUpdate,
  backgroundColor,
  dependencies = [],
  generationKey,
  textureOffsetX = 0,
  textureOffsetY = 0
}: UseTextureGenerationCoreProps) {
  useEffect(() => {
    const generateTexture = async () => {
      // Handle case with no images
      if (images.length === 0) {
        if (backgroundColor) {
          // Create texture with just background color
          try {
                      const texture = await generateImageTexture({
            width: TEXTURE_SIZE,
            height: TEXTURE_SIZE,
            images: [],
            backgroundColor,
            textureOffsetX,
            textureOffsetY
          });
            onTextureUpdate(texture);
          } catch (error) {
            console.error(`Error generating empty texture for ${generationKey}:`, error);
          }
        } else {
          // No images and no background = null texture
          onTextureUpdate(null);
        }
        return;
      }
      
      // Check if all images have been processed
      const allImagesProcessed = images.every(img => processedImages[img.id]);
      
      if (allImagesProcessed) {
        try {
                  const texture = await generateImageTexture({
          width: TEXTURE_SIZE,
          height: TEXTURE_SIZE,
          images: images.map(img => ({
            ...img,
            processedImage: processedImages[img.id]
          })),
          backgroundColor,
          textureOffsetX,
          textureOffsetY
        });
          
          if (texture) {
            onTextureUpdate(texture);
          }
        } catch (error) {
          console.error(`Error generating texture for ${generationKey}:`, error);
        }
      }
    };

    generateTexture();
  }, [
    // Watch for changes in images array (including transform properties)
    images,
    processedImages,
    backgroundColor,
    onTextureUpdate,
    generationKey,
    textureOffsetX,
    textureOffsetY,
    ...dependencies
  ]);
} 