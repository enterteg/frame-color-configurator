"use client";

import React from "react";
import { BikeViewer3D } from "../components/bike-viewer";

// Layout components
import MainLayout from "../components/layout/MainLayout";
import LeftNavigation from "../components/layout/LeftNavigation";
import BottomPanel from "../components/layout/BottomPanel";
import ControlInfoPanel from "../components/layout/ControlInfoPanel";
import MobileWarning from "../components/MobileWarning";
import SelectionPanel from "../components/layout/SelectionPanel";
import { TextureManager } from "../components/TextureManager";

export default function BikeCustomizer() {
  

  return (
    <>
      <TextureManager />
      <MobileWarning />
      <ControlInfoPanel />
      <MainLayout
        leftNavigation={<LeftNavigation />}
        mainContent={
          <div
            className={`w-full relative transition-all duration-300 h-screen`}
          >
            <BikeViewer3D
              combinedModelPath="/models/bikeframe_pre.glb"
              className="w-full h-full"
            />
          </div>
        }
        rightPanel={null}
      />
      <SelectionPanel />
      <BottomPanel />
    </>
  );
}