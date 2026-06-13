import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// base: './' permite desplegar en GitHub Pages o cualquier subcarpeta sin reconfigurar.
export default defineConfig({
  plugins: [react()],
  base: './',
})
