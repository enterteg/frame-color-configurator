'use client';

import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import LogoCanvas from '../LogoCanvas';
import { useBikeStore } from '../../store/useBikeStore';

export default function RightColorPanel() {
  // Zustand store state
  const {
    rightPanelOpen,
    showLogoEditor,
    selectedLogoImageId,
    selectedLogoColor,
    setRightPanelOpen,
    setLogoTexture,
    handleColorChangeRequest
  } = useBikeStore();

  if (!rightPanelOpen) {
    return <div className="w-0 transition-all duration-300" />;
  }

  return (
    <div className="w-[500px] h-screen bg-white shadow-lg border-l border-gray-200 transition-all duration-300 overflow-hidden z-20">
      <div className="h-full flex flex-col">
        {/* Panel Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            {showLogoEditor ? 'Logo Editor' : 'Tools'}
          </h2>
          <button
            onClick={() => setRightPanelOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Panel Content */}
        <div className="flex-1 overflow-auto p-4">
          {showLogoEditor && selectedLogoImageId ? (
            <LogoCanvas
              imageUrl="/textures/loca_half.png"
              onTextureChange={setLogoTexture}
              onColorChangeRequest={handleColorChangeRequest}
              selectedColor={selectedLogoColor}
              externalSelectedImageId={selectedLogoImageId}
            />
          ) : (
            <div className="text-center text-gray-500">
              {showLogoEditor ? 'Select a logo to edit' : 'Tools panel - Coming soon'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 