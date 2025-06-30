'use client';

import React, { useState, useEffect } from 'react';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { GradientSettings, GradientDirection, GradientTransition } from '../../types/bike';
import { createDefaultGradient, generateCSSGradient, getSortedColorStops } from '../../utils/generateGradient';
import { useBikeStore } from '../../store/useBikeStore';
import { ralColors } from '../../data/ralColors';
import { getContrastTextColor } from '@/utils/colorUtils';
import CustomDropdown from './CustomDropdown';
import AnimatedCollapse from './AnimatedCollapse';


interface GradientControlsProps {
  gradient?: GradientSettings;
  onGradientChange: (gradient: GradientSettings | undefined) => void;
  autoExpand?: boolean; // Auto-expand when gradient is enabled
}

export default function GradientControls({ gradient, onGradientChange, autoExpand = false }: GradientControlsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { openGradientColorSelection, closeColorSelection } = useBikeStore();

  // Auto-expand when gradient is enabled and autoExpand is true
  useEffect(() => {
    if (autoExpand && gradient?.enabled) {
      setIsExpanded(true);
    }
  }, [autoExpand, gradient?.enabled]);

  const handleEnableGradient = () => {
    if (gradient) {
      // Toggle the enabled state instead of removing the gradient
      const newEnabled = !gradient.enabled;
      onGradientChange({ ...gradient, enabled: newEnabled });
      
      if (newEnabled) {
        // Close color picker when enabling gradient (switching from solid color to gradient)
        closeColorSelection();
      } else {
        // Close gradient configuration when disabling gradient
        setIsExpanded(false);
      }
    } else {
      // Create new gradient with enabled: true
      onGradientChange(createDefaultGradient());
      // Close color picker when creating new gradient
      closeColorSelection();
    }
  };

  const handleGradientUpdate = (updates: Partial<GradientSettings>) => {
    if (gradient) {
      onGradientChange({ ...gradient, ...updates });
    }
  };

  const handleColorStopChange = (index: number, field: 'color' | 'position', value: string | number) => {
    if (!gradient) return;
    
    const updatedColorStops = [...gradient.colorStops];
    if (field === 'position') {
      updatedColorStops[index] = { ...updatedColorStops[index], position: value as number };
    }
    handleGradientUpdate({ colorStops: updatedColorStops });
  };

  const addColorStop = () => {
    if (!gradient) return;
    
    // Find a good position for the new color stop (midpoint of largest gap)
    const sortedStops = getSortedColorStops(gradient.colorStops);
    let newPosition = 0.5;
    
    if (sortedStops.length >= 2) {
      let maxGap = 0;
      let gapPosition = 0.5;
      
      for (let i = 0; i < sortedStops.length - 1; i++) {
        const gap = sortedStops[i + 1].position - sortedStops[i].position;
        if (gap > maxGap) {
          maxGap = gap;
          gapPosition = sortedStops[i].position + gap / 2;
        }
      }
      newPosition = gapPosition;
    }
    
    const newColorStop = {
      color: ralColors['1003'], // Default to yellow
      position: newPosition
    };
    
    handleGradientUpdate({
      colorStops: [...gradient.colorStops, newColorStop]
    });
  };

  const removeColorStop = (index: number) => {
    if (!gradient || gradient.colorStops.length <= 2) return;
    
    const newColorStops = gradient.colorStops.filter((_, i) => i !== index);
    handleGradientUpdate({ colorStops: newColorStops });
  };

  return (
    <div className="bg-white px-5 pb-3 pt-5 border-b flex-col items-center justify-between border-gray-100">
      <div className="flex flex-1 items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <label htmlFor="enable-gradient" className="text-sm font-medium text-gray-700">
            Multicolor
          </label>
          <button
            id="enable-gradient"
            onClick={handleEnableGradient}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 ${
              gradient?.enabled ? 'bg-gray-700' : 'bg-gray-200'
            }`}
            role="switch"
            aria-checked={gradient?.enabled || false}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                gradient?.enabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        {gradient?.enabled && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors cursor-pointer ${
              isExpanded ? 'bg-gray-200' : ''
            }`}
            title={isExpanded ? 'Hide gradient controls' : 'Show gradient controls'}
          >
            <AdjustmentsHorizontalIcon className="h-6 w-6" />
          </button>
        )}
      </div>

      {gradient && (
        <AnimatedCollapse isOpen={isExpanded}>
          <div className="space-y-4 mt-3">
          {/* Direction and Transition */}
          <div className="grid grid-cols-2 gap-3">
            <CustomDropdown
              label="Direction"
              value={gradient.direction}
              onChange={(value) => handleGradientUpdate({ direction: value as GradientDirection })}
              options={[
                { value: 'horizontal', label: 'Horizontal →' },
                { value: 'vertical', label: 'Vertical ↓' },
                { value: 'diagonal-tl-br', label: 'Diagonal ↘' },
                { value: 'diagonal-tr-bl', label: 'Diagonal ↙' },
                { value: 'diagonal-bl-tr', label: 'Diagonal ↗' },
                { value: 'diagonal-br-tl', label: 'Diagonal ↖' }
              ]}
            />
            <CustomDropdown
              label="Transition"
              value={gradient.transition}
              onChange={(value) => handleGradientUpdate({ transition: value as GradientTransition })}
              options={[
                { value: 'smooth', label: 'Smooth' },
                { value: 'hard-stop', label: 'Hard Stop' },
                { value: 'stepped', label: 'Stepped' },
                { value: 'ease-in', label: 'Ease In' },
                { value: 'ease-out', label: 'Ease Out' }
              ]}
            />
          </div>

          {/* Center Position (Radial/Conic) */}
          {(gradient.type === 'radial' || gradient.type === 'conic') && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Center X
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={gradient.centerX}
                  onChange={(e) => handleGradientUpdate({ centerX: parseFloat(e.target.value) })}
                  className="w-full"
                />
                <span className="text-xs text-gray-700">{Math.round(gradient.centerX * 100)}%</span>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Center Y
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={gradient.centerY}
                  onChange={(e) => handleGradientUpdate({ centerY: parseFloat(e.target.value) })}
                  className="w-full"
                />
                <span className="text-xs text-gray-700">{Math.round(gradient.centerY * 100)}%</span>
              </div>
            </div>
          )}

          {/* Radius (Radial only) */}
          {gradient.type === 'radial' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Radius X
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={gradient.radiusX}
                  onChange={(e) => handleGradientUpdate({ radiusX: parseFloat(e.target.value) })}
                  className="w-full"
                />
                <span className="text-xs text-gray-700">{Math.round(gradient.radiusX * 100)}%</span>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Radius Y
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={gradient.radiusY}
                  onChange={(e) => handleGradientUpdate({ radiusY: parseFloat(e.target.value) })}
                  className="w-full"
                />
                <span className="text-xs text-gray-700">{Math.round(gradient.radiusY * 100)}%</span>
              </div>
            </div>
          )}

          {/* Angle (Conic only) */}
          {gradient.type === 'conic' && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Angle
              </label>
              <input
                type="range"
                min="0"
                max="360"
                step="1"
                value={gradient.angle}
                onChange={(e) => handleGradientUpdate({ angle: parseInt(e.target.value) })}
                className="w-full"
              />
              <span className="text-xs text-gray-700">{gradient.angle}°</span>
            </div>
          )}

          {/* Color Stops */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-medium text-gray-700">
                Color Stops
              </label>
              <button
                onClick={addColorStop}
                className="px-3 py-1 text-xs bg-gray-100 text-black rounded hover:bg-gray-200 cursor-pointer"
              >
                Add Color +
              </button>
            </div>
            
            <div className="space-y-2">
              {gradient.colorStops.map((stop, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <button
                    onClick={() => openGradientColorSelection(index)}
                    className="w-12 h-12 border border-gray-300 rounded-full cursor-pointer flex items-center justify-center shadow-md"
                    style={{ backgroundColor: stop.color?.hex || '#ffffff' }}
                    title={`Choose RAL color - ${stop.color?.code || 'Unknown'}`}
                  >
                    <span
                      className="text-[10px] font-bold"
                      style={{ color: getContrastTextColor(stop.color?.hex || '#ffffff') }}
                    >
                      {stop.color?.code?.replace("RAL ", "") || '?'}
                    </span>
                  </button>
                  
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-1">Position</div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={stop.position}
                      onChange={(e) => handleColorStopChange(index, 'position', parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <div className="text-xs text-gray-700">{Math.round(stop.position * 100)}%</div>
                  </div>
                  

                  
                  {gradient.colorStops.length > 2 && (
                    <button
                      onClick={() => removeColorStop(index)}
                      className="p-1 text-red-500 hover:text-red-700"
                      title="Remove color stop"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Gradient Preview */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Preview
            </label>
            <div 
              className="w-full h-12 border border-gray-300 rounded"
              style={{
                background: generateCSSGradient(gradient)
              }}
            />
          </div>
          </div>
        </AnimatedCollapse>
      )}
    </div>
  );
} 