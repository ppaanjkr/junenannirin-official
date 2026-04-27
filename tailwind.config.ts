import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        kanit: ["var(--font-kanit)"],
      },
      colors: {
        pinkAccent: "#ffe4ef",
        pinkSecondary: "#ff6fa3",
        textMain: "#2D3135",
        textSub: "#71767A"
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.08)",
        sm: "0 2px 8px rgba(255,143,182,.18)"
      },
      textColor: {
        accent: "#ffe4ef",
        secondary: "#ff6fa3",
        main: "#2D3135",
        sub: "#71767A"
      },
      keyframes: {
        pulseSoft: {
          '50%': {
            boxShadow: '0 0 0 8px rgba(255,111,163,0)',
          },
        },
      },
      animation: {
        pulseSoft: 'pulseSoft 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
export default config;
