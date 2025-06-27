import { useLogoTextureProcessing } from './useLogoTextureProcessing';
import { useFrameTextureProcessing } from './useFrameTextureProcessing';

/**
 * Manager hook that coordinates all texture processing
 * This should be used at the app level to ensure textures are always updated
 */
export function useTextureProcessingManager() {
  useLogoTextureProcessing();
  useFrameTextureProcessing();
} 