import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  css: {
    preprocessorOptions: {
      css: {
        include: /node_modules\/@fortawesome/,
      },
    },
  },
  server: {
    hmr: {
      overlay: false,
    },
  },
})
