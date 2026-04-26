import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const configuredTarget =
    env.VITE_PROXY_TARGET || env.VITE_API_BASE_URL || env.VITE_API_URL || "";

  // Vite proxy target should be backend origin (without /api suffix)
  const proxyTarget = configuredTarget
    ? configuredTarget.replace(/\/api\/?$/i, "")
    : "http://localhost:5000";

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        "/api": {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
