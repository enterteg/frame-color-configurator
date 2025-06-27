import * as THREE from 'three';
import { TextureImage, GradientSettings } from '../types/bike';
import { generateGradientImage } from './generateGradient';

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

export async function processImageWithTransformations(image: TextureImage): Promise<HTMLImageElement> {
  console.log('processImageWithTransformations called for:', { 
    id: image.id, 
    name: image.name, 
    hasColor: !!image.color,
    colorHex: image.color?.hex 
  });
  
  // Load the source image
  const sourceImage = await loadImage(image.url || image.blobUrl || '');
  
  // If no color is defined, return the original image without transformations
  if (!image.color) {
    console.log('No color defined, returning original image');
    return sourceImage;
  }
  
  console.log('Applying color transformation with:', image.color.hex);
  
  // Create a canvas to apply transformations
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  
  canvas.width = sourceImage.width;
  canvas.height = sourceImage.height;
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw the image first
  ctx.drawImage(sourceImage, 0, 0);
  
  // Apply color tint only if color is defined
  ctx.globalCompositeOperation = 'source-in';
  ctx.fillStyle = image.color.hex;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Reset composite operation
  ctx.globalCompositeOperation = 'source-over';
  
  // Create a new image from the processed canvas
  const processedImage = new window.Image();
  processedImage.src = canvas.toDataURL('image/png', 1.0); // Use maximum quality
  
  return new Promise((resolve) => {
    processedImage.onload = () => resolve(processedImage);
  });
}

export async function generateImageTexture({
  width,
  height,
  images,
  backgroundColor,
  textureOffsetX = 0,
  textureOffsetY = 0,
  gradient,
}: {
  width: number;
  height: number;
  images: TextureImage[];
  backgroundColor?: string;
  textureOffsetX?: number;
  textureOffsetY?: number;
  gradient?: GradientSettings;
}): Promise<THREE.Texture> {
  console.log('generateImageTexture called with:', { 
    width, 
    height, 
    imagesCount: images.length, 
    backgroundColor,
    textureOffsetX,
    textureOffsetY
  });
  
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Clear canvas with transparent background
  ctx.clearRect(0, 0, width, height);

  // Fill with background color if provided
  if (backgroundColor) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);
  }

  // Apply gradient background if provided
  if (gradient && gradient.enabled) {
    try {
      const gradientImage = await generateGradientImage({ width, height, gradient });
      
      ctx.save();
      ctx.globalAlpha = gradient.opacity;
      ctx.globalCompositeOperation = 
        gradient.blendMode === 'multiply' ? 'multiply' :
        gradient.blendMode === 'screen' ? 'screen' :
        gradient.blendMode === 'overlay' ? 'overlay' :
        gradient.blendMode === 'soft-light' ? 'soft-light' :
        gradient.blendMode === 'hard-light' ? 'hard-light' :
        'source-over';
      ctx.drawImage(gradientImage, 0, 0, width, height);
      ctx.restore();
    } catch (error) {
      console.error('Error applying gradient to texture:', error);
    }
  }

  for (const img of images) {
    if (!img.url && !img.blobUrl) continue;
    
    console.log('Processing image:', { 
      id: img.id, 
      name: img.name, 
      hasColor: !!img.color, 
      hasProcessedImage: !!img.processedImage,
      originalX: img.x,
      originalY: img.y,
      adjustedX: img.x - textureOffsetX,
      adjustedY: img.y - textureOffsetY
    });
    
    // Use processed image if available, otherwise process it
    const processedImage = img.processedImage || await processImageWithTransformations(img);
    
    // Adjust coordinates to be relative to texture capture area
    const adjustedX = img.x - textureOffsetX;
    const adjustedY = img.y - textureOffsetY;
    
    console.log('Drawing image to canvas:', {
      imageWidth: processedImage.width,
      imageHeight: processedImage.height,
      adjustedX,
      adjustedY,
      scaleX: img.scaleX || 1,
      scaleY: img.scaleY || 1,
      rotation: img.rotation || 0
    });
    
    ctx.save();
    ctx.translate(adjustedX, adjustedY);
    ctx.rotate((img.rotation || 0) * Math.PI / 180);
    ctx.scale(img.scaleX || 1, img.scaleY || 1);
    ctx.drawImage(
      processedImage,
      -processedImage.width / 2,
      -processedImage.height / 2
    );
    ctx.restore();
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.flipY = false;
  texture.needsUpdate = true;
  texture.colorSpace = THREE.SRGBColorSpace;

  return texture;
} 