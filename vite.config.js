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
        target: "http://ecommerce-admin-backend.i-diligence.com",
        changeOrigin: true,
        secure: false    // allow self-signed cert on backend
      }
    }
  }
});
