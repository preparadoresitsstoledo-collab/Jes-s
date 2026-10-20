// Pruebas de «Dietas y jornada anual».
// Ejecutar con:  npm run test:dietas

import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  fraccionAnio,
  cuadranteTrabajador,
  analizarDietas,
  leerLineasDietas,
  nuevoTrabajador,
  resumenExpediente,
  tipoDesdeTexto,
  mesDesdeTexto,
  aNumero,
} from '../calculo.js'
import { generarBloques, bloquesATexto, bloquesAHtml } from '../informe.js'
import { CONFIG_POR_DEFECTO } from '../../../data/dietasJornada.js'

const cfg = { ...CONFIG_POR_DEFECTO, desde: '2022-01-01', hasta: '2025-10-31' }

test('días hábiles: 1.800 h / 8 h = 225 días; enero–octubre de 2025 = 188 días (por meses)', () => {
  const t = nuevoTrabajador({ nombre: 'Conductor 1', anios: { 2022: { diasDieta: 240 }, 2025: { diasDieta: 200 } } })
  const { filas, totales } = cuadranteTrabajador(t, cfg)
  assert.deepEqual(filas.map((f) => f.anio), ['2022', '2023', '2024', '2025'])
  assert.equal(filas[0].diasTeoricos, 225)
  assert.equal(filas[3].diasTeoricos, 188)
  assert.equal(filas[0].excesoDias, 15)
  assert.equal(filas[0].excesoHoras, 120)
  assert.equal(filas[0].superaLimiteHE, true)
  assert.equal(filas[3].excesoDias, 12)
  assert.equal(filas[1].diasTrabajados, null)
  assert.equal(totales.excesoDias, 27)
})

test('prorrateo por días naturales', () => {
  assert.equal(Math.round(fraccionAnio('2025-01-01', '2025-10-31', 'dias') * 365), 304)
  const r = cuadranteTrabajador(nuevoTrabajador({ anios: { 2025: { diasDieta: 190 } } }), { ...cfg, prorrateo: 'dias', desde: '2025-01-01' })
  assert.equal(r.filas[0].diasTeoricos, 187)
})

test('alta y baja del trabajador limitan el periodo', () => {
  const t = nuevoTrabajador({ alta: '2023-07-01', baja: '2024-06-30' })
  const { filas } = cuadranteTrabajador(t, cfg)
  assert.deepEqual(filas.map((f) => [f.anio, f.desde, f.hasta, f.diasTeoricos]), [
    ['2023', '2023-07-01', '2023-12-31', 113],
    ['2024', '2024-01-01', '2024-06-30', 113],
  ])
})

test('vacaciones: déficit y actividad del tacógrafo durante las vacaciones', () => {
  const t = nuevoTrabajador({
    vacaciones: [{ desde: '2023-08-01', hasta: '2023-08-15' }],
    tacografo: { fechas: ['2023-08-03', '2023-08-04', '2023-09-01'], minutos: { '2023-08-03': 480, '2023-08-04': 480, '2023-09-01': 600 }, presencia: {} },
  })
  const { filas } = cuadranteTrabajador(t, { ...cfg, desde: '2023-01-01', hasta: '2023-12-31' })
  assert.equal(filas[0].vacaciones, 15)
  assert.equal(filas[0].deficitVacaciones, 15)
  assert.equal(filas[0].diasEnVacaciones, 2)
  assert.equal(filas[0].diasTacografo, 3)
  assert.equal(filas[0].horasEfectivas, 26)
})

test('método por horas (calculadora de transportes): HE en B. CP y presencia en B. CC', () => {
  const base = { ...cfg, desde: '2023-03-01', hasta: '2023-10-31' }
  // 245 días en alta → jornada máxima 1800 × 245 / 365 = 1208,22 h
  const t = nuevoTrabajador({ anios: { 2023: { horasEfectivas: 1300, horasPresencia: 400 } } })
  let f = cuadranteTrabajador(t, base).filas[0]
  assert.equal(f.diasAlta, 245)
  assert.equal(f.jornadaMaxima, 1208.22)
  assert.equal(f.excesoHE, 91.78)
  assert.equal(f.excesoCC, 400)

  // Si el trabajo efectivo no supera la jornada máxima no hay HE; el exceso total va a B. CC
  t.anios[2023] = { horasEfectivas: 1000, horasPresencia: 400 }
  f = cuadranteTrabajador(t, base).filas[0]
  assert.equal(f.excesoHE, 0)
  assert.equal(f.excesoCC, 191.78)

  // Los días de IT reducen la jornada máxima: 1800 × (245 − 20) / 365
  t.anios[2023] = { horasEfectivas: 1000, horasPresencia: 400, diasIT: 20 }
  f = cuadranteTrabajador(t, base).filas[0]
  assert.equal(f.jornadaMaxima, 1109.59)

  // Año bisiesto: se divide entre 366
  const b = cuadranteTrabajador(nuevoTrabajador({ anios: { 2024: { horasEfectivas: 1800 } } }), { ...cfg, desde: '2024-01-01', hasta: '2024-12-31' })
  assert.equal(b.filas[0].jornadaMaxima, 1800)
})

