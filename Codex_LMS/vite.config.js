import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Relative base so a built bundle works when served from a subdirectory
  // rather than only from a domain root.
  base: "./",
  build: {
    outDir: "dist",
    // CoreApp.jsx is one ~370 KB module; the default 500 KB warning would
    // fire on every build with nothing useful to act on.
    chunkSizeWarningLimit: 1200,
  },
});
