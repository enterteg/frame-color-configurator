import { useState, useEffect, useRef } from 'react';
import { TextureImage } from '@/types/bike';
import { processImageWithTransformations } from '../utils/generateImageTexture';

export function useImageProcessing(currentImages: TextureImage[]) {
  const [processedImages, setProcessedImages] = useState<Record<string, HTMLImageElement>>({});
  const processingRef = useRef(false);
  const lastProcessedRef = useRef<Record<string, string>>({});

  // Process images when they change
  useEffect(() => {
    if (!currentImages || processingRef.current) return;

    const processImages = async () => {
      try {
        processingRef.current = true;
        const newProcessedImages: Record<string, HTMLImageElement> = {};
        
        for (const image of currentImages) {
          // Only process if the image hasn't been processed or if its color has changed
          const imageKey = `${image.id}_${image.color?.hex || 'no-color'}_${image.url || ''}_${image.blobUrl || ''}`;
          if (
            !lastProcessedRef.current[image.id] ||
            lastProcessedRef.current[image.id] !== imageKey
          ) {
            const processedImage = await processImageWithTransformations(image);
            newProcessedImages[image.id] = processedImage;
            lastProcessedRef.current[image.id] = imageKey;
          }
        }
        
        if (Object.keys(newProcessedImages).length > 0) {
          setProcessedImages((prev) => ({ ...prev, ...newProcessedImages }));
        }
      } catch (error) {
        console.error("Error processing images:", error);
      } finally {
        processingRef.current = false;
      }
    };

    processImages();
  }, [currentImages]);

  return {
    processedImages
  };
} 