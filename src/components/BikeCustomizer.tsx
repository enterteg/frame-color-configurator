'use client';

import React, { useEffect } from 'react';
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
    showBottomPanel,
    openColorSelection,
    setActiveTab,
    initializeAllLogoTextures
  } = useBikeStore();

  useEffect(() => {
    initializeAllLogoTextures();
  }, [initializeAllLogoTextures]);

  const textureUrl = "/textures/loca_half.png";

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
              combinedModelPath="/models/bikeframe_full.glb"
              className="w-full h-full"
              onPartClick={handleTabClick}
            />
          </div>
        }
        rightPanel={null}
        bottomPanelHeight={showBottomPanel ? 200 : 0}
      />
      <ColorSelection />
      <BottomPanel isOpen={showBottomPanel} />
    </>
  );
} 