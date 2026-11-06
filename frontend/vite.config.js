import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// During local development, /api requests are sent to the Express server
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    proxy: { "/api": "http://localhost:5000" }
  },
  preview: {
    proxy: { "/api": "http://localhost:5000" }
  }
});
