import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Tailwind v4 plugs straight into Vite — no PostCSS config, no tailwind.config.js.
// This is part of the talk's point: Tailwind is a build-tool-native idea that
// belongs to the JS toolchain.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
