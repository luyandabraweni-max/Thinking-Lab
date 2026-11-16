import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// The platform app: one build for the web, iOS and Android (Capacitor wraps dist/).
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: { target: "es2020", outDir: "dist", sourcemap: true },
  // Port 3000 is Supabase's default return address for sign-in links, so links work without changing project settings.
  server: { port: 3000, strictPort: true }
});
