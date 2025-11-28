import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  // Diz à Vite que a raiz do nosso projeto frontend é a pasta 'client'
  root: 'client', 
  
  plugins: [react()],
  
  resolve: {
    alias: {
      // Agora que a raiz é 'client', o atalho '@' aponta para 'client/src'
      '@': path.resolve(__dirname, './client/src'),
      // E o atalho '@shared' aponta para a pasta 'shared' que está um nível acima
      '@shared': path.resolve(__dirname, './shared'),
    },
  },

  build: {
    // Diz à Vite para colocar o resultado final na pasta 'dist' na raiz do projeto
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
