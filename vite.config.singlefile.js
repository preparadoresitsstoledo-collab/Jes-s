import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Build especial: genera un ÚNICO index.html con todo el CSS y JS incrustado,
// para poder abrir la web localmente con doble clic (protocolo file://) SIN
// servidor. Se fuerza formato IIFE (script clásico, no módulo) porque los
// navegadores bloquean los <script type="module"> al abrir archivos locales.
// Uso: npx vite build --config vite.config.singlefile.js
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: {
    outDir: 'dist-singlefile',
    assetsInlineLimit: 100000000,
    cssCodeSplit: false,
    reportCompressedSize: false,
    modulePreload: false,
    target: 'es2019',
    rollupOptions: {
      output: {
        format: 'iife',
        inlineDynamicImports: true,
      },
    },
  },
})
