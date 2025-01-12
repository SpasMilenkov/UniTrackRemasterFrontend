import type { GlobalThemeOverrides } from 'naive-ui';

export const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#4ade80', // primary.DEFAULT
    primaryColorHover: '#86efac', // primary.light
    primaryColorPressed: '#22c55e', // primary.dark

    // Secondary colors
    infoColor: '#3b82f6', // secondary.DEFAULT
    infoColorHover: '#60a5fa', // secondary.light
    infoColorPressed: '#2563eb', // secondary.dark

    // Background colors
    baseColor: '#101014', // background.DEFAULT
    modalColor: '#18181c', // background.secondary
    cardColor: '#262629', // background.card

    // Text colors
    textColor1: '#f5f5f5', // text.primary
    textColor2: '#9ca3af', // text.secondary
    textColor3: 'rgba(156, 163, 175, 0.7)', // text.muted

    // Border colors
    borderColor: '#374151', // border.DEFAULT
  },
};
