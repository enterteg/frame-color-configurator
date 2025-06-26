import * as THREE from 'three';
import { TextureImage } from '../types/bike';

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
  // Load the source image
  const sourceImage = await loadImage(image.url || image.blobUrl || '');
  
  // If no color is defined, return the original image without transformations
  if (!image.color) {
    console.log('No color defined, returning original image');
    return sourceImage;
  }
  
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
}: {
  width: number;
  height: number;
  images: TextureImage[];
}): Promise<THREE.Texture> {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Clear canvas with transparent background
  ctx.clearRect(0, 0, width, height);

  for (const img of images) {
    if (!img.url && !img.blobUrl) continue;
    
    // Use processed image if available, otherwise process it
    const processedImage = img.processedImage || await processImageWithTransformations(img);
    
    ctx.save();
    ctx.translate(img.x, img.y);
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