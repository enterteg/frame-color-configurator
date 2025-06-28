import { GradientSettings, GradientColorStop } from '../types/bike';
import { ralColors } from '../data/ralColors';
import { applyGammaToHex } from './colorCorrections';

/**
 * Generates a gradient as HTMLImageElement from GradientSettings
 * This can be used as a texture in both Konva and texture generation
 */
export async function generateGradientImage({
  width,
  height,
  gradient
}: {
  width: number;
  height: number;
  gradient: GradientSettings;
}): Promise<HTMLImageElement> {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  let canvasGradient: CanvasGradient;

  if (gradient.type === 'linear') {
    // Calculate gradient coordinates based on direction
    let x0 = 0, y0 = 0, x1 = 0, y1 = 0;
    
    switch (gradient.direction) {
      case 'horizontal':
        x0 = 0; y0 = height / 2;
        x1 = width; y1 = height / 2;
        break;
      case 'vertical':
        x0 = width / 2; y0 = 0;
        x1 = width / 2; y1 = height;
        break;
      case 'diagonal-tl-br':
        x0 = 0; y0 = 0;
        x1 = width; y1 = height;
        break;
      case 'diagonal-tr-bl':
        x0 = width; y0 = 0;
        x1 = 0; y1 = height;
        break;
    }
    
    canvasGradient = ctx.createLinearGradient(x0, y0, x1, y1);
  } else if (gradient.type === 'radial') {
    // Create radial gradient
    const centerX = gradient.centerX * width;
    const centerY = gradient.centerY * height;
    const radiusX = gradient.radiusX * width;
    const radiusY = gradient.radiusY * height;
    
    // Use average radius for circular gradient (HTML5 Canvas doesn't support elliptical gradients)
    const radius = Math.max(radiusX, radiusY);
    canvasGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
  } else if (gradient.type === 'conic') {
    // Conic gradients require modern browser support
    // For broader compatibility, we'll create a simulated conic gradient using linear segments
    return generateConicGradientImage({ width, height, gradient });
  } else {
    throw new Error(`Unsupported gradient type: ${gradient.type}`);
  }

  // Add color stops based on transition type
  if (gradient.transition === 'hard-stop') {
    // For hard stops, add each color twice at the same position
    gradient.colorStops.forEach((stop, index) => {
      const hexColor = applyGammaToHex(stop.color?.hex || '#ffffff');
      
      if (index > 0) {
        // Add the previous color just before this position
        const prevStop = gradient.colorStops[index - 1];
        const prevHexColor = applyGammaToHex(prevStop.color?.hex || '#ffffff');
        canvasGradient.addColorStop(Math.max(0, stop.position - 0.001), prevHexColor);
      }
      
      canvasGradient.addColorStop(stop.position, hexColor);
    });
  } else if (gradient.transition === 'stepped') {
    // For stepped transitions, create distinct bands
    gradient.colorStops.forEach((stop, index) => {
      const hexColor = applyGammaToHex(stop.color?.hex || '#ffffff');
      
      if (index < gradient.colorStops.length - 1) {
        const nextStop = gradient.colorStops[index + 1];
        const midPoint = (stop.position + nextStop.position) / 2;
        
        canvasGradient.addColorStop(stop.position, hexColor);
        canvasGradient.addColorStop(midPoint - 0.001, hexColor);
        canvasGradient.addColorStop(midPoint, hexColor);
      } else {
        canvasGradient.addColorStop(stop.position, hexColor);
      }
    });
  } else if (gradient.transition === 'ease-in') {
    // For ease-in, adjust color stop positions to create easing effect
    gradient.colorStops.forEach((stop) => {
      const hexColor = applyGammaToHex(stop.color?.hex || '#ffffff');
      
      // Apply ease-in curve (quadratic)
      const easedPosition = stop.position * stop.position;
      canvasGradient.addColorStop(easedPosition, hexColor);
    });
  } else if (gradient.transition === 'ease-out') {
    // For ease-out, adjust color stop positions to create easing effect
    gradient.colorStops.forEach((stop) => {
      const hexColor = applyGammaToHex(stop.color?.hex || '#ffffff');
      
      // Apply ease-out curve (inverse quadratic)
      const easedPosition = 1 - Math.pow(1 - stop.position, 2);
      canvasGradient.addColorStop(easedPosition, hexColor);
    });
  } else {
    // Default smooth transition
    gradient.colorStops.forEach(stop => {
      const hexColor = applyGammaToHex(stop.color?.hex || '#ffffff');
      canvasGradient.addColorStop(stop.position, hexColor);
    });
  }

  // Apply gradient
  ctx.fillStyle = canvasGradient;
  ctx.fillRect(0, 0, width, height);

  // Convert canvas to image
  const image = new Image();
  image.src = canvas.toDataURL('image/png', 1.0);
  
  return new Promise((resolve) => {
    image.onload = () => resolve(image);
  });
}

