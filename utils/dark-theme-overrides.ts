// utils/dark-theme-overrides.ts
import type { GlobalThemeOverrides } from 'naive-ui';

export const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#4ade80', // emerald-400 from the design
    primaryColorHover: '#22c55e', // emerald-600 for hover states
    primaryColorPressed: '#16a34a', // emerald-700 for pressed states

    infoColor: '#3b82f6', // blue-500 from the design
    infoColorHover: '#2563eb', // blue-600 for hover
    infoColorPressed: '#1d4ed8', // blue-700 for pressed

    borderRadius: '8px',
  },

  Button: {
    textColorPrimary: '#ffffff',
    textColorHoverPrimary: '#ffffff',
    textColorPressedPrimary: '#ffffff',
    textColorFocusPrimary: '#ffffff',

    colorOpacitySecondary: '0.15',
    colorOpacitySecondaryHover: '0.2',
    colorOpacitySecondaryPressed: '0.25',
  },

  Card: {
    color: '#18181c', // card background
    colorModal: '#18181c',
    colorPopover: '#18181c',
    colorEmbedded: '#18181c',
    colorTarget: '#4ade80',

    borderColor: '#374151', // border color for cards
    borderColorModal: '#374151',
    borderColorPopover: '#374151',

    boxShadow:
      '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  },

  Input: {
    color: '#101014', // main background
    colorFocus: '#101014',
    colorDisabled: '#262629',

    border: '1px solid #374151',
    borderHover: '1px solid rgba(74, 222, 128, 0.5)',
    borderFocus: '1px solid #4ade80',

    borderRadius: '6px',

    placeholderColor: 'rgba(156, 163, 175, 0.5)', // subtle gray text
  },

  Select: {
    peers: {
      InternalSelection: {
        textColor: '#f5f5f5',
        placeholderColor: 'rgba(156, 163, 175, 0.5)',
      },
      InternalSelectMenu: {
        color: '#18181c', // card bg for dropdown
      },
    },
  },

  Tag: {
    borderRadius: '16px',
    textColorSuccess: '#4ade80',
    colorCheckboxChecked: '#4ade80',
  },

  Menu: {
    borderRadius: '8px',
    itemTextColor: '#f5f5f5',
    itemTextColorHover: '#4ade80',
    itemTextColorActive: '#4ade80',
    itemColorActive: 'rgba(74, 222, 128, 0.1)',
    itemColorActiveHover: 'rgba(74, 222, 128, 0.15)',
    arrowColor: '#9ca3af',
  },

  Switch: {
    railColor: 'rgba(74, 222, 128, 0.2)',
    railColorActive: '#4ade80',
  },

  Form: {
    feedbackFontSizeSmall: '12px',
    feedbackFontSizeMedium: '14px',
    feedbackFontSizeLarge: '14px',
    feedbackHeightSmall: '1.25em',
    feedbackHeightMedium: '1.25em',
    feedbackHeightLarge: '1.25em',
    feedbackTextColorError: '#ef4444',
  },
};
