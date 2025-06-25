import React from 'react';
import { useBikeStore } from '../../store/useBikeStore';
import ColorPickerPanel from './ColorSelection';
import ImagePickerPanel from './ImagePickerPanel';

export default function SelectionPanel() {
  const { selectionPanelType } = useBikeStore();

  if (!selectionPanelType) return null;
  if (selectionPanelType === 'color') return <ColorPickerPanel />;
  if (selectionPanelType === 'image') return <ImagePickerPanel />;
  return null;
} 