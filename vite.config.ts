import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/postcss' // <-- MUDANÇA AQUI
import autoprefixer from 'autoprefixer'

export default defineConfig({
  root: 'client', 
  
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },

  plugins: [react()],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
      '@shared': path.resolve(__dirname, './shared'),
    },
  },

  build: {
    outDir: '../dist',
  },

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path ) => path.replace(/^\/api/, ''),
      },
    },
  },
})
