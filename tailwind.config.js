/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        // Brand colors
        primary: {
          DEFAULT: '#4ade80', // emerald-400 from the design
          light: '#86efac', // lighter variant for hover states
          dark: '#22c55e', // darker variant for active states
        },
        secondary: {
          DEFAULT: '#3b82f6', // blue-500 from the design
          light: '#60a5fa',
          dark: '#2563eb',
        },
        // Background colors
        background: {
          DEFAULT: '#101014', // main background
          secondary: '#262629', // secondary background
          card: '#18181c', // card background
        },
        // Text colors
        text: {
          primary: '#f5f5f5',
          secondary: '#9ca3af', // gray-400 equivalent
          muted: 'rgba(156, 163, 175, 0.7)', // reduced opacity gray
        },
        // Border colors
        border: {
          DEFAULT: '#374151', // gray-700 equivalent
          hover: 'rgba(74, 222, 128, 0.5)', // emerald-400 with 50% opacity
        },
      },
      backgroundColor: {
        'emerald-glow': 'rgba(74, 222, 128, 0.1)', // for glowing effects
        'blue-glow': 'rgba(59, 130, 246, 0.1)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, #4ade80, #3b82f6)',
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
      },
    },
  },
  plugins: [],
};
