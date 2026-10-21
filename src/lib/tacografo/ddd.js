// Lector de archivos de descarga de la TARJETA DE CONDUCTOR del tacógrafo
// digital (.DDD, .TGD, .C1B…), 1.ª y 2.ª generación (Reglamento de Ejecución
// (UE) 2016/799, anexo IC, apéndices 1 y 7).
//
// El archivo es una secuencia TLV: etiqueta de 3 bytes (identificador de
// fichero elemental de 2 bytes + 1 byte de apéndice: 00 datos gen1, 01 firma
// gen1, 02 datos gen2, 03 firma gen2), longitud de 2 bytes big-endian y datos.
// Todas las horas del tacógrafo están en UTC.

export const ACT = {
  DESCANSO: 'DESCANSO',
  DISPONIBILIDAD: 'DISPONIBILIDAD',
  TRABAJO: 'TRABAJO',
  CONDUCCION: 'CONDUCCION',
  DESCONOCIDO: 'DESCONOCIDO', // tarjeta no insertada y actividad no registrada
  SIN_DATOS: 'SIN_DATOS', // día sin registro en la tarjeta
}

const ACT_POR_CODIGO = [ACT.DESCANSO, ACT.DISPONIBILIDAD, ACT.TRABAJO, ACT.CONDUCCION]

const EF = {
  IDENTIFICACION: 0x0520,
  ACTIVIDAD: 0x0504,
  VEHICULOS: 0x0505,
  LUGARES: 0x0506,
  DESCARGA: 0x050e,
}

const DIA_MS = 86400000

function be16(b, p) {
  return (b[p] << 8) | b[p + 1]
}
function be24(b, p) {
  return (b[p] << 16) | (b[p + 1] << 8) | b[p + 2]
}
function be32(b, p) {
  return ((b[p] << 24) >>> 0) + ((b[p + 1] << 16) | (b[p + 2] << 8) | b[p + 3])
}

// TimeReal: segundos desde 1970-01-01 00:00 UTC (0 o 0xFFFFFFFF = sin valor)
function timeReal(b, p) {
  const s = be32(b, p)
  if (s === 0 || s === 0xffffffff) return null
  return s * 1000
}

function bcd(b, p, n) {
  let s = ''
  for (let i = 0; i < n; i++) s += (b[p + i] >> 4).toString(16) + (b[p + i] & 15).toString(16)
  return /^\d+$/.test(s) ? parseInt(s, 10) : null
}

const decodificadores = {}
function decodificador(codePage) {
  let etiqueta = 'iso-8859-1'
  if (codePage >= 1 && codePage <= 16 && codePage !== 12) etiqueta = `iso-8859-${codePage}`
  else if (codePage === 80) etiqueta = 'koi8-r'
  else if (codePage === 85) etiqueta = 'koi8-u'
  if (!decodificadores[etiqueta]) {
    try {
      decodificadores[etiqueta] = new TextDecoder(etiqueta)
    } catch {
      decodificadores[etiqueta] = new TextDecoder('iso-8859-1')
    }
  }
  return decodificadores[etiqueta]
}

// Cadena con byte de página de códigos delante (Name, VehicleRegistrationNumber…)
function texto(b, p, n) {
  const dec = decodificador(b[p])
  return limpiar(dec.decode(b.subarray(p + 1, p + n)))
}
// Cadena IA5 sin página de códigos (CardNumber)
function ia5(b, p, n) {
  return limpiar(new TextDecoder('iso-8859-1').decode(b.subarray(p, p + n)))
}
function limpiar(s) {
  // eslint-disable-next-line no-control-regex
  return s.replace(/[\u0000ÿ]/g, ' ').replace(/\s+/g, ' ').trim()
}

