/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary, #4ade80)',
          light: 'var(--color-primary-light, #86efac)',
          dark: 'var(--color-primary-hover, #22c55e)', // Also used for hover states
        },
        secondary: {
          DEFAULT: 'var(--color-secondary, #3b82f6)',
          light: 'var(--color-secondary-light, #60a5fa)',
          dark: 'var(--color-secondary-hover, #2563eb)', // Also used for hover states
        },
        // Background colors
        background: {
          DEFAULT: 'var(--color-background, #101014)', // main background
          secondary: 'var(--color-background-secondary, #262629)', // secondary background
          card: 'var(--color-background-card, #18181c)', // card background
        },
        // Text colors
        text: {
          primary: 'var(--color-text-primary, #f5f5f5)',
          secondary: 'var(--color-text-secondary, #9ca3af)',
          muted: 'var(--color-text-muted, rgba(156, 163, 175, 0.7))',
        },
        // Border colors
        border: {
          DEFAULT: 'var(--color-border, #374151)',
          hover: 'var(--color-border-hover, rgba(74, 222, 128, 0.5))',
        },
      },
      backgroundColor: {
        'emerald-glow': 'rgba(var(--color-primary-rgb, 74, 222, 128), 0.1)',
        'blue-glow': 'rgba(var(--color-secondary-rgb, 59, 130, 246), 0.1)',
      },
      backgroundImage: {
        'gradient-primary':
          'linear-gradient(to right, var(--color-primary, #4ade80), var(--color-secondary, #3b82f6))',
      },
      blur: {
        '3xl': '64px',
      },
      opacity: {
        5: '0.05',
        10: '0.1',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'scale-in': 'scaleIn 0.3s ease-in-out',
        'gradient-shift': 'gradientShift 8s ease infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
        gradientShift: {
          '0%, 100%': {
            'background-position': '0% 50%',
          },
          '50%': {
            'background-position': '100% 50%',
          },
        },
      },
    },
  },
  plugins: [
    // Plugin to generate custom utilities for theme-related styling
    function ({ addUtilities }) {
      const newUtilities = {
        '.text-gradient': {
          'background-image':
            'linear-gradient(to right, var(--color-primary, #4ade80), var(--color-secondary, #3b82f6))',
          '-webkit-background-clip': 'text',
          'background-clip': 'text',
          color: 'transparent',
          display: 'inline-block',
        },
        '.bg-glass': {
          background: 'rgba(var(--color-background-card-rgb, 24, 24, 28), 0.7)',
          'backdrop-filter': 'blur(8px)',
          border: '1px solid rgba(var(--color-border-rgb, 55, 65, 81), 0.3)',
        },
        '.bg-glass-hover': {
          transition: 'all 0.3s ease',
          '&:hover': {
            background:
              'rgba(var(--color-background-card-rgb, 24, 24, 28), 0.9)',
            'border-color': 'rgba(var(--color-primary-rgb, 74, 222, 128), 0.3)',
          },
        },
        '.hover-elevate': {
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-3px)',
            'box-shadow':
              '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          },
        },
      };

      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
  // Use class strategy for dark mode to support our theme system
  darkMode: 'class',
};
