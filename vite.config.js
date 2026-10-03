import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves from /eagle/; Netlify serves from the domain root.
  base: process.env.NETLIFY ? '/' : '/eagle/',
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
