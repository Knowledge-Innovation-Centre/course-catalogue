// Theme configuration - easily change colors, logo, and font for the entire app
import logoImage from './assets/images/logo.png';

export const theme = {
  // Colors
  colors: {
    primary: '#0b223b',       // Dark blue — reserved for header/navbar only
    primaryHover: '#0a1d31',
    accent: '#50B2DA',        // Light blue — used for icons, filters, and interactive accents throughout the app
    accentHover: '#3ea0c7',
    secondary: '#1c64f2',
    secondaryHover: '#1e5cdb',
    background: '#f9fafb',
    white: '#ffffff',
    link: '#2563eb',          // Color for links and info icons
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2a37',
      900: '#111928',
    },
  },

  // Logo
  logo: {
    url: logoImage,
    name: 'QualityLink',
  },

  // Typography
  fonts: {
    primary: 'Inter, system-ui, -apple-system, sans-serif',
  },
};

// CSS custom properties for easy runtime theme changes
export const getCSSVariables = () => ({
  '--color-primary': theme.colors.primary,
  '--color-primary-hover': theme.colors.primaryHover,
  '--color-accent': theme.colors.accent,
  '--color-accent-hover': theme.colors.accentHover,
  '--color-secondary': theme.colors.secondary,
  '--color-secondary-hover': theme.colors.secondaryHover,
  '--color-background': theme.colors.background,
  '--font-primary': theme.fonts.primary,
});
