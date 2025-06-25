import React from 'react';
import ColorSelectorRow from '../ColorSelectorRow';
import { TabType } from '../../../types/bike';

interface ForkSelectorProps {
  activeTab: TabType;
  forkColor: { hex: string; code: string };
  setActiveTab: (tab: TabType) => void;
  openColorSelection: (type: 'frame' | 'fork' | 'logo') => void;
}

const ForkSelector: React.FC<ForkSelectorProps> = ({ activeTab, forkColor, setActiveTab, openColorSelection }) => {
  return (
    <ColorSelectorRow
      label="FORK"
      active={activeTab === 'fork'}
      color={forkColor}
      onClick={() => {
        setActiveTab('fork');
        openColorSelection('fork');
      }}
    />
  );
};

export default ForkSelector; 