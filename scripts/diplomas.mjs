#!/usr/bin/env node
/**
 * Generador de diplomas (uso del preparador/formador).
 *
 *   node scripts/diplomas.mjs --asistentes asistentes.csv --curso "Título del curso" \
 *        --fecha 2026-09-15 [--fecha-fin 2026-09-16] [--horas 5] [--lugar "Toledo"] \
 *        [--modalidad Presencial] [--tipo "DIPLOMA DE ASISTENCIA"] [--organizador "..."] \
 *        [--formador "Nombre"] [--cargo "Cargo"] [--subtitulo "..."] [--firma "Toledo, 15 de septiembre de 2026"] \
 *        [--salida src/data/diplomas.json] [--codigos codigos.csv] [--simular]
 *
 * `asistentes.csv`: un asistente por línea, "Nombre completo" o "Nombre completo;Documento".
 *
 * Qué hace:
 *   1. Genera un código personal aleatorio para cada asistente.
 *   2. Cifra los datos del diploma con ese código y los añade a src/data/diplomas.json.
 *   3. Escribe un CSV con "nombre;documento;codigo" para enviar cada código a su asistente.
 *      ⚠️ Ese CSV es CONFIDENCIAL: no lo subas al repositorio (está en .gitignore).
 *
 * Después: commit + push de src/data/diplomas.json y la web publicará los diplomas.
 */
import { readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { cifrarDiploma, generarCodigo, formatearCodigo } from '../src/lib/diplomasCrypto.js'

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function leerArgs(argv) {
  const args = {}
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (!a.startsWith('--')) continue
    const clave = a.slice(2)
    const siguiente = argv[i + 1]
    if (siguiente === undefined || siguiente.startsWith('--')) {
      args[clave] = true
    } else {
      args[clave] = siguiente
      i++
    }
  }
  return args
}

function ayuda() {
  console.log(
    [
      'Uso: node scripts/diplomas.mjs --asistentes asistentes.csv --curso "Título" --fecha AAAA-MM-DD [opciones]',
      '',
      'Opciones:',
      '  --fecha-fin AAAA-MM-DD   Fecha de fin (cursos de varios días)',
      '  --horas N                Duración en horas',
      '  --lugar "Toledo"         Lugar de celebración',
      '  --modalidad Presencial   Modalidad (Presencial, Online, Mixta...)',
      '  --tipo "DIPLOMA DE ASISTENCIA"   Título del documento',
      '  --subtitulo "..."        Texto secundario bajo el título del curso',
      '  --organizador "..."      Entidad organizadora',
      '  --formador "..."         Nombre de quien firma',
      '  --cargo "..."            Cargo de quien firma',
      '  --firma "..."            Lugar y fecha de la firma',
      '  --salida ruta.json       Archivo de diplomas (por defecto src/data/diplomas.json)',
      '  --codigos ruta.csv       CSV confidencial con los códigos (por defecto diplomas-codigos-<fecha>.csv)',
      '  --simular                No escribe nada; muestra los códigos por pantalla',
    ].join('\n'),
  )
}

function parsearAsistentes(texto) {
  return texto
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
    .filter((l, i) => !(i === 0 && /^nombre/i.test(l))) // cabecera opcional
    .map((l) => {
      const [nombre, documento = ''] = l.split(/[;,\t]/).map((s) => s.trim())
      return { nombre, documento }
    })
    .filter((a) => a.nombre)
}

async function main() {
  const args = leerArgs(process.argv.slice(2))
  if (args.help || args.h || !args.asistentes || !args.curso || !args.fecha) {
    ayuda()
    process.exit(args.help || args.h ? 0 : 1)
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(args.fecha)) {
    console.error('La fecha debe tener formato AAAA-MM-DD')
    process.exit(1)
  }

  const rutaAsistentes = path.resolve(process.cwd(), args.asistentes)
  const asistentes = parsearAsistentes(await readFile(rutaAsistentes, 'utf8'))
  if (!asistentes.length) {
    console.error('No se ha encontrado ningún asistente en', rutaAsistentes)
    process.exit(1)
  }

  const rutaSalida = path.resolve(raiz, args.salida || 'src/data/diplomas.json')
  const rutaCodigos = path.resolve(process.cwd(), args.codigos || `diplomas-codigos-${args.fecha}.csv`)

  const base = {
    tipo: args.tipo || 'DIPLOMA DE ASISTENCIA',
    curso: args.curso,
    subtitulo: args.subtitulo || '',
    fecha: args.fecha,
    fechaFin: args['fecha-fin'] || '',
    horas: args.horas || '',
    lugar: args.lugar || '',
    modalidad: args.modalidad || '',
    organizador: args.organizador || '',
    formador: args.formador || '',
    cargo: args.cargo || '',
    firmaLugarFecha: args.firma || '',
  }

  const archivo = existsSync(rutaSalida)
    ? JSON.parse(await readFile(rutaSalida, 'utf8'))
    : { version: 1, diplomas: [] }
  archivo.diplomas ||= []

  const filasCodigos = ['nombre;documento;codigo']
  for (const a of asistentes) {
    const codigo = generarCodigo(12)
    const datos = { ...base, nombre: a.nombre, documento: a.documento, emitido: new Date().toISOString().slice(0, 10) }
    const registro = await cifrarDiploma(codigo, datos)
    archivo.diplomas.push(registro)
    filasCodigos.push(`${a.nombre};${a.documento};${formatearCodigo(codigo)}`)
  }

  if (args.simular) {
    console.log('--- SIMULACIÓN (no se ha escrito nada) ---')
    console.log(filasCodigos.join('\n'))
    return
  }

  await writeFile(rutaSalida, JSON.stringify(archivo, null, 2) + '\n', 'utf8')
  await writeFile(rutaCodigos, filasCodigos.join('\n') + '\n', 'utf8')

  console.log(`✔ ${asistentes.length} diploma(s) añadidos a ${path.relative(process.cwd(), rutaSalida)}`)
  console.log(`✔ Códigos guardados en ${path.relative(process.cwd(), rutaCodigos)} (CONFIDENCIAL, no lo subas al repositorio)`)
  console.log('Siguiente paso: git add src/data/diplomas.json && git commit && git push')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
