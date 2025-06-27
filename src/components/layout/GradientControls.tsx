'use client';

import React, { useState } from 'react';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { GradientSettings, GradientDirection, GradientTransition } from '../../types/bike';
import { createDefaultGradient } from '../../utils/generateGradient';
import { useBikeStore } from '../../store/useBikeStore';
import { ralColors } from '../../data/ralColors';
import { getContrastTextColor } from '../../utils/colorUtils';
import CustomDropdown from './CustomDropdown';

interface GradientControlsProps {
  gradient?: GradientSettings;
  onGradientChange: (gradient: GradientSettings | undefined) => void;
}

export default function GradientControls({ gradient, onGradientChange }: GradientControlsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { openGradientColorSelection } = useBikeStore();

  const handleEnableGradient = () => {
    if (gradient) {
      // Toggle the enabled state instead of removing the gradient
      onGradientChange({ ...gradient, enabled: !gradient.enabled });
    } else {
      // Create new gradient with enabled: true
      onGradientChange(createDefaultGradient());
    }
  };

  const handleGradientUpdate = (updates: Partial<GradientSettings>) => {
    if (gradient) {
      onGradientChange({ ...gradient, ...updates });
    }
  };

  const handleColorStopChange = (index: number, field: 'color' | 'position' | 'opacity', value: string | number) => {
    if (!gradient) return;
    
    const newColorStops = [...gradient.colorStops];
    newColorStops[index] = {
      ...newColorStops[index],
      [field]: value
    };
    
    handleGradientUpdate({ colorStops: newColorStops });
  };

  const addColorStop = () => {
    if (!gradient) return;
    
    // Use a default RAL color (RAL 7040 Window grey)
    const defaultColor = ralColors['7040'];
    
    const newColorStops = [...gradient.colorStops];
    newColorStops.push({
      color: defaultColor,
      position: 0.5,
      opacity: 1
    });
    
    handleGradientUpdate({ colorStops: newColorStops });
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
            Gradient Background
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
        {gradient && (
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

      {gradient && isExpanded && (
        <div className="space-y-4 mt-3">
          {/* Direction and Transition */}
          <div className="grid grid-cols-2 gap-3">
            <CustomDropdown
              label="Direction"
              value={gradient.direction}
              onChange={(value) => handleGradientUpdate({ direction: value as GradientDirection })}
              options={[
                { value: 'horizontal', label: 'Horizontal' },
                { value: 'vertical', label: 'Vertical' },
                { value: 'diagonal-tl-br', label: 'Diagonal ↘' },
                { value: 'diagonal-tr-bl', label: 'Diagonal ↙' }
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

          {/* Overall Opacity */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Opacity
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={gradient.opacity}
              onChange={(e) => handleGradientUpdate({ opacity: parseFloat(e.target.value) })}
              className="w-full"
            />
            <span className="text-xs text-gray-700">{Math.round(gradient.opacity * 100)}%</span>
          </div>



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
                  
                  <div className="w-16">
                    <div className="text-xs text-gray-700 mb-1">Opacity</div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                     color='black'
                      value={stop.opacity}
                      onChange={(e) => handleColorStopChange(index, 'opacity', parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <div className="text-xs text-gray-700">{Math.round(stop.opacity * 100)}%</div>
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
                background: gradient.type === 'linear' 
                  ? `linear-gradient(${
                      gradient.direction === 'horizontal' ? 'to right' :
                      gradient.direction === 'vertical' ? 'to bottom' :
                      gradient.direction === 'diagonal-tl-br' ? 'to bottom right' :
                      'to bottom left'
                    }, ${gradient.colorStops.map(stop => 
                      `${stop.color?.hex || '#ffffff'}${Math.round(stop.opacity * 255).toString(16).padStart(2, '0')} ${stop.position * 100}%`
                    ).join(', ')})`
                  : gradient.type === 'radial' 
                  ? `radial-gradient(ellipse ${gradient.radiusX * 100}% ${gradient.radiusY * 100}% at ${gradient.centerX * 100}% ${gradient.centerY * 100}%, ${gradient.colorStops.map(stop => 
                      `${stop.color?.hex || '#ffffff'}${Math.round(stop.opacity * 255).toString(16).padStart(2, '0')} ${stop.position * 100}%`
                    ).join(', ')})`
                  : `conic-gradient(from ${gradient.angle}deg at ${gradient.centerX * 100}% ${gradient.centerY * 100}%, ${gradient.colorStops.map(stop => 
                      `${stop.color?.hex || '#ffffff'}${Math.round(stop.opacity * 255).toString(16).padStart(2, '0')} ${stop.position * 360}deg`
                    ).join(', ')})`,
                opacity: gradient.opacity
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
} 