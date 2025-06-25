"use client";

import React, { useEffect } from "react";
import { BikeViewer3D } from "../components/bike-viewer";
import { useBikeStore } from "../store/useBikeStore";

// Layout components
import MainLayout from "../components/layout/MainLayout";
import LeftNavigation from "../components/layout/LeftNavigation";
import ColorSelection from "../components/layout/ColorSelection";
import BottomPanel from "../components/layout/BottomPanel";
import ControlInfoPanel from "../components/layout/ControlInfoPanel";
import MobileWarning from "../components/MobileWarning";

export default function BikeCustomizer() {
  

  return (
    <>
      <InitializeAllLogoTextures />
      <MobileWarning />
      <ControlInfoPanel />
      <MainLayout
        leftNavigation={<LeftNavigation />}
        mainContent={
          <div
            className={`w-full relative transition-all duration-300 h-screen`}
          >
            <BikeViewer3D
              combinedModelPath="/models/bikeframe.glb"
              className="w-full h-full"
            />
          </div>
        }
        rightPanel={null}
      />
      <ColorSelection />
      <BottomPanel />
    </>
  );
}


const InitializeAllLogoTextures = () => {
  const { initializeAllLogoTextures } = useBikeStore();

  useEffect(() => {
    initializeAllLogoTextures();
  }, [initializeAllLogoTextures]);

  return null;
}