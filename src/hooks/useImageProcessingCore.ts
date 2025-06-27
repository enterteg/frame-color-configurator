import { useEffect, useRef } from 'react';
import { TextureImage } from '@/types/bike';
import { processImageWithTransformations } from '../utils/generateImageTexture';

interface UseImageProcessingCoreProps {
  images: TextureImage[];
  currentProcessedImages: Record<string, HTMLImageElement>;
  onProcessedImagesUpdate: (processedImages: Record<string, HTMLImageElement>) => void;
  processingKey: string; // Unique key for this processing instance (e.g., 'HEAD_TUBE', 'frameTexture')
}

export function useImageProcessingCore({
  images,
  currentProcessedImages,
  onProcessedImagesUpdate,
  processingKey
}: UseImageProcessingCoreProps) {
  const processingRef = useRef(false);
  const lastProcessedRef = useRef<Record<string, string>>({});

  useEffect(() => {
    if (processingRef.current) return;

    const processImages = async () => {
      try {
        processingRef.current = true;
        let hasChanges = false;
        const newProcessedImages = { ...currentProcessedImages };
        
        // Process new or changed images
        for (const image of images) {
          const imageKey = `${image.id}_${image.color?.hex || 'no-color'}_${image.url || ''}_${image.blobUrl || ''}`;
          
          // Check if image needs processing
          if (
            !lastProcessedRef.current[image.id] ||
            lastProcessedRef.current[image.id] !== imageKey ||
            !currentProcessedImages[image.id]
          ) {
            const processedImage = await processImageWithTransformations(image);
            newProcessedImages[image.id] = processedImage;
            lastProcessedRef.current[image.id] = imageKey;
            hasChanges = true;
          }
        }
        
        // Remove processed images for deleted images
        const currentImageIds = new Set(images.map(img => img.id));
        for (const processedImageId of Object.keys(currentProcessedImages)) {
          if (!currentImageIds.has(processedImageId)) {
            delete newProcessedImages[processedImageId];
            delete lastProcessedRef.current[processedImageId];
            hasChanges = true;
          }
        }
        
        // Update if there are changes
        if (hasChanges) {
          onProcessedImagesUpdate(newProcessedImages);
        }
      } catch (error) {
        console.error(`Error processing images for ${processingKey}:`, error);
      } finally {
        processingRef.current = false;
      }
    };

    processImages();
  }, [images, currentProcessedImages, onProcessedImagesUpdate, processingKey]);
} 