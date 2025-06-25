'use client';

import React from 'react';
import NavigationHeader from './left-navigation/NavigationHeader';
import FrameSelector from './left-navigation/FrameSelector';
import ForkSelector from './left-navigation/ForkSelector';
import TireWallSelector from './left-navigation/TireWallSelector';
import RimTypeSelector from './left-navigation/RimTypeSelector';
import LogosSection from './left-navigation/LogosSection';  
import FinishSelector from './FinishSelector';
import { useBikeStore } from '../../store/useBikeStore';

const LeftNavigation = () => {
  const {
    activeTab,
    frameColor,
    forkColor,
    tireWallColor,
    rimType,
    selectedLogoType,
    logoTypes,
    selectedLogoImageId,
    navigationCollapsed,
    logosCollapsed,
    setActiveTab,
    setSelectedLogoType,
    openColorSelection,
    addLogoImageFromFile,
    removeLogoImage,
    setSelectedLogoImageId,
    setLogoTextureFromState,
    updateLogoTypeImages,
    saveConfiguration,
    loadConfiguration,
    setTireWallColor,
    setRimType,
    setLogosCollapsed,
  } = useBikeStore();

  const handleSave = () => {
    const config = saveConfiguration();
    const blob = new Blob([config], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bike-configuration.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLoad = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const config = event.target?.result as string;
            loadConfiguration(config);
          } catch (error) {
            console.error('Failed to load configuration:', error);
            alert('Failed to load configuration. Please make sure the file is valid.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="w-[300px] h-full bg-white shadow-lg border-r border-gray-200 flex flex-col transition-all duration-300 z-20">
      {/* Header */}
      <NavigationHeader
        navigationCollapsed={navigationCollapsed}
        handleSave={handleSave}
        handleLoad={handleLoad}
      />
      {/* Navigation Options */}
      <div className="flex-1 overflow-y-auto">
        <FrameSelector
          activeTab={activeTab}
          frameColor={frameColor}
          setActiveTab={setActiveTab}
          openColorSelection={openColorSelection}
        />
        <ForkSelector
          activeTab={activeTab}
          forkColor={forkColor}
          setActiveTab={setActiveTab}
          openColorSelection={openColorSelection}
        />
        <FinishSelector />
        <RimTypeSelector rimType={rimType} setRimType={setRimType} />

        <TireWallSelector
          tireWallColor={tireWallColor}
          setTireWallColor={setTireWallColor}
        />
        <LogosSection
          activeTab={activeTab}
          logosCollapsed={logosCollapsed}
          setLogosCollapsed={setLogosCollapsed}
          selectedLogoType={selectedLogoType}
          selectedLogoImageId={selectedLogoImageId}
          logoTypes={logoTypes}
          setSelectedLogoType={setSelectedLogoType}
          setSelectedLogoImageId={setSelectedLogoImageId}
          setActiveTab={setActiveTab}
          addLogoImageFromFile={addLogoImageFromFile}
          removeLogoImage={removeLogoImage}
          setLogoTextureFromState={setLogoTextureFromState}
          updateLogoTypeImages={updateLogoTypeImages}
          openColorSelection={openColorSelection}
        />
      </div>
    </div>
  );
};

export default LeftNavigation; 