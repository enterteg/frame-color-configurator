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
    <div className="flex flex-col gap-3">
      {ralColorGroups.map((group) => (
        <button
          key={group.name}
          onClick={() => onGroupSelect(group.name)}
          className={`w-12 h-12 rounded-full border border-gray-300 shadow-md transition-all duration-200 hover:scale-105 ${
            selectedGroup === group.name ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:ring-2 hover:ring-blue-300'
          }`}
          style={{ backgroundColor: getGroupMainColor(group.name) }}
          title={group.name}
        />
      ))}
    </div>
  );
} 