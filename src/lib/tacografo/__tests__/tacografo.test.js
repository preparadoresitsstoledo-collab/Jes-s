// Pruebas del lector de tarjetas y del motor de análisis.
// Ejecutar con:  npm run test:tacografo

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { generarTarjeta, m } from './generador.js'
import { leerArchivoTarjeta, ACT } from '../ddd.js'
import { agruparPorConductor } from '../conductores.js'
import { analizar } from '../analisis.js'
import { sumarDias } from '../tiempo.js'
import { CONFIG_POR_DEFECTO } from '../../../data/tacografo.js'

const cfgUTC = { ...CONFIG_POR_DEFECTO, zonaHoraria: 'UTC' }

// dia('2024-01-01', [['00:00','DESCANSO'], ['06:00','CONDUCCION'], ...])
function dia(fecha, tramos, km = 0) {
  return { fecha, km, cambios: tramos.map(([h, act, f]) => [m(h), act, f]) }
}

function lee(dias, op) {
  return leerArchivoTarjeta(generarTarjeta(dias, op), 'prueba.ddd')
}

function articulos(r) {
  return r.infracciones.map((i) => `${i.norma}|${i.articulo}`)
}

test('lee identificación, actividades (búfer circular) y vehículos', () => {
  const dias = []
  for (let d = 1; d <= 20; d++) {
    const f = `2024-03-${String(d).padStart(2, '0')}`
    dias.push(dia(f, [['00:00', 'DESCANSO'], ['07:00', 'CONDUCCION'], ['11:00', 'DESCANSO'], ['11:45', 'TRABAJO'], ['15:00', 'DESCANSO']], 300 + d))
  }
  const l = lee(dias, { vehiculos: [{ desde: '2024-03-01', hasta: '2024-03-20', matricula: '1234ABC' }] })
  assert.equal(l.titular.apellidos, 'GARCÍA LÓPEZ')
  assert.equal(l.titular.nombre, 'JOSÉ')
  assert.equal(l.titular.fechaNacimiento, '1980-05-14')
  assert.equal(l.tarjeta.numero, 'E123456789012000')
  assert.equal(l.tarjeta.pais, 'E')
  assert.equal(l.dias.length, 20)
  assert.equal(l.dias[0].fecha, '2024-03-01')
  assert.equal(l.dias[19].fecha, '2024-03-20')
  assert.equal(l.dias[4].distancia, 305)
  assert.equal(l.dias[0].cambios[1].actividad, ACT.CONDUCCION)
  assert.equal(l.dias[0].cambios[1].minuto, 420)
  assert.equal(l.vehiculos[0].matricula, '1234ABC')
})

test('lee tarjetas de 2.ª generación', () => {
  const l = lee([dia('2024-03-01', [['00:00', 'DESCANSO'], ['08:00', 'CONDUCCION'], ['12:00', 'DESCANSO']])], {
    gen2: true,
    vehiculos: [{ desde: '2024-03-01', hasta: '2024-03-01', matricula: '9999XYZ' }],
  })
  assert.equal(l.generacion, 2)
  assert.equal(l.dias.length, 1)
  assert.equal(l.vehiculos[0].matricula, '9999XYZ')
  assert.equal(l.vehiculos[0].vin, 'VF1TESTVIN0000000')
})

test('rechaza archivos de vehículo', () => {
  assert.throws(() => leerArchivoTarjeta(Uint8Array.from([0x76, 0x01, 0, 0, 0, 0]), 'v.ddd'), /vehículo/)
})

test('fusiona varias descargas del mismo conductor sin duplicar días', () => {
  const a = lee([1, 2, 3].map((d) => dia(`2024-01-0${d}`, [['00:00', 'DESCANSO'], ['08:00', 'CONDUCCION'], ['12:00', 'DESCANSO']])))
  const b = lee([3, 4, 5].map((d) => dia(`2024-01-0${d}`, [['00:00', 'DESCANSO'], ['08:00', 'CONDUCCION'], ['12:00', 'DESCANSO']])))
  const otro = lee([dia('2024-01-01', [['00:00', 'DESCANSO']])], { numero: 'E9999999999990', apellidos: 'PÉREZ' })
  const grupos = agruparPorConductor([a, b, otro])
  assert.equal(grupos.length, 2)
  const g = grupos.find((x) => x.titular.apellidos === 'GARCÍA LÓPEZ')
  assert.equal(g.dias.length, 5)
  assert.equal(g.archivos.length, 2)
})

