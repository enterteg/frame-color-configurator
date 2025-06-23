'use client';

import React, { useEffect } from 'react';
import { BikeViewer3D } from './bike-viewer';
import { useBikeStore } from '../store/useBikeStore';

// Layout components
import MainLayout from './layout/MainLayout';
import LeftNavigation from './layout/LeftNavigation';
import ColorSelection from './layout/ColorSelection';
import BottomPanel from './layout/BottomPanel';
import ControlInfoPanel from './layout/ControlInfoPanel';

export default function BikeCustomizer() {
  // Get all state from Zustand store
  const {
    showBottomPanel,
    initializeAllLogoTextures
  } = useBikeStore();

  useEffect(() => {
    initializeAllLogoTextures();
  }, [initializeAllLogoTextures]);


  return (
    <>
      <ControlInfoPanel />
      <MainLayout
        leftNavigation={<LeftNavigation />}
        mainContent={
          <div className={`w-full relative transition-all duration-300 h-screen`}>
            <BikeViewer3D 
              combinedModelPath="/models/bikeframe.glb"
              className="w-full h-full"
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