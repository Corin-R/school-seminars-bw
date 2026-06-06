import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default {
  server: {
    host: true,
    port: 5173,
    allowedHosts: [
      'schools.horizonglade.com'
    ]
  },
  plugins: [react()],
}