test('jornada correcta: sin incidencias del Reglamento 561/2006', () => {
  const dias = []
  for (let d = 1; d <= 5; d++) {
    dias.push(dia(`2024-01-0${d}`, [['00:00', 'DESCANSO'], ['07:00', 'CONDUCCION'], ['11:00', 'DESCANSO'], ['11:45', 'CONDUCCION'], ['15:45', 'DESCANSO']]))
  }
  const r = analizar({ dias: lee(dias).dias }, cfgUTC)
  assert.deepEqual(articulos(r).filter((a) => a.startsWith('Reglamento')), [])
  assert.equal(r.dias[0].conduccion, 480)
  assert.equal(r.dias[0].inicio, '07:00')
  assert.equal(r.dias[0].fin, '15:45')
  assert.equal(r.jornadas[0].descansoTipo, 'diario normal')
})

test('detecta conducción continuada, exceso de 10 h, descanso insuficiente y pausas', () => {
  const dias = [
    // 5 h seguidas de conducción
    dia('2024-01-01', [['00:00', 'DESCANSO'], ['06:00', 'CONDUCCION'], ['11:00', 'DESCANSO'], ['11:45', 'CONDUCCION'], ['14:00', 'DESCANSO']]),
    // 10 h 30 min de conducción
    dia('2024-01-02', [['00:00', 'DESCANSO'], ['05:00', 'CONDUCCION'], ['09:30', 'DESCANSO'], ['10:15', 'CONDUCCION'], ['14:45', 'DESCANSO'], ['15:30', 'CONDUCCION'], ['17:00', 'DESCANSO']]),
    // 11 h 45 min de otros trabajos con 15 min de pausa y solo 8 h de descanso después
    dia('2024-01-03', [['00:00', 'DESCANSO'], ['05:00', 'TRABAJO'], ['11:00', 'DESCANSO'], ['11:15', 'TRABAJO'], ['17:00', 'DESCANSO']]),
    dia('2024-01-04', [['00:00', 'DESCANSO'], ['01:00', 'CONDUCCION'], ['04:00', 'DESCANSO']]),
  ]
  const r = analizar({ dias: lee(dias).dias }, cfgUTC)
  const a = articulos(r)
  assert.ok(a.includes('Reglamento (CE) 561/2006|Art. 7'), 'art. 7')
  assert.ok(a.includes('Reglamento (CE) 561/2006|Art. 6.1'), 'art. 6.1')
  assert.ok(a.includes('Reglamento (CE) 561/2006|Art. 8.2'), 'art. 8.2')
  assert.ok(a.includes('RD 1561/1995|Art. 10 bis.4'), 'pausas RD 1561')
  const art7 = r.infracciones.find((i) => i.articulo === 'Art. 7')
  assert.equal(art7.valor, 300)
  const art61 = r.infracciones.find((i) => i.articulo === 'Art. 6.1')
  assert.equal(art61.valor, 630)
  const insuf = r.infracciones.find((i) => i.articulo === 'Art. 8.2')
  assert.equal(insuf.valor, 8 * 60)
})

test('descanso fraccionado 3 h + 9 h y reducido', () => {
  const dias = [
    dia('2024-01-01', [['00:00', 'DESCANSO'], ['06:00', 'CONDUCCION'], ['10:00', 'DESCANSO'], ['13:00', 'CONDUCCION'], ['17:00', 'DESCANSO']]),
    // descanso 17:00 → 02:00 = 9 h tras fracción de 3 h → fraccionado
    dia('2024-01-02', [['00:00', 'DESCANSO'], ['02:00', 'CONDUCCION'], ['06:00', 'DESCANSO'], ['06:45', 'CONDUCCION'], ['10:00', 'DESCANSO'], ['10:30', 'TRABAJO'], ['17:00', 'DESCANSO']]),
    // descanso 17:00 → 02:00 sin fracción previa de 3 h → reducido
    dia('2024-01-03', [['00:00', 'DESCANSO'], ['02:00', 'CONDUCCION'], ['05:00', 'DESCANSO']]),
  ]
  const r = analizar({ dias: lee(dias).dias }, cfgUTC)
  assert.equal(r.jornadas[0].descansoTipo, 'diario fraccionado (3 h + 9 h)')
  assert.equal(r.jornadas[1].descansoTipo, 'diario reducido')
})

