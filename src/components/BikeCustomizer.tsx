'use client';

import React from 'react';
import { BikeViewer3D } from './bike-viewer';
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
    activeTab,
    openColorSelection,
    setActiveTab
  } = useBikeStore();

  const textureUrl = "/textures/loca_half.png";

  // Only show logo texture when frame/fork tabs are NOT active
  const shouldShowLogos = activeTab !== 'frame' && activeTab !== 'fork';
  const currentLogoTexture = shouldShowLogos ? logoTypes.DOWN_TUBE.texture : null;

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