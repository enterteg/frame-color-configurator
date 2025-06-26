import React from 'react';
import { getContrastTextColor } from '../../utils/colorUtils';

interface ColorSelectorRowProps {
  label: string;
  active: boolean;
  color: { hex: string; code: string };
  onClick: () => void;
}

const ColorSelectorRow: React.FC<ColorSelectorRowProps> = ({ label, active, color, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full cursor-pointer flex items-center justify-between px-4 py-4 border-b border-gray-100 transition-all duration-200 ${
      active
        ? 'bg-gray-200 text-brand-brown-700 border-l-4'
        : 'hover:bg-gray-50'
    }`}
    style={active ? { borderLeftColor: '#4B2E19' } : undefined}
  >
    <div className="flex-1 text-left">
      <div className="font-medium text-gray-800">{label}</div>
    </div>
    <div
      className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center flex-shrink-0 shadow-md"
      style={{ backgroundColor: color.hex }}
    >
      <span
        className="text-[10px] font-bold"
        style={{ color: getContrastTextColor(color.hex) }}
      >
        {color.code.replace('RAL ', '')}
      </span>
    </div>
  </button>
);

export default ColorSelectorRow; 