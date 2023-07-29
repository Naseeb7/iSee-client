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
          '100%': { transform: 'translateY(0) , opacity : 1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(100%) ; opacity : 0' },
          '100%': { transform: 'translateX(0) , opacity : 1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(0) , opacity : 1' },
          '100%': { transform: 'translateX(100%) ; opacity : 0' },
        },
        Appear : {
          '0%': { opacity : '0' },
          '100%': { opacity : '1' },
        },

      },
      animation: {
        wiggle: 'wiggle .25s ease-in-out infinite',
        slideDown: 'slideDown .5s ease-in-out',
        slideLeft: 'slideLeft .5s ease-in-out',
        slideRight: 'slideRight .5s ease-in-out',
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

