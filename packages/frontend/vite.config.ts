import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    emptyOutDir: true,
    outDir: "../../dist/public"
  },
  server: {
    proxy: {
      "/api": "http://127.0.0.1:8080"
    }
  }
});
