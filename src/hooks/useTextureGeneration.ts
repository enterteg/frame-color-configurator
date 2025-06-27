import { useCallback, useRef } from 'react';
import * as THREE from 'three';
import { TextureImage, TabType } from '@/types/bike';
import { generateImageTexture } from '../utils/generateImageTexture';
import { TEXTURE_SIZE } from '../utils/constants';
import { RALColor } from '../data/ralColors';

interface UseTextureGenerationProps {
  activeTexture: { images: TextureImage[] } | null;
  processedImages: Record<string, HTMLImageElement>;
  setLogoTexture: (texture: THREE.Texture | null) => void;
  setFrameTexture: (texture: THREE.Texture | null) => void;
  activeTab: TabType;
  frameColor: RALColor;
  textureOffsetX: number;
  textureOffsetY: number;
}

export function useTextureGeneration({
  activeTexture,
  processedImages,
  setLogoTexture,
  setFrameTexture,
  activeTab,
  frameColor,
  textureOffsetX,
  textureOffsetY
}: UseTextureGenerationProps) {
  const textureUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedTextureUpdate = useCallback(() => {
    if (textureUpdateTimeoutRef.current) {
      clearTimeout(textureUpdateTimeoutRef.current);
    }

    textureUpdateTimeoutRef.current = setTimeout(async () => {
      if (activeTexture) {
        try {
          const texture = await generateImageTexture({
            width: TEXTURE_SIZE,
            height: TEXTURE_SIZE,
            images: activeTexture.images.map(img => ({
              ...img,
              // Adjust positions relative to the texture capture area
              x: img.x - textureOffsetX,
              y: img.y - textureOffsetY,
              processedImage: processedImages[img.id]
            })),
            backgroundColor: activeTab === 'frameTexture' ? frameColor.hex : undefined
          });
          
          if (texture) {
            if (activeTab === 'frameTexture') {
              setFrameTexture(texture);
            } else {
              setLogoTexture(texture);
            }
          }
        } catch (error) {
          console.error('Error generating texture:', error);
        }
      }
    }, 50);
  }, [activeTexture, processedImages, setLogoTexture, setFrameTexture, activeTab, frameColor, textureOffsetX, textureOffsetY]);

  return {
    debouncedTextureUpdate
  };
} 