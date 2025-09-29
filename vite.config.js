import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import react from '@vitejs/plugin-react'

const DEV_HOST = '5173-firebase-proyecto-1755798103194.cluster-fsmcisrvfbb5cr5mvra3hr3qyg.cloudworkstations.dev'

export default defineConfig(({ mode }) => ({
  plugins: [
    laravel({
      input: 'resources/js/app.jsx',
      refresh: true,
    }),
    react(),
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    https: false, // Cloud Workstations ya hace el TLS
    origin: `https://${DEV_HOST}`, // URL que el browser puede ver
    hmr: {
      protocol: 'wss',
      host: DEV_HOST,
      clientPort: 443, // muy importante en Workstations detrás de proxy HTTPS
    },
  },
}))
