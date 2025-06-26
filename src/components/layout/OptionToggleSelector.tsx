import React from 'react';

interface OptionToggleSelectorProps {
  label: string;
  options: { value: string; label: string }[];
  selected: string;
  onSelect: (value: string) => void;
}

const OptionToggleSelector: React.FC<OptionToggleSelectorProps> = ({ label, options, selected, onSelect }) => (
  <div className="px-4 py-4 border-b border-gray-100 flex items-center justify-between gap-4">
    <span className="font-medium text-gray-800">{label}</span>
    <div className="flex gap-2">
      {options.map(opt => (
        <button
          key={opt.value}
          className={`px-3 cursor-pointer py-1 text-sm font-medium rounded-full border-2 transition-colors ${
            selected === opt.value
              ? 'bg-gray-100 border-yellow-200 text-gray-700'
              : 'border-gray-100 bg-white text-gray-700'
          }`}
          onClick={() => onSelect(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  </div>
);

export default OptionToggleSelector; 