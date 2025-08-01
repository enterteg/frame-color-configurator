import React from 'react';
import { ArrowDownTrayIcon, ArrowUpTrayIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useBikeStore } from '../../../store/useBikeStore';

interface NavigationHeaderProps {
  navigationCollapsed: boolean;
  handleSave: () => void;
  handleLoad: () => void;
}

const NavigationHeader: React.FC<NavigationHeaderProps> = ({ navigationCollapsed, handleSave, handleLoad }) => {
  const resetStore = useBikeStore((state) => state.resetStore);
  return (
    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
      <div className="flex flex-1 items-center justify-between">
        <h2
          className={`text-xl text-black font-semibold ${navigationCollapsed ? 'hidden' : ''}`}
        >
          Frame Configurator
        </h2>
        <div className="flex gap-1">
          <button
            onClick={handleSave}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            title="Save Configuration"
          >
            <ArrowDownTrayIcon className="h-5 w-5" />
          </button>
          <button
            onClick={handleLoad}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            title="Load Configuration"
          >
            <ArrowUpTrayIcon className="h-5 w-5" />
          </button>
          <button
            onClick={resetStore}
            className="text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"
            title="Reset All"
          >
            <ArrowPathIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavigationHeader; 