import React from 'react';

interface RimTypeSelectorProps {
  rimType: string;
  setRimType: (type: string) => void;
}

const RimTypeSelector: React.FC<RimTypeSelectorProps> = ({ rimType, setRimType }) => {
  return (
    <div className="w-full flex items-center justify-between px-4 py-4 transition-all duration-200 hover:bg-gray-50">
      <div className="flex-1 text-left">
        <div className="font-medium text-gray-800">RIM TYPE</div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setRimType('35')}
          className={`px-3 py-1 text-xs font-medium rounded border-2 transition-colors ${
            rimType === '35'
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          35mm
        </button>
        <button
          onClick={() => setRimType('50')}
          className={`px-3 py-1 text-xs font-medium rounded border-2 transition-colors ${
            rimType === '50'
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          50mm
        </button>
      </div>
    </div>
  );
};

export default RimTypeSelector; 