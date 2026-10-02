import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import path from "path";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    svgr({ exportAsDefault: true }),
  ],
  resolve: {
    alias: {
      assets: path.resolve(__dirname, "./src/assets"),
      components: path.resolve(__dirname, "./src/components"),
      fonts: path.resolve(__dirname, "./assets/fonts"),
      images: path.resolve(__dirname, "./assets/images"),
      utils: path.resolve(__dirname, "./src/utils"),
      pages: path.resolve(__dirname, "./src/pages"),
    }
  }
})
