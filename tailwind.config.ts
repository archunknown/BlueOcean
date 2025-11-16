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
      },
    },
  },
  plugins: [],
};
export default config;
