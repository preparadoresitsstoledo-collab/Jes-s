// Generador de archivos sintéticos de tarjeta de conductor (formato gen1/gen2)
// para las pruebas del lector y del motor de análisis.

const CODIGO = { DESCANSO: 0, DISPONIBILIDAD: 1, TRABAJO: 2, CONDUCCION: 3 }

function u16(v) {
  return [(v >> 8) & 255, v & 255]
}
function u32(v) {
  return [(v >>> 24) & 255, (v >>> 16) & 255, (v >>> 8) & 255, v & 255]
}
function nombre(s, n = 36) {
  const b = new Array(n).fill(0x20)
  b[0] = 1 // ISO-8859-1
  const bytes = Buffer.from(s, 'latin1')
  for (let i = 0; i < bytes.length && i < n - 1; i++) b[i + 1] = bytes[i]
  return b
}
function ia5(s, n) {
  const b = new Array(n).fill(0x20)
  for (let i = 0; i < s.length && i < n; i++) b[i] = s.charCodeAt(i)
  return b
}
function seg(fecha) {
  return Math.floor(Date.parse(fecha + 'T00:00:00Z') / 1000)
}
function tlv(fid, apendice, datos) {
  return [...u16(fid), apendice, ...u16(datos.length), ...datos]
}

// 'HH:MM' → minutos
export function m(hhmm) {
  const [h, mi] = hhmm.split(':').map(Number)
  return h * 60 + mi
}

/**
 * dias: [{ fecha: 'AAAA-MM-DD', cambios: [[minuto, 'CONDUCCION', {noInsertada, manual}], ...], km }]
 * opciones: { apellidos, nombre, numero, tamBuffer, desplazamiento, gen2, vehiculos }
 */
export function generarTarjeta(dias, opciones = {}) {
  const {
    apellidos = 'GARCÍA LÓPEZ',
    nombre: nombrePila = 'JOSÉ',
    numero = 'E1234567890120',
    tamBuffer = 13776,
    desplazamiento = 13000, // fuerza la vuelta del búfer circular
    gen2 = false,
    vehiculos = [],
  } = opciones

  const ident = [
    0x0f, ...ia5(numero + '00', 16), ...nombre('DGT'),
    ...u32(seg('2020-01-01')), ...u32(seg('2020-01-01')), ...u32(seg('2030-01-01')),
    ...nombre(apellidos), ...nombre(nombrePila), 0x19, 0x80, 0x05, 0x14, 0x65, 0x73,
  ]

  // Registros diarios en búfer circular
  const buf = new Array(tamBuffer).fill(0)
  let pos = desplazamiento % tamBuffer
  let prevLen = 0
  let antiguo = pos
  let reciente = pos
  dias.forEach((d, i) => {
    const cambios = d.cambios.map(([min, act, f = {}]) => {
      let v = min & 0x7ff
      v |= CODIGO[act] << 11
      if (f.noInsertada) v |= 0x2000
      if (f.manual || f.tripulacion) v |= 0x4000
      if (f.segundo) v |= 0x8000
      return v
    })
    const len = 12 + cambios.length * 2
    const n = (i + 1) % 10000 // contador de presencia diaria en BCD
    const contador = [(Math.floor(n / 1000) << 4) | Math.floor(n / 100) % 10, (Math.floor(n / 10) % 10 << 4) | n % 10]
    const bytes = [...u16(prevLen), ...u16(len), ...u32(seg(d.fecha)), ...contador, ...u16(d.km || 0)]
    for (const c of cambios) bytes.push(...u16(c))
    if (i === 0) antiguo = pos
    reciente = pos
    for (let k = 0; k < bytes.length; k++) buf[(pos + k) % tamBuffer] = bytes[k]
    pos = (pos + len) % tamBuffer
    prevLen = len
  })
  const actividad = [...u16(antiguo), ...u16(reciente), ...buf]

  const tam = gen2 ? 48 : 31
  const veh = [...u16(vehiculos.length)]
  for (const v of vehiculos) {
    const r = [
      0, 0, 100, 0, 1, 44, ...u32(seg(v.desde)), ...u32(seg(v.hasta) + 86399),
      0x0f, ...nombre(v.matricula, 14), 0, 1,
    ]
    if (gen2) r.push(...ia5('VF1TESTVIN0000000', 17))
    veh.push(...r.slice(0, tam))
  }

  const ap = gen2 ? 2 : 0
  // EF Application_Identification: tamaños de las estructuras de la tarjeta
  const aplicacion = gen2
    ? [1, 1, 0, 12, 24, ...u16(tamBuffer), ...u16(vehiculos.length), ...u16(0), ...u16(0), ...u16(0), ...u16(0)]
    : [1, 0, 0, 12, 24, ...u16(tamBuffer), ...u16(vehiculos.length), 0]
  const bytes = [
    ...tlv(0x0002, ap, new Array(25).fill(1)),
    ...tlv(0x0501, ap, aplicacion),
    ...tlv(0x0520, ap, ident),
    ...tlv(0x0520, ap + 1, new Array(gen2 ? 64 : 128).fill(7)),
    ...tlv(0x0504, ap, actividad),
    ...tlv(0x0504, ap + 1, new Array(gen2 ? 64 : 128).fill(7)),
    ...tlv(0x0505, ap, veh),
  ]
  return Uint8Array.from(bytes)
}
