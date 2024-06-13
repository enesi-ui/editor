/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";
import typo from "@tailwindcss/typography";

export default {
  content: ["./src/**/*.tsx"],
  plugins: [typo, daisyui],
  daisyui: {
    themes: ["dim"],
  },
};
