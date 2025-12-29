// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Proxy any request starting with /api to the .NET backend
      "/api": {
        target: "https://localhost:7031",
        changeOrigin: true,
        secure: false    // allow self-signed cert on backend
      }
    }
  }
});
