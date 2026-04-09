import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: './index.html', // Ensure this points to the correct location
    },
  },
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    // Local dev: browser calls same-origin /api/v3/* → proxied to production API.
    // The API only allows CORS from seedlingeducation.org, so direct calls from
    // localhost would fail; the proxy avoids that.
    proxy: {
      '/api/v3': {
        target: 'https://api.seedlingeducation.org',
        changeOrigin: true,
        secure: true,
      },
      '/api/v2': {
        target: 'https://api.seedlingeducation.org',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
