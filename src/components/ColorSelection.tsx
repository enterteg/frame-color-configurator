'use client';

import React from 'react';
import { RALColor } from '../data/ralColors';
import { getContrastTextColor } from '../utils/colorUtils';

interface ColorSelectionProps {
  selectedGroup: string | null;
  selectedColors: RALColor[];
  filteredColors: RALColor[];
  hasActiveFilters: boolean;
  onColorSelect: (color: RALColor) => void;
}

export default function ColorSelection({
  selectedGroup,
  selectedColors,
  filteredColors,
  hasActiveFilters,
  onColorSelect
}: ColorSelectionProps) {
  if (!selectedGroup) {
    return null;
  }

  if (filteredColors.length === 0 && hasActiveFilters) {
    return (
      <div className="grid grid-cols-4 gap-3">
        <div className="col-span-4 text-center py-8 text-gray-500">
          No colors match the selected filters. Try adjusting your filter settings.
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-3">
      {filteredColors.map((color) => {
        const textColor = getContrastTextColor(color.hex);
        return (
          <button
            key={color.code}
            onClick={() => onColorSelect(color)}
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
      })}
    </div>
  );
} 