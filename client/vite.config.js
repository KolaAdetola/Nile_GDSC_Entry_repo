import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5003,
    proxy: {
      '/api': {
        target : 'http://localhost: 5004',
        changeOrigin:  true,
      },
    },
  },
})
