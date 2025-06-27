import { useMemo } from 'react';
import { TEXTURE_SIZE } from '../utils/constants';

interface UseCanvasCalculationsProps {
  aspectRatio: number;
  bottomPanelHeight: number;
}

export function useCanvasCalculations({
  aspectRatio,
  bottomPanelHeight
}: UseCanvasCalculationsProps) {
  const calculations = useMemo(() => {
    // Canvas dimensions
    const LOGICAL_CANVAS_WIDTH = TEXTURE_SIZE;
    const LOGICAL_CANVAS_HEIGHT = TEXTURE_SIZE / aspectRatio;
    
    // Make the stage larger to allow dragging outside the texture area
    const STAGE_PADDING = LOGICAL_CANVAS_HEIGHT * 0.2;
    const STAGE_WIDTH = LOGICAL_CANVAS_WIDTH + (STAGE_PADDING * 2);
    const STAGE_HEIGHT = LOGICAL_CANVAS_HEIGHT + (STAGE_PADDING * 2);
    
    // Texture capture area offset (centered in the larger stage)
    const TEXTURE_OFFSET_X = STAGE_PADDING;
    const TEXTURE_OFFSET_Y = STAGE_PADDING;
    
    // Available space calculations
    const availableHeight = bottomPanelHeight - 80;
    const availableWidth = typeof window !== 'undefined' ? window.innerWidth - 80 : 1200;
    
    // Calculate scale while maintaining aspect ratio
    const scaleByWidth = availableWidth / STAGE_WIDTH;
    const scaleByHeight = availableHeight / STAGE_HEIGHT;
    const visualScale = Math.min(scaleByWidth, scaleByHeight);
    
    const VISUAL_DISPLAY_WIDTH = STAGE_WIDTH * visualScale;
    const VISUAL_DISPLAY_HEIGHT = STAGE_HEIGHT * visualScale;

    return {
      LOGICAL_CANVAS_WIDTH,
      LOGICAL_CANVAS_HEIGHT,
      STAGE_PADDING,
      STAGE_WIDTH,
      STAGE_HEIGHT,
      TEXTURE_OFFSET_X,
      TEXTURE_OFFSET_Y,
      availableHeight,
      availableWidth,
      scaleByWidth,
      scaleByHeight,
      visualScale,
      VISUAL_DISPLAY_WIDTH,
      VISUAL_DISPLAY_HEIGHT
    };
  }, [aspectRatio, bottomPanelHeight]);

  return calculations;
} 