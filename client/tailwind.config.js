// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Arial', 'sans-serif'],
      },
      colors: {
        primary: '#9370db',
        secondary: '#8a2be2',
        mystical: {
          dark: '#1a0933',
          medium: '#2a1045',
          light: '#3a1c5a',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'twinkle': 'twinkle 4s ease-in-out infinite',
        'float-y': 'float-y 6s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shine': 'shine 4s ease-in-out infinite',
        'flip': 'flip 1s ease-in-out',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: 0.2 },
          '50%': { opacity: 1 },
        },
        'float-y': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0) rotate(0)' },
          '25%': { transform: 'translateY(-8px) rotate(2deg)' },
          '75%': { transform: 'translateY(8px) rotate(-2deg)' },
        },
        'shine': {
          '0%': { transform: 'translateY(100%) rotate(35deg)' },
          '100%': { transform: 'translateY(-100%) rotate(35deg)' },
        },
        'flip': {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(180deg)' },
        },
        'glow': {
          '0%, 100%': { filter: 'brightness(1) drop-shadow(0 0 8px rgba(147, 112, 219, 0.5))' },
          '50%': { filter: 'brightness(1.2) drop-shadow(0 0 15px rgba(147, 112, 219, 0.8))' },
        },
      },
      letterSpacing: {
        'vn-tight': '-0.01em',
      },
      lineHeight: {
        'vn': '1.6',
      },
      backdropBlur: {
        xs: '2px',
      },
      transitionProperty: {
        'height': 'height',
        'transform-opacity': 'transform, opacity',
      },
      perspective: {
        '1000': '1000px',
      },
      transformStyle: {
        '3d': 'preserve-3d',
      },
      backfaceVisibility: {
        'hidden': 'hidden',
      },
      rotate: {
        'y-180': 'rotateY(180deg)',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.perspective-1000': {
          perspective: '1000px',
        },
        '.transform-style-3d': {
          transformStyle: 'preserve-3d',
        },
        '.backface-hidden': {
          backfaceVisibility: 'hidden',
        },
        '.rotate-y-180': {
          transform: 'rotateY(180deg)',
        },
        '.animation-delay-1000': {
          animationDelay: '1000ms',
        },
        '.animation-delay-2000': {
          animationDelay: '2000ms',
        },
        '.animation-delay-3000': {
          animationDelay: '3000ms',
        },
      };
      addUtilities(newUtilities);
    },
  ],
}