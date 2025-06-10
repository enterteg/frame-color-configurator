// Get the main color to represent a color group (first color in the group)
export function getGroupMainColor(groupName: string): string {
  // This would need to be implemented based on your color group structure
  // For now, return a default color based on group name
  switch (groupName) {
      case 'Yellows': return '#FFD700';  // Gold (better material representation)
      case 'Oranges': return '#FF7F50';  // Coral (avoids clay-like appearance)
      case 'Reds': return '#DC143C';     // Crimson (vibrant yet natural)
      case 'Violets': return '#8A2BE2';  // Blue Violet (web-safe standard)
      case 'Blues': return '#4169E1';    // Royal Blue (works well with Three.js lighting)
      case 'Greens': return '#228B22';   // Forest Green (natural material friendly)
      case 'Greys': return '#778899';    // Light Slate Gray (better contrast balance)
      case 'Browns': return '#8B4513';   // Saddle Brown (rich texture-friendly)
      case 'Whites & Blacks': return '#F8F9FA'; // Anti-flash White (avoids overexposure)
      default: return '#D3D3D3';         // Light Gray (neutral fallback)
  }
}

// Helper to determine if text should be black or white based on background color
export function getContrastTextColor(hexColor: string): string {
  // Remove # if present
  const color = hexColor.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black for light colors, white for dark colors
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
} 