test('conducción semanal > 56 h y bisemanal > 90 h', () => {
  const dias = []
  // 6 días × 9 h 50 min = 59 h en la semana del 1 de enero; 6 × 9 h en la siguiente
  for (let d = 1; d <= 6; d++) {
    dias.push(dia(`2024-01-0${d}`, [['00:00', 'DESCANSO'], ['05:00', 'CONDUCCION'], ['09:30', 'DESCANSO'], ['10:15', 'CONDUCCION'], ['14:45', 'DESCANSO'], ['15:30', 'CONDUCCION'], ['16:20', 'DESCANSO']]))
  }
  for (let d = 8; d <= 13; d++) {
    const f = `2024-01-${String(d).padStart(2, '0')}`
    dias.push(dia(f, [['00:00', 'DESCANSO'], ['05:00', 'CONDUCCION'], ['09:30', 'DESCANSO'], ['10:15', 'CONDUCCION'], ['14:45', 'DESCANSO']]))
  }
  const r = analizar({ dias: lee(dias).dias }, cfgUTC)
  const a = articulos(r)
  assert.ok(a.includes('Reglamento (CE) 561/2006|Art. 6.2'))
  assert.ok(a.includes('Reglamento (CE) 561/2006|Art. 6.3'))
  // Más de dos ampliaciones a 10 h en la primera semana
  assert.ok(r.infracciones.some((i) => i.articulo === 'Art. 6.1' && /3\.ª vez/.test(i.descripcion)))
  assert.equal(r.semanas[0].conduccion, 6 * 590)
})

test('horas extraordinarias mensuales, semanales, diarias y anuales', () => {
  const dias = []
  // Enero 2024: 23 días laborables de 10 h de trabajo efectivo
  for (let d = 1; d <= 31; d++) {
    const f = `2024-01-${String(d).padStart(2, '0')}`
    const dow = new Date(f + 'T00:00:00Z').getUTCDay()
    if (dow === 0 || dow === 6) continue
    dias.push(dia(f, [['00:00', 'DESCANSO'], ['06:00', 'CONDUCCION'], ['10:00', 'DESCANSO'], ['10:45', 'CONDUCCION'], ['14:45', 'TRABAJO'], ['16:45', 'DESCANSO']]))
  }
  const r = analizar({ dias: lee(dias).dias }, { ...cfgUTC, jornadaAnual: 1830 }, { desde: '2024-01-01', hasta: '2024-01-31' })
  const enero = r.meses[0]
  assert.equal(enero.trabajoEfectivo, 23 * 600)
  assert.equal(enero.heDiaria, 23 * 60)
  // Jornada ordinaria prorrateada: 1830 h × 31 / 366 = 155 h
  assert.equal(enero.jornadaOrdinaria, 155 * 60)
  assert.equal(enero.heMensual, 23 * 600 - 155 * 60)
  assert.equal(r.anios[0].heAnual, enero.heMensual)
  assert.equal(enero.heAnual, enero.heMensual)
  // Semanas de 5 días × 10 h = 50 h → 10 h extra por semana completa
  assert.equal(r.semanas[1].heSemanal, 600)
})

test('hora local de Madrid y actividad con tarjeta no insertada', () => {
  const dias = [
    // 22:00–23:00 UTC conducción = 23:00–00:00 hora local de invierno
    dia('2024-01-01', [['00:00', 'DESCANSO'], ['22:00', 'CONDUCCION'], ['23:00', 'DESCANSO']]),
    dia('2024-01-02', [['00:00', 'DESCANSO'], ['08:00', 'TRABAJO', { noInsertada: true, manual: true }], ['09:00', 'DESCANSO', { noInsertada: true }]]),
  ]
  const r = analizar({ dias: lee(dias).dias }, CONFIG_POR_DEFECTO)
  const d1 = r.dias.find((d) => d.fecha === '2024-01-01')
  assert.equal(d1.inicio, '23:00')
  assert.equal(d1.nocturno, 60)
  const d2 = r.dias.find((d) => d.fecha === '2024-01-02')
  assert.equal(d2.trabajo, 60)
  assert.equal(d2.manual, 60)
  assert.ok(d2.desconocido > 0)
})

