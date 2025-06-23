// utils/theme-utils.ts

/**
 * Type definitions for the theme system
 */

export type ThemeType = 'dark' | 'light' | 'system';
export type AccentColorType =
  | 'green'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'red'
  | 'amber'
  | 'teal';

export interface ColorSet {
  primary: string;
  'primary-hover': string;
  secondary: string;
  'secondary-hover': string;
}

export interface AccentColorOverrides {
  primaryColor: string;
  primaryColorHover: string;
  primaryColorPressed: string;
  infoColor: string;
  infoColorHover: string;
  infoColorPressed: string;
}

/**
 * Color definitions for each accent color and theme
 */
export const accentColorMap: Record<
  AccentColorType,
  {
    value: string;
    label: string;
    colors: {
      dark: ColorSet;
      light: ColorSet;
    };
  }
> = {
  green: {
    value: '#4ade80',
    label: 'Green',
    colors: {
      dark: {
        primary: '#4ade80',
        'primary-hover': '#22c55e',
        secondary: '#3b82f6',
        'secondary-hover': '#2563eb',
      },
      light: {
        primary: '#22c55e',
        'primary-hover': '#16a34a',
        secondary: '#2563eb',
        'secondary-hover': '#1d4ed8',
      },
    },
  },
  blue: {
    value: '#3b82f6',
    label: 'Blue',
    colors: {
      dark: {
        primary: '#3b82f6',
        'primary-hover': '#2563eb',
        secondary: '#6366f1',
        'secondary-hover': '#4f46e5',
      },
      light: {
        primary: '#2563eb',
        'primary-hover': '#1d4ed8',
        secondary: '#4f46e5',
        'secondary-hover': '#4338ca',
      },
    },
  },
  purple: {
    value: '#8b5cf6',
    label: 'Purple',
    colors: {
      dark: {
        primary: '#8b5cf6',
        'primary-hover': '#7c3aed',
        secondary: '#a855f7',
        'secondary-hover': '#9333ea',
      },
      light: {
        primary: '#7c3aed',
        'primary-hover': '#6d28d9',
        secondary: '#9333ea',
        'secondary-hover': '#7e22ce',
      },
    },
  },
  pink: {
    value: '#ec4899',
    label: 'Pink',
    colors: {
      dark: {
        primary: '#ec4899',
        'primary-hover': '#db2777',
        secondary: '#f472b6',
        'secondary-hover': '#e11d48',
      },
      light: {
        primary: '#db2777',
        'primary-hover': '#be185d',
        secondary: '#e11d48',
        'secondary-hover': '#be123c',
      },
    },
  },
  red: {
    value: '#ef4444',
    label: 'Red',
    colors: {
      dark: {
        primary: '#ef4444',
        'primary-hover': '#dc2626',
        secondary: '#f87171',
        'secondary-hover': '#ef4444',
      },
      light: {
        primary: '#dc2626',
        'primary-hover': '#b91c1c',
        secondary: '#ef4444',
        'secondary-hover': '#dc2626',
      },
    },
  },
  amber: {
    value: '#f59e0b',
    label: 'Amber',
    colors: {
      dark: {
        primary: '#f59e0b',
        'primary-hover': '#d97706',
        secondary: '#fbbf24',
        'secondary-hover': '#f59e0b',
      },
      light: {
        primary: '#d97706',
        'primary-hover': '#b45309',
        secondary: '#f59e0b',
        'secondary-hover': '#d97706',
      },
    },
  },
  teal: {
    value: '#14b8a6',
    label: 'Teal',
    colors: {
      dark: {
        primary: '#14b8a6',
        'primary-hover': '#0d9488',
        secondary: '#2dd4bf',
        'secondary-hover': '#14b8a6',
      },
      light: {
        primary: '#0d9488',
        'primary-hover': '#0f766e',
        secondary: '#14b8a6',
        'secondary-hover': '#0d9488',
      },
    },
  },
};

/**
 * Generate accent color overrides for Naive UI
 */
export function getAccentColorOverrides(
  accentColor: AccentColorType,
  theme: 'dark' | 'light'
): AccentColorOverrides {
  const colorSet = accentColorMap[accentColor].colors[theme];

  return {
    primaryColor: colorSet.primary,
    primaryColorHover: colorSet['primary-hover'],
    primaryColorPressed: colorSet['primary-hover'],
    infoColor: colorSet.secondary,
    infoColorHover: colorSet['secondary-hover'],
    infoColorPressed: colorSet['secondary-hover'],
  };
}

/**
 * Get CSS variables for the current theme and accent color
 */
export function getCssVariables(
  theme: 'dark' | 'light',
  accentColor: AccentColorType
): Record<string, string> {
  const colorSet = accentColorMap[accentColor].colors[theme];

  const baseVariables =
    theme === 'dark'
      ? {
          '--color-background': '#101014',
          '--color-background-secondary': '#262629',
          '--color-background-card': '#18181c',
          '--color-text-primary': '#f5f5f5',
          '--color-text-secondary': '#9ca3af',
          '--color-text-muted': 'rgba(156, 163, 175, 0.7)',
          '--color-border': '#374151',
        }
      : {
          '--color-background': '#ffffff',
          '--color-background-secondary': '#f9fafb',
          '--color-background-card': '#ffffff',
          '--color-text-primary': '#1f2937',
          '--color-text-secondary': '#4b5563',
          '--color-text-muted': 'rgba(75, 85, 99, 0.7)',
          '--color-border': '#e5e7eb',
        };

  return {
    ...baseVariables,
    '--color-primary': colorSet.primary,
    '--color-primary-hover': colorSet['primary-hover'],
    '--color-secondary': colorSet.secondary,
    '--color-secondary-hover': colorSet['secondary-hover'],
  };
}

