// utils/light-theme-overrides.ts
import type { GlobalThemeOverrides } from 'naive-ui';

export const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#22c55e', // emerald-600, slightly darker for light theme
    primaryColorHover: '#16a34a', // emerald-700 for hover states
    primaryColorPressed: '#15803d', // emerald-800 for pressed states

    infoColor: '#2563eb', // blue-600 from the design
    infoColorHover: '#1d4ed8', // blue-700 for hover
    infoColorPressed: '#1e40af', // blue-800 for pressed

    borderRadius: '8px',
  },

  Button: {
    textColorPrimary: '#ffffff',
    textColorHoverPrimary: '#ffffff',
    textColorPressedPrimary: '#ffffff',
    textColorFocusPrimary: '#ffffff',

    colorOpacitySecondary: '0.1',
    colorOpacitySecondaryHover: '0.15',
    colorOpacitySecondaryPressed: '0.2',
  },

  Card: {
    color: '#ffffff', // card background for light theme
    colorModal: '#ffffff',
    colorPopover: '#ffffff',
    colorEmbedded: '#f9fafb', // very light gray for embedded
    colorTarget: '#22c55e',

    borderColor: '#e5e7eb', // gray-200 for card borders
    borderColorModal: '#e5e7eb',
    borderColorPopover: '#e5e7eb',

    boxShadow:
      '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  },

  Input: {
    color: '#ffffff', // white background
    colorFocus: '#ffffff',
    colorDisabled: '#f9fafb',

    border: '1px solid #d1d5db', // gray-300
    borderHover: '1px solid rgba(34, 197, 94, 0.5)', // emerald-600 with opacity
    borderFocus: '1px solid #22c55e', // emerald-600

    borderRadius: '6px',

    placeholderColor: 'rgba(107, 114, 128, 0.6)', // gray-500 with opacity
  },

  Select: {
    peers: {
      InternalSelection: {
        textColor: '#374151', // gray-700 for text
        placeholderColor: 'rgba(107, 114, 128, 0.6)', // gray-500 with opacity
      },
      InternalSelectMenu: {
        color: '#ffffff', // white bg for dropdown
      },
    },
  },

  Tag: {
    borderRadius: '16px',
    textColorSuccess: '#22c55e', // emerald-600
    colorCheckboxChecked: '#22c55e', // emerald-600
  },

  Menu: {
    borderRadius: '8px',
    itemTextColor: '#374151', // gray-700 for menu items
    itemTextColorHover: '#22c55e', // emerald-600 for hover
    itemTextColorActive: '#22c55e', // emerald-600 for active
    itemColorActive: 'rgba(34, 197, 94, 0.1)', // emerald-600 with 10% opacity
    itemColorActiveHover: 'rgba(34, 197, 94, 0.15)', // emerald-600 with 15% opacity
    arrowColor: '#6b7280', // gray-500
  },

  Switch: {
    railColor: '#d1d5db', // gray-300
    railColorActive: '#22c55e', // emerald-600
  },

  Form: {
    feedbackFontSizeSmall: '12px',
    feedbackFontSizeMedium: '14px',
    feedbackFontSizeLarge: '14px',
    feedbackHeightSmall: '1.25em',
    feedbackHeightMedium: '1.25em',
    feedbackHeightLarge: '1.25em',
    feedbackTextColorError: '#dc2626', // red-600 for errors
  },
};
