'use client';

import React from 'react';
import { 
  TrashIcon, 
  PlusIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import { useBikeStore } from '../../store/useBikeStore';
import { getContrastTextColor } from '../../utils/colorUtils';
import { LogoType } from '../../types/bike';

const LeftNavigation = () => {
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
    addLogoImageFromFile,
    removeLogoImage,
    setSelectedLogoImageId,
    setLogoTextureFromState,
    updateLogoTypeImages
  } = useBikeStore();

  // Logo types configuration
  const logoTypes_CONFIG = [
    { id: 'DOWN_TUBE_RIGHT' as LogoType, name: 'Down Tube Right' },
    { id: 'DOWN_TUBE_LEFT' as LogoType, name: 'Down Tube Left' },
    { id: 'HEAD_TUBE' as LogoType, name: 'Head Tube' }
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
  };

  const handleImageSelect = (logoType: LogoType, imageId: string) => {
    setSelectedLogoType(logoType);
    setSelectedLogoImageId(imageId);
  };

  const handleImageImport = (logoType: LogoType) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png,image/jpg,image/jpeg';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        addLogoImageFromFile(logoType, file);
      }
    };
    input.click();
  };

  const handleImageDelete = (logoType: LogoType, imageId: string) => {
    removeLogoImage(logoType, imageId);
    // Clear selection if the deleted image was selected
    if (selectedLogoType === logoType && selectedLogoImageId === imageId) {
      setSelectedLogoType(null);
      setSelectedLogoImageId(null);
    }
    // Trigger texture regeneration
    setLogoTextureFromState(logoType);
  };

  const handleImageColorChange = (logoType: LogoType, imageId: string) => {
    setSelectedLogoType(logoType);
    setSelectedLogoImageId(imageId);
    openColorSelection('logo');
  };

  const handleLogoTypeClick = (logoType: LogoType) => {
    setSelectedLogoType(logoType);
    // Select first image if available
    const images = logoTypes[logoType].images;
    if (images.length > 0) {
      setSelectedLogoImageId(images[0].id);
    } else {
      setSelectedLogoImageId(null);
    }
    setActiveTab('logos');
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
        </button>

        {/* Always Expanded Logo Types Section */}
        <div className="bg-gray-50 border-b border-gray-100">
          {logoTypes_CONFIG.map((logoType) => (
            <div
              key={logoType.id}
              className="border-b border-gray-200 last:border-b-0"
            >
              {/* Logo Type Header */}
              <div
                className="px-6 py-3 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleLogoTypeClick(logoType.id)}
              >
                <div className="flex-1 flex flex-row min-w-0 justify-between items-center">
                  <div className="text-sm font-medium text-gray-900">
                    {logoType.name}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleImageImport(logoType.id);
                    }}
                    className="flex cursor-pointer items-center justify-center gap-2 px-3 py-2 text-sm text-gray-600 border border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Images List */}
              <div className="bg-white px-4 py-2">
                {/* Images */}
                {logoTypes[logoType.id].images.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {logoTypes[logoType.id].images.map((image) => (
                      <div
                        key={image.id}
                        className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-200 cursor-pointer ${
                          selectedLogoType === logoType.id &&
                          selectedLogoImageId === image.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                        onClick={() => handleImageSelect(logoType.id, image.id)}
                      >
                        {/* Image Thumbnail */}
                        <div className="w-10 h-10 rounded border border-gray-300 bg-gray-100 flex-shrink-0 overflow-hidden">
                          <img
                            src={image.url || image.blobUrl}
                            alt={image.name}
                            className="w-full h-full object-contain"
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
                              handleImageColorChange(logoType.id, image.id);
                            }}
                            className="p-1 rounded hover:bg-gray-100 transition-colors"
                          >
                            <div
                              className="w-6 h-6 rounded-full border border-gray-300"
                              style={{ backgroundColor: image.color.hex }}
                            />
                          </button>
                          {logoTypes[logoType.id].images.length > 1 && (
                            <>
                              {logoTypes[logoType.id].images.findIndex(
                                (img) => img.id === image.id
                              ) <
                                logoTypes[logoType.id].images.length - 1 && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Move image up in layer order
                                    const currentIndex = logoTypes[
                                      logoType.id
                                    ].images.findIndex(
                                      (img) => img.id === image.id
                                    );
                                    const newImages = [
                                      ...logoTypes[logoType.id].images,
                                    ];
                                    [
                                      newImages[currentIndex],
                                      newImages[currentIndex + 1],
                                    ] = [
                                      newImages[currentIndex + 1],
                                      newImages[currentIndex],
                                    ];
                                    updateLogoTypeImages(
                                      logoType.id,
                                      newImages
                                    );
                                    setLogoTextureFromState(logoType.id);
                                  }}
                                  className="p-1 rounded hover:bg-gray-100 transition-colors"
                                  title="Move up"
                                >
                                  <ArrowDownIcon className="h-4 w-4 text-gray-500" />
                                </button>
                              )}
                              {logoTypes[logoType.id].images.findIndex(
                                (img) => img.id === image.id
                              ) > 0 && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Move image down in layer order
                                    const currentIndex = logoTypes[
                                      logoType.id
                                    ].images.findIndex(
                                      (img) => img.id === image.id
                                    );
                                    const newImages = [
                                      ...logoTypes[logoType.id].images,
                                    ];
                                    [
                                      newImages[currentIndex],
                                      newImages[currentIndex - 1],
                                    ] = [
                                      newImages[currentIndex - 1],
                                      newImages[currentIndex],
                                    ];
                                    updateLogoTypeImages(
                                      logoType.id,
                                      newImages
                                    );
                                    setLogoTextureFromState(logoType.id);
                                  }}
                                  className="p-1 rounded hover:bg-gray-100 transition-colors"
                                  title="Move down"
                                >
                                  <ArrowUpIcon className="h-4 w-4 text-gray-500" />
                                </button>
                              )}
                            </>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleImageDelete(logoType.id, image.id);
                            }}
                            className="p-1 rounded hover:bg-gray-100 transition-colors"
                          >
                            <TrashIcon className="h-4 w-4 text-gray-500" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeftNavigation; 