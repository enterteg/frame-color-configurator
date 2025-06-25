import React from 'react';
import ColorSelectorRow from '../ColorSelectorRow';
import { TabType } from '../../../types/bike';

interface FrameSelectorProps {
  activeTab: TabType;
  frameColor: { hex: string; code: string };
  setActiveTab: (tab: TabType) => void;
  openColorSelection: (type: 'frame' | 'fork' | 'logo') => void;
}

const FrameSelector: React.FC<FrameSelectorProps> = ({ activeTab, frameColor, setActiveTab, openColorSelection }) => {
  return (
    <ColorSelectorRow
      label="FRAME"
      active={activeTab === 'frame'}
      color={frameColor}
      onClick={() => {
        setActiveTab('frame');
        openColorSelection('frame');
      }}
    />
  );
};

export default FrameSelector; 