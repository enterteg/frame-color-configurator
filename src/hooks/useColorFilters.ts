import { useState } from 'react';
import { ralColorGroups, RALColor } from '../data/ralColors';
import { 
  getHarmoniousColorsForPalette, 
  filterByTemperature, 
  filterByBrightness, 
  filterBySaturation,
  HarmonyType 
} from '../utils/colorTheory';

export function useColorFilters(selectedColors: RALColor[]) {
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
  const hasActiveFilters = Boolean(harmonyFilter || temperatureFilter || brightnessFilter || saturationFilter);

  return {
    // State
    showFilters,
    harmonyFilter,
    temperatureFilter,
    brightnessFilter,
    saturationFilter,
    harmonyTolerance,
    hasActiveFilters,
    
    // Actions
    setShowFilters,
    setHarmonyFilter,
    setTemperatureFilter,
    setBrightnessFilter,
    setSaturationFilter,
    setHarmonyTolerance,
    clearFilters,
    getFilteredColors
  };
} 