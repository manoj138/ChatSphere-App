import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/src/services/api.js') || id.includes('\\src\\services\\api.js')) return 'api'
          if (id.includes('node_modules/axios')) return 'api'
          if (id.includes('node_modules/zustand')) return 'zustand'
          if (id.includes('node_modules/react-hot-toast')) return 'toast'
        },
      },
    },
  },
})
