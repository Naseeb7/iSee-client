/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-5deg)" },
          "50%": { transform: "rotate(5deg)" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10%) ; opacity : 0" },
          "100%": { transform: "translateY(0) ; opacity : 1" },
        },
        slideUp: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-100%)" },
        },
        enterRight: {
          "0%": { transform: "translateX(100%) ; opacity : 0" },
          "100%": { transform: "translateX(0) ; opacity : 1" },
        },
        exitRight: {
          "0%": { transform: "translateX(0) ; opacity : 1" },
          "100%": { transform: "translateX(100%) ; opacity : 0" },
        },
        Appear: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleDown: {
          "0%": { transform: "scaleY(0)" },
          "100%": { transform: "scaleY(1)" },
        },
        scaleUp: {
          "0%": { transform: "scaleY(1)" },
          "100%": { transform: "scaleY(0)" },
        },
        slideUpAndBounce: {
          "0%": { transform: "translateY(70%)" },
          "60%": { transform: "translateY(-10%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
      animation: {
        wiggle: "wiggle .25s ease-in-out infinite",
        slideDown: "slideDown .5s ease-in-out",
        slideUp: "slideUp .5s ease-in-out",
        enterRight: "enterRight .5s ease-in-out",
        exitRight: "exitRight .5s ease-in-out",
        Appear: "Appear .5s ease-in-out",
        Disappear: "Appear .5s ease-in-out alternate-reverse",
        scaleDown: "scaleDown .5s ease-in-out",
        scaleUp: "scaleUp .5s ease-in-out",
        slideUpAndBounce: "slideUpAndBounce .4s ease-in-out",
        Blip: "Appear 1s steps(2,end) infinite",
      },
      width: {
        12: "12%",
      },
    },
  },
  plugins: [],
};
