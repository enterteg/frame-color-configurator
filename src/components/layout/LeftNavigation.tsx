'use client';

import React from 'react';
import { ChevronDownIcon, ChevronUpIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useBikeStore } from '../../store/useBikeStore';
import { getContrastTextColor } from '../../utils/colorUtils';
import { getColorById } from '../../data/ralColors';

export default function LeftNavigation() {
  const [logosExpanded, setLogosExpanded] = React.useState(false);
  
  // Zustand store state
  const {
    activeTab,
    frameColor,
    forkColor,
    selectedLogoType,
    logoTypes,
    selectedLogoImageId,
    setActiveTab,
    setSelectedLogoType,
    openColorSelection,
    addLogoImage,
    removeLogoImage,
    setSelectedLogoImageId
  } = useBikeStore();

  // Logo types
  const logoTypes_CONFIG = [
    { id: 'DOWN_TUBE', name: 'Down Tube' },
    { id: 'HEAD_TUBE', name: 'Head Tube' }
  ] as const;

  const handleFrameClick = () => {
    setActiveTab('frame');
    openColorSelection('frame');
  };

  const handleForkClick = () => {
    setActiveTab('fork');
    openColorSelection('fork');
  };

  const handleLogosClick = () => {
    setActiveTab('logos');
    setLogosExpanded(!logosExpanded);
  };

  const handleLogoTypeSelect = (logoType: 'DOWN_TUBE' | 'HEAD_TUBE') => {
    setSelectedLogoType(logoType);
  };

  const handleImageImport = (logoType: 'DOWN_TUBE' | 'HEAD_TUBE') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png,image/jpg,image/jpeg';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const url = event.target?.result as string;
          
          // Load image to get dimensions for initial scaling
          const img = new Image();
          img.onload = () => {
            // Calculate initial scale to fit within constraints (600px width or 50px height)
            const maxWidth = 600;
            const maxHeight = 50;
            
            let scaleX = 1;
            let scaleY = 1;
            
            if (img.width > maxWidth) {
              scaleX = maxWidth / img.width;
            }
            
            if (img.height > maxHeight) {
              scaleY = maxHeight / img.height;
            }
            
            // Use the smaller scale factor to ensure both constraints are met
            const initialScale = Math.min(scaleX, scaleY);
            
            addLogoImage(logoType, {
              name: file.name,
              url,
              color: getColorById('9005') || { code: 'RAL 9005', name: 'Jet black', hex: '#0A0A0A' },
              x: 50,
              y: 25,
              scaleX: initialScale,
              scaleY: initialScale,
              rotation: 0
            });
          };
          img.src = url;
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleImageSelect = (imageId: string) => {
    setSelectedLogoImageId(imageId);
  };

  const handleImageDelete = (logoType: 'DOWN_TUBE' | 'HEAD_TUBE', imageId: string) => {
    removeLogoImage(logoType, imageId);
  };

  const handleImageColorChange = (imageId: string) => {
    setSelectedLogoImageId(imageId);
    openColorSelection('logo');
  };

  return (
    <div className="w-[300px] h-screen bg-white shadow-lg border-r border-gray-200 flex flex-col transition-all duration-300 z-20">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-800">
          Frame Customizer
        </h1>
      </div>

      {/* Navigation Options */}
      <div className="flex-1 overflow-y-auto">
        {/* Frame */}
        <button
          onClick={handleFrameClick}
          className={`w-full flex items-center justify-between px-4 py-4 border-b border-gray-100 transition-all duration-200 ${
            activeTab === "frame"
              ? "bg-blue-50 text-blue-700 border-l-4 border-l-blue-500"
              : "hover:bg-gray-50"
          }`}
        >
          <div className="flex-1 text-left">
            <div className="font-medium text-gray-800">FRAME</div>
          </div>
          <div
            className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center flex-shrink-0 shadow-md"
            style={{ backgroundColor: frameColor.hex }}
          >
            <span
              className="text-[10px] font-bold"
              style={{ color: getContrastTextColor(frameColor.hex) }}
            >
              {frameColor.code.replace("RAL ", "")}
            </span>
          </div>
        </button>

        {/* Fork */}
        <button
          onClick={handleForkClick}
          className={`w-full flex items-center justify-between px-4 py-4 border-b border-gray-100 transition-all duration-200 ${
            activeTab === "fork"
              ? "bg-blue-50 text-blue-700 border-l-4 border-l-blue-500"
              : "hover:bg-gray-50"
          }`}
        >
          <div className="flex-1 text-left">
            <div className="font-medium text-gray-800">FORK</div>
          </div>
          <div
            className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center flex-shrink-0 shadow-md"
            style={{ backgroundColor: forkColor.hex }}
          >
            <span
              className="text-[10px] font-bold"
              style={{ color: getContrastTextColor(forkColor.hex) }}
            >
              {forkColor.code.replace("RAL ", "")}
            </span>
          </div>
        </button>

        {/* Logos */}
        <button
          onClick={handleLogosClick}
          className={`w-full flex items-center justify-between px-4 py-4 border-b border-gray-100 transition-all duration-200 ${
            activeTab === "logos"
              ? "bg-blue-50 text-blue-700 border-l-4 border-l-blue-500"
              : "hover:bg-gray-50"
          }`}
        >
          <div className="flex-1 text-left">
            <div className="font-medium text-gray-800">LOGOS</div>
          </div>
          <div className="flex items-center gap-2">
            {logosExpanded ? (
              <ChevronUpIcon className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDownIcon className="h-4 w-4 text-gray-500" />
            )}
          </div>
        </button>

        {/* Expandable Logo Types Section */}
        {logosExpanded && (
          <div className="bg-gray-50 border-b border-gray-100">
            {logoTypes_CONFIG.map((logoType) => (
              <div
                key={logoType.id}
                className="border-b border-gray-200 last:border-b-0"
              >
                {/* Logo Type Header */}
                <button
                  onClick={() => handleLogoTypeSelect(logoType.id)}
                  className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-100 transition-all duration-200 ${
                    selectedLogoType === logoType.id
                      ? "bg-blue-50 border-l-4 border-l-blue-500"
                      : ""
                  }`}
                >
                  <div className="w-8 h-8 rounded border border-gray-300 bg-white mr-3 flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">
                      {logoType.id === "DOWN_TUBE" ? "DT" : "HT"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900">
                      {logoType.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {logoTypes[logoType.id].images.length} image
                      {logoTypes[logoType.id].images.length !== 1 ? "s" : ""}
                    </div>
                  </div>
                </button>

                {/* Images List for Selected Logo Type */}
                {selectedLogoType === logoType.id && (
                  <div className="bg-white px-4 py-2">
                    {/* Images */}
                    {logoTypes[logoType.id].images.length > 0 && (
                      <div className="space-y-2 mb-3">
                        {logoTypes[logoType.id].images.map((image) => (
                          <div
                            key={image.id}
                            className={`flex items-center gap-3 p-2 rounded-lg border transition-all duration-200 cursor-pointer ${
                              selectedLogoImageId === image.id
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                            onClick={() => handleImageSelect(image.id)}
                          >
                            {/* Image Thumbnail */}
                            <div className="w-10 h-10 rounded border border-gray-300 bg-gray-100 flex-shrink-0 overflow-hidden">
                              <img
                                src={image.url}
                                alt={image.name}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* Image Info */}
                            <div className="flex-1 flex flex-col min-w-0">
                              <div className="text-xs font-medium text-gray-800 truncate">
                                {image.name}
                              </div>
                              <div className="text-xs font-medium text-gray-800 truncate">
                                {image.color.code}
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleImageColorChange(image.id);
                                }}
                                className="p-1 rounded cursor-pointer transition-colors"
                                title="Change color"
                              >
                                <div
                                  className="w-8 h-8 rounded-full border border-gray-300"
                                  style={{ backgroundColor: image.color.hex }}
                                />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleImageDelete(logoType.id, image.id);
                                }}
                                className="p-1 h-8 w-8 cursor-pointer items-center justify-center flex rounded-full border border-gray-300 hover:bg-red-100 transition-colors"
                                title="Delete image"
                              >
                                <TrashIcon className="h-4 w-4 text-red-500" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Import Button */}
                    <button
                      onClick={() => handleImageImport(logoType.id)}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-600 border border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors"
                    >
                      <PlusIcon className="h-4 w-4" />
                      Import Image
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 