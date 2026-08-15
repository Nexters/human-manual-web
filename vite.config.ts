import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // 운영 환경은 nginx가 같은 도메인에서 /api를 백엔드로 리버스 프록시해 CORS가 없음.
      // 로컬 dev 서버에도 동일하게 프록시해서 브라우저 CORS 제약을 우회한다.
      "/api": {
        target: "https://api.pakit.kr",
        changeOrigin: true,
      },
    },
  },
});
