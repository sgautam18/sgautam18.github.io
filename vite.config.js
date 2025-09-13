// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'docs',        // ⬅️ build straight into /docs
    emptyOutDir: true      // clears old files before new build
  },
  base: './'               // important for GitHub Pages relative paths
})
