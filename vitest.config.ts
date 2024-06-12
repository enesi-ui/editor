import {defineConfig} from 'vitest/config'
import { fileURLToPath, URL } from "url";

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    root: __dirname,
    testTimeout: 60000,
  },
  resolve: {
    alias: {
      "~": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
})
