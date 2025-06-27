'use client';

import React, { useState } from 'react';
import { GradientSettings, GradientType, GradientDirection } from '../../types/bike';
import { createDefaultGradient } from '../../utils/generateGradient';
import { useBikeStore } from '../../store/useBikeStore';

interface GradientControlsProps {
  gradient?: GradientSettings;
  onGradientChange: (gradient: GradientSettings | undefined) => void;
}

export default function GradientControls({ gradient, onGradientChange }: GradientControlsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { openGradientColorSelection } = useBikeStore();

  const handleEnableGradient = () => {
    if (gradient) {
      onGradientChange(undefined);
    } else {
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
    
    const newColorStops = [...gradient.colorStops];
    newColorStops.push({
      color: '#808080',
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
    <div className="bg-white px-4 py-3 border-b border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="enable-gradient"
            checked={!!gradient}
            onChange={handleEnableGradient}
            className="rounded border-gray-300 text-gray-700 focus:ring-gray-500"
          />
          <label htmlFor="enable-gradient" className="text-sm font-medium text-gray-700">
            Gradient Background
          </label>
        </div>
        {gradient && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-gray-700 hover:text-gray-900"
          >
            {isExpanded ? 'Hide' : 'Show'} Controls
          </button>
        )}
      </div>

      {gradient && isExpanded && (
        <div className="space-y-4 mt-3">
          {/* Gradient Type */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Gradient Type
            </label>
            <select
              value={gradient.type}
              onChange={(e) => handleGradientUpdate({ type: e.target.value as GradientType })}
              className="w-full px-3 py-1 text-black border border-gray-300 rounded-md text-sm focus:ring-gray-500 focus:border-gray-500"
            >
              <option value="linear">Linear</option>
              <option value="radial">Radial</option>
              <option value="conic">Conic</option>
            </select>
          </div>

          {/* Direction (Linear only) */}
          {gradient.type === 'linear' && (
            <div>
              <label className="block  text-xs font-medium text-gray-700 mb-1">
                Direction
              </label>
              <select
                value={gradient.direction}
                onChange={(e) => handleGradientUpdate({ direction: e.target.value as GradientDirection })}
                className="w-full px-3 py-1 text-black border border-gray-300 rounded-md text-sm focus:ring-gray-500 focus:border-gray-500"
              >
                <option value="horizontal">Horizontal</option>
                <option value="vertical">Vertical</option>
                <option value="diagonal-tl-br">Diagonal ↘</option>
                <option value="diagonal-tr-bl">Diagonal ↙</option>
              </select>
            </div>
          )}

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

          {/* Blend Mode */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Blend Mode
            </label>
            <select
              value={gradient.blendMode}
              onChange={(e) => handleGradientUpdate({ blendMode: e.target.value as GradientSettings['blendMode'] })}
              className="w-full px-3 py-1 text-black border border-gray-300 rounded-md text-sm focus:ring-gray-500 focus:border-gray-500"
            >
              <option value="normal">Normal</option>
              <option value="multiply">Multiply</option>
              <option value="screen">Screen</option>
              <option value="overlay">Overlay</option>
              <option value="soft-light">Soft Light</option>
              <option value="hard-light">Hard Light</option>
            </select>
          </div>

          {/* Color Stops */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-medium text-gray-700">
                Color Stops
              </label>
              <button
                onClick={addColorStop}
                className="px-2 py-1 text-xs bg-gray-700 text-white rounded hover:bg-gray-800"
              >
                Add Color
              </button>
            </div>
            
            <div className="space-y-2">
              {gradient.colorStops.map((stop, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <button
                    onClick={() => openGradientColorSelection(index)}
                    className="w-8 h-8 border border-gray-300 rounded cursor-pointer flex items-center justify-center"
                    style={{ backgroundColor: stop.color }}
                    title="Choose RAL color"
                  />
                  
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
                      `${stop.color}${Math.round(stop.opacity * 255).toString(16).padStart(2, '0')} ${stop.position * 100}%`
                    ).join(', ')})`
                  : gradient.type === 'radial' 
                  ? `radial-gradient(ellipse ${gradient.radiusX * 100}% ${gradient.radiusY * 100}% at ${gradient.centerX * 100}% ${gradient.centerY * 100}%, ${gradient.colorStops.map(stop => 
                      `${stop.color}${Math.round(stop.opacity * 255).toString(16).padStart(2, '0')} ${stop.position * 100}%`
                    ).join(', ')})`
                  : `conic-gradient(from ${gradient.angle}deg at ${gradient.centerX * 100}% ${gradient.centerY * 100}%, ${gradient.colorStops.map(stop => 
                      `${stop.color}${Math.round(stop.opacity * 255).toString(16).padStart(2, '0')} ${stop.position * 360}deg`
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