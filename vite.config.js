import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";


export default defineConfig({
  base: "/diplom_frontend/",
  plugins: [react()],
  server: {
    proxy: {
      "/academy": "https://diplombackend-production-fbcf.up.railway.app",
      "/auth": "https://diplombackend-production-fbcf.up.railway.app",
    },
  },
});
