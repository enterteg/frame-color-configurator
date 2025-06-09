import { useState, useEffect } from 'react';
import { RALColor } from '../data/ralColors';

export function useColorPalette() {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedColors, setSelectedColors] = useState<RALColor[]>([]);
  const [colorWidths, setColorWidths] = useState<number[]>([]);
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);
  const [previewHeight, setPreviewHeight] = useState<number>(200);
  const [previewTextOpacity, setPreviewTextOpacity] = useState<number>(0.3);

  // Sync colorWidths with selectedColors
  useEffect(() => {
    if (selectedColors.length === 0) {
      setColorWidths([]);
    } else if (selectedColors.length !== colorWidths.length) {
      // Distribute widths equally
      setColorWidths(Array(selectedColors.length).fill(1));
    }
    // eslint-disable-next-line
  }, [selectedColors.length]);

  const handleGroupSelect = (groupName: string) => {
    setSelectedGroup(groupName);
  };

  const handleColorSelect = (color: RALColor) => {
    if (replaceIndex !== null) {
      // Replace color at replaceIndex
      setSelectedColors(selectedColors => {
        const newColors = [...selectedColors];
        newColors[replaceIndex] = color;
        return newColors;
      });
      setReplaceIndex(null);
    } else if (!selectedColors.some((c) => c.code === color.code)) {
      setSelectedColors([...selectedColors, color]);
    }
  };

  const handleColorRemove = (colorToRemove: RALColor) => {
    const idx = selectedColors.findIndex(c => c.code === colorToRemove.code);
    if (idx !== -1) {
      setSelectedColors(selectedColors.filter(color => color.code !== colorToRemove.code));
      setColorWidths(colorWidths.filter((_, i) => i !== idx));
    }
  };

  // Move color left
  const handleMoveLeft = (index: number) => {
    if (index > 0) {
      setSelectedColors((prev) => {
        const newColors = [...prev];
        const temp = newColors[index - 1];
        newColors[index - 1] = newColors[index];
        newColors[index] = temp;
        return newColors;
      });
    }
  };

  // Move color right
  const handleMoveRight = (index: number) => {
    if (index < selectedColors.length - 1) {
      setSelectedColors((prev) => {
        const newColors = [...prev];
        const temp = newColors[index + 1];
        newColors[index + 1] = newColors[index];
        newColors[index] = temp;
        return newColors;
      });
    }
  };

  return {
    // State
    selectedGroup,
    selectedColors,
    colorWidths,
    replaceIndex,
    previewHeight,
    previewTextOpacity,
    
    // Actions
    setColorWidths,
    setReplaceIndex,
    setPreviewHeight,
    setPreviewTextOpacity,
    handleGroupSelect,
    handleColorSelect,
    handleColorRemove,
    handleMoveLeft,
    handleMoveRight
  };
} 