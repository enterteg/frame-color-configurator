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

// Gradient types
export type GradientType = 'linear' | 'radial' | 'conic';
export type GradientDirection = 'horizontal' | 'vertical' | 'diagonal-tl-br' | 'diagonal-tr-bl' | 'diagonal-bl-tr' | 'diagonal-br-tl';
export type GradientTransition = 'smooth' | 'hard-stop' | 'stepped' | 'ease-in' | 'ease-out';

export interface GradientColorStop {
  color: RALColor; // RAL color instead of hex
  position: number; // 0-1
}

export interface GradientSettings {
  id: string;
  enabled: boolean;
  type: GradientType;
  direction: GradientDirection; // For linear gradients
  transition: GradientTransition; // How colors blend together
  centerX: number; // 0-1, for radial/conic gradients
  centerY: number; // 0-1, for radial/conic gradients
  radiusX: number; // 0-1, for radial gradients
  radiusY: number; // 0-1, for radial gradients
  angle: number; // 0-360, for conic gradients
  colorStops: GradientColorStop[];
  blendMode: 'normal' | 'multiply' | 'screen' | 'overlay' | 'soft-light' | 'hard-light';
}

export type LogoType = 'HEAD_TUBE' | 'DOWN_TUBE_LEFT' | 'DOWN_TUBE_RIGHT';

export interface BikeConfiguration {
  colors: BikeColors;
  logoImages: TextureImage[];
}

export type TabType = 'frame' | 'fork' | 'logos' | 'tires' | null;
export type RimType = '35' | '50';
export type TireWallColor = 'black' | 'brown' | 'white' | 'light_brown'; 