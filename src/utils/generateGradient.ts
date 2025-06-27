import { GradientSettings, GradientColorStop } from '../types/bike';

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

  // Add color stops
  gradient.colorStops.forEach(stop => {
    const color = `${stop.color}${Math.round(stop.opacity * 255).toString(16).padStart(2, '0')}`;
    canvasGradient.addColorStop(stop.position, color);
  });

  // Apply gradient
  ctx.globalAlpha = gradient.opacity;
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
    ctx.fillStyle = `${color}${Math.round(gradient.opacity * 255).toString(16).padStart(2, '0')}`;
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
function interpolateGradientColor(colorStops: GradientColorStop[], position: number): string {
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
    return beforeStop.color;
  }
  
  // Interpolate between the two colors
  const ratio = (position - beforeStop.position) / (afterStop.position - beforeStop.position);
  return interpolateHexColors(beforeStop.color, afterStop.color, ratio);
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
  return {
    id: `gradient_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    enabled: true,
    type: 'linear',
    direction: 'vertical',
    centerX: 0.5,
    centerY: 0.5,
    radiusX: 0.5,
    radiusY: 0.5,
    angle: 0,
    colorStops: [
      { color: '#ffffff', position: 0, opacity: 1 },
      { color: '#000000', position: 1, opacity: 1 }
    ],
    opacity: 1,
    blendMode: 'normal'
  };
} 