import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  return {
    plugins: [react()],
    server: {
      host: "127.0.0.1",
      port: 4174,
      proxy: { "/api": env.VITE_API_PROXY_TARGET || "http://localhost:8000" },
      fs: {
        deny: [
          ".env",
          ".env.*",
          "**/.git/**",
          "**/tmp/**",
          "**/.superpowers/**",
          "**/docs/**",
          "**/tests/**",
          "**/scripts/**",
          "**/AGENT.md",
        ],
      },
    },
    build: {
      rollupOptions: {
        input: {
          app: "index.html",
          demo: "demo.html",
          intake: "assets/intake-simulator.html",
        },
      },
      outDir: "dist",
      emptyOutDir: true,
    },
  };
});
