'use client';

import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { RALColor } from '../../data/ralColors';
import ColorGroupSelector from '../ColorGroupSelector';
import ColorSelection from '../ColorSelection';

interface LeftColorPanelProps {
  isOpen: boolean;
  selectedGroup: string | null;
  selectedColors: RALColor[];
  filteredColors: RALColor[];
  hasActiveFilters: boolean;
  leftNavWidth: number; // Width of the left navigation to position panel correctly
  onGroupSelect: (groupName: string | null) => void;
  onColorSelect: (color: RALColor) => void;
}

export default function LeftColorPanel({
  isOpen,
  selectedGroup,
  selectedColors,
  filteredColors,
  hasActiveFilters,
  leftNavWidth,
  onGroupSelect,
  onColorSelect
}: LeftColorPanelProps) {
  if (!isOpen) {
    return null;
  }

  const getHeaderText = () => {
    if (selectedGroup) {
      return `${selectedGroup} Colors`;
    }
    return 'Select a color group';
  };

  return (
    <div 
      className="fixed top-0 h-full bg-white shadow-lg border-r border-gray-200 transition-all duration-300 z-10 flex"
      style={{ left: leftNavWidth }}
    >
      {/* Color Groups Column */}
      <div className="w-20 border-r border-gray-200 p-4">
        <ColorGroupSelector
          selectedGroup={selectedGroup}
          onGroupSelect={onGroupSelect}
        />
      </div>

      {/* Individual Colors Area */}
      {selectedGroup && (
        <div className="flex-1 flex flex-col">
          {/* Header with title and close button */}
          <div className="p-2 border-b border-gray-200 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 ml-2">{getHeaderText()}</span>
            <button
              onClick={() => onGroupSelect(null)}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              title="Close individual colors"
            >
              <XMarkIcon className="h-4 w-4 text-gray-600" />
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-auto">
            <ColorSelection
              selectedGroup={selectedGroup}
              selectedColors={selectedColors}
              filteredColors={filteredColors}
              hasActiveFilters={hasActiveFilters}
              onColorSelect={onColorSelect}
            />
          </div>
        </div>
      )}
    </div>
  );
} 