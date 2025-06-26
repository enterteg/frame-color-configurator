import { useEffect, useRef, useCallback, useMemo } from 'react';
import { useBikeStore } from '../store/useBikeStore';
import { generateImageTexture, processImageWithTransformations } from '../utils/generateImageTexture';
import { TEXTURE_SIZE } from '../utils/constants';

interface ImageComparisonData {
  id: string;
  url?: string;
  blobUrl?: string;
  color?: string;
  x: number;
  y: number;
  scaleX?: number;
  scaleY?: number;
  rotation?: number;
}

export function useTextureManager() {
  const textureUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const processingRef = useRef(false);
  const lastProcessedRef = useRef<Record<string, string>>({});
  const previousImagesRef = useRef<Record<string, ImageComparisonData>>({});

  const {
    logoTypes,
    frameTexture,
    frameColor,
    processedImages,
    setFrameTexture,
    updateProcessedImages,
    removeProcessedImages,
    setIsProcessing,
  } = useBikeStore();

  // Collect all images that need processing
  const allImages = useMemo(() => [
    ...logoTypes.HEAD_TUBE.images,
    ...logoTypes.DOWN_TUBE_LEFT.images,
    ...logoTypes.DOWN_TUBE_RIGHT.images,
    ...frameTexture.images,
  ], [logoTypes.HEAD_TUBE.images, logoTypes.DOWN_TUBE_LEFT.images, logoTypes.DOWN_TUBE_RIGHT.images, frameTexture.images]);

  // Create a map of current images for comparison
  const currentImagesMap = allImages.reduce((acc, img) => {
    acc[img.id] = {
      id: img.id,
      url: img.url,
      blobUrl: img.blobUrl,
      color: img.color?.hex,
      x: img.x,
      y: img.y,
      scaleX: img.scaleX,
      scaleY: img.scaleY,
      rotation: img.rotation,
    };
    return acc;
  }, {} as Record<string, ImageComparisonData>);

  // Find which images changed
  const getChangedImages = useCallback(() => {
    const changedImages = [];
    const previousImages = previousImagesRef.current;

    for (const image of allImages) {
      const currentImageData = currentImagesMap[image.id];
      const previousImageData = previousImages[image.id];

      // Check if image is new or any property changed
      if (!previousImageData || 
          JSON.stringify(currentImageData) !== JSON.stringify(previousImageData)) {
        changedImages.push(image);
      }
    }

    // Update the reference for next comparison
    previousImagesRef.current = { ...currentImagesMap };
    
    return changedImages;
  }, [allImages, currentImagesMap]);

  // Process only changed images
  useEffect(() => {
    if (processingRef.current) return;

    const changedImages = getChangedImages();
    if (changedImages.length === 0) return;

    const processChangedImages = async () => {
      try {
        processingRef.current = true;
        setIsProcessing(true);
        
        const newProcessedImages: Record<string, HTMLImageElement> = {};
        
        for (const image of changedImages) {
          const processedImage = await processImageWithTransformations(image);
          newProcessedImages[image.id] = processedImage;
          
          // Update the processing cache
          const imageKey = `${image.id}_${image.color?.hex || 'no-color'}_${image.url}_${image.blobUrl}`;
          lastProcessedRef.current[image.id] = imageKey;
        }
        
        if (Object.keys(newProcessedImages).length > 0) {
          updateProcessedImages({ ...processedImages, ...newProcessedImages });
        }
      } catch (error) {
        console.error("Error processing changed images:", error);
      } finally {
        processingRef.current = false;
        setIsProcessing(false);
      }
    };

    processChangedImages();
  }, [getChangedImages, updateProcessedImages, setIsProcessing, processedImages]);

  // Clean up processed images for removed images
  useEffect(() => {
    const currentImageIds = new Set(allImages.map(img => img.id));
    const processedImageIds = Object.keys(processedImages);
    
    const removedImageIds = processedImageIds.filter(id => !currentImageIds.has(id));
    
    if (removedImageIds.length > 0) {
      removeProcessedImages(removedImageIds);
      
      // Clean up refs too
      removedImageIds.forEach(id => {
        delete lastProcessedRef.current[id];
        delete previousImagesRef.current[id];
      });
    }
  }, [allImages, processedImages, removeProcessedImages]);

  // Debounced texture generation
  const generateTextures = useCallback(async () => {
    if (textureUpdateTimeoutRef.current) {
      clearTimeout(textureUpdateTimeoutRef.current);
    }

    textureUpdateTimeoutRef.current = setTimeout(async () => {
      try {
        // Generate logo textures for each logo type
        for (const [logoTypeName, logoData] of Object.entries(logoTypes)) {
          if (logoData.images.length > 0) {
            // Check if all required processed images are available
            const allImagesProcessed = logoData.images.every(img => processedImages[img.id]);
            
            if (allImagesProcessed) {
              const texture = await generateImageTexture({
                width: TEXTURE_SIZE,
                height: TEXTURE_SIZE,
                images: logoData.images.map(img => ({
                  ...img,
                  processedImage: processedImages[img.id]
                }))
              });
              
              if (texture) {
                // Update the specific logo type texture directly in the store
                useBikeStore.setState((state) => ({
                  logoTypes: {
                    ...state.logoTypes,
                    [logoTypeName]: {
                      ...state.logoTypes[logoTypeName as keyof typeof state.logoTypes],
                      texture
                    }
                  }
                }));
              } else {
                console.warn(`Failed to generate texture for logo type: ${logoTypeName}`);
              }
            } else {
              console.log(`Not all images processed yet for logo type: ${logoTypeName}`);
            }
          }
        }

        // Generate frame texture
        if (frameTexture.images.length > 0) {
          // Check if all required processed images are available
          const allImagesProcessed = frameTexture.images.every(img => processedImages[img.id]);
          
          if (allImagesProcessed) {
            const texture = await generateImageTexture({
              width: TEXTURE_SIZE,
              height: TEXTURE_SIZE,
              images: frameTexture.images.map(img => ({
                ...img,
                processedImage: processedImages[img.id]
              })),
              backgroundColor: frameColor.hex
            });
            
            if (texture) {
              setFrameTexture(texture);
            }
          }
        }
      } catch (error) {
        console.error('Error generating textures:', error);
      }
    }, 100); // 100ms debounce
  }, [logoTypes, frameTexture, frameColor, processedImages, setFrameTexture]);

  // Trigger texture generation when relevant state changes
  useEffect(() => {
    if (Object.keys(processedImages).length > 0) {
      generateTextures();
    }
  }, [processedImages, frameColor, generateTextures]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (textureUpdateTimeoutRef.current) {
        clearTimeout(textureUpdateTimeoutRef.current);
      }
    };
  }, []);
} 