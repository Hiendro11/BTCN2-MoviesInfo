import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://34.124.214.214:2423',
        changeOrigin: true,
        secure: false, 
      },
    },
  },
})