test('cuatro años de datos se procesan en un tiempo razonable', () => {
  const dias = []
  let f = Date.parse('2021-01-01T00:00:00Z')
  const fin = Date.parse('2024-12-31T00:00:00Z')
  while (f <= fin) {
    const fecha = new Date(f).toISOString().slice(0, 10)
    const dow = new Date(f).getUTCDay()
    if (dow !== 0 && dow !== 6) {
      dias.push(dia(fecha, [['00:00', 'DESCANSO'], ['05:00', 'CONDUCCION'], ['09:00', 'DESCANSO'], ['09:45', 'TRABAJO'], ['10:30', 'CONDUCCION'], ['14:30', 'DISPONIBILIDAD'], ['15:30', 'TRABAJO'], ['17:00', 'DESCANSO']], 450))
    }
    f += 86400000
  }
  // Varias descargas solapadas, como las que se hacen cada 28 días
  const lecturas = []
  for (let i = 0; i < dias.length; i += 200) lecturas.push(lee(dias.slice(Math.max(0, i - 20), i + 200), { tamBuffer: 60000, desplazamiento: 59000 }))
  const [g] = agruparPorConductor(lecturas)
  assert.equal(g.dias.length, dias.length)
  const t = Date.now()
  const r = analizar(g, CONFIG_POR_DEFECTO)
  const ms = Date.now() - t
  assert.equal(r.anios.length, 4)
  assert.ok(ms < 5000, `tardó ${ms} ms`)
  assert.ok(r.totales.trabajoEfectivo > 0)
})

test('conducción en equipo: 9 h de descanso en 30 h y disponibilidad de copiloto como pausa', () => {
  const eq = { tripulacion: true }
  const cop = { tripulacion: true, segundo: true }
  const dias = [
    dia('2024-01-01', [['00:00', 'DESCANSO'], ['02:00', 'CONDUCCION', eq], ['06:30', 'DISPONIBILIDAD', cop], ['11:00', 'CONDUCCION', eq], ['15:30', 'DISPONIBILIDAD', cop], ['20:00', 'CONDUCCION', eq], ['22:00', 'DESCANSO']]),
    dia('2024-01-02', [['00:00', 'DESCANSO'], ['07:00', 'CONDUCCION', eq], ['10:00', 'DESCANSO']]),
  ]
  const r = analizar({ dias: lee(dias).dias }, cfgUTC)
  const a = r.infracciones.map((i) => i.articulo)
  assert.equal(r.jornadas[0].descansoTipo, 'diario en equipo (9 h en 30 h)')
  assert.ok(!a.includes('Art. 8.5') && !a.includes('Art. 8.2'))
  assert.ok(!a.includes('Art. 7'))
  assert.ok(a.includes('Art. 6.1'))
})

test('detiene la lectura ante registros diarios dañados', () => {
  const dias = [1, 2, 3, 4].map((d) => dia(`2024-02-0${d}`, [['00:00', 'DESCANSO'], ['08:00', 'CONDUCCION'], ['12:00', 'DESCANSO']]))
  const bytes = generarTarjeta(dias, { desplazamiento: 0 })
  // El segundo registro (2 de febrero) se sustituye por una fecha posterior a la del tercero
  let tag = 0
  while (!(bytes[tag] === 0x05 && bytes[tag + 1] === 0x04 && bytes[tag + 2] === 0x00)) tag++
  const inicioBuffer = tag + 5 + 4 // cabecera TLV + punteros
  const len = 12 + 3 * 2
  const p = inicioBuffer + len + 4
  const falsa = Date.parse('2024-03-01T00:00:00Z') / 1000
  bytes[p] = (falsa >>> 24) & 255
  bytes[p + 1] = (falsa >>> 16) & 255
  bytes[p + 2] = (falsa >>> 8) & 255
  bytes[p + 3] = falsa & 255
  const l = leerArchivoTarjeta(bytes, 'dañado.ddd')
  assert.deepEqual(l.dias.map((d) => d.fecha), ['2024-02-03', '2024-02-04'])
  assert.ok(l.avisos.length > 0)
})

