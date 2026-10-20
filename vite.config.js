import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

// Aviso de autoría al principio de cada archivo de código publicado.
const AVISO = `/*! © ${new Date().getFullYear()} Jesús María Prieto Valbuena · preparadoritsstoledo.es · Todos los derechos reservados. Prohibida su copia, reproducción, distribución o transformación, total o parcial, sin autorización expresa del autor (RDLeg 1/1996, de Propiedad Intelectual). */\n`

function avisoAutoria() {
  return {
    name: 'aviso-autoria',
    apply: 'build',
    // Se escribe sobre los archivos ya generados para que el aviso quede en la primera línea
    writeBundle(opciones, bundle) {
      for (const nombre of Object.keys(bundle)) {
        if (!/\.(js|css)$/.test(nombre)) continue
        const ruta = path.join(opciones.dir, nombre)
        const codigo = fs.readFileSync(ruta, 'utf8')
        if (!codigo.startsWith('/*! ©')) fs.writeFileSync(ruta, AVISO + codigo)
      }
    },
  }
}

// https://vitejs.dev/config/
// base: './' permite desplegar en GitHub Pages o cualquier subcarpeta sin reconfigurar.
export default defineConfig({
  plugins: [react(), avisoAutoria()],
  base: './',
})
