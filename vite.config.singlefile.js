import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Build especial: genera un ÚNICO index.html con todo el CSS y JS incrustado,
// para poder abrir la web localmente con doble clic (sin servidor).
// Uso: npx vite build --config vite.config.singlefile.js
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: {
    outDir: 'dist-singlefile',
    assetsInlineLimit: 100000000,
    cssCodeSplit: false,
    reportCompressedSize: false,
  },
})
