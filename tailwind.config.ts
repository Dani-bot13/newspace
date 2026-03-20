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
        myspace: {
          blue: "#003366",
          lightblue: "#336699",
          red: "#cc0000",
          orange: "#ff6600",
        },
      },
    },
  },
  plugins: [],
};
export default config;
