'use client';

import { useState, useEffect, useRef } from 'react';
import { ralColorGroups, RALColor } from '../data/ralColors';
import { TrashIcon, ArrowPathIcon, ArrowsUpDownIcon, ChevronLeftIcon, ChevronRightIcon, FunnelIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { 
  getHarmoniousColorsForPalette, 
  filterByTemperature, 
  filterByBrightness, 
  filterBySaturation,
  HarmonyType 
} from '../utils/colorTheory';

// Helper function to get the main color for each group
const getGroupMainColor = (groupName: string): string => {
  const group = ralColorGroups.find(g => g.name === groupName);
  if (!group) return '#FFFFFF';
  
  // Return the first color's hex value for each group
  return group.colors[0].hex;
};

// Helper to determine if text should be black or white based on background color
function getContrastTextColor(hex: string) {
  // Remove # if present
  hex = hex.replace('#', '');
  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? 'black' : 'white';
}

const MIN_FLEX = 0.1;

export default function Home() {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedColors, setSelectedColors] = useState<RALColor[]>([]);
  const [colorWidths, setColorWidths] = useState<number[]>([]);
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);
  const [previewHeight, setPreviewHeight] = useState<number>(400);
  const dragIndex = useRef<number | null>(null);
  const dragStartX = useRef<number>(0);
  const dragStartWidths = useRef<number[]>([]);
  const heightDragStartY = useRef<number>(0);
  const heightDragStart = useRef<number>(400);
  const [previewTextOpacity, setPreviewTextOpacity] = useState<number>(0.3);

  // Color theory filtering states
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [harmonyFilter, setHarmonyFilter] = useState<HarmonyType | null>(null);
  const [temperatureFilter, setTemperatureFilter] = useState<'warm' | 'cool' | 'neutral' | null>(null);
  const [brightnessFilter, setBrightnessFilter] = useState<'light' | 'medium' | 'dark' | null>(null);
  const [saturationFilter, setSaturationFilter] = useState<'high' | 'medium' | 'low' | null>(null);
  const [harmonyTolerance, setHarmonyTolerance] = useState<number>(30);

  // Get all colors for filtering
  const allColors = ralColorGroups.flatMap(group => group.colors);

  // Get filtered colors based on selected filters
  const getFilteredColors = (groupColors: RALColor[]): RALColor[] => {
    let filtered = [...groupColors];

    // Apply harmony filter if selected colors exist and harmony filter is active
    if (harmonyFilter && selectedColors.length > 0) {
      const harmoniousColors = getHarmoniousColorsForPalette(
        selectedColors, 
        allColors, 
        harmonyFilter, 
        harmonyTolerance
      );
      const harmoniousCodes = new Set(harmoniousColors.map(c => c.code));
      filtered = filtered.filter(color => harmoniousCodes.has(color.code));
    }

    // Apply temperature filter
    if (temperatureFilter) {
      filtered = filterByTemperature(filtered, temperatureFilter);
    }

    // Apply brightness filter
    if (brightnessFilter) {
      filtered = filterByBrightness(filtered, brightnessFilter);
    }

    // Apply saturation filter
    if (saturationFilter) {
      filtered = filterBySaturation(filtered, saturationFilter);
    }

    return filtered;
  };

  // Clear all filters
  const clearFilters = () => {
    setHarmonyFilter(null);
    setTemperatureFilter(null);
    setBrightnessFilter(null);
    setSaturationFilter(null);
  };

  // Check if any filters are active
  const hasActiveFilters = harmonyFilter || temperatureFilter || brightnessFilter || saturationFilter;

  // Sync colorWidths with selectedColors
  useEffect(() => {
    if (selectedColors.length === 0) {
      setColorWidths([]);
    } else if (selectedColors.length !== colorWidths.length) {
      // Distribute widths equally
      setColorWidths(Array(selectedColors.length).fill(1));
    }
    // eslint-disable-next-line
  }, [selectedColors.length]);

  const handleGroupSelect = (groupName: string) => {
    setSelectedGroup(groupName);
  };

  const handleColorSelect = (color: RALColor) => {
    if (replaceIndex !== null) {
      // Replace color at replaceIndex
      setSelectedColors(selectedColors => {
        const newColors = [...selectedColors];
        newColors[replaceIndex] = color;
        return newColors;
      });
      setReplaceIndex(null);
    } else if (!selectedColors.some((c) => c.code === color.code)) {
      setSelectedColors([...selectedColors, color]);
    }
  };

  const handleColorRemove = (colorToRemove: RALColor) => {
    const idx = selectedColors.findIndex(c => c.code === colorToRemove.code);
    if (idx !== -1) {
      setSelectedColors(selectedColors.filter(color => color.code !== colorToRemove.code));
      setColorWidths(colorWidths.filter((_, i) => i !== idx));
    }
  };

  // Drag logic
  const onDragStart = (index: number, e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault(); // Prevent text selection
    dragIndex.current = index;
    dragStartX.current = e.clientX;
    dragStartWidths.current = [...colorWidths];
    window.addEventListener('mousemove', onDragMove);
    window.addEventListener('mouseup', onDragEnd);
  };

  const onDragMove = (e: MouseEvent) => {
    if (dragIndex.current === null) return;
    const idx = dragIndex.current;
    const deltaX = e.clientX - dragStartX.current;
    const container = document.getElementById('palette-preview');
    if (!container) return;
    const containerWidth = container.offsetWidth;
    const totalFlex = dragStartWidths.current.reduce((a, b) => a + b, 0);
    const deltaFlex = (deltaX / containerWidth) * totalFlex;
    let left = dragStartWidths.current[idx] + deltaFlex;
    let right = dragStartWidths.current[idx + 1] - deltaFlex;
    // Clamp to min flex
    if (left < MIN_FLEX) {
      right -= (MIN_FLEX - left);
      left = MIN_FLEX;
    }
    if (right < MIN_FLEX) {
      left -= (MIN_FLEX - right);
      right = MIN_FLEX;
    }
    const newWidths = [...dragStartWidths.current];
    newWidths[idx] = left;
    newWidths[idx + 1] = right;
    console.log('Dragging:', newWidths); // Debug
    setColorWidths([...newWidths]);
  };

  const onDragEnd = () => {
    dragIndex.current = null;
    window.removeEventListener('mousemove', onDragMove);
    window.removeEventListener('mouseup', onDragEnd);
  };

  // Height drag logic
  const onHeightDragStart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    heightDragStartY.current = e.clientY;
    heightDragStart.current = previewHeight;
    window.addEventListener('mousemove', onHeightDragMove);
    window.addEventListener('mouseup', onHeightDragEnd);
  };
  const onHeightDragMove = (e: MouseEvent) => {
    const deltaY = e.clientY - heightDragStartY.current;
    let newHeight = heightDragStart.current + deltaY;
    newHeight = Math.max(200, Math.min(700, newHeight));
    setPreviewHeight(newHeight);
  };
  const onHeightDragEnd = () => {
    window.removeEventListener('mousemove', onHeightDragMove);
    window.removeEventListener('mouseup', onHeightDragEnd);
  };

  // Move color left
  const handleMoveLeft = (index: number) => {
    if (index > 0) {
      setSelectedColors((prev) => {
        const newColors = [...prev];
        const temp = newColors[index - 1];
        newColors[index - 1] = newColors[index];
        newColors[index] = temp;
        return newColors;
      });
    }
  };
  // Move color right
  const handleMoveRight = (index: number) => {
    if (index < selectedColors.length - 1) {
      setSelectedColors((prev) => {
        const newColors = [...prev];
        const temp = newColors[index + 1];
        newColors[index + 1] = newColors[index];
        newColors[index] = temp;
        return newColors;
      });
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-6xl font-bold mt-8 mb-16 text-center border-b-2 border-orange-200 pb-4 font-sans" style={{ fontFamily: 'Inter, sans-serif', color: 'black' }}>
          RAL Color Palette Composer
        </h1>
        {/* Sticky Preview: centered under header */}
        {selectedColors.length > 0 && (
          <div className="mb-8 mt-16 relative w-full overflow-visible">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">Color Palette Preview</h2>
            <div id="palette-preview" className="flex w-full items-stretch sticky top-0 z-40 bg-transparent py-0" style={{ height: previewHeight }}>
              {selectedColors.map((color, i) => {
                const textColor = getContrastTextColor(color.hex);
                const isReplace = replaceIndex === i;
                return (
                  <React.Fragment key={color.code}>
                    <div
                      style={{ flex: colorWidths[i], backgroundColor: color.hex }}
                      className={`flex p-10 flex-col items-center justify-end relative min-w-[50px] ${isReplace ? 'border-2 border-blue-200' : ''}`}
                    >
                      <div className="flex items-center justify-center mb-4 gap-2">
                        {i !== 0 && (
                          <button
                            onClick={() => handleMoveLeft(i)}
                            style={{ opacity: previewTextOpacity }}
                            className={textColor === 'white' ? 'text-white hover:text-blue-200' : 'text-black hover:text-blue-600'}
                            title="Move Left"
                          >
                            <ChevronLeftIcon className="w-6 h-6" />
                          </button>
                        )}
                        {i !== selectedColors.length - 1 && (
                          <button
                            onClick={() => handleMoveRight(i)}
                            style={{ opacity: previewTextOpacity }}
                            className={textColor === 'white' ? 'text-white hover:text-blue-200' : 'text-black hover:text-blue-600'}
                            title="Move Right"
                          >
                            <ChevronRightIcon className="w-6 h-6" />
                          </button>
                        )}
                        <button style={{ opacity: previewTextOpacity }} className={textColor === 'white' ? 'text-white hover:text-red-200' : 'text-black hover:text-red-600'} title="Remove" onClick={() => handleColorRemove(color)}>
                          <TrashIcon className="w-6 h-6" />
                        </button>
                        <button
                          style={{ opacity: previewTextOpacity }}
                          className={isReplace ? 'animate-spin text-blue-500' : textColor === 'white' ? 'text-white hover:text-blue-200' : 'text-black hover:text-blue-600'}
                          title="Replace"
                          onClick={() => setReplaceIndex(isReplace ? null : i)}
                        >
                          <ArrowPathIcon className="w-6 h-6" />
                        </button>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-semibold" style={{ color: textColor, opacity: previewTextOpacity }}>{color.code}</div>
                        <div className="text-xs mt-1" style={{ color: textColor, opacity: previewTextOpacity * 0.7 }}>{color.hex}</div>
                        <div className="text-xs mt-1" style={{ color: textColor, opacity: previewTextOpacity * 0.7 }}>{color.name}</div>
                      </div>
                      {isReplace && (
                        <div className="absolute inset-0 bg-blue-400/10 pointer-events-none rounded" />
                      )}
                    </div>
                    {/* Drag handle (except after last color) */}
                    {i < selectedColors.length - 1 && (
                      <div className="flex flex-col items-center justify-center" style={{ width: 2 }}>
                        <div className="flex-1 bg-blue-400/40" style={{ width: 2 }} />
                        <button
                          onMouseDown={e => onDragStart(i, e)}
                          className="flex items-center justify-center rounded-full bg-white border border-blue-500 shadow w-5 h-5 -my-2 cursor-col-resize z-20"
                          style={{ position: 'relative', top: '-50%', opacity: previewTextOpacity }}
                          title="Drag to resize"
                        >
                          <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="3" y="7" width="10" height="2" rx="1" fill="gray" />
                            <rect x="3" y="11" width="10" height="2" rx="1" fill="gray" />
                            <rect x="3" y="3" width="10" height="2" rx="1" fill="gray" />
                          </svg>
                        </button>
                        <div className="flex-1 bg-blue-400/40" style={{ width: 2 }} />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
            {/* Bottom right corner resize icon */}
            <button
              className="absolute bottom-0 right-0 bg-white border border-blue-500 rounded-full shadow w-6 h-6 flex items-center justify-center cursor-row-resize z-30 translate-x-1/2 translate-y-7/10"
              onMouseDown={onHeightDragStart}
              title="Drag to resize height"
              style={{ userSelect: 'none', opacity: previewTextOpacity }}
            >
              <ArrowsUpDownIcon className="w-4.5 h-4.5 text-blue-600" />
            </button>
            {/* Opacity slider */}
            <div className="flex items-center gap-2 mt-4">
              <label htmlFor="opacity-slider" className="text-gray-700 text-sm">Preview Text Opacity</label>
              <input
                id="opacity-slider"
                type="range"
                min={0.1}
                max={1}
                step={0.01}
                value={previewTextOpacity}
                onChange={e => setPreviewTextOpacity(Number(e.target.value))}
                className="w-40 accent-blue-500"
              />
              <span className="text-gray-500 text-xs">{Math.round(previewTextOpacity * 100)}%</span>
            </div>
          </div>
        )}
        <div className="flex gap-8">
          {/* Color Groups */}
          <div className="flex flex-col">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Color Groups</h2>
            <div className="grid grid-cols-3 gap-6 w-max">
              {ralColorGroups.map((group) => (
                <button
                  key={group.name}
                  onClick={() => handleGroupSelect(group.name)}
                  className={`relative flex flex-col items-center group transition-all ${
                    selectedGroup === group.name ? 'scale-110' : 'hover:scale-105'
                  }`}
                >
                  <div
                    className={`w-16 h-16 rounded-full shadow-lg transition-all ${
                      selectedGroup === group.name ? 'ring-0 border-2 border-blue-200' : 'group-hover:ring-2 group-hover:ring-blue-200'
                    }`}
                    style={{ backgroundColor: getGroupMainColor(group.name) }}
                  />
                  <span className={`mt-2 text-sm font-medium ${
                    selectedGroup === group.name ? 'text-blue-600' : 'text-gray-700'
                  }`}>
                    {group.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                {selectedGroup ? `${selectedGroup} Colors` : 'Select a Color Group'}
              </h2>
              
              {/* Filter Toggle Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                  hasActiveFilters 
                    ? 'bg-blue-100 border-blue-300 text-blue-700' 
                    : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FunnelIcon className="w-5 h-5" />
                <span>Color Theory Filters</span>
                {hasActiveFilters && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    Active
                  </span>
                )}
              </button>
            </div>

            {/* Color Theory Filters Panel */}
            {showFilters && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-800">Color Theory Filters</h3>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Harmony Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color Harmony {selectedColors.length === 0 && <span className="text-gray-400">(select colors first)</span>}
                    </label>
                    <select
                      value={harmonyFilter || ''}
                      onChange={(e) => setHarmonyFilter(e.target.value as HarmonyType || null)}
                      disabled={selectedColors.length === 0}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm disabled:bg-gray-100 disabled:text-gray-400"
                    >
                      <option value="">No harmony filter</option>
                      <option value="complementary">Complementary</option>
                      <option value="analogous">Analogous</option>
                      <option value="triadic">Triadic</option>
                      <option value="tetradic">Tetradic</option>
                      <option value="splitComplementary">Split Complementary</option>
                      <option value="monochromatic">Monochromatic</option>
                      <option value="similar">Similar</option>
                    </select>
                    {harmonyFilter && (
                      <div className="mt-2">
                        <label className="block text-xs text-gray-600 mb-1">Tolerance: {harmonyTolerance}°</label>
                        <input
                          type="range"
                          min={10}
                          max={60}
                          value={harmonyTolerance}
                          onChange={(e) => setHarmonyTolerance(Number(e.target.value))}
                          className="w-full accent-blue-500"
                        />
                      </div>
                    )}
                  </div>

                  {/* Temperature Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Temperature</label>
                    <select
                      value={temperatureFilter || ''}
                      onChange={(e) => setTemperatureFilter(e.target.value as 'warm' | 'cool' | 'neutral' || null)}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="">All temperatures</option>
                      <option value="warm">Warm colors</option>
                      <option value="cool">Cool colors</option>
                      <option value="neutral">Neutral colors</option>
                    </select>
                  </div>

                  {/* Brightness Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Brightness</label>
                    <select
                      value={brightnessFilter || ''}
                      onChange={(e) => setBrightnessFilter(e.target.value as 'light' | 'medium' | 'dark' || null)}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="">All brightness levels</option>
                      <option value="light">Light colors</option>
                      <option value="medium">Medium colors</option>
                      <option value="dark">Dark colors</option>
                    </select>
                  </div>

                  {/* Saturation Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Saturation</label>
                    <select
                      value={saturationFilter || ''}
                      onChange={(e) => setSaturationFilter(e.target.value as 'high' | 'medium' | 'low' || null)}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="">All saturation levels</option>
                      <option value="high">High saturation</option>
                      <option value="medium">Medium saturation</option>
                      <option value="low">Low saturation</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {selectedGroup && (
              <div className="grid grid-cols-4 gap-3">
                {(() => {
                  const groupColors = ralColorGroups.find((group) => group.name === selectedGroup)?.colors || [];
                  const filteredColors = getFilteredColors(groupColors);
                  
                  if (filteredColors.length === 0 && hasActiveFilters) {
                    return (
                      <div className="col-span-4 text-center py-8 text-gray-500">
                        No colors match the selected filters. Try adjusting your filter settings.
                      </div>
                    );
                  }
                  
                  return filteredColors.map((color) => {
                    const textColor = getContrastTextColor(color.hex);
                    return (
                      <button
                        key={color.code}
                        onClick={() => handleColorSelect(color)}
                        className={`p-3 rounded-lg shadow-md transition-all ${
                          selectedColors.some((c) => c.code === color.code)
                            ? 'ring-0 border-2 border-blue-200'
                            : 'hover:ring-2 hover:ring-blue-200'
                        }`}
                        style={{ backgroundColor: color.hex }}
                      >
                        <div className="text-center w-full">
                          <div className="text-lg font-semibold" style={{ color: textColor }}>{color.code}</div>
                          <div className="text-xs mt-1" style={{ color: textColor, opacity: 0.7 }}>{color.hex}</div>
                          <div className="text-sm" style={{ color: textColor, opacity: 0.85 }}>{color.name}</div>
                        </div>
                      </button>
                    );
                  });
                })()}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
