"use client";

import { useTextureProcessingManager } from "../hooks/useTextureProcessingManager";

/**
 * Provider component that initializes texture processing
 * This component handles all automatic texture processing and generation
 */
export function TextureProcessingProvider() {
  useTextureProcessingManager();
  
  // This component doesn't render anything, it just initializes the texture processing
  return null;
} 