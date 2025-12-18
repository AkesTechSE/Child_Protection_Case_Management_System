import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
  plugins: [react()],

  // 🔹 Local development only
  server: command === 'serve' ? {
    port: 3000,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      }
    }
  } : undefined,

  // 🔹 Production build
  build: {
    outDir: '../public/build',
    emptyOutDir: true,
    manifest:true,
  },

  // 🔹 Required for production
  base: '/build/',
}))

