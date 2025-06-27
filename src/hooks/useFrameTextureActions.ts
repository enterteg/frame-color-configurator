import { useBikeStore } from '../store/useBikeStore';
import { loadImageAndGetScale } from './useLogoImageActions';

export function useFrameTextureActions() {
  const {
    frameTexture,
    addFrameTextureImage,
    setShowBottomPanel
  } = useBikeStore();

  const aspectRatio = frameTexture.aspectRatio || 1;

  // Centralized add logic for built-in frame texture images
  const addBuiltInImage = (img: string) => {
    loadImageAndGetScale(`/textures/frame/${img}`, aspectRatio, (scale, canvasWidth, canvasHeight) => {
      // Calculate texture capture area offset (same logic as useCanvasCalculations)
      const STAGE_PADDING = canvasHeight * 0.2;
      const TEXTURE_OFFSET_X = STAGE_PADDING;
      const TEXTURE_OFFSET_Y = STAGE_PADDING;
      
      addFrameTextureImage({
        name: img,
        url: `/textures/frame/${img}`,
        x: TEXTURE_OFFSET_X + canvasWidth / 2, // Center within texture capture area
        y: TEXTURE_OFFSET_Y + canvasHeight / 2, // Center within texture capture area
        scaleX: scale,
        scaleY: scale,
        rotation: 0,
        zIndex: 0,
      });
      setShowBottomPanel(true);
    });
  };

  // Centralized add logic for uploaded images
  const addUploadedImage = (file: File) => {
    const blobUrl = URL.createObjectURL(file);
    loadImageAndGetScale(blobUrl, aspectRatio, (scale, canvasWidth, canvasHeight) => {
      // Calculate texture capture area offset
      const STAGE_PADDING = canvasHeight * 0.2;
      const TEXTURE_OFFSET_X = STAGE_PADDING;
      const TEXTURE_OFFSET_Y = STAGE_PADDING;
      
      addFrameTextureImage({
        name: file.name,
        file,
        blobUrl,
        x: TEXTURE_OFFSET_X + canvasWidth / 2,
        y: TEXTURE_OFFSET_Y + canvasHeight / 2,
        scaleX: scale,
        scaleY: scale,
        rotation: 0,
        zIndex: 0,
      });
      setShowBottomPanel(true);
    }, 0.8);
  };

  return {
    addBuiltInImage,
    addUploadedImage,
  };
} 