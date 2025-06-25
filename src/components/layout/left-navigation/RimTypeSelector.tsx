import React from 'react';
import OptionToggleSelector from '../OptionToggleSelector';
import { RimType } from '../../../types/bike';

interface RimTypeSelectorProps {
  rimType: RimType;
  setRimType: (type: RimType) => void;
}

const RimTypeSelector: React.FC<RimTypeSelectorProps> = ({ rimType, setRimType }) => {
  return (
    <OptionToggleSelector
      label="RIM TYPE"
      options={[
        { value: '35', label: '35mm' },
        { value: '50', label: '50mm' },
      ]}
      selected={rimType}
      onSelect={val => setRimType(val as RimType)}
    />
  );
};

export default RimTypeSelector; 