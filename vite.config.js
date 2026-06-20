import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'

// @crxjs handles MV3 wiring: it bundles the popup (index.html), options page,
// content script, and service worker referenced from manifest.json.
export default defineConfig({
  plugins: [react(), crx({ manifest })],
  // Content scripts can't use ES module imports at runtime, so let Vite inline
  // their deps into a single IIFE-style bundle (crxjs does this per entry).
  build: {
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
})
