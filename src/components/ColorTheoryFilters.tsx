'use client';

import React from 'react';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { HarmonyType } from '../utils/colorTheory';

interface ColorTheoryFiltersProps {
  showFilters: boolean;
  harmonyFilter: HarmonyType | null;
  temperatureFilter: 'warm' | 'cool' | 'neutral' | null;
  brightnessFilter: 'light' | 'medium' | 'dark' | null;
  saturationFilter: 'high' | 'medium' | 'low' | null;
  harmonyTolerance: number;
  hasActiveFilters: boolean;
  selectedColorsCount: number;
  onToggleFilters: () => void;
  onHarmonyFilterChange: (filter: HarmonyType | null) => void;
  onTemperatureFilterChange: (filter: 'warm' | 'cool' | 'neutral' | null) => void;
  onBrightnessFilterChange: (filter: 'light' | 'medium' | 'dark' | null) => void;
  onSaturationFilterChange: (filter: 'high' | 'medium' | 'low' | null) => void;
  onHarmonyToleranceChange: (tolerance: number) => void;
  onClearFilters: () => void;
}

export default function ColorTheoryFilters({
  showFilters,
  harmonyFilter,
  temperatureFilter,
  brightnessFilter,
  saturationFilter,
  harmonyTolerance,
  hasActiveFilters,
  selectedColorsCount,
  onToggleFilters,
  onHarmonyFilterChange,
  onTemperatureFilterChange,
  onBrightnessFilterChange,
  onSaturationFilterChange,
  onHarmonyToleranceChange,
  onClearFilters
}: ColorTheoryFiltersProps) {
  return (
    <>
      {/* Filter Toggle Button */}
      <button
        onClick={onToggleFilters}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
          hasActiveFilters 
            ? 'bg-red-100 border-red-300 text-red-700 hover:bg-red-200' 
            : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
        }`}
      >
        {hasActiveFilters ? (
          <XMarkIcon className="w-5 h-5" />
        ) : (
          <>
            <FunnelIcon className="w-5 h-5" />
            <span>Color Theory Filters</span>
          </>
        )}
      </button>

      {/* Color Theory Filters Panel */}
      {showFilters && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-800">Color Theory Filters</h3>
            {hasActiveFilters && (
              <button
                onClick={onClearFilters}
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
                Color Harmony {selectedColorsCount === 0 && <span className="text-gray-400">(select colors first)</span>}
              </label>
              <select
                value={harmonyFilter || ''}
                onChange={(e) => onHarmonyFilterChange(e.target.value as HarmonyType || null)}
                disabled={selectedColorsCount === 0}
                className="w-full p-2 border border-gray-300 rounded-md text-sm bg-white text-gray-900 disabled:bg-gray-100 disabled:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="" className="text-gray-900">No harmony filter</option>
                <option value="complementary" className="text-gray-900">Complementary</option>
                <option value="analogous" className="text-gray-900">Analogous</option>
                <option value="triadic" className="text-gray-900">Triadic</option>
                <option value="tetradic" className="text-gray-900">Tetradic</option>
                <option value="splitComplementary" className="text-gray-900">Split Complementary</option>
                <option value="monochromatic" className="text-gray-900">Monochromatic</option>
                <option value="similar" className="text-gray-900">Similar</option>
              </select>
              {harmonyFilter && (
                <div className="mt-2">
                  <label className="block text-xs text-gray-600 mb-1">Tolerance: {harmonyTolerance}°</label>
                  <input
                    type="range"
                    min={10}
                    max={60}
                    value={harmonyTolerance}
                    onChange={(e) => onHarmonyToleranceChange(Number(e.target.value))}
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
                onChange={(e) => onTemperatureFilterChange(e.target.value as 'warm' | 'cool' | 'neutral' || null)}
                className="w-full p-2 border border-gray-300 rounded-md text-sm bg-white text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="" className="text-gray-900">All temperatures</option>
                <option value="warm" className="text-gray-900">Warm colors</option>
                <option value="cool" className="text-gray-900">Cool colors</option>
                <option value="neutral" className="text-gray-900">Neutral colors</option>
              </select>
            </div>

            {/* Brightness Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Brightness</label>
              <select
                value={brightnessFilter || ''}
                onChange={(e) => onBrightnessFilterChange(e.target.value as 'light' | 'medium' | 'dark' || null)}
                className="w-full p-2 border border-gray-300 rounded-md text-sm bg-white text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="" className="text-gray-900">All brightness levels</option>
                <option value="light" className="text-gray-900">Light colors</option>
                <option value="medium" className="text-gray-900">Medium colors</option>
                <option value="dark" className="text-gray-900">Dark colors</option>
              </select>
            </div>

            {/* Saturation Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Saturation</label>
              <select
                value={saturationFilter || ''}
                onChange={(e) => onSaturationFilterChange(e.target.value as 'high' | 'medium' | 'low' || null)}
                className="w-full p-2 border border-gray-300 rounded-md text-sm bg-white text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="" className="text-gray-900">All saturation levels</option>
                <option value="high" className="text-gray-900">High saturation</option>
                <option value="medium" className="text-gray-900">Medium saturation</option>
                <option value="low" className="text-gray-900">Low saturation</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 