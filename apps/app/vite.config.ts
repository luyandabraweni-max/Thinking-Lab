import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// The platform app: one build for the web, iOS and Android (Capacitor wraps dist/).
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: { target: "es2020", outDir: "dist", sourcemap: true },
  server: { port: 5173, strictPort: true }
});
