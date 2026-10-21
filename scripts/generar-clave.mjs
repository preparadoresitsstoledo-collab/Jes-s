// Genera el resumen (hash) de una clave para las funciones avanzadas de «Dietas y jornada».
// Uso:  node scripts/generar-clave.mjs "mi clave"
// Copia las dos líneas que imprime en src/data/accesoAvanzado.js. La clave no se guarda en ningún sitio.
import { createHash, randomBytes } from 'node:crypto'

const clave = process.argv[2]
if (!clave) {
  console.error('Uso: node scripts/generar-clave.mjs "mi clave"')
  process.exit(1)
}
const sal = randomBytes(12).toString('hex')
const hash = createHash('sha256').update(sal + clave, 'utf8').digest('hex')
console.log(`export const SAL = '${sal}'`)
console.log(`export const HASH = '${hash}'`)
