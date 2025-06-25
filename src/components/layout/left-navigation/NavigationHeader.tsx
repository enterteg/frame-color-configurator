import React from 'react';
import { ArrowDownTrayIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';

interface NavigationHeaderProps {
  navigationCollapsed: boolean;
  handleSave: () => void;
  handleLoad: () => void;
}

const NavigationHeader: React.FC<NavigationHeaderProps> = ({ navigationCollapsed, handleSave, handleLoad }) => (
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
          <ArrowDownTrayIcon className="h-4 w-4" />
        </button>
        <button
          onClick={handleLoad}
          className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          title="Load Configuration"
        >
          <ArrowUpTrayIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  </div>
);

export default NavigationHeader; 