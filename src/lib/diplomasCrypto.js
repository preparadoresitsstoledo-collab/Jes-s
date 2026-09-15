/**
 * Cifrado de los diplomas.
 *
 * La web es estática (GitHub Pages) y no tiene servidor, así que el listado
 * de diplomas viaja dentro de la propia web. Para no publicar los nombres de
 * los asistentes, cada diploma se guarda CIFRADO con una clave derivada del
 * código personal del asistente (PBKDF2 + AES-256-GCM). Sin el código, el
 * archivo público solo contiene texto ilegible.
 *
 * Este módulo usa la Web Crypto API, disponible tanto en el navegador como
 * en Node.js 20+ (globalThis.crypto), por lo que lo comparten la herramienta
 * web y el script `scripts/diplomas.mjs`.
 */

const ITERACIONES = 210000
const ALFABETO = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // sin 0/O/1/I para evitar confusiones

const cripto = globalThis.crypto
const codificador = new TextEncoder()
const decodificador = new TextDecoder()

// --- utilidades base64 (compatibles navegador/Node) -----------------------
function aBase64(bytes) {
  let binario = ''
  for (const b of bytes) binario += String.fromCharCode(b)
  return btoa(binario)
}
function deBase64(texto) {
  const binario = atob(texto)
  const bytes = new Uint8Array(binario.length)
  for (let i = 0; i < binario.length; i++) bytes[i] = binario.charCodeAt(i)
  return bytes
}

/** Normaliza un código escrito por el usuario: mayúsculas, sin espacios ni guiones. */
export function normalizarCodigo(codigo) {
  return String(codigo || '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
}

/** Formatea un código en bloques de 4 para mostrarlo: ABCD-EFGH-JKLM. */
export function formatearCodigo(codigo) {
  return normalizarCodigo(codigo).replace(/(.{4})(?=.)/g, '$1-')
}

/** Genera un código aleatorio de `longitud` caracteres del alfabeto seguro. */
export function generarCodigo(longitud = 12) {
  const aleatorio = new Uint8Array(longitud)
  cripto.getRandomValues(aleatorio)
  let codigo = ''
  for (const n of aleatorio) codigo += ALFABETO[n % ALFABETO.length]
  return codigo
}

/** Identificador público del diploma: hash del código + sal (no revela el código). */
async function calcularId(codigo, sal) {
  const datos = codificador.encode(`diploma:${codigo}`)
  const entrada = new Uint8Array(sal.length + datos.length)
  entrada.set(sal)
  entrada.set(datos, sal.length)
  const hash = new Uint8Array(await cripto.subtle.digest('SHA-256', entrada))
  return aBase64(hash.slice(0, 12))
}

async function derivarClave(codigo, sal) {
  const material = await cripto.subtle.importKey('raw', codificador.encode(codigo), 'PBKDF2', false, [
    'deriveKey',
  ])
  return cripto.subtle.deriveKey(
    { name: 'PBKDF2', salt: sal, iterations: ITERACIONES, hash: 'SHA-256' },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )
}

/**
 * Cifra los datos de un diploma con el código del asistente.
 * Devuelve el registro público que se guarda en `src/data/diplomas.json`.
 */
export async function cifrarDiploma(codigo, datos) {
  const codigoNorm = normalizarCodigo(codigo)
  const sal = cripto.getRandomValues(new Uint8Array(16))
  const iv = cripto.getRandomValues(new Uint8Array(12))
  const clave = await derivarClave(codigoNorm, sal)
  const cifrado = await cripto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    clave,
    codificador.encode(JSON.stringify(datos)),
  )
  return {
    id: await calcularId(codigoNorm, sal),
    sal: aBase64(sal),
    iv: aBase64(iv),
    datos: aBase64(new Uint8Array(cifrado)),
  }
}

/**
 * Busca y descifra el diploma que corresponde a un código.
 * Devuelve los datos del diploma o `null` si el código no existe.
 */
export async function descifrarDiploma(codigo, registros) {
  const codigoNorm = normalizarCodigo(codigo)
  if (codigoNorm.length < 8) return null
  for (const registro of registros) {
    const sal = deBase64(registro.sal)
    const id = await calcularId(codigoNorm, sal)
    if (id !== registro.id) continue
    try {
      const clave = await derivarClave(codigoNorm, sal)
      const claro = await cripto.subtle.decrypt(
        { name: 'AES-GCM', iv: deBase64(registro.iv) },
        clave,
        deBase64(registro.datos),
      )
      return JSON.parse(decodificador.decode(claro))
    } catch {
      return null
    }
  }
  return null
}
