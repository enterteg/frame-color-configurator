import React from 'react';
import { getContrastTextColor } from '../../utils/colorUtils';

interface ColorPreviewProps {
  color: { hex: string; code: string };
  size?: 'small' | 'medium' | 'large';
  className?: string;
  onClick?: () => void;
}

const ColorPreview: React.FC<ColorPreviewProps> = ({ 
  color, 
  size = 'medium',
  className = '',
  onClick 
}) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8', 
    large: 'w-12 h-12'
  };
  
  const textSizeClasses = {
    small: 'text-[8px]',
    medium: 'text-[9px]',
    large: 'text-[10px]'
  };

  const baseClasses = `${sizeClasses[size]} rounded-full border border-gray-300 flex items-center justify-center flex-shrink-0 shadow-md ${className}`;
  
  const Component = onClick ? 'button' : 'div';
  
  return (
    <Component
      onClick={onClick}
      className={`${baseClasses} ${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`}
      style={{ backgroundColor: color.hex }}
    >
      <span
        className={`${textSizeClasses[size]} font-bold`}
        style={{ color: getContrastTextColor(color.hex) }}
      >
        {color.code.replace('RAL ', '')}
      </span>
    </Component>
  );
};

export default ColorPreview; 