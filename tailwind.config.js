/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-5deg)' },
          '50%': { transform: 'rotate(5deg)' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10%) ; opacity : 0' },
          '100%': { transform: 'translateY(0) ; opacity : 1' },
        },
        enterRight: {
          '0%': { transform: 'translateX(100%) ; opacity : 0' },
          '100%': { transform: 'translateX(0) ; opacity : 1' },
        },
        exitRight: {
          '0%': { transform: 'translateX(0) ; opacity : 1' },
          '100%': { transform: 'translateX(100%) ; opacity : 0' },
        },
        slideRightEnter: {
          '0%': { transform: 'translateX(100%) ; scale : 0.5' },
          '50%': { transform: 'translateX(0)' },
          '100%': { transform: 'scale(1)' },
        },
        slideRightExit: {
          '0%': { transform: 'translateX(0) ; scale : 1' },
          '50%': { transform: 'scale(0.5)' },
          '100%': { transform: 'translateX(100%)' },
        },
        slideLeftEnter: {
          '0%': { transform: 'translateX(-100%) ; scale : 0.5' },
          '50%': { transform: 'translateX(0)' },
          '100%': { transform: 'scale(1)' },
        },
        slideLeftExit: {
          '0%': { transform: 'translateX(0) ; scale : 1' },
          '50%': { transform: 'scale(0.5)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        Appear : {
          '0%': { opacity : '0' },
          '100%': { opacity : '1' },
        },

      },
      animation: {
        wiggle: 'wiggle .25s ease-in-out infinite',
        slideDown: 'slideDown .5s ease-in-out',
        enterRight: 'enterRight .5s ease-in-out',
        exitRight: 'exitRight .5s ease-in-out',
        slideRightEnter: 'slideRightEnter .7s ease-in-out',
        slideRightExit: 'slideRightExit .7s ease-in-out',
        slideLeftEnter: 'slideLeftEnter .7s ease-in-out',
        slideLeftExit: 'slideLeftExit .7s ease-in-out',
        Appear: 'Appear 1s ease-in-out',
        Disappear: 'Appear 1s ease-in-out alternate-reverse',
      },
      width : {
        "12" : "12%",
      }
    },
  },
  plugins: [],
}

