import { ralColorGroups } from '../data/ralColors';

// Helper function to get the main color for each group
export const getGroupMainColor = (groupName: string): string => {
  const group = ralColorGroups.find(g => g.name === groupName);
  if (!group) return '#FFFFFF';
  
  // Return the first color's hex value for each group
  return group.colors[0].hex;
};

// Helper to determine if text should be black or white based on background color
export function getContrastTextColor(hex: string) {
  // Remove # if present
  hex = hex.replace('#', '');
  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? 'black' : 'white';
} 