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
        "ocean-blue": "#1E3A5F",
        turquoise: "#33A8B1",
        "warm-yellow": "#FFCC00",
        "light-gray": "#F4F4F4",
        "emerald-green": "#2E8B57",
      },
    },
  },
  plugins: [],
};
export default config;
