/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  corePlugins: {
    preflight: false,
    // The layout uses the hand-written `.container` in index.css (a flat
    // 1300px max-width). Tailwind's own `.container` was shadowing it with a
    // stepped max-width (1280px up to 1536px, then 1536px), which made the
    // side gutters jump around and collapse to the 20px padding on wide
    // screens.
    container: false,
  },
  theme: {
    extend: {
      colors: {
        primary: "var(--primary-color)",
        title: "var(--title-color)",
        text: "var(--text-color)",
        muted: "var(--muted-color)",
        bg: "var(--bg-color)",
        "bg-alt": "var(--bg-color-alt)",
        container: "var(--container-color)",
        border: "var(--border-color)",
      },
      fontFamily: {
        body: ["var(--body-font)"],
        accent: ["var(--second-font)"],
      },
      boxShadow: {
        soft: "var(--shadow)",
        card: "var(--shadow-card)",
        "card-hover": "var(--shadow-card-hover)",
      },
      backgroundImage: {
        first: "var(--first-gradient)",
        second: "var(--second-gradient)",
        third: "var(--third-gradient)",
      },
      keyframes: {
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
        "scroll-hint": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(200%)" },
        },
      },
      animation: {
        "home-reveal": "home-reveal 0.9s var(--transition) forwards",
        "home-reveal-pop": "home-reveal-pop 1s var(--transition) forwards",
        "home-reveal-card-left":
          "home-reveal-card-left 0.85s var(--transition) forwards",
        "home-reveal-card-right":
          "home-reveal-card-right 0.85s var(--transition) forwards",
        "logo-scroll": "logo-scroll var(--logo-duration) linear infinite",
        "scroll-hint": "scroll-hint 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
