// Acceso a las funciones avanzadas de «Dietas y jornada» (bases de cotización por
// trabajador y mes). Solo se guarda el resumen SHA-256 de la clave, nunca la clave.
// Para cambiarla:  node scripts/generar-clave.mjs "nueva clave"  y sustituye estas dos líneas.
export const SAL = '6e95f31c342da457722deb8f'
export const HASH = '8d27d26d64aefeba17de7b70e53fb3d3e038d0fcca446a99e0268c974efe7270'

async function resumen(texto) {
  const datos = new TextEncoder().encode(texto)
  const h = await crypto.subtle.digest('SHA-256', datos)
  return [...new Uint8Array(h)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

export async function comprobarClave(clave) {
  if (!clave || !globalThis.crypto?.subtle) return false
  return (await resumen(SAL + clave.trim())) === HASH
}
