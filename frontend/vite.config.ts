import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': {
        target: 'http://localhost:3001', // URL de tu backend
        changeOrigin: true,
        secure: false,
      },
      '/api': {
        target: 'http://localhost:3001', // URL de tu backend
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
