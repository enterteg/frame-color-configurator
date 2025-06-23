'use client';

import React, { useState, useEffect } from 'react';
import { DevicePhoneMobileIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';

const MobileWarning = () => {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent;
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const isSmallScreen = window.innerWidth <= 768;
      
      const shouldShowWarning = isMobileDevice || isSmallScreen;
      setShowWarning(shouldShowWarning);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleContinueAnyway = () => {
    setShowWarning(false);
  };

  if (!showWarning) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center shadow-2xl">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <DevicePhoneMobileIcon className="h-16 w-16 text-gray-400" />
            <div className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1">
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Mobile Version Coming Soon
        </h2>

        {/* Message */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          The RAL Palette Composer is optimized for desktop and tablet experiences. 
          For the best experience with all features, please use a computer or tablet with a larger screen.
        </p>

        {/* Desktop recommendation */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center mb-2">
            <ComputerDesktopIcon className="h-8 w-8 text-blue-600 mr-2" />
            <span className="text-blue-800 font-medium">Recommended</span>
          </div>
          <p className="text-blue-700 text-sm">
            Use a desktop or laptop computer for the full experience with all customization features.
          </p>
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          <button
            onClick={handleContinueAnyway}
            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Continue Anyway
          </button>
          <p className="text-xs text-gray-500">
            Limited functionality on mobile devices
          </p>
        </div>

        {/* Coming soon note */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            📱 Mobile-optimized version coming soon!
          </p>
        </div>
      </div>
    </div>
  );
};

export default MobileWarning; 