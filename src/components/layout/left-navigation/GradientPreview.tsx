import React from 'react';
import { GradientSettings } from '../../../types/bike';
import { getContrastTextColor } from '@/utils/colorUtils';
import { applyGammaToHex } from '../../../utils/colorCorrections';

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
  // Get first and last color stops for the split preview (matching GradientControls order)
  const sortedStops = [...gradient.colorStops].sort((a, b) => a.position - b.position);
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

  // Create gradient background for the circle
  const gradientStyle = gradient.type === 'linear' 
    ? `linear-gradient(${gradient.direction === 'horizontal' ? '90deg' : 
        gradient.direction === 'vertical' ? '180deg' : 
        gradient.direction === 'diagonal-tl-br' ? '135deg' : '225deg'}, ${
        gradient.colorStops.map(stop => `${applyGammaToHex(stop.color.hex)} ${stop.position * 100}%`).join(', ')
      })`
    : gradient.type === 'radial'
    ? `radial-gradient(circle at ${gradient.centerX * 100}% ${gradient.centerY * 100}%, ${
        gradient.colorStops.map(stop => `${applyGammaToHex(stop.color.hex)} ${stop.position * 100}%`).join(', ')
      })`
    : `conic-gradient(from ${gradient.angle}deg at ${gradient.centerX * 100}% ${gradient.centerY * 100}%, ${
        gradient.colorStops.map(stop => `${applyGammaToHex(stop.color.hex)} ${stop.position * 360}deg`).join(', ')
      })`;

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