import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import config from "./local.config.ts";

// https://vite.dev/config/
export default defineConfig(({  }) => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      tsconfigPaths: true,
    },
    server: {
      port: Number(config.VITE_PORT) || 8080,
      host: true,
      watch: {
        usePolling: true,
      },
      allowedHosts: [config.VITE_BACKEND_HOST],
      hmr: {
        host: "localhost",
        port: Number(config.VITE_PORT) || 8080,
      },
      proxy: {
        "/api": {
          target:
            "http://" +
            config.VITE_BACKEND_HOST +
            ":" +
            config.VITE_BACKEND_PORT,
          changeOrigin: true,
        },
      },
    },
  };
});
