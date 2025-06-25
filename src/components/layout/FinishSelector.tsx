import React from 'react';
import { useBikeStore } from '../../store/useBikeStore';
import OptionToggleSelector from './OptionToggleSelector';

const FinishSelector: React.FC = () => {
  const isFrameMetallic = useBikeStore((s) => s.isFrameMetallic);
  const setFrameMetallic = useBikeStore((s) => s.setFrameMetallic);

  return (
    <OptionToggleSelector
      label="FINISH"
      options={[
        { value: 'metallic', label: 'Metallic' },
        { value: 'matte', label: 'Matte' },
      ]}
      selected={isFrameMetallic ? 'metallic' : 'matte'}
      onSelect={val => setFrameMetallic(val === 'metallic')}
    />
  );
};

export default FinishSelector; 