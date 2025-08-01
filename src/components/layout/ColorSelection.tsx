'use client';

import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ralColorGroups, RALColor, getColorById } from '../../data/ralColors';
import { useBikeStore } from '../../store/useBikeStore';
import { getContrastTextColor, getGroupMainColor } from '../../utils/colorUtils';
import { LEFT_NAVIGATION_WIDTH } from '../../utils/constants';

export default function ColorPickerPanel() {
  const {
    isColorSelectionOpen,
    selectedColorGroup,
    colorSelectionType,
    frameColor,
    forkColor,
    selectedLogoImageId,
    selectedLogoType,
    logoTypes,
    showBottomPanel,
    bottomPanelHeight,
    gradientColorStopIndex,
    frameTexture,
    closeColorSelection,
    setSelectedColorGroup,
    setFrameColor,
    setForkColor,
    updateTextureImage,
    updateGradientColorStop,
    selectionPanelType,
  } = useBikeStore();

  // Auto-select appropriate color group based on current color
  React.useEffect(() => {
    if (isColorSelectionOpen && !selectedColorGroup) {
      let currentColor: RALColor | null = null;
      
      if (colorSelectionType === 'frame') {
        currentColor = frameColor;
      } else if (colorSelectionType === 'fork') {
        currentColor = forkColor;
      } else if (colorSelectionType === 'gradient' && gradientColorStopIndex !== null && frameTexture.gradient) {
        // For gradient colors, the current color is already a RAL color
        currentColor = frameTexture.gradient.colorStops[gradientColorStopIndex]?.color || null;
      }
      
      if (currentColor) {
        // Find which group contains the current color
        const group = ralColorGroups.find(group => 
          group.colorIds.some(colorId => {
            const color = getColorById(colorId);
            return color && color.code === currentColor!.code;
          })
        );
        if (group) {
          setSelectedColorGroup(group.name);
        } else {
          // Default to first group if current color not found
          setSelectedColorGroup(ralColorGroups[0]?.name || null);
        }
      } else {
        // Default to first group for logo colors and gradients
        setSelectedColorGroup(ralColorGroups[0]?.name || null);
      }
    }
  }, [isColorSelectionOpen, colorSelectionType, frameColor, forkColor, selectedColorGroup, setSelectedColorGroup, gradientColorStopIndex, frameTexture.gradient]);

  if (!isColorSelectionOpen && selectionPanelType !== 'image') {
    return null;
  }

  const handleColorSelect = (color: RALColor) => {
    if (colorSelectionType === 'frame') {
      setFrameColor(color);
      // Don't close for frame colors - keep open for easy color switching
    } else if (colorSelectionType === 'fork') {
      setForkColor(color);
      // Don't close for fork colors - keep open for easy color switching
    } else if (colorSelectionType === 'logo' && selectedLogoImageId) {
      updateTextureImage(selectedLogoImageId, { color });
      // Don't close for logo colors - keep open for multiple selections
    } else if (colorSelectionType === 'gradient' && gradientColorStopIndex !== null) {
      updateGradientColorStop(gradientColorStopIndex, color);
      // Don't close for gradient colors - keep open for multiple color stop selections
    }
  };

  const getHeaderText = () => {
    switch (colorSelectionType) {
      case 'frame': return 'Choose frame color';
      case 'fork': return 'Choose fork color';
      case 'logo': return 'Choose logo color';
      case 'gradient': return 'Choose gradient color';
      default: return 'Choose color';
    }
  };

  const selectedGroup = ralColorGroups.find(group => group.name === selectedColorGroup);

  return (
    <div
      className="fixed top-0 bg-white shadow-lg border-l border-gray-200 z-30 flex"
      style={{
        left: `${LEFT_NAVIGATION_WIDTH}px`,
        width: "auto",
        minWidth: 300,
        maxWidth: "100vw",
        bottom: showBottomPanel ? `${bottomPanelHeight}px` : "0px",
        height: showBottomPanel
          ? `calc(100vh - ${bottomPanelHeight}px)`
          : "100vh",
      }}
    >
      {/* Color Groups */}
      <div className="bg-gray-50 border-r border-gray-200 overflow-y-auto">
        <div className="p-2">
          <div className="text-xs font-medium text-gray-600 mb-3 uppercase tracking-wide text-center">
            Groups
          </div>
          <div className="space-y-1">
            {ralColorGroups.map((group) => (
              <button
                key={group.name}
                onClick={() => setSelectedColorGroup(group.name)}
                className={`flex cursor-pointer flex-col items-center p-2 rounded-lg transition-all duration-200 ${
                  selectedColorGroup === group.name
                    ? "bg-brand-brown-100 border-2 border-brand-brown-500 shadow-md"
                    : "hover:bg-gray-100 border-2 border-transparent"
                }`}
                title={group.name}
              >
                <div
                  className={`w-14 h-14 rounded-full border shadow-sm mb-1 ${
                    selectedColorGroup === group.name
                      ? "border-brand-brown-100 shadow-md"
                      : "border-gray-300"
                  }`}
                  style={{ backgroundColor: getGroupMainColor(group.name) }}
                />
                <div
                  className={`text-[12px] text-center text-black leading-tight max-w-full`}
                >
                  {group.name.split(" ")[0]}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Individual Colors */}
      {selectedGroup && (
        <div className="flex-1 bg-white flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
            <div>
              <h3 className="text-sm font-medium text-gray-800">
                {getHeaderText()}
              </h3>
              <div className="text-xs text-gray-500 mt-1">
                {selectedGroup.name} Colors
              </div>
            </div>
            <button
              onClick={closeColorSelection}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <XMarkIcon className="h-4 w-4 text-gray-600" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="p-2">
              <div className="grid grid-cols-4 gap-0.5">
                {selectedGroup.colorIds.map((colorId) => {
                  const color = getColorById(colorId);
                  if (!color) return null;

                  // Debug: Check what we're comparing
                  const isFrameSelected = colorSelectionType === "frame" && color.code === frameColor.code;
                  const isForkSelected = colorSelectionType === "fork" && color.code === forkColor.code;
                  const isGradientSelected = colorSelectionType === "gradient" &&
                    gradientColorStopIndex !== null &&
                    frameTexture.gradient &&
                    frameTexture.gradient.colorStops[gradientColorStopIndex]?.color?.code === color.code;
                  
                  const isLogoSelected = colorSelectionType === "logo" &&
                    selectedLogoImageId &&
                    selectedLogoType &&
                    logoTypes[selectedLogoType]?.images.find(
                      (img: { id: string; color?: RALColor }) =>
                        img.id === selectedLogoImageId
                    )?.color?.code === color.code;

                  const isSelected = isFrameSelected || isForkSelected || isLogoSelected || isGradientSelected;

                  // Debug logging for the first few colors
                  if (colorId === selectedGroup.colorIds[0] || colorId === selectedGroup.colorIds[1]) {
                    console.log('Color debug:', {
                      colorCode: color.code,
                      colorHex: color.hex,
                      colorSelectionType,
                      frameColorCode: frameColor.code,
                      gradientColorStopIndex,
                      gradientColor: frameTexture.gradient?.colorStops[gradientColorStopIndex || 0]?.color,
                      isFrameSelected,
                      isGradientSelected,
                      isSelected
                    });
                  }

                  return (
                    <div key={color.code}>
                      <button
                        onClick={() => handleColorSelect(color)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-brand-brown-100 ring-2 ring-brand-brown-500"
                            : "hover:bg-gray-100"
                        }`}
                        title={`${color.code} - ${color.name}`}
                      >
                        <div
                          className={`w-18 h-18 rounded-full shadow-sm group-hover:shadow-md transition-shadow flex flex-col items-center justify-center ${
                            (colorSelectionType === "frame" &&
                              color.code === frameColor.code) ||
                            (colorSelectionType === "fork" &&
                              color.code === forkColor.code) ||
                            (colorSelectionType === "logo" &&
                              selectedLogoImageId &&
                              selectedLogoType &&
                              logoTypes[selectedLogoType]?.images.find(
                                (img: { id: string; color?: RALColor }) =>
                                  img.id === selectedLogoImageId
                              )?.color?.code === color.code) ||
                                                      (colorSelectionType === "gradient" &&
                            gradientColorStopIndex !== null &&
                            frameTexture.gradient &&
                            frameTexture.gradient.colorStops[gradientColorStopIndex]?.color?.code === color.code)
                              ? "ring-2 ring-brand-brown-500"
                              : ""
                          }`}
                          style={{ backgroundColor: color.hex }}
                        >
                          <div className="flex flex-col items-center justify-center opacity-60">
                            <span
                              className="text-[12px] font-bold leading-tight"
                              style={{ color: getContrastTextColor(color.hex) }}
                            >
                              {color.code.replace("RAL ", "")}
                            </span>
                            <span
                              className="text-[10px] leading-tight text-center px-4"
                              style={{ color: getContrastTextColor(color.hex) }}
                            >
                              {color.name}
                            </span>
                          </div>
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 