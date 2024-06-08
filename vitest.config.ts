import {defineConfig} from 'vitest/config'
import { fileURLToPath, URL } from "url";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    root: __dirname,
    setupFiles: './src/tests/global.ts',
  },
  resolve: {
    alias: {
      "~": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
})
