import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/eagle/' : '/',
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        app: './app.html'
      }
    }
  }
})
