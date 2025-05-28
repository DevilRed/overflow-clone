import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from "url";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
    // you might want to disable it, if you don't have tests that rely on CSS
    // since parsing CSS is slow
    //css: true,
    include: ["src/**/*.test.{js,jsx,ts,tsx}"],
    exclude: ["node_modules", "dist"],
    includeSource: ["src/**/*.{js,ts,vue}"], // Ensures Vitest includes sources
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  },
});
