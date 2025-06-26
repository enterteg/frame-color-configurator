'use client';

import { useTextureManager } from '../hooks/useTextureManager';

/**
 * Global texture manager component that handles all texture generation
 * automatically when any texture-affecting state changes.
 * 
 * This component has no UI - it only manages side effects.
 */
export function TextureManager() {
  useTextureManager();
  return null;
} 