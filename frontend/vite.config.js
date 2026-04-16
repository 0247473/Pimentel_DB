/**
 * Vite configuration for the React frontend.
 * Purpose: Bundles React app, defines env prefix, configures dev server.
 * Modify: Add proxies, aliases, or plugins as needed.
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  envPrefix: 'VITE_',
})
