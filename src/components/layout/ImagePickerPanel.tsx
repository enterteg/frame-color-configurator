import React, { useState } from 'react';
import { useBikeStore, useActiveLogoType } from '../../store/useBikeStore';
import Image from 'next/image';

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

export default function ImagePickerPanel() {
  const {
    selectedLogoImageId,
    updateLogoImage,
    selectionPanelType,
    showBottomPanel,
    bottomPanelHeight
  } = useBikeStore();
  const TEXTURE_SIZE = 1024;
  const activeLogoType = useActiveLogoType();
  const aspectRatio = activeLogoType?.aspectRatio || 1;
  const [logoImages] = useState<string[]>(logoImagesList);

  if (selectionPanelType !== 'image') return null;

  const handleImagePick = (img: string) => {
    if (selectedLogoImageId) {
      const imageObj = new window.Image();
      imageObj.onload = () => {
        const canvasWidth = TEXTURE_SIZE;
        const canvasHeight = TEXTURE_SIZE / aspectRatio;
        const scaleW = 0.7 * canvasWidth / imageObj.naturalWidth;
        const scaleH = 0.7 * canvasHeight / imageObj.naturalHeight;
        const scale = Math.min(scaleW, scaleH);
        updateLogoImage(selectedLogoImageId, {
          url: `/textures/logos/${img}`,
          scaleX: scale,
          scaleY: scale
        });
      };
      imageObj.src = `/textures/logos/${img}`;
    }
  };

  return (
    <div 
      className="fixed left-[300px] top-0 bg-white shadow-lg border-l border-gray-200 z-30 flex flex-col"
      style={{
        width: 'auto',
        minWidth: 300,
        maxWidth: '100vw',
        bottom: showBottomPanel ? `${bottomPanelHeight}px` : '0px',
        height: showBottomPanel ? `calc(100vh - ${bottomPanelHeight}px)` : '100vh'
      }}
    >
      <div className="p-4 border-b border-gray-200 font-medium text-gray-800">Select a Logo Image</div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-3 gap-3">
          {logoImages.map(img => (
            <button
              key={img}
              className="w-20 h-20 border border-gray-300 rounded-lg overflow-hidden flex items-center justify-center bg-white hover:border-brand-brown-100 focus:border-brand-brown-500 transition-all"
              onClick={() => handleImagePick(img)}
            >
              <Image src={`/textures/logos/${img}`} alt={img} width={80} height={80} className="object-contain w-full h-full" unoptimized />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 