// Códigos NationNumeric más habituales (apéndice 1, 2.101)
const NACIONES = {
  0x01: 'A', 0x02: 'AL', 0x03: 'AND', 0x04: 'ARM', 0x05: 'AZ', 0x06: 'B', 0x07: 'BG',
  0x08: 'BIH', 0x09: 'BY', 0x0a: 'CH', 0x0b: 'CY', 0x0c: 'CZ', 0x0d: 'D', 0x0e: 'DK',
  0x0f: 'E', 0x10: 'EST', 0x11: 'F', 0x12: 'FIN', 0x13: 'FL', 0x14: 'FR', 0x15: 'UK',
  0x16: 'GE', 0x17: 'GR', 0x18: 'H', 0x19: 'HR', 0x1a: 'I', 0x1b: 'IRL', 0x1c: 'IS',
  0x1d: 'KZ', 0x1e: 'L', 0x1f: 'LT', 0x20: 'LV', 0x21: 'M', 0x22: 'MC', 0x23: 'MD',
  0x24: 'MK', 0x25: 'N', 0x26: 'NL', 0x27: 'P', 0x28: 'PL', 0x29: 'RO', 0x2a: 'RSM',
  0x2b: 'RUS', 0x2c: 'S', 0x2d: 'SK', 0x2e: 'SLO', 0x2f: 'TM', 0x30: 'TR', 0x31: 'UA',
  0x32: 'V', 0x33: 'YU', 0x34: 'MNE', 0x35: 'SRB', 0x36: 'UZ', 0x37: 'TJ', 0x38: 'KG',
  0xfd: 'EC', 0xfe: 'EUR', 0xff: 'WLD',
}
export function nacion(c) {
  return NACIONES[c] || (c ? `#${c}` : '')
}

// Separa el archivo en bloques TLV
function leerBloques(b) {
  const bloques = []
  let p = 0
  while (p + 5 <= b.length) {
    const etiqueta = be24(b, p)
    const longitud = be16(b, p + 3)
    if ((etiqueta === 0 || etiqueta === 0xffffff) && (longitud === 0 || longitud === 0xffff)) break
    const fin = p + 5 + longitud
    if (fin > b.length) throw new Error(`Bloque 0x${etiqueta.toString(16)} truncado (archivo incompleto)`)
    bloques.push({ fid: etiqueta >> 8, apendice: etiqueta & 0xff, datos: b.subarray(p + 5, fin) })
    p = fin
  }
  return bloques
}

function leerIdentificacion(d) {
  if (d.length < 65 + 78) return null
  const fn = bcd(d, 65 + 72, 2)
  const mes = bcd(d, 65 + 74, 1)
  const dia = bcd(d, 65 + 75, 1)
  return {
    tarjeta: {
      pais: nacion(d[0]),
      numero: ia5(d, 1, 16),
      autoridad: texto(d, 17, 36),
      emision: timeReal(d, 53),
      validezDesde: timeReal(d, 57),
      caducidad: timeReal(d, 61),
    },
    titular: {
      apellidos: texto(d, 65, 36),
      nombre: texto(d, 101, 36),
      fechaNacimiento:
        fn && mes && dia ? `${fn}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}` : '',
    },
  }
}

// Decodifica un ActivityChangeInfo (2 bytes): 'scpaattttttttttt'
function cambioActividad(v) {
  const ranura = v & 0x8000 ? 'segundo conductor' : 'conductor'
  const bitC = (v & 0x4000) !== 0
  const noInsertada = (v & 0x2000) !== 0
  const codigo = (v >> 11) & 3
  const minuto = v & 0x07ff
  let actividad = ACT_POR_CODIGO[codigo]
  let manual = false
  if (noInsertada) {
    // Con la tarjeta no insertada el bit 'c' indica si la actividad es conocida
    // (introducida manualmente) o desconocida.
    if (bitC) manual = true
    else actividad = ACT.DESCONOCIDO
  }
  return {
    minuto,
    actividad,
    ranura,
    tripulacion: !noInsertada && bitC,
    tarjetaInsertada: !noInsertada,
    manual,
  }
}

