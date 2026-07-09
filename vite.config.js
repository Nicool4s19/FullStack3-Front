import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/usuarios": {
        target: "http://100.49.140.32",
        changeOrigin: true,
        secure: false,
      },
      "/cursos": {
        target: "http://100.49.140.32",
        changeOrigin: true,
        secure: false,
      },
      "/mensajes": {
        target: "http://100.49.140.32",
        changeOrigin: true,
        secure: false,
      },
      "/asignaturas": {
        target: "http://100.49.140.32",
        changeOrigin: true,
        secure: false,
      },
      "/reuniones": {
        target: "http://3.227.198.218:8089",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/reuniones/, ""),
      },
    },
  },
})