test('RD 1561/1995: jornada total > 12 h y descanso entre jornadas < 10 h (informativo)', () => {
  const dias = [
    // 12 h 30 min de trabajo efectivo con pausas suficientes; después, 9 h 30 min de descanso (reducido)
    dia('2024-01-01', [['00:00', 'DESCANSO'], ['04:00', 'CONDUCCION'], ['08:00', 'DESCANSO'], ['08:45', 'TRABAJO'], ['13:00', 'DESCANSO'], ['13:45', 'CONDUCCION'], ['18:00', 'DESCANSO']]),
    dia('2024-01-02', [['00:00', 'DESCANSO'], ['03:30', 'CONDUCCION'], ['07:30', 'DESCANSO']]),
    dia('2024-01-03', [['00:00', 'DESCANSO']]),
  ]
  const r = analizar({ dias: lee(dias).dias }, cfgUTC)
  const j12 = r.infracciones.find((i) => i.norma === 'RD 1561/1995' && i.articulo === 'Art. 8.2')
  assert.ok(j12, 'jornada > 12 h')
  assert.equal(j12.valor, 12 * 60 + 30)
  const d10 = r.infracciones.find((i) => i.norma === 'RD 1561/1995' && i.articulo === 'Art. 9')
  assert.ok(d10 && d10.informativa, 'descanso < 10 h informativo')
  assert.equal(d10.valor, 9 * 60 + 30)
})

test('RD 1561/1995: promedio de 48 h en periodos móviles de 4 o 6 meses', () => {
  // 1 de enero a 30 de junio de 2024: 9 h 30 min de trabajo de lunes a sábado (57 h/semana)
  const dias = []
  for (let d = 0; d < 182; d++) {
    const f = sumarDias('2024-01-01', d)
    const dow = new Date(f + 'T00:00:00Z').getUTCDay()
    if (dow === 0) dias.push(dia(f, [['00:00', 'DESCANSO']]))
    else dias.push(dia(f, [['00:00', 'DESCANSO'], ['06:00', 'CONDUCCION'], ['10:00', 'DESCANSO'], ['10:45', 'TRABAJO'], ['14:45', 'DESCANSO'], ['15:30', 'CONDUCCION'], ['17:00', 'DESCANSO']]))
  }
  const r4 = analizar({ dias: lee(dias, { tamBuffer: 60000 }).dias }, cfgUTC)
  const p4 = r4.infracciones.filter((i) => i.articulo === 'Art. 10 bis.1' && /48 h/.test(i.descripcion))
  assert.equal(r4.cuatrimestres.length, 3) // ene-abr, feb-may, mar-jun
  assert.equal(p4.length, 3)
  assert.match(r4.cuatrimestres[0].periodo, /ene 2024 – abr 2024/)
  const r6 = analizar({ dias: lee(dias, { tamBuffer: 60000 }).dias }, { ...cfgUTC, mesesReferencia: 6 })
  assert.equal(r6.cuatrimestres.length, 1)
  assert.equal(r6.infracciones.filter((i) => i.articulo === 'Art. 10 bis.1' && /48 h/.test(i.descripcion)).length, 1)
})

test('RD 1561/1995: menos de 4 descansos de 36 h en 4 semanas (informativo)', () => {
  // 1 a 28 de enero de 2024 (de lunes a domingo): se trabaja todos los días, sin descansos de 36 h
  const dias = []
  for (let d = 0; d < 28; d++) {
    dias.push(dia(sumarDias('2024-01-01', d), [['00:00', 'DESCANSO'], ['08:00', 'CONDUCCION'], ['12:00', 'DESCANSO'], ['12:45', 'CONDUCCION'], ['15:00', 'DESCANSO']]))
  }
  const r = analizar({ dias: lee(dias).dias }, cfgUTC)
  const sem = r.infracciones.filter((i) => i.norma === 'RD 1561/1995' && i.articulo === 'Art. 9' && /36 h/.test(i.descripcion))
  assert.equal(sem.length, 1)
  assert.ok(sem[0].informativa)
})

test('esperas: aviso informativo cuando la disponibilidad diaria es muy alta', () => {
  const dias = [dia('2024-01-01', [['00:00', 'DESCANSO'], ['06:00', 'CONDUCCION'], ['08:00', 'DISPONIBILIDAD'], ['14:30', 'CONDUCCION'], ['15:00', 'DESCANSO']])]
  const r = analizar({ dias: lee(dias).dias }, { ...cfgUTC, umbralEsperaH: 6 })
  const e = r.infracciones.find((i) => i.articulo === 'Art. 3')
  assert.ok(e && e.informativa)
  assert.equal(e.valor, 6 * 60 + 30)
  const r2 = analizar({ dias: lee(dias).dias }, { ...cfgUTC, umbralEsperaH: 0 })
  assert.equal(r2.infracciones.find((i) => i.articulo === 'Art. 3'), undefined)
})

