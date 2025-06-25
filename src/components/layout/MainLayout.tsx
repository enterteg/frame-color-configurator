'use client';

import { useBikeStore } from '@/store/useBikeStore';
import React from 'react';

interface MainLayoutProps {
  leftNavigation: React.ReactNode;
  mainContent: React.ReactNode;
  rightPanel: React.ReactNode;
}

export default function MainLayout({ leftNavigation, mainContent, rightPanel }: MainLayoutProps) {
  const bottomPanelHeight = useBikeStore(state => state.bottomPanelHeight);
  const isBottomPanelOpen = useBikeStore(state => state.showBottomPanel);
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
          bottom: isBottomPanelOpen ? `${bottomPanelHeight}px` : '0px'
        }}
      >
        {leftNavigation}
      </div>
      
      {/* Right Panel - Floating on top */}
      <div 
        className="absolute top-0 right-0 z-20"
        style={{ 
          bottom: isBottomPanelOpen ? `${bottomPanelHeight}px` : '0px'
        }}
      >
        {rightPanel}
      </div>
    </div>
  );
} 