// EF Driver_Activity_Data: punteros + búfer circular de CardActivityDailyRecord
function leerActividad(d, avisos) {
  if (d.length < 8) return []
  const punteroAntiguo = be16(d, 0)
  const punteroReciente = be16(d, 2)
  const buf = d.subarray(4)
  const n = buf.length
  if (punteroReciente >= n || punteroAntiguo >= n) {
    avisos.push('Punteros de actividad fuera de rango: se ignoran las actividades')
    return []
  }
  const byte = (i) => buf[((i % n) + n) % n]
  const u16 = (i) => (byte(i) << 8) | byte(i + 1)

  const registros = []
  let pos = punteroReciente
  const vistos = new Set()
  for (let guard = 0; guard < 3000; guard++) {
    if (vistos.has(pos)) break
    vistos.add(pos)
    const prev = u16(pos)
    const len = u16(pos + 2)
    if (len < 12 || len > 12 + 1440 * 2 || (len - 12) % 2 !== 0 || len > n) {
      if (guard === 0) avisos.push('Registro diario de actividad con longitud no válida')
      break
    }
    const fechaS =
      ((byte(pos + 4) << 24) >>> 0) + ((byte(pos + 5) << 16) | (byte(pos + 6) << 8) | byte(pos + 7))
    const fechaMs = fechaS * 1000
    const anio = new Date(fechaMs).getUTCFullYear()
    if (anio < 1995 || anio > 2100) break
    // Recorriendo hacia atrás las fechas deben ser estrictamente decrecientes
    if (registros.length && fechaMs >= registros[registros.length - 1].inicioMs) {
      avisos.push('Registros de actividad desordenados: se detiene la lectura en el punto dañado')
      break
    }
    const contadorBcd = [byte(pos + 8), byte(pos + 9)]
    const contador = bcd(Uint8Array.from(contadorBcd), 0, 2)
    const distancia = u16(pos + 10)
    const cambios = []
    for (let k = pos + 12; k < pos + len; k += 2) cambios.push(cambioActividad(u16(k)))
    registros.push({
      fecha: new Date(fechaMs - (fechaMs % DIA_MS)).toISOString().slice(0, 10),
      inicioMs: fechaMs - (fechaMs % DIA_MS),
      contador,
      distancia,
      cambios: cambios.filter((c) => c.minuto < 1440),
    })
    if (pos === punteroAntiguo || prev === 0) break
    pos = (((pos - prev) % n) + n) % n
  }
  return registros.reverse()
}

// EF Vehicles_Used: registros de 31 bytes (gen1) o 48 bytes (gen2, añade VIN)
function leerVehiculos(d, gen2) {
  const tam = gen2 ? 48 : 31
  const vehiculos = []
  for (let p = 2; p + tam <= d.length; p += tam) {
    const primerUso = timeReal(d, p + 6)
    const ultimoUso = timeReal(d, p + 10)
    if (!primerUso) continue
    const kmIni = be24(d, p)
    const kmFin = be24(d, p + 3)
    vehiculos.push({
      primerUso,
      ultimoUso: ultimoUso || primerUso,
      kmInicio: kmIni,
      kmFin: kmFin,
      pais: nacion(d[p + 14]),
      matricula: texto(d, p + 15, 14),
      vin: gen2 ? ia5(d, p + 31, 17) : '',
    })
  }
  return vehiculos.sort((a, b) => a.primerUso - b.primerUso)
}

