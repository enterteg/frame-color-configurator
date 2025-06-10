'use client';

import React from 'react';

interface MainLayoutProps {
  leftNavigation: React.ReactNode;
  mainContent: React.ReactNode;
  rightPanel: React.ReactNode;
  bottomPanelHeight?: number;
}

export default function MainLayout({ leftNavigation, mainContent, rightPanel, bottomPanelHeight = 0 }: MainLayoutProps) {
  return (
    <div className="h-screen w-screen relative overflow-hidden bg-gray-50">
      {/* Main Content - Always full screen */}
      <div className="absolute inset-0 z-0">
        {mainContent}
      </div>
      
      {/* Left Navigation - Floating on top */}
      <div 
        className="absolute top-0 left-0 z-20"
        style={{ 
          bottom: `${bottomPanelHeight}px`
        }}
      >
        {leftNavigation}
      </div>
      
      {/* Right Panel - Floating on top */}
      <div 
        className="absolute top-0 right-0 z-20"
        style={{ 
          bottom: `${bottomPanelHeight}px`
        }}
      >
        {rightPanel}
      </div>
    </div>
  );
} 