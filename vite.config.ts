import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // Importe o módulo 'path' do Node.js

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react( )],
  resolve: {
    alias: {
      // Adiciona o atalho para a pasta 'src' (comum em muitos projetos)
      '@': path.resolve(__dirname, './src'),
      // Adiciona o atalho para a pasta 'shared' (a causa do nosso erro)
      '@shared': path.resolve(__dirname, '../shared'),
    },
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