// EF Places: país y región introducidos al empezar y terminar cada periodo de trabajo diario.
// gen1: puntero de 1 byte y registros de 10 bytes; gen2: puntero de 2 bytes y registros de 21 bytes
// (añaden la posición GNSS, que no se usa aquí).
const TIPOS_LUGAR = ['inicio', 'fin', 'inicio (manual)', 'fin (manual)', 'inicio (supuesto)', 'fin (supuesto)']
function leerLugares(d, gen2) {
  const tam = gen2 ? 21 : 10
  const lugares = []
  for (let p = gen2 ? 2 : 1; p + tam <= d.length; p += tam) {
    const ms = timeReal(d, p)
    if (!ms) continue
    const tipo = d[p + 4]
    lugares.push({
      ms,
      tipo: TIPOS_LUGAR[tipo] || 'otro',
      esInicio: tipo % 2 === 0,
      pais: nacion(d[p + 5]),
      region: d[p + 6],
      km: be24(d, p + 7),
    })
  }
  return lugares.sort((a, b) => a.ms - b.ms)
}

// Detecta descargas de la UNIDAD INTRAVEHICULAR (archivos V): comienzan por 0x76
function esArchivoVehiculo(b) {
  return b.length > 2 && b[0] === 0x76 && ((b[1] >= 0x01 && b[1] <= 0x05) || (b[1] >= 0x21 && b[1] <= 0x35))
}

// Elige, para cada fecha, el registro diario más completo
export function fusionarDias(listas) {
  const porFecha = new Map()
  for (const lista of listas) {
    for (const r of lista) {
      const previo = porFecha.get(r.fecha)
      if (!previo || r.cambios.length > previo.cambios.length) porFecha.set(r.fecha, r)
    }
  }
  return [...porFecha.values()].sort((a, b) => a.inicioMs - b.inicioMs)
}

/**
 * Lee un archivo de tarjeta de conductor.
 * @param {ArrayBuffer|Uint8Array} entrada
 * @param {string} nombre nombre del archivo (solo informativo)
 */
export function leerArchivoTarjeta(entrada, nombre = '') {
  const b = entrada instanceof Uint8Array ? entrada : new Uint8Array(entrada)
  const avisos = []
  if (esArchivoVehiculo(b)) {
    throw new Error('Es una descarga de vehículo (archivo V). Solo se admiten archivos de tarjeta de conductor (C).')
  }
  const bloques = leerBloques(b)
  const datos = (fid, gen2) => bloques.find((x) => x.fid === fid && x.apendice === (gen2 ? 2 : 0))

  const id2 = datos(EF.IDENTIFICACION, true)
  const id1 = datos(EF.IDENTIFICACION, false)
  const ident = (id2 && leerIdentificacion(id2.datos)) || (id1 && leerIdentificacion(id1.datos))
  if (!ident) throw new Error('No contiene la identificación de una tarjeta de conductor')

  const act1 = datos(EF.ACTIVIDAD, false)
  const act2 = datos(EF.ACTIVIDAD, true)
  if (!act1 && !act2) throw new Error('No contiene datos de actividad del conductor')
  const dias = fusionarDias([
    act1 ? leerActividad(act1.datos, avisos) : [],
    act2 ? leerActividad(act2.datos, avisos) : [],
  ])

  const veh2 = datos(EF.VEHICULOS, true)
  const veh1 = datos(EF.VEHICULOS, false)
  let vehiculos = []
  try {
    vehiculos = veh2 ? leerVehiculos(veh2.datos, true) : veh1 ? leerVehiculos(veh1.datos, false) : []
  } catch {
    avisos.push('No se pudieron leer los vehículos utilizados')
  }

  const lug2 = datos(EF.LUGARES, true)
  const lug1 = datos(EF.LUGARES, false)
  let lugares = []
  try {
    lugares = lug2 ? leerLugares(lug2.datos, true) : lug1 ? leerLugares(lug1.datos, false) : []
  } catch {
    avisos.push('No se pudieron leer los lugares (países) de inicio y fin de jornada')
  }

  const descarga = datos(EF.DESCARGA, true) || datos(EF.DESCARGA, false)

  return {
    nombre,
    generacion: act2 || id2 ? 2 : 1,
    ...ident,
    ultimaDescarga: descarga && descarga.datos.length >= 4 ? timeReal(descarga.datos, 0) : null,
    dias,
    vehiculos,
    lugares,
    avisos,
  }
}