test('análisis de dietas: precios distintos en la misma nómina y exceso no exento', () => {
  const lineas = [
    { mes: '2023-01', tipo: 'nacional_con', dias: 10, importe: 50 },
    { mes: '2023-01', tipo: 'nacional_con', dias: 5, importe: 53 },
    { mes: '2023-02', tipo: 'nacional_con', dias: 18, importe: 52 },
    { mes: '2023-02', tipo: 'nacional_sin', dias: 3, importe: 30 },
  ]
  const a = analizarDietas(lineas)
  assert.equal(a.mesesConDieta, 2)
  assert.deepEqual(a.mesesVariacion, [{ mes: '2023-01', tipo: 'nacional_con', precios: [50, 53] }])
  const con = a.porTipo.find((x) => x.tipo === 'nacional_con')
  assert.deepEqual(con.precios, [50, 52, 53])
  assert.equal(con.dias, 33)
  // 30 € sin pernocta supera el límite de 26,67 € → 3,33 × 3 días
  assert.equal(a.excesoNoExento, 9.99)
})

test('las líneas de nómina alimentan los días con dieta del año', () => {
  const t = nuevoTrabajador({ dietas: [{ mes: '2024-03', tipo: 'nacional_con', dias: 20, importe: 52 }, { mes: '2024-04', tipo: 'nacional_sin', dias: 2, importe: 20 }] })
  const f = cuadranteTrabajador(t, cfg).filas.find((x) => x.anio === '2024')
  assert.equal(f.diasDieta, 22)
  assert.equal(f.importeDietas, 1080)
})

test('importa dietas pegadas desde Excel (tabuladores) o CSV', () => {
  const { lineas, errores } = leerLineasDietas(
    'Trabajador\tMes\tTipo\tDías\tImporte\nPérez Gómez, Juan\t01/2023\tDieta con pernocta\t20\t52,50\nPérez Gómez, Juan\tfebrero 2023\tMedia dieta Portugal\t3\t30',
  )
  assert.equal(errores.length, 0)
  assert.equal(lineas.length, 2)
  assert.deepEqual(lineas[0], { trabajador: 'Pérez Gómez, Juan', mes: '2023-01', tipo: 'nacional_con', dias: 20, importe: 52.5 })
  assert.equal(lineas[1].mes, '2023-02')
  assert.equal(lineas[1].tipo, 'extranjero_sin')
  assert.equal(tipoDesdeTexto('Dieta completa (comida, cena y pernocta)'), 'nacional_con')
  assert.equal(mesDesdeTexto('2025-10'), '2025-10')
  assert.equal(aNumero('1.234,56'), 1234.56)
})

test('genera los hechos con la estructura del requerimiento', () => {
  const t = nuevoTrabajador({
    nombre: 'Conductor 1',
    anios: { 2022: { diasDieta: 240, vacaciones: 10 }, 2023: { horasEfectivas: 1900, horasPresencia: 300 } },
    dietas: [
      { mes: '2022-01', tipo: 'nacional_con', dias: 10, importe: 50 },
      { mes: '2022-01', tipo: 'nacional_con', dias: 5, importe: 53 },
    ],
  })
  const resumen = resumenExpediente([t], cfg)
  const bloques = generarBloques({
    expediente: { empresa: 'Transportes Ejemplo, S.L.', convenio: 'el convenio colectivo de transporte de mercancías por carretera' },
    cfg,
    resumen,
    comprobaciones: ['sinJustificantes', 'variacionPrecios', 'sinHE'],
    importesDeclarados: 'entre 15 y 30 euros/día sin pernocta y entre 50 y 53 euros/día con pernocta',
  })
  const texto = bloquesATexto(bloques)
  assert.match(texto, /1\.800 horas\/año/)
  assert.match(texto, /225 días hábiles/)
  assert.match(texto, /incluso dentro de una misma nómina/)
  assert.match(texto, /no disfrutan del periodo mínimo de vacaciones/)
  assert.match(texto, /Período examinado: desde enero de 2022 hasta octubre de 2025/)
  assert.match(texto, /horas extraordinarias no declaradas/)
  assert.match(texto, /base de contingencias profesionales/)
  assert.match(bloquesAHtml(bloques), /<table>/)
})
