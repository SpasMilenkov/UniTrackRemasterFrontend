export interface ThemeState {
  currentTheme: ThemeType;
  systemTheme: 'dark' | 'light';
  accentColor: AccentColorType;
  isInitialized: boolean;
}
