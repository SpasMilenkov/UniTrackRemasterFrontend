// stores/theme.ts
import { defineStore } from 'pinia';
import type { GlobalTheme, GlobalThemeOverrides } from 'naive-ui';
import { darkTheme, lightTheme } from 'naive-ui';
import { themeOverrides as darkThemeOverrides } from '../utils/dark-theme-overrides';
import { themeOverrides as lightThemeOverrides } from '../utils/light-theme-overrides';
import {
  accentColorMap,
  getAccentColorOverrides,
  getCssVariables,
  type ThemeType,
  type AccentColorType,
  type ColorSet,
} from '../utils/theme-utils';
import type { ThemeState } from '~/interfaces/theme/theme-state';



export const useThemeStore = defineStore('theme', {
  state: (): ThemeState => ({
    // Always start with defaults - we'll load from localStorage in initTheme
    currentTheme: 'dark',
    systemTheme: 'dark',
    accentColor: 'green',
    isInitialized: false,
  }),

  getters: {
    // Get the actual theme - resolves 'system' to either 'dark' or 'light'
    actualTheme: (state): 'dark' | 'light' => {
      if (state.currentTheme === 'system') {
        return state.systemTheme;
      }
      return state.currentTheme;
    },

    // Get the Naive UI theme object
    naiveTheme: (state): GlobalTheme => {
      // If using system theme, return based on detected system preference
      if (state.currentTheme === 'system') {
        return state.systemTheme === 'dark' ? darkTheme : lightTheme;
      }

      // Otherwise return based on explicit setting
      return state.currentTheme === 'dark' ? darkTheme : lightTheme;
    },

    // Get the Naive UI theme overrides
    naiveThemeOverrides(): GlobalThemeOverrides {
      // Get base theme overrides
      const baseOverrides =
        this.actualTheme === 'dark'
          ? { ...darkThemeOverrides }
          : { ...lightThemeOverrides };

      // Apply accent color adjustments
      return {
        ...baseOverrides,
        common: {
          ...baseOverrides.common,
          // Add color customizations based on accent color
          ...getAccentColorOverrides(this.accentColor, this.actualTheme),
        },
      };
    },

    // Get color values for the current theme and accent color
    themeColors(): ColorSet {
      return accentColorMap[this.accentColor].colors[this.actualTheme];
    },

    // Get CSS variables for the current theme and accent color
    cssVariables(): Record<string, string> {
      return getCssVariables(this.actualTheme, this.accentColor);
    },

    // Get the Tailwind classes for the current theme
    tailwindClasses(): string {
      return this.actualTheme === 'dark' ? 'dark' : 'light';
    },
  },

  actions: {
    // Load values from localStorage (client-side only)
    loadFromLocalStorage(): void {
      if (
        typeof window === 'undefined' ||
        typeof localStorage === 'undefined'
      ) {
        return;
      }

      try {
        // Load theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme && ['dark', 'light', 'system'].includes(savedTheme)) {
          this.currentTheme = savedTheme as ThemeType;
        }

        // Load accent color
        const savedAccentColor = localStorage.getItem('accentColor');
        const validColors: AccentColorType[] = [
          'green',
          'blue',
          'purple',
          'pink',
          'red',
          'amber',
          'teal',
        ];
        if (
          savedAccentColor &&
          validColors.includes(savedAccentColor as AccentColorType)
        ) {
          this.accentColor = savedAccentColor as AccentColorType;
        }
      } catch (error) {
        console.warn('Failed to load theme from localStorage:', error);
      }
    },

    // Set the theme explicitly
    setTheme(theme: ThemeType): void {
      // Validate theme option
      if (!['dark', 'light', 'system'].includes(theme)) {
        console.error('Invalid theme:', theme);
        return;
      }

      this.currentTheme = theme;

      // Apply Tailwind theme
      this.applyTailwindTheme();

      // Apply CSS variables
      this.applyCssVariables();

      // Save to localStorage (only in browser)
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('theme', theme);
      }
    },

    getDefaultThemeOverrides(): GlobalThemeOverrides {
      // Get base theme overrides for the default theme (dark)
      const baseOverrides = { ...darkThemeOverrides };

      // Apply default accent color overrides (green)
      return {
        ...baseOverrides,
        common: {
          ...baseOverrides.common,
          ...getAccentColorOverrides('green', 'dark'),
        },
      };
    },

    // Set the accent color
    setAccentColor(color: AccentColorType): void {
      // Validate color
      const validColors: AccentColorType[] = [
        'green',
        'blue',
        'purple',
        'pink',
        'red',
        'amber',
        'teal',
      ];
      if (!validColors.includes(color)) {
        console.error('Invalid accent color:', color);
        return;
      }

      this.accentColor = color;

      // Apply CSS variables
      this.applyCssVariables();

      // Save to localStorage (only in browser)
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('accentColor', color);
      }
    },

    // Apply CSS variables to the document root
    applyCssVariables(): void {
      // Skip for SSR
      if (typeof document === 'undefined') return;

      const variables = this.cssVariables;
      const html = document.documentElement;

      // Apply each CSS variable
      Object.entries(variables).forEach(([key, value]) => {
        html.style.setProperty(key, value);
      });

      // Also set RGB versions for rgba usage
      const colors = this.themeColors;

      // Helper function to convert hex to RGB
      const getRgbFromHex = (hex: string): string => {
        // Remove # if present
        hex = hex.replace('#', '');

        // Parse the hex values to RGB
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        return `${r}, ${g}, ${b}`;
      };

      // Set RGB versions
      html.style.setProperty(
        '--color-primary-rgb',
        getRgbFromHex(colors.primary)
      );
      html.style.setProperty(
        '--color-secondary-rgb',
        getRgbFromHex(colors.secondary)
      );
    },

    // Detect system theme preference
    detectSystemTheme(): void {
      // Skip for SSR
      if (typeof window === 'undefined') return;

      // Check for media query support
      if (window.matchMedia) {
        // Check if the dark-mode media query matches
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          this.systemTheme = 'dark';
        } else {
          this.systemTheme = 'light';
        }

        // Add listener for changes
        window
          .matchMedia('(prefers-color-scheme: dark)')
          .addEventListener('change', (e) => {
            this.systemTheme = e.matches ? 'dark' : 'light';

            // If currently using system theme, apply the changes
            if (this.currentTheme === 'system') {
              this.applyTailwindTheme();
              this.applyCssVariables();
            }
          });
      } else {
        // Default to dark if media queries not supported
        this.systemTheme = 'dark';
      }
    },

    // Apply Tailwind classes to document based on current theme
    applyTailwindTheme(): void {
      // Skip for SSR
      if (typeof document === 'undefined') return;

      const html = document.documentElement;

      // Remove existing theme classes
      html.classList.remove('dark', 'light');

      // Add appropriate class
      if (this.actualTheme === 'dark') {
        html.classList.add('dark');
      } else {
        html.classList.add('light');
      }
    },

    // Initialize theme from localStorage or system preference
    initTheme(): void {
      if (this.isInitialized) return;

      // First load from localStorage
      this.loadFromLocalStorage();

      // Detect system theme preference
      this.detectSystemTheme();

      // Apply theme to document
      this.applyTailwindTheme();

      // Apply CSS variables
      this.applyCssVariables();

      this.isInitialized = true;
    },
  },
});
  