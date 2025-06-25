import React from 'react';
import { getContrastTextColor } from '../../../utils/colorUtils';

interface ForkSelectorProps {
  activeTab: string;
  forkColor: { hex: string; code: string };
  setActiveTab: (tab: string) => void;
  openColorSelection: (section: string) => void;
}

const ForkSelector: React.FC<ForkSelectorProps> = ({ activeTab, forkColor, setActiveTab, openColorSelection }) => {
  return (
    <button
      onClick={() => {
        setActiveTab('fork');
        openColorSelection('fork');
      }}
      className={`w-full flex items-center justify-between px-4 py-4 border-b border-gray-100 transition-all duration-200 ${
        activeTab === 'fork'
          ? 'bg-blue-50 text-blue-700 border-l-4 border-l-blue-500'
          : 'hover:bg-gray-50'
      }`}
    >
      <div className="flex-1 text-left">
        <div className="font-medium text-gray-800">FORK</div>
      </div>
      <div
        className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center flex-shrink-0 shadow-md"
        style={{ backgroundColor: forkColor.hex }}
      >
        <span
          className="text-[10px] font-bold"
          style={{ color: getContrastTextColor(forkColor.hex) }}
        >
          {forkColor.code.replace('RAL ', '')}
        </span>
      </div>
    </button>
  );
};

export default ForkSelector; 