test('países de la tarjeta: detecta trabajo en el extranjero (gen1 y gen2)', () => {
  for (const gen2 of [false, true]) {
    const dias = [
      dia('2024-01-08', [['00:00', 'DESCANSO'], ['06:00', 'CONDUCCION'], ['10:00', 'DESCANSO'], ['10:45', 'CONDUCCION'], ['14:00', 'DESCANSO']]),
      dia('2024-01-09', [['00:00', 'DESCANSO'], ['06:00', 'CONDUCCION'], ['10:00', 'DESCANSO'], ['10:45', 'CONDUCCION'], ['14:00', 'DESCANSO']]),
    ]
    const lugares = [
      { fecha: '2024-01-08', hora: '06:00', tipo: 0, pais: 0x0f },
      { fecha: '2024-01-08', hora: '14:00', tipo: 1, pais: 0x27 },
      { fecha: '2024-01-09', hora: '06:00', tipo: 0, pais: 0x27 },
      { fecha: '2024-01-09', hora: '14:00', tipo: 1, pais: 0x0f },
    ]
    const l = lee(dias, { gen2, lugares })
    assert.equal(l.lugares.length, 4)
    assert.equal(l.lugares[1].pais, 'P')
    assert.equal(l.lugares[1].esInicio, false)
    const [c] = agruparPorConductor([l])
    const r = analizar(c, cfgUTC)
    assert.equal(r.dias.find((d) => d.fecha === '2024-01-08').paises, 'E, P')
    const ext = r.infracciones.filter((i) => i.norma === 'Trabajo en el extranjero')
    assert.equal(ext.length, 1)
    assert.match(ext[0].descripcion, /\(P\) en 2 día/)
    assert.ok(ext[0].informativa)
  }
})

test('esperas de carga y descarga: más de 2 h de disponibilidad como trabajo efectivo (opcional)', () => {
  const dias = [dia('2024-01-01', [['00:00', 'DESCANSO'], ['06:00', 'CONDUCCION'], ['08:00', 'DISPONIBILIDAD'], ['13:00', 'CONDUCCION'], ['15:00', 'DESCANSO']])]
  const base = analizar({ dias: lee(dias).dias }, cfgUTC)
  assert.equal(base.dias[0].presencia, 5 * 60)
  assert.equal(base.dias[0].trabajoEfectivo, 4 * 60)
  const r = analizar({ dias: lee(dias).dias }, { ...cfgUTC, esperasComoTrabajo: true })
  assert.equal(r.dias[0].presencia, 2 * 60)
  assert.equal(r.dias[0].trabajoEfectivo, 7 * 60)
})

test('excepción del transporte internacional: dos descansos semanales reducidos fuera de España', () => {
  // 4 semanas: semanas 1 y 2 con descanso semanal reducido (30 h) en Portugal; semanas 3 y 4 con 48 h
  const jornada = [['00:00', 'DESCANSO'], ['06:00', 'CONDUCCION'], ['10:00', 'DESCANSO'], ['10:45', 'CONDUCCION'], ['14:00', 'DESCANSO']]
  const dias = []
  const lugares = []
  for (let d = 0; d < 28; d++) {
    const f = sumarDias('2024-01-01', d)
    const semana = Math.floor(d / 7)
    const dow = d % 7 // 0 = lunes
    const reducido = semana < 2
    // reducido: se trabaja hasta el sábado y se vuelve el domingo a las 20:00 (30 h); normal: libre sábado y domingo
    if ((reducido && dow === 6) || (!reducido && dow >= 5)) {
      dias.push(dia(f, reducido ? [['00:00', 'DESCANSO'], ['20:00', 'CONDUCCION'], ['22:00', 'DESCANSO']] : [['00:00', 'DESCANSO']]))
      continue
    }
    dias.push(dia(f, jornada))
    lugares.push({ fecha: f, hora: '06:00', tipo: 0, pais: semana < 2 ? 0x27 : 0x0f }, { fecha: f, hora: '14:00', tipo: 1, pais: semana < 2 ? 0x27 : 0x0f })
  }
  const [c] = agruparPorConductor([lee(dias, { lugares, tamBuffer: 30000 })])
  const r = analizar(c, cfgUTC)
  const art86 = r.infracciones.filter((i) => i.articulo === 'Art. 8.6' && /consecutivos/.test(i.descripcion))
  assert.equal(art86.length, 1)
  assert.ok(art86[0].informativa, art86[0].descripcion)
  assert.match(art86[0].descripcion, /excepción del transporte internacional/)
})
