import React, { useState } from 'react';
import { useBikeStore } from '../../store/useBikeStore';
import Image from 'next/image';
import UploadImageButton from './UploadImageButton';
import { useLogoImageActions } from '../../hooks/useLogoImageActions';
import { useFrameTextureActions } from '../../hooks/useFrameTextureActions';
import { LEFT_NAVIGATION_WIDTH } from '../../utils/constants';

const logoImagesList = [
  '100percent.png',
  'handmade_poland.png',
  'mud_stones.png',
  'loca_triangle.png',
  'loca_sharp_empty.png',
  'loca_sharp.png',
  'loca_empty.png',
  'loca_bikes_empty_italic.png',
  'loca_bikes_italic.png',
  'loca_spacious_vert.png',
  'loca_spacious.png',
  'loca_bikes_horizontal.png',
  'loca_half.png',
  'CA.png',
  'loca_vertical.png',
  'lo_jing_yang.png',
  'triangle.png',
  'handmade.png',
  'loca_circles.png',
  'loca_bikes_text_front.png',
  'loca_bikes_front.png',
  'loca_solid.png',
];

const frameTexturesList = [
  'zebra.png',
];

export default function ImagePickerPanel() {
  const {
    selectedLogoImageId,
    selectionPanelType,
    showBottomPanel,
    bottomPanelHeight,
    selectedLogoType,
    activeTab,
  } = useBikeStore();
  const [logoImages] = useState<string[]>(logoImagesList);
  const [frameTextures] = useState<string[]>(frameTexturesList);

  const {
    isReplaceMode,
    addBuiltInImage: addBuiltInLogoImage,
    replaceBuiltInImage,
    addUploadedImage: addUploadedLogoImage,
    replaceUploadedImage,
  } = useLogoImageActions();

  const {
    addBuiltInImage: addBuiltInFrameTexture,
    addUploadedImage: addUploadedFrameTexture,
  } = useFrameTextureActions();

  if (selectionPanelType !== 'image') return null;

  // Determine if we're in frame texture mode
  const isFrameTextureMode = activeTab === 'frame' && !selectedLogoType;

  const handleImagePick = (img: string) => {
    if (isFrameTextureMode) {
      addBuiltInFrameTexture(img);
    } else if (isReplaceMode) {
      replaceBuiltInImage(img);
    } else {
      addBuiltInLogoImage(img);
    }
  };

  const handleUploadFile = (file: File) => {
    if (isFrameTextureMode) {
      addUploadedFrameTexture(file);
    } else if (!selectedLogoType && !selectedLogoImageId) {
      return;
    } else if (isReplaceMode) {
      replaceUploadedImage(file);
    } else {
      addUploadedLogoImage(file);
    }
  };

  const getHeaderText = () => {
    if (isFrameTextureMode) {
      return 'Add Frame Texture';
    }
    return isReplaceMode ? 'Replace Logo Image' : 'Add Logo Image';
  };

  const imagesToShow = isFrameTextureMode ? frameTextures : logoImages;
  const imageBasePath = isFrameTextureMode ? '/textures/frame/' : '/textures/logos/';

  return (
    <div 
      className="fixed top-0 bg-white shadow-lg border-l border-gray-200 z-30 flex flex-col"
      style={{
        left: `${LEFT_NAVIGATION_WIDTH}px`,
        width: 'auto',
        minWidth: 300,
        maxWidth: '100vw',
        bottom: showBottomPanel ? `${bottomPanelHeight}px` : '0px',
        height: showBottomPanel ? `calc(100vh - ${bottomPanelHeight}px)` : '100vh'
      }}
    >
      <div className="p-4 border-b border-gray-200 font-medium text-gray-800 flex items-center justify-between">
        <span>{getHeaderText()}</span>
        <UploadImageButton onFile={handleUploadFile} accept="image/png,image/jpg,image/jpeg" title="Upload new image" />
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-3 gap-3">
          {imagesToShow.map(img => (
            <button
              key={img}
              className="w-20 h-20 border border-gray-300 rounded-lg overflow-hidden flex items-center justify-center bg-white hover:border-brand-brown-100 focus:border-brand-brown-500 transition-all"
              onClick={() => handleImagePick(img)}
            >
              <Image src={`${imageBasePath}${img}`} alt={img} width={80} height={80} className="object-contain w-full h-full" unoptimized />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 