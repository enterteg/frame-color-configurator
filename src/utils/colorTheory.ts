import { RALColor } from '../data/ralColors';

// Convert hex to HSL
export function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [h * 360, s * 100, l * 100];
}

// Convert HSL to hex
export function hslToHex(h: number, s: number, l: number): string {
  h = h / 360;
  s = s / 100;
  l = l / 100;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  const toHex = (c: number) => {
    const hex = Math.round(c * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Calculate color distance in HSL space
export function colorDistance(color1: RALColor, color2: RALColor): number {
  const [h1, s1, l1] = hexToHsl(color1.hex);
  const [h2, s2, l2] = hexToHsl(color2.hex);

  // Hue distance (circular)
  const hueDiff = Math.min(Math.abs(h1 - h2), 360 - Math.abs(h1 - h2));
  
  // Weighted distance considering hue, saturation, and lightness
  return Math.sqrt(
    Math.pow(hueDiff / 180, 2) * 0.5 +
    Math.pow((s1 - s2) / 100, 2) * 0.3 +
    Math.pow((l1 - l2) / 100, 2) * 0.2
  );
}

// Color harmony types
export type HarmonyType = 
  | 'complementary' 
  | 'analogous' 
  | 'triadic' 
  | 'tetradic' 
  | 'monochromatic' 
  | 'splitComplementary'
  | 'similar';

// Get harmonious colors based on color theory
export function getHarmoniousColors(
  baseColor: RALColor, 
  allColors: RALColor[], 
  harmonyType: HarmonyType,
  tolerance: number = 30
): RALColor[] {
  const [baseH, baseS, baseL] = hexToHsl(baseColor.hex);
  
  const isHarmoniousHue = (targetH: number, expectedH: number): boolean => {
    const diff = Math.min(Math.abs(targetH - expectedH), 360 - Math.abs(targetH - expectedH));
    return diff <= tolerance;
  };

  return allColors.filter(color => {
    if (color.code === baseColor.code) return false;
    
    const [h, s, l] = hexToHsl(color.hex);
    
    switch (harmonyType) {
      case 'complementary':
        // Colors opposite on the color wheel (180° apart)
        const complementaryH = (baseH + 180) % 360;
        return isHarmoniousHue(h, complementaryH);
        
      case 'analogous':
        // Colors adjacent on the color wheel (±30° to ±60°)
        const analogous1 = (baseH + 30) % 360;
        const analogous2 = (baseH - 30 + 360) % 360;
        const analogous3 = (baseH + 60) % 360;
        const analogous4 = (baseH - 60 + 360) % 360;
        return isHarmoniousHue(h, analogous1) || 
               isHarmoniousHue(h, analogous2) ||
               isHarmoniousHue(h, analogous3) || 
               isHarmoniousHue(h, analogous4);
        
      case 'triadic':
        // Colors 120° apart on the color wheel
        const triadic1 = (baseH + 120) % 360;
        const triadic2 = (baseH + 240) % 360;
        return isHarmoniousHue(h, triadic1) || isHarmoniousHue(h, triadic2);
        
      case 'tetradic':
        // Colors forming a rectangle on the color wheel (90° apart)
        const tetradic1 = (baseH + 90) % 360;
        const tetradic2 = (baseH + 180) % 360;
        const tetradic3 = (baseH + 270) % 360;
        return isHarmoniousHue(h, tetradic1) || 
               isHarmoniousHue(h, tetradic2) || 
               isHarmoniousHue(h, tetradic3);
        
      case 'splitComplementary':
        // Base color plus two colors adjacent to its complement
        const complement = (baseH + 180) % 360;
        const splitComp1 = (complement + 30) % 360;
        const splitComp2 = (complement - 30 + 360) % 360;
        return isHarmoniousHue(h, splitComp1) || isHarmoniousHue(h, splitComp2);
        
      case 'monochromatic':
        // Same hue, different saturation/lightness
        const hueDiff = Math.min(Math.abs(h - baseH), 360 - Math.abs(h - baseH));
        return hueDiff <= 15 && (Math.abs(s - baseS) > 10 || Math.abs(l - baseL) > 10);
        
      case 'similar':
        // Colors with similar properties (close in HSL space)
        return colorDistance(baseColor, color) < 0.3;
        
      default:
        return false;
    }
  });
}

// Get all harmonious colors for multiple selected colors
export function getHarmoniousColorsForPalette(
  selectedColors: RALColor[],
  allColors: RALColor[],
  harmonyType: HarmonyType,
  tolerance: number = 30
): RALColor[] {
  if (selectedColors.length === 0) return [];
  
  const harmoniousColors = new Set<RALColor>();
  
  selectedColors.forEach(baseColor => {
    const harmonious = getHarmoniousColors(baseColor, allColors, harmonyType, tolerance);
    harmonious.forEach(color => harmoniousColors.add(color));
  });
  
  // Remove already selected colors
  const selectedCodes = new Set(selectedColors.map(c => c.code));
  return Array.from(harmoniousColors).filter(color => !selectedCodes.has(color.code));
}

// Get color temperature classification
export function getColorTemperature(color: RALColor): 'warm' | 'cool' | 'neutral' {
  const [h] = hexToHsl(color.hex);
  
  if (h >= 0 && h < 60) return 'warm'; // Red-Orange-Yellow
  if (h >= 60 && h < 120) return 'warm'; // Yellow-Green
  if (h >= 120 && h < 180) return 'cool'; // Green
  if (h >= 180 && h < 240) return 'cool'; // Cyan-Blue
  if (h >= 240 && h < 300) return 'cool'; // Blue-Purple
  if (h >= 300 && h < 360) return 'warm'; // Purple-Red
  
  return 'neutral';
}

// Filter colors by temperature
export function filterByTemperature(
  colors: RALColor[], 
  temperature: 'warm' | 'cool' | 'neutral'
): RALColor[] {
  return colors.filter(color => getColorTemperature(color) === temperature);
}

// Get color brightness level
export function getColorBrightness(color: RALColor): 'light' | 'medium' | 'dark' {
  const [, , l] = hexToHsl(color.hex);
  
  if (l > 70) return 'light';
  if (l > 30) return 'medium';
  return 'dark';
}

// Filter colors by brightness
export function filterByBrightness(
  colors: RALColor[], 
  brightness: 'light' | 'medium' | 'dark'
): RALColor[] {
  return colors.filter(color => getColorBrightness(color) === brightness);
}

// Get color saturation level
export function getColorSaturation(color: RALColor): 'high' | 'medium' | 'low' {
  const [, s] = hexToHsl(color.hex);
  
  if (s > 60) return 'high';
  if (s > 20) return 'medium';
  return 'low';
}

// Filter colors by saturation
export function filterBySaturation(
  colors: RALColor[], 
  saturation: 'high' | 'medium' | 'low'
): RALColor[] {
  return colors.filter(color => getColorSaturation(color) === saturation);
} 