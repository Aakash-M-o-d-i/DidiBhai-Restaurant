import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '^/g/a/n/e/s/h/ganeshdidibhai/(status|login|validate|logout|unblock|blocked)': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
})
