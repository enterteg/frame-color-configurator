import { useBikeStore, useActiveTexture } from '../store/useBikeStore';

export function loadImageAndGetScale(
  imgUrl: string,
  aspectRatio: number,
  callback: (scale: number, canvasWidth: number, canvasHeight: number) => void,
  scaleFactor: number = 0.5
) {
  const imageObj = new window.Image();
  imageObj.onload = () => {
    const canvasWidth = 1024;
    const canvasHeight = 1024 / aspectRatio;
    const scaleW = scaleFactor * canvasWidth / imageObj.naturalWidth;
    const scaleH = scaleFactor * canvasHeight / imageObj.naturalHeight;
    const scale = Math.min(scaleW, scaleH);
    callback(scale, canvasWidth, canvasHeight);
  };
  imageObj.src = imgUrl;
}

export function useLogoImageActions() {
  const {
    selectedLogoImageId,
    updateTextureImage,
    selectedLogoType,
    addLogoImageFromFile,
    addLogoImage,
  } = useBikeStore();
  const activeTexture = useActiveTexture();
  const aspectRatio = activeTexture?.aspectRatio || 1;

  // Helper: are we in replace mode?
  const isReplaceMode = !!selectedLogoImageId;

  // Centralized add logic for built-in images
  const addBuiltInImage = (img: string) => {
    if (!selectedLogoType) return;
    loadImageAndGetScale(`/textures/logos/${img}`, aspectRatio, (scale, canvasWidth, canvasHeight) => {
      // Calculate texture capture area offset (same logic as useCanvasCalculations)
      const STAGE_PADDING = canvasHeight * 0.2;
      const TEXTURE_OFFSET_X = STAGE_PADDING;
      const TEXTURE_OFFSET_Y = STAGE_PADDING;
      
      addLogoImage(selectedLogoType, {
        name: img,
        url: `/textures/logos/${img}`,
        x: TEXTURE_OFFSET_X + canvasWidth / 2, // Center within texture capture area
        y: TEXTURE_OFFSET_Y + canvasHeight / 2, // Center within texture capture area
        scaleX: scale,
        scaleY: scale,
        rotation: 0,
        color: activeTexture?.images[0]?.color || { code: 'RAL 9005', name: 'Jet black', hex: '#0A0A0A' },
        zIndex: 0,
      });
    });
  };

  // Centralized replace logic for built-in images
  const replaceBuiltInImage = (img: string) => {
    if (!selectedLogoImageId) return;
    loadImageAndGetScale(`/textures/logos/${img}`, aspectRatio, (scale) => {
      updateTextureImage(selectedLogoImageId, {
        url: `/textures/logos/${img}`,
        scaleX: scale,
        scaleY: scale
      });
    });
  };

  // Centralized add logic for uploaded images
  const addUploadedImage = (file: File) => {
    if (!selectedLogoType) return;
    addLogoImageFromFile(selectedLogoType, file);
  };

  // Centralized replace logic for uploaded images
  const replaceUploadedImage = (file: File) => {
    if (!selectedLogoImageId) return;
    const blobUrl = URL.createObjectURL(file);
    updateTextureImage(selectedLogoImageId, {
      file,
      blobUrl,
      name: file.name,
      url: blobUrl,
    });
  };

  return {
    isReplaceMode,
    addBuiltInImage,
    replaceBuiltInImage,
    addUploadedImage,
    replaceUploadedImage,
  };
} 