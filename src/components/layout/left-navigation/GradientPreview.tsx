import React from 'react';
import { GradientSettings } from '../../../types/bike';
import { getContrastTextColor } from '@/utils/colorUtils';
import { getSortedColorStops, generateCSSGradientForPreview } from '../../../utils/generateGradient';

interface GradientPreviewProps {
  gradient: GradientSettings;
  size?: number; // Size of the circle in pixels
  className?: string;
}

const GradientPreview: React.FC<GradientPreviewProps> = ({ 
  gradient, 
  size = 48, 
  className = '' 
}) => {
  // Get first and last color stops for the split preview using unified sorting
  const sortedStops = getSortedColorStops(gradient.colorStops);
  const firstColor = sortedStops[0]?.color; // First color (position 0)
  const lastColor = sortedStops[sortedStops.length - 1]?.color; // Last color (position 1)

  if (!firstColor || !lastColor) {
    return (
      <div
        className={`rounded-full border border-gray-300 flex items-center justify-center bg-gray-200 ${className}`}
        style={{ width: size, height: size }}
      >
        <span className="text-xs text-gray-500">N/A</span>
      </div>
    );
  }

  // Use unified CSS gradient generation
  const gradientStyle = generateCSSGradientForPreview(gradient);

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* Gradient background circle */}
      <div
        className="absolute inset-0 rounded-full border border-gray-300 shadow-md"
        style={{
          background: gradientStyle,
        }}
      />
      
      {/* Split text overlay with color names */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center h-full">
          {/* First color name - top half */}
          <div 
            className="flex-1 flex items-center justify-center text-center px-1"
            style={{ 
              fontSize: `${Math.max(8, size * 0.18)}px`,
              lineHeight: 1,
              color: getContrastTextColor(firstColor.hex),
            }}
          >
            <span 
              className="font-bold px-1 rounded"
            >
              {firstColor.code.replace('RAL ', '')}
            </span>
          </div>
          
          {/* Last color name - bottom half */}
          <div 
            className="flex-1 flex items-center justify-center text-center px-1"
            style={{ 
              fontSize: `${Math.max(8, size * 0.18)}px`,
              lineHeight: 1,
              color: getContrastTextColor(lastColor.hex),
            }}
          >
            <span 
              className="font-bold px-1 rounded"
            >
              {lastColor.code.replace('RAL ', '')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradientPreview; 