import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // base: "/college-api/",

  plugins: [tailwindcss()],

  base: "/test-project/",

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
