import React from 'react';

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
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-8m0 8l-4-4m4 4l4-4m-8 8h8a2 2 0 002-2V6a2 2 0 00-2-2H8a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        </button>
        <button
          onClick={handleLoad}
          className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          title="Load Configuration"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8m0-8l-4 4m4-4l4 4m-8-8h8a2 2 0 012 2v12a2 2 0 01-2 2H8a2 2 0 01-2-2V6a2 2 0 012-2z" /></svg>
        </button>
      </div>
    </div>
  </div>
);

export default NavigationHeader; 