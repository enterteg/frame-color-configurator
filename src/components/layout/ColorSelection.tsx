'use client';

import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ralColorGroups, RALColor, getColorById } from '../../data/ralColors';
import { useBikeStore } from '../../store/useBikeStore';
import { getContrastTextColor, getGroupMainColor } from '../../utils/colorUtils';

export default function ColorSelection() {
  const {
    isColorSelectionOpen,
    selectedColorGroup,
    colorSelectionType,
    frameColor,
    forkColor,
    selectedLogoImageId,
    selectedLogoType,
    closeColorSelection,
    setSelectedColorGroup,
    setFrameColor,
    setForkColor,
    updateLogoImage
  } = useBikeStore();

  // Auto-select appropriate color group based on current color
  React.useEffect(() => {
    if (isColorSelectionOpen && !selectedColorGroup) {
      let currentColor: RALColor | null = null;
      
      if (colorSelectionType === 'frame') {
        currentColor = frameColor;
      } else if (colorSelectionType === 'fork') {
        currentColor = forkColor;
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
        // Default to first group for logo colors
        setSelectedColorGroup(ralColorGroups[0]?.name || null);
      }
    }
  }, [isColorSelectionOpen, colorSelectionType, frameColor, forkColor, selectedColorGroup, setSelectedColorGroup]);

  if (!isColorSelectionOpen) {
    return null;
  }

  const handleColorSelect = (color: RALColor) => {
    if (colorSelectionType === 'frame') {
      setFrameColor(color);
    } else if (colorSelectionType === 'fork') {
      setForkColor(color);
    } else if (colorSelectionType === 'logo' && selectedLogoImageId && selectedLogoType) {
      updateLogoImage(selectedLogoType, selectedLogoImageId, { color });
      // Don't close for logo colors - keep open for multiple selections
    }
  };

  const getHeaderText = () => {
    switch (colorSelectionType) {
      case 'frame': return 'Choose frame color';
      case 'fork': return 'Choose fork color';
      case 'logo': return 'Choose logo color';
      default: return 'Choose color';
    }
  };

  const selectedGroup = ralColorGroups.find(group => group.name === selectedColorGroup);

  return (
    <div className="fixed left-[300px] top-0 bottom-0 h-screen bg-white shadow-lg border-l border-gray-200 z-30 flex">
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
                className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 ${
                  selectedColorGroup === group.name
                    ? "bg-blue-100 border-2 border-blue-500 shadow-md"
                    : "hover:bg-gray-100 border-2 border-transparent"
                }`}
                title={group.name}
              >
                <div
                  className={`w-14 h-14 rounded-full border shadow-sm mb-1 ${
                    selectedColorGroup === group.name
                      ? "border-blue-400 shadow-md"
                      : "border-gray-300"
                  }`}
                  style={{ backgroundColor: getGroupMainColor(group.name) }}
                />
                <div
                  className={`text-[12px] text-center leading-tight max-w-full ${
                    selectedColorGroup === group.name
                      ? "text-blue-700 font-medium"
                      : "text-gray-600"
                  }`}
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
        <div className="flex-1 bg-white">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
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
              className="p-1 rounded hover:bg-gray-100 transition-colors"
            >
              <XMarkIcon className="h-4 w-4 text-gray-600" />
            </button>
          </div>
     
          <div className="flex-1 overflow-y-auto">
            <div className="p-2">
              <div className="grid grid-cols-4 gap-1">
                {selectedGroup.colorIds.map((colorId) => {
                  const color = getColorById(colorId);
                  if (!color) return null;
                  
                  return (
                    <div key={color.code}>
                      <button
                        onClick={() => handleColorSelect(color)}
                        className="w-full group hover:bg-gray-50 transition-colors p-1 rounded"
                        title={`${color.code} - ${color.name}`}
                      >
                        <div
                          className="w-16 h-16 rounded-full shadow-sm group-hover:shadow-md transition-shadow flex flex-col items-center justify-center"
                          style={{ backgroundColor: color.hex }}
                        >
                          <div className="flex flex-col items-center justify-center opacity-60">
                            <span
                              className="text-[9px] font-bold leading-tight"
                              style={{ color: getContrastTextColor(color.hex) }}
                            >
                              {color.code.replace("RAL ", "")}
                            </span>
                            <span
                              className="text-[7px] font-bold leading-tight text-center px-1"
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