/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui"

export default {
  content: ["./src/**/*.tsx"],
  plugins: [daisyui],
  daisyui: {
    themes: ['dim']
  }
};
