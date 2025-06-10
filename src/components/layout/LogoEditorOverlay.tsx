'use client';

import React from 'react';
import LogoCanvas from '../LogoCanvas';
import * as THREE from 'three';

interface LogoEditorOverlayProps {
  isVisible: boolean;
  selectedLogoColor: string;
  selectedLogoImageId?: string;
  onTextureChange: (texture: THREE.Texture | null) => void;
  onColorChangeRequest: (imageId: string) => void;
}

export default function LogoEditorOverlay({
  isVisible,
  selectedLogoColor,
  selectedLogoImageId,
  onTextureChange,
  onColorChangeRequest
}: LogoEditorOverlayProps) {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="absolute bottom-4 left-4 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Logo Editor</h3>
      <LogoCanvas
        imageUrl="/textures/loca_half.png"
        onTextureChange={onTextureChange}
        onColorChangeRequest={onColorChangeRequest}
        selectedColor={selectedLogoColor}
        externalSelectedImageId={selectedLogoImageId}
      />
    </div>
  );
} 