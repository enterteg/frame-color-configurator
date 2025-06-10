'use client';

import React from 'react';
import { RALColor } from '../data/ralColors';

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
      <div className="text-center py-8 text-gray-500">
        No colors match the selected filters. Try adjusting your filter settings.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-5 gap-3">
      {filteredColors.map((color) => {
        return (
          <button
            key={color.code}
            onClick={() => onColorSelect(color)}
            className={`w-10 h-10 rounded-full border border-gray-300 shadow-md transition-all duration-200 hover:scale-105 ${
              selectedColors.some((c) => c.code === color.code)
                ? 'ring-2 ring-blue-500 ring-offset-2'
                : 'hover:ring-2 hover:ring-blue-300'
            }`}
            style={{ backgroundColor: color.hex }}
            title={`${color.code} - ${color.name}`}
          />
        );
      })}
    </div>
  );
} 