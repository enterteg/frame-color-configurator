'use client';

import React from 'react';
import { ralColorGroups } from '../data/ralColors';
import { getGroupMainColor } from '../utils/colorUtils';

interface ColorGroupSelectorProps {
  selectedGroup: string | null;
  onGroupSelect: (groupName: string | null) => void;
}

export default function ColorGroupSelector({ selectedGroup, onGroupSelect }: ColorGroupSelectorProps) {
  return (
    <div className="flex flex-col">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Color Groups</h2>
      <div className="grid grid-cols-3 gap-6 w-max">
        {ralColorGroups.map((group) => (
          <button
            key={group.name}
            onClick={() => onGroupSelect(group.name)}
            className={`relative flex flex-col items-center group transition-all ${
              selectedGroup === group.name ? 'scale-110' : 'hover:scale-105'
            }`}
          >
            <div
              className={`w-15 h-15 rounded-lg shadow-lg transition-all ${
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
  );
} 