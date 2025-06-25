import { useBikeStore, useActiveLogoType } from '../store/useBikeStore';

function loadImageAndGetScale(imgUrl: string, aspectRatio: number, callback: (scale: number, canvasWidth: number, canvasHeight: number) => void) {
  const imageObj = new window.Image();
  imageObj.onload = () => {
    const canvasWidth = 1024;
    const canvasHeight = 1024 / aspectRatio;
    const scaleW = 0.7 * canvasWidth / imageObj.naturalWidth;
    const scaleH = 0.7 * canvasHeight / imageObj.naturalHeight;
    const scale = Math.min(scaleW, scaleH);
    callback(scale, canvasWidth, canvasHeight);
  };
  imageObj.src = imgUrl;
}

export function useLogoImageActions() {
  const {
    selectedLogoImageId,
    updateLogoImage,
    selectedLogoType,
    addLogoImageFromFile,
    addLogoImage,
  } = useBikeStore();
  const activeLogoType = useActiveLogoType();
  const aspectRatio = activeLogoType?.aspectRatio || 1;

  // Helper: are we in replace mode?
  const isReplaceMode = !!selectedLogoImageId;

  // Centralized add logic for built-in images
  const addBuiltInImage = (img: string) => {
    if (!selectedLogoType) return;
    loadImageAndGetScale(`/textures/logos/${img}`, aspectRatio, (scale, canvasWidth, canvasHeight) => {
      addLogoImage(selectedLogoType, {
        name: img,
        url: `/textures/logos/${img}`,
        x: canvasWidth / 2,
        y: canvasHeight / 2,
        scaleX: scale,
        scaleY: scale,
        rotation: 0,
        color: activeLogoType?.images[0]?.color || { code: 'RAL 9005', name: 'Jet black', hex: '#0A0A0A' },
        zIndex: 0,
      });
    });
  };

  // Centralized replace logic for built-in images
  const replaceBuiltInImage = (img: string) => {
    if (!selectedLogoImageId) return;
    loadImageAndGetScale(`/textures/logos/${img}`, aspectRatio, (scale) => {
      updateLogoImage(selectedLogoImageId, {
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
    updateLogoImage(selectedLogoImageId, {
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