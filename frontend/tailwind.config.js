/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0B1120",
          soft: "#111A2E",
          card: "#151F38",
          line: "#233152",
        },
        paper: "#F6F3EC",
        gold: {
          DEFAULT: "#F0A93C",
          soft: "#FFD98E",
          deep: "#C9791E",
        },
        sprout: {
          DEFAULT: "#37B58A",
          soft: "#8FE3C4",
          deep: "#1F7A5C",
        },
        nebula: {
          DEFAULT: "#8B7FF5",
          soft: "#C4BDFB",
        },
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "star-field": "radial-gradient(circle at 20% 20%, rgba(240,169,60,0.10), transparent 40%), radial-gradient(circle at 80% 0%, rgba(139,127,245,0.12), transparent 45%), radial-gradient(circle at 50% 100%, rgba(55,181,138,0.10), transparent 40%)",
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(240,169,60,0.35)",
        card: "0 20px 60px -20px rgba(0,0,0,0.5)",
      },
      keyframes: {
        drift: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: 0.5, transform: "scale(1)" },
          "50%": { opacity: 1, transform: "scale(1.15)" },
        },
        dash: {
          to: { strokeDashoffset: 0 },
        },
        floatSlow: {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
          "50%": { transform: "translate(20px, -30px) scale(1.05)" },
        },
        floatSlower: {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
          "50%": { transform: "translate(-25px, 25px) scale(1.08)" },
        },
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        fadeInUp: {
          "0%": { opacity: 0, transform: "translateY(14px)" },
          "100%": { opacity: 1, transform: "translateY(0px)" },
        },
        spinSlow: {
          to: { transform: "rotate(360deg)" },
        },
        shine: {
          "0%": { transform: "translateX(-120%) skewX(-15deg)" },
          "100%": { transform: "translateX(220%) skewX(-15deg)" },
        },
        bob: {
          "0%, 100%": { transform: "translateY(0px) rotate(-1deg)" },
          "50%": { transform: "translateY(-14px) rotate(1deg)" },
        },
        bobFast: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-9px)" },
        },
        ringPulse: {
          "0%, 100%": { transform: "scale(1)", opacity: 0.55 },
          "50%": { transform: "scale(1.18)", opacity: 0.15 },
        },
        orbGlow: {
          "0%, 100%": { opacity: 0.5, transform: "scale(0.95)" },
          "50%": { opacity: 0.9, transform: "scale(1.08)" },
        },
      },
      animation: {
        drift: "drift 6s ease-in-out infinite",
        pulseGlow: "pulseGlow 2.4s ease-in-out infinite",
        floatSlow: "floatSlow 9s ease-in-out infinite",
        floatSlower: "floatSlower 13s ease-in-out infinite",
        gradientShift: "gradientShift 8s ease infinite",
        shimmer: "shimmer 2.5s linear infinite",
        fadeInUp: "fadeInUp 0.6s ease-out both",
        spinSlow: "spinSlow 12s linear infinite",
        shine: "shine 1.4s ease-in-out infinite",
        bob: "bob 6s ease-in-out infinite",
        bobFast: "bobFast 4s ease-in-out infinite",
        ringPulse: "ringPulse 2.8s ease-in-out infinite",
        orbGlow: "orbGlow 3.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}
