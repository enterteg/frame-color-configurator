import { useState, useEffect } from 'react';
import { GradientSettings } from '../types/bike';
import { generateGradientImage } from '../utils/generateGradient';

interface UseGradientImageProps {
  gradient?: GradientSettings;
  width: number;
  height: number;
}

export function useGradientImage({ gradient, width, height }: UseGradientImageProps) {
  const [gradientImage, setGradientImage] = useState<HTMLImageElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!gradient || !gradient.enabled) {
      setGradientImage(null);
      return;
    }

    let isCancelled = false;
    setIsLoading(true);

    const generateImage = async () => {
      try {
        const image = await generateGradientImage({
          width: Math.round(width),
          height: Math.round(height),
          gradient
        });
        
        if (!isCancelled) {
          setGradientImage(image);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error generating gradient image:', error);
        if (!isCancelled) {
          setGradientImage(null);
          setIsLoading(false);
        }
      }
    };

    generateImage();

    return () => {
      isCancelled = true;
    };
  }, [gradient, width, height]);

  return {
    gradientImage,
    isLoading
  };
} 