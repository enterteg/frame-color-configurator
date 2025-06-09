import { useRef } from 'react';

const MIN_FLEX = 0.1;

export function usePaletteDrag(
  colorWidths: number[],
  setColorWidths: (widths: number[]) => void
) {
  const dragIndex = useRef<number | null>(null);
  const dragStartX = useRef<number>(0);
  const dragStartWidths = useRef<number[]>([]);

  const onDragStart = (index: number, e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault(); // Prevent text selection
    dragIndex.current = index;
    dragStartX.current = e.clientX;
    dragStartWidths.current = [...colorWidths];
    window.addEventListener('mousemove', onDragMove);
    window.addEventListener('mouseup', onDragEnd);
  };

  const onDragMove = (e: MouseEvent) => {
    if (dragIndex.current === null) return;
    const idx = dragIndex.current;
    const deltaX = e.clientX - dragStartX.current;
    const container = document.getElementById('palette-preview');
    if (!container) return;
    const containerWidth = container.offsetWidth;
    const totalFlex = dragStartWidths.current.reduce((a, b) => a + b, 0);
    const deltaFlex = (deltaX / containerWidth) * totalFlex;
    let left = dragStartWidths.current[idx] + deltaFlex;
    let right = dragStartWidths.current[idx + 1] - deltaFlex;
    // Clamp to min flex
    if (left < MIN_FLEX) {
      right -= (MIN_FLEX - left);
      left = MIN_FLEX;
    }
    if (right < MIN_FLEX) {
      left -= (MIN_FLEX - right);
      right = MIN_FLEX;
    }
    const newWidths = [...dragStartWidths.current];
    newWidths[idx] = left;
    newWidths[idx + 1] = right;
    setColorWidths([...newWidths]);
  };

  const onDragEnd = () => {
    dragIndex.current = null;
    window.removeEventListener('mousemove', onDragMove);
    window.removeEventListener('mouseup', onDragEnd);
  };

  return { onDragStart };
}

export function useHeightDrag(
  previewHeight: number,
  setPreviewHeight: (height: number) => void
) {
  const heightDragStartY = useRef<number>(0);
  const heightDragStart = useRef<number>(200);

  const onHeightDragStart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    heightDragStartY.current = e.clientY;
    heightDragStart.current = previewHeight;
    window.addEventListener('mousemove', onHeightDragMove);
    window.addEventListener('mouseup', onHeightDragEnd);
  };

  const onHeightDragMove = (e: MouseEvent) => {
    const deltaY = e.clientY - heightDragStartY.current;
    let newHeight = heightDragStart.current + deltaY;
    newHeight = Math.max(120, Math.min(400, newHeight));
    setPreviewHeight(newHeight);
  };

  const onHeightDragEnd = () => {
    window.removeEventListener('mousemove', onHeightDragMove);
    window.removeEventListener('mouseup', onHeightDragEnd);
  };

  return { onHeightDragStart };
} 