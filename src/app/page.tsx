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
  const [repeatX, setRepeatX] = React.useState(1);
  const [repeatY, setRepeatY] = React.useState(1);
  const [offsetX, setOffsetX] = React.useState(0);
  const [offsetY, setOffsetY] = React.useState(0);
  const [logoImageUrl, setLogoImageUrl] = React.useState('/textures/TEST.png');

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

        {/* 3D Bike Viewer */}
        {palette.selectedColors.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-semibold mb-6 text-gray-800 text-center">3D Bike Preview</h2>
            <div className="relative h-[600px] w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg border border-gray-200">
              <BikeViewer3D 
                selectedColors={palette.selectedColors}
                combinedModelPath="/models/frame_tube.glb"
                textureUrl="/textures/loca.png"
                className="w-full h-full rounded-xl"
                canvasTexture={canvasTexture}
                repeatX={repeatX}
                repeatY={repeatY}
                offsetX={offsetX}
                offsetY={offsetY}
              />
            </div>
            <p className="text-sm text-gray-600 text-center mt-4">
              Place your bike.glb file in the public/models/ directory. 
              First color = Frame, Second color = Fork
            </p>
          </div>
        )}

        {/* Tabs for Color/Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24, gap: 16 }}>
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

        {/* Conditional rendering for WHOLE COLOR PALETTE or LogoCanvas */}
        <div style={{ display: activeTab === 'color' ? 'block' : 'none' }}>
          <div className="flex gap-8">
            {/* Color Groups */}
            <ColorGroupSelector
              selectedGroup={palette.selectedGroup}
              onGroupSelect={palette.handleGroupSelect}
            />

            {/* Color Selection */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">
                  {palette.selectedGroup ? `${palette.selectedGroup} Colors` : 'Select a Color Group'}
                </h2>
                
                {/* Color Theory Filters */}
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
          </div>
        </div>
        <div style={{ display: activeTab === 'logo' ? 'block' : 'none' }}>
          <LogoCanvas
            imageUrl={logoImageUrl}
            onTextureChange={setCanvasTexture}
            repeatX={repeatX} setRepeatX={setRepeatX}
            repeatY={repeatY} setRepeatY={setRepeatY}
            offsetX={offsetX} setOffsetX={setOffsetX}
            offsetY={offsetY} setOffsetY={setOffsetY}
            onImageChange={setLogoImageUrl}
          />
        </div>
      </div>
    </main>
  );
}
