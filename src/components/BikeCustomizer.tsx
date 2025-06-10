'use client';

import React from 'react';
import BikeViewer3D from './BikeViewer3D';
import { useBikeStore } from '../store/useBikeStore';

// Layout components
import MainLayout from './layout/MainLayout';
import LeftNavigation from './layout/LeftNavigation';
import ColorSelection from './layout/ColorSelection';
import BottomPanel from './layout/BottomPanel';

export default function BikeCustomizer() {
  // Get all state from Zustand store
  const {
    frameColor,
    forkColor,
    showBottomPanel,
    logoTypes,
    openColorSelection,
    setActiveTab
  } = useBikeStore();

  const textureUrl = "/textures/loca_half.png";

  // Get current logo texture for the selected logo type (DOWN_TUBE for frame display)
  const currentLogoTexture = logoTypes.DOWN_TUBE.texture;

  // Handle tab clicks
  const handleTabClick = (tab: 'frame' | 'fork' | 'logos') => {
    if (tab === 'frame' || tab === 'fork') {
      // Open color selection for frame/fork
      openColorSelection(tab);
    } else {
      // Just set active tab for logos
      setActiveTab(tab);
    }
  };

  return (
    <>
      <MainLayout
        leftNavigation={<LeftNavigation />}
        mainContent={
          <div className={`w-full relative transition-all duration-300 h-screen`}>
            <BikeViewer3D 
              selectedColors={[frameColor, forkColor]}
              combinedModelPath="/models/frame_tube.glb"
              textureUrl={textureUrl}
              className="w-full h-full"
              canvasTexture={currentLogoTexture}
              offsetX={0}
              offsetY={0}
              onPartClick={handleTabClick}
            />
          </div>
        }
        rightPanel={null}
        bottomPanelHeight={showBottomPanel ? 200 : 0}
      />
      <ColorSelection />
      <BottomPanel isOpen={showBottomPanel} baseTextureUrl={textureUrl} />
    </>
  );
} 