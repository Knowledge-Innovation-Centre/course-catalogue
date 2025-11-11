// Theme configuration - easily change colors, logo, and font for the entire app

export const theme = {
  // Colors
  colors: {
    primary: '#0b223b',
    primaryHover: '#0a1d31',
    secondary: '#1c64f2',
    secondaryHover: '#1e5cdb',
    background: '#f9fafb',
    white: '#ffffff',
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
    url: 'http://localhost:3845/assets/c2fe6cf42b161442b1536ac771602631d89136a7.png',
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
  '--color-secondary': theme.colors.secondary,
  '--color-secondary-hover': theme.colors.secondaryHover,
  '--color-background': theme.colors.background,
  '--font-primary': theme.fonts.primary,
});
