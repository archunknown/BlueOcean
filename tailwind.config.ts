import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        oceanBlue: "#1E3A5F",
        turquoise: "#33A8B1",
        warmYellow: "#FFCC00",
        lightGray: "#F4F4F4",
        emeraldGreen: "#2E8B57",
        danger: "#EF4444",
      },
      animation: {
        kenburns: 'kenburns 20s ease-out infinite alternate-reverse',
        'spin-slow': 'spin 6s linear infinite',
        scroll: 'scroll 40s linear infinite',
      },
      keyframes: {
        kenburns: {
          '0%': { transform: 'scale(1) translate(0, 0)' },
          '100%': { transform: 'scale(1.1) translate(-2%, 2%)' },
        },
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(calc(-250px * 7))' }, // Ajusta el número de items
        },
      },
    },
  },
  plugins: [],
};
export default config;
