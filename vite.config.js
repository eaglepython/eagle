import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/eagle/' : '/',
  server: {
    historyApiFallback: true,
    proxy: {
      '/oauth2/': 'https://accounts.google.com'
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        app: './app.html'
      }
    }
  },
  define: {
    'import.meta.env.VITE_GOOGLE_CLIENT_ID': JSON.stringify(process.env.REACT_APP_GOOGLE_CLIENT_ID),
    'import.meta.env.VITE_GOOGLE_CLIENT_SECRET': JSON.stringify(process.env.REACT_APP_GOOGLE_CLIENT_SECRET),
    'import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY': JSON.stringify(process.env.REACT_APP_GOOGLE_CALENDAR_API_KEY),
  }
})
