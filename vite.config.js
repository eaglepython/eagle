import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/eagle/',
  build: {
    outDir: 'docs',
    rollupOptions: {
      input: {
        main: './index.html',
        app: './app.html'
      }
    }
  },
  server: {
    historyApiFallback: true
  }
})
