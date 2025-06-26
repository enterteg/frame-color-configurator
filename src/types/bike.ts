import { RALColor } from '../data/ralColors';

// Bike component types
export interface BikeColors {
  frameColorId: string;
  forkColorId: string;
}

export interface TextureImage {
  id: string;
  // File-based properties (optional for URL-based logos)
  file?: File;
  blobUrl?: string;
  // URL-based properties (optional for file-based logos)
  url?: string;
  name?: string;
  // Position and sizing
  x: number;
  y: number;
  width?: number;  // For file-based system
  height?: number; // For file-based system
  scaleX?: number; // For URL-based system
  scaleY?: number; // For URL-based system
  scale?: number;  // For unified scaling
  rotation: number;
  // Color (unified as RALColor) - optional for frame textures
  color?: RALColor;
  // Processed image for texture generation
  processedImage?: HTMLImageElement;
  // Layer ordering
  zIndex: number;
}

export type LogoType = 'HEAD_TUBE' | 'DOWN_TUBE_LEFT' | 'DOWN_TUBE_RIGHT';

export interface BikeConfiguration {
  colors: BikeColors;
  logoImages: TextureImage[];
}

export type TabType = 'frame' | 'fork' | 'logos' | 'tires' | 'frameTexture' | null;
export type RimType = '35' | '50';
export type TireWallColor = 'black' | 'brown' | 'white' | 'light_brown'; 