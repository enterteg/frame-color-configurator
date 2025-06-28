/**
 * Applies gamma correction to a hex color based on its brightness
 * Darkens light colors and lightens dark colors for better visual appearance
 */
export function applyGammaToHex(hex: string): string {
  // Convert hex to RGB [0,1]
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const avg = (r + g + b) / 3;
  let gamma = 1;
  if (avg > 0.7) gamma = 1.1; // darken
  else if (avg < 0.3) gamma = 0.9; // lighten
  // Apply gamma correction
  const r2 = Math.pow(r, gamma);
  const g2 = Math.pow(g, gamma);
  const b2 = Math.pow(b, gamma);
  // Convert back to hex
  const toHex = (c: number) => {
    const h = Math.round(c * 255).toString(16).padStart(2, '0');
    return h;
  };
  return `#${toHex(r2)}${toHex(g2)}${toHex(b2)}`;
} 