/**
 * Generates a conic gradient using multiple linear gradients for compatibility
 */
async function generateConicGradientImage({
  width,
  height,
  gradient
}: {
  width: number;
  height: number;
  gradient: GradientSettings;
}): Promise<HTMLImageElement> {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, width, height);

  const centerX = gradient.centerX * width;
  const centerY = gradient.centerY * height;
  const radius = Math.max(width, height);

  // Create multiple linear gradients to simulate conic gradient
  const segments = 360; // Number of degree segments
  
  for (let angle = 0; angle < 360; angle += 360 / segments) {
    const startAngle = (angle + gradient.angle) * Math.PI / 180;
    const endAngle = (angle + gradient.angle + 360 / segments) * Math.PI / 180;
    
    // Calculate color for this angle
    const normalizedAngle = (angle % 360) / 360;
    const color = interpolateGradientColor(gradient.colorStops, normalizedAngle);
    
    // Draw pie segment
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();
    const hexColor = applyGammaToHex(color?.hex || '#ffffff');
    ctx.fillStyle = hexColor;
    ctx.fill();
  }

  // Convert canvas to image
  const image = new Image();
  image.src = canvas.toDataURL('image/png', 1.0);
  
  return new Promise((resolve) => {
    image.onload = () => resolve(image);
  });
}

/**
 * Interpolates color from gradient color stops at given position
 */
function interpolateGradientColor(colorStops: GradientColorStop[], position: number): { hex: string } {
  // Sort color stops by position
  const sortedStops = [...colorStops].sort((a, b) => a.position - b.position);
  
  // Find the two stops to interpolate between
  let beforeStop = sortedStops[0];
  let afterStop = sortedStops[sortedStops.length - 1];
  
  for (let i = 0; i < sortedStops.length - 1; i++) {
    if (position >= sortedStops[i].position && position <= sortedStops[i + 1].position) {
      beforeStop = sortedStops[i];
      afterStop = sortedStops[i + 1];
      break;
    }
  }
  
  // If position is exactly at a stop, return that color
  if (beforeStop.position === afterStop.position) {
    return { hex: applyGammaToHex(beforeStop.color.hex) };
  }
  
  // Interpolate between the two colors
  const ratio = (position - beforeStop.position) / (afterStop.position - beforeStop.position);
  const interpolatedHex = interpolateHexColors(beforeStop.color.hex, afterStop.color.hex, ratio);
  return { hex: applyGammaToHex(interpolatedHex) };
}

/**
 * Interpolates between two hex colors
 */
function interpolateHexColors(color1: string, color2: string, ratio: number): string {
  const r1 = parseInt(color1.slice(1, 3), 16);
  const g1 = parseInt(color1.slice(3, 5), 16);
  const b1 = parseInt(color1.slice(5, 7), 16);
  
  const r2 = parseInt(color2.slice(1, 3), 16);
  const g2 = parseInt(color2.slice(3, 5), 16);
  const b2 = parseInt(color2.slice(5, 7), 16);
  
  const r = Math.round(r1 + (r2 - r1) * ratio);
  const g = Math.round(g1 + (g2 - g1) * ratio);
  const b = Math.round(b1 + (b2 - b1) * ratio);
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Creates a default gradient configuration
 */
export function createDefaultGradient(): GradientSettings {
  // Use beige (RAL 1001) and yellow (RAL 1003) as default colors
  const beigeColor = ralColors['1001']; // RAL 1001 Beige
  const yellowColor = ralColors['1003']; // RAL 1003 Signal yellow
  
  return {
    id: `gradient_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    enabled: true,
    type: 'linear',
    direction: 'vertical',
    transition: 'smooth',
    centerX: 0.5,
    centerY: 0.5,
    radiusX: 0.5,
    radiusY: 0.5,
    angle: 0,
    colorStops: [
      { color: beigeColor, position: 0 },
      { color: yellowColor, position: 1 }
    ],
    blendMode: 'normal'
  };
} 