export const colors = {
  dark: {
    base: '#1C1A17',        // Charred timber
    surface: '#2A2520',      // Worn leather
    surfaceAlt: '#352F28',   // Aged pine
    card: '#3D362E',         // Bark brown
    primary: '#C8A96E',      // Wheat gold / firelight
    primaryMuted: '#9B8455', // Dusty gold
    accent: '#5B8C5A',       // Mountain pine green
    accentAlt: '#7FB069',    // Spring meadow
    danger: '#C75D3A',       // Campfire ember
    warning: '#D4A437',      // Lantern amber
    text: '#E8E0D4',         // Parchment white
    textMuted: '#9C9284',    // Weathered stone
    border: '#4A4238',       // Fence post
    topo: 'rgba(200,169,110,0.06)',
  },
  light: {
    base: '#F5F0E8',         // Birch paper
    surface: '#FFFFFF',       // Clean linen
    surfaceAlt: '#EDE7DC',
    card: '#FFFFFF',
    primary: '#A07D3A',
    primaryMuted: '#7A6030',
    accent: '#4A7A49',
    accentAlt: '#5B8C5A',
    danger: '#C75D3A',
    warning: '#D4A437',
    text: '#2A2520',
    textMuted: '#6B6358',
    border: '#D4CCBF',
    topo: 'rgba(100,85,55,0.05)',
  },
};

export type ColorScheme = typeof colors.dark;
export type ThemeMode = 'dark' | 'light';
