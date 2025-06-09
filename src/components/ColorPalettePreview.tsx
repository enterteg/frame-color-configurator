'use client';

import React from 'react';
import { RALColor } from '../data/ralColors';
import { TrashIcon, ArrowPathIcon, ArrowsUpDownIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { getContrastTextColor } from '../utils/colorUtils';

interface ColorPalettePreviewProps {
  selectedColors: RALColor[];
  colorWidths: number[];
  replaceIndex: number | null;
  previewHeight: number;
  previewTextOpacity: number;
  onColorRemove: (color: RALColor) => void;
  onMoveLeft: (index: number) => void;
  onMoveRight: (index: number) => void;
  onReplaceToggle: (index: number | null) => void;
  onDragStart: (index: number, e: React.MouseEvent<HTMLElement>) => void;
  onHeightDragStart: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onOpacityChange: (opacity: number) => void;
}

export default function ColorPalettePreview({
  selectedColors,
  colorWidths,
  replaceIndex,
  previewHeight,
  previewTextOpacity,
  onColorRemove,
  onMoveLeft,
  onMoveRight,
  onReplaceToggle,
  onDragStart,
  onHeightDragStart,
  onOpacityChange
}: ColorPalettePreviewProps) {
  if (selectedColors.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 mt-8 relative w-full overflow-visible">
      <h2 className="text-xl font-semibold mb-3 text-gray-800 text-center">Color Palette Preview</h2>
      <div id="palette-preview" className="flex w-full items-stretch sticky top-0 z-40 bg-transparent py-0" style={{ height: previewHeight }}>
        {selectedColors.map((color, i) => {
          const textColor = getContrastTextColor(color.hex);
          const isReplace = replaceIndex === i;
          return (
            <React.Fragment key={color.code}>
              <div
                style={{ flex: colorWidths[i], backgroundColor: color.hex }}
                className={`flex p-4 flex-col items-center justify-end relative min-w-[50px] ${isReplace ? 'border-2 border-blue-200' : ''}`}
              >
                <div className="flex items-center justify-center mb-2 gap-1">
                  {i !== 0 && (
                    <button
                      onClick={() => onMoveLeft(i)}
                      style={{ opacity: previewTextOpacity }}
                      className={textColor === 'white' ? 'text-white hover:text-blue-200' : 'text-black hover:text-blue-600'}
                      title="Move Left"
                    >
                      <ChevronLeftIcon className="w-4 h-4" />
                    </button>
                  )}
                  {i !== selectedColors.length - 1 && (
                    <button
                      onClick={() => onMoveRight(i)}
                      style={{ opacity: previewTextOpacity }}
                      className={textColor === 'white' ? 'text-white hover:text-blue-200' : 'text-black hover:text-blue-600'}
                      title="Move Right"
                    >
                      <ChevronRightIcon className="w-4 h-4" />
                    </button>
                  )}
                  <button 
                    style={{ opacity: previewTextOpacity }} 
                    className={textColor === 'white' ? 'text-white hover:text-red-200' : 'text-black hover:text-red-600'} 
                    title="Remove" 
                    onClick={() => onColorRemove(color)}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                  <button
                    style={{ opacity: previewTextOpacity }}
                    className={isReplace ? 'animate-spin text-blue-500' : textColor === 'white' ? 'text-white hover:text-blue-200' : 'text-black hover:text-blue-600'}
                    title="Replace"
                    onClick={() => onReplaceToggle(isReplace ? null : i)}
                  >
                    <ArrowPathIcon className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold" style={{ color: textColor, opacity: previewTextOpacity }}>{color.code}</div>
                  <div className="text-xs mt-1" style={{ color: textColor, opacity: previewTextOpacity * 0.7 }}>{color.hex}</div>
                  <div className="text-xs mt-1" style={{ color: textColor, opacity: previewTextOpacity * 0.7 }}>{color.name}</div>
                </div>
                {isReplace && (
                  <div className="absolute inset-0 bg-blue-400/10 pointer-events-none rounded" />
                )}
              </div>
              {/* Drag handle (except after last color) */}
              {i < selectedColors.length - 1 && (
                <div className="flex flex-col items-center justify-center" style={{ width: 2 }}>
                  <div className="flex-1 bg-blue-400/40" style={{ width: 2 }} />
                  <button
                    onMouseDown={e => onDragStart(i, e)}
                    className="flex items-center justify-center rounded-full bg-white border border-blue-500 shadow w-4 h-4 -my-2 cursor-col-resize z-20"
                    style={{ position: 'relative', top: '-50%', opacity: previewTextOpacity }}
                    title="Drag to resize"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="7" width="10" height="2" rx="1" fill="gray" />
                      <rect x="3" y="11" width="10" height="2" rx="1" fill="gray" />
                      <rect x="3" y="3" width="10" height="2" rx="1" fill="gray" />
                    </svg>
                  </button>
                  <div className="flex-1 bg-blue-400/40" style={{ width: 2 }} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      {/* Bottom right corner resize icon */}
      <button
        className="absolute bottom-0 right-0 bg-white border border-blue-500 rounded-full shadow w-5 h-5 flex items-center justify-center cursor-row-resize z-30 translate-x-1/2 translate-y-7/10"
        onMouseDown={onHeightDragStart}
        title="Drag to resize height"
        style={{ userSelect: 'none', opacity: previewTextOpacity }}
      >
        <ArrowsUpDownIcon className="w-3.5 h-3.5 text-blue-600" />
      </button>
      {/* Opacity slider */}
      <div className="flex items-center gap-2 mt-3">
        <label htmlFor="opacity-slider" className="text-gray-700 text-sm">Preview Text Opacity</label>
        <input
          id="opacity-slider"
          type="range"
          min={0.1}
          max={1}
          step={0.01}
          value={previewTextOpacity}
          onChange={e => onOpacityChange(Number(e.target.value))}
          className="w-32 accent-blue-500"
        />
        <span className="text-gray-500 text-xs">{Math.round(previewTextOpacity * 100)}%</span>
      </div>
    </div>
  );
} 