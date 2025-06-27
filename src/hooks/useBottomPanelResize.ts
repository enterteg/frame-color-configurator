import { useState, useCallback, useEffect } from 'react';

interface UseBottomPanelResizeProps {
  setBottomPanelHeight: (height: number) => void;
  minPanelHeight?: number;
}

export function useBottomPanelResize({
  setBottomPanelHeight,
  minPanelHeight = 200
}: UseBottomPanelResizeProps) {
  const [isResizing, setIsResizing] = useState(false);
  const [maxPanelHeight, setMaxPanelHeight] = useState(300);

  // Initialize max panel height based on window size
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setMaxPanelHeight(window.innerHeight * 0.5);
    }
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing || typeof window === 'undefined') return;
    const newHeight = window.innerHeight - e.clientY;
    const constrainedHeight = Math.max(minPanelHeight, Math.min(maxPanelHeight, newHeight));
    setBottomPanelHeight(constrainedHeight);
  }, [isResizing, setBottomPanelHeight, minPanelHeight, maxPanelHeight]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  // Handle mouse events for resizing
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'row-resize';
      document.body.style.userSelect = 'none';
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return {
    isResizing,
    handleMouseDown,
    maxPanelHeight
  };
} 