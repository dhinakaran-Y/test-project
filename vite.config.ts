import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // base: "/college-api/",

  plugins: [tailwindcss()],

  server: {
    proxy: {
      "/api": {
        target: "https://indian-colleges-list.vercel.app",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
