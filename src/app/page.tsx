'use client';

import React from 'react';
import { ralColorGroups } from '../data/ralColors';
import BikeViewer3D from '../components/BikeViewer3D';
import ColorPalettePreview from '../components/ColorPalettePreview';
import ColorTheoryFilters from '../components/ColorTheoryFilters';
import ColorGroupSelector from '../components/ColorGroupSelector';
import ColorSelection from '../components/ColorSelection';
import { usePaletteDrag, useHeightDrag } from '../hooks/usePaletteDrag';
import { useColorPalette } from '../hooks/useColorPalette';
import { useColorFilters } from '../hooks/useColorFilters';
import LogoCanvas from '../components/LogoCanvas';
import * as THREE from 'three';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function Home() {
  // Custom hooks for state management
  const palette = useColorPalette();
  const filters = useColorFilters(palette.selectedColors);
  
  // Custom hooks for drag functionality
  const { onDragStart } = usePaletteDrag(palette.colorWidths, palette.setColorWidths);
  const { onHeightDragStart } = useHeightDrag(palette.previewHeight, palette.setPreviewHeight);

  // Get filtered colors for current group
  const groupColors = palette.selectedGroup 
    ? ralColorGroups.find((group) => group.name === palette.selectedGroup)?.colors || [] 
    : [];
  const filteredColors = filters.getFilteredColors(groupColors);

  // --- Tab and LogoCanvas state ---
  const [activeTab, setActiveTab] = React.useState<'color' | 'logo'>('color');
  const [canvasTexture, setCanvasTexture] = React.useState<THREE.Texture | null>(null);

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-6xl font-bold mt-8 mb-16 text-center border-b-2 border-orange-200 pb-4 font-sans" style={{ fontFamily: 'Inter, sans-serif', color: 'black' }}>
          RAL Color Palette Composer
        </h1>

        {/* Color Palette Preview */}
        <ColorPalettePreview
          selectedColors={palette.selectedColors}
          colorWidths={palette.colorWidths}
          replaceIndex={palette.replaceIndex}
          previewHeight={palette.previewHeight}
          previewTextOpacity={palette.previewTextOpacity}
          onColorRemove={palette.handleColorRemove}
          onMoveLeft={palette.handleMoveLeft}
          onMoveRight={palette.handleMoveRight}
          onReplaceToggle={palette.setReplaceIndex}
          onDragStart={onDragStart}
          onHeightDragStart={onHeightDragStart}
          onOpacityChange={palette.setPreviewTextOpacity}
        />

        {/* Main Content Layout: Left (Color/Logo) + Right (3D Preview) */}
        <div className="flex gap-8 mb-12">
          {/* Left Side: Color/Logo Selectors */}
          <div className="flex-1">
            {/* Tabs for Color/Logo */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24, gap: 16 }}>
              <button
                onClick={() => setActiveTab('color')}
                style={{ padding: '8px 24px', borderRadius: 8, border: 'none', background: activeTab === 'color' ? '#2563eb' : '#e5e7eb', color: activeTab === 'color' ? '#fff' : '#222', fontWeight: 600, cursor: 'pointer' }}
              >
                Color
              </button>
              <button
                onClick={() => setActiveTab('logo')}
                style={{ padding: '8px 24px', borderRadius: 8, border: 'none', background: activeTab === 'logo' ? '#2563eb' : '#e5e7eb', color: activeTab === 'logo' ? '#fff' : '#222', fontWeight: 600, cursor: 'pointer' }}
              >
                Logo
              </button>
            </div>

            {/* Color/Logo Content */}
            <div style={{ display: activeTab === 'color' ? 'block' : 'none' }}>
              <div className="flex gap-8">
                {/* Color Groups - only show when no group is selected */}
                {!palette.selectedGroup && (
                  <ColorGroupSelector
                    selectedGroup={palette.selectedGroup}
                    onGroupSelect={palette.handleGroupSelect}
                  />
                )}

                {/* Color Selection */}
                <div className="flex-1">
                  {!palette.selectedGroup && (
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-semibold text-gray-800">
                        Select a Color Group
                      </h2>
                    </div>
                  )}
                  
                  {palette.selectedGroup && (
                    <div className="flex items-center gap-3 mb-4">
                      <button
                        onClick={() => palette.handleGroupSelect(null)}
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                        title="Back to color groups"
                      >
                        <ArrowLeftIcon className="h-4 w-4" />
                      </button>
                      <h2 className="text-2xl font-semibold text-gray-800">
                        {palette.selectedGroup} Colors
                      </h2>
                    </div>
                  )}

                  {/* Color Selection Grid with Color Theory Filters */}
                  {palette.selectedGroup && (
                    <div>
                      {/* Color Theory Filters */}
                      <div className="mb-4 flex justify-end">
                        <ColorTheoryFilters
                          showFilters={filters.showFilters}
                          harmonyFilter={filters.harmonyFilter}
                          temperatureFilter={filters.temperatureFilter}
                          brightnessFilter={filters.brightnessFilter}
                          saturationFilter={filters.saturationFilter}
                          harmonyTolerance={filters.harmonyTolerance}
                          hasActiveFilters={filters.hasActiveFilters}
                          selectedColorsCount={palette.selectedColors.length}
                          onToggleFilters={() => filters.setShowFilters(!filters.showFilters)}
                          onHarmonyFilterChange={filters.setHarmonyFilter}
                          onTemperatureFilterChange={filters.setTemperatureFilter}
                          onBrightnessFilterChange={filters.setBrightnessFilter}
                          onSaturationFilterChange={filters.setSaturationFilter}
                          onHarmonyToleranceChange={filters.setHarmonyTolerance}
                          onClearFilters={filters.clearFilters}
                        />
                      </div>
                      
                      {/* Color Selection Grid */}
                      <ColorSelection
                        selectedGroup={palette.selectedGroup}
                        selectedColors={palette.selectedColors}
                        filteredColors={filteredColors}
                        hasActiveFilters={filters.hasActiveFilters}
                        onColorSelect={palette.handleColorSelect}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div style={{ display: activeTab === 'logo' ? 'block' : 'none' }}>
              <LogoCanvas
                imageUrl="/textures/loca_half.png"
                onTextureChange={setCanvasTexture}
              />
            </div>
          </div>

          {/* Right Side: 3D Bike Viewer */}
          {palette.selectedColors.length > 0 && (
            <div className="w-[768px]">
              <h2 className="text-3xl font-semibold mb-6 text-gray-800 text-center">3D Bike Preview</h2>
              <div className="relative h-[600px] w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg border border-gray-200">
                <BikeViewer3D 
                  selectedColors={palette.selectedColors}
                  combinedModelPath="/models/frame_tube.glb"
                  textureUrl="/textures/loca.png"
                  className="w-full h-full rounded-xl"
                  canvasTexture={canvasTexture}
                  offsetX={0}
                  offsetY={0}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
