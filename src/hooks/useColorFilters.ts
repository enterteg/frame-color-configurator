import { useState, useMemo } from 'react';
import { RALColor, ralColorGroups, getColorById } from '../data/ralColors';
import { getHarmoniousColors, HarmonyType } from '../utils/colorTheory';

export interface ColorFilter {
  temperature: 'all' | 'warm' | 'cool';
  saturation: 'all' | 'high' | 'medium' | 'low';
  brightness: 'all' | 'bright' | 'medium' | 'dark';
  harmony: 'all' | HarmonyType;
  selectedBaseColor: RALColor | null;
}

export function useColorFilters() {
  const [filters, setFilters] = useState<ColorFilter>({
    temperature: 'all',
    saturation: 'all', 
    brightness: 'all',
    harmony: 'all',
    selectedBaseColor: null
  });

  // Get all colors from the new structure
  const allColors = ralColorGroups.flatMap(group => 
    group.colorIds.map(id => getColorById(id)).filter(Boolean) as RALColor[]
  );

  const filteredColors = useMemo(() => {
    let filtered = [...allColors];

    // Apply harmony filter
    if (filters.harmony !== 'all' && filters.selectedBaseColor) {
      const harmoniousColors = getHarmoniousColors(
        filters.selectedBaseColor, 
        allColors, 
        filters.harmony, // Now properly typed
        30 // Default tolerance
      );
      const harmoniousCodes = new Set(harmoniousColors.map(c => c.code));
      filtered = filtered.filter(color => harmoniousCodes.has(color.code));
    }

    // Add other filters here (temperature, saturation, brightness)
    // These would need implementations based on color analysis

    return filtered;
  }, [filters, allColors]);

  const hasActiveFilters = filters.temperature !== 'all' || 
                          filters.saturation !== 'all' || 
                          filters.brightness !== 'all' || 
                          filters.harmony !== 'all';

  return {
    filters,
    setFilters,
    filteredColors,
    hasActiveFilters,
    allColors
  };
} 