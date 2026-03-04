/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        primary: "var(--primary-color)",
        title: "var(--title-color)",
        text: "var(--text-color)",
        bg: "var(--bg-color)",
        "bg-alt": "var(--bg-color-alt)",
        container: "var(--container-color)",
        border: "var(--border-color)",
      },
      borderColor: {
        border: "var(--border-color)",
      },
      fontFamily: {
        body: ["var(--body-font)"],
        accent: ["var(--second-font)"],
      },
      boxShadow: {
        soft: "var(--shadow)",
      },
      backgroundImage: {
        first: "var(--first-gradient)",
        second: "var(--second-gradient)",
        third: "var(--third-gradient)",
      },
      keyframes: {
        "header-animate": {
          "0%": { transform: "translateY(-100px)" },
          "100%": { transform: "translateY(0)" },
        },
        "home-reveal": {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "home-reveal-pop": {
          "0%": {
            opacity: "0",
            transform: "translateY(24px) scale(1.06)",
            filter: "blur(8px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0) scale(1)",
            filter: "blur(0)",
          },
        },
        "home-reveal-card-left": {
          "0%": {
            opacity: "0",
            transform: "translate3d(24px, 12px, 0) rotate(2deg)",
          },
          "100%": {
            opacity: "1",
            transform: "translate3d(0, 0, 0) rotate(0deg)",
          },
        },
        "home-reveal-card-right": {
          "0%": {
            opacity: "0",
            transform: "translate3d(-24px, 10px, 0) rotate(-2deg)",
          },
          "100%": {
            opacity: "1",
            transform: "translate3d(0, 0, 0) rotate(0deg)",
          },
        },
        "logo-scroll": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "pricing-border-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "header-animate": "header-animate 0.8s var(--transition) forwards",
        "home-reveal": "home-reveal 0.9s var(--transition) forwards",
        "home-reveal-pop": "home-reveal-pop 1s var(--transition) forwards",
        "home-reveal-card-left":
          "home-reveal-card-left 0.85s var(--transition) forwards",
        "home-reveal-card-right":
          "home-reveal-card-right 0.85s var(--transition) forwards",
        "logo-scroll": "logo-scroll var(--logo-duration) linear infinite",
        "pricing-border-spin": "pricing-border-spin 2.4s linear infinite",
      },
    },
  },
  plugins: [],
};
