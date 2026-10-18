// Utilidades de fecha y hora con zona horaria (las horas del tacógrafo son UTC;
// el análisis laboral se hace en hora local, por defecto Europe/Madrid).

export const MIN = 60000
export const HORA = 60 * MIN
export const DIA = 24 * HORA

const formateadores = {}
function formateador(tz) {
  if (!formateadores[tz]) {
    formateadores[tz] = new Intl.DateTimeFormat('en-GB', {
      timeZone: tz,
      hourCycle: 'h23',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }
  return formateadores[tz]
}

const cacheOffset = new Map()
// Desfase (ms) de la zona respecto a UTC en el instante dado
export function desfase(ms, tz) {
  if (tz === 'UTC') return 0
  const clave = tz + Math.floor(ms / HORA)
  const c = cacheOffset.get(clave)
  if (c !== undefined) return c
  const partes = {}
  for (const p of formateador(tz).formatToParts(new Date(ms))) partes[p.type] = p.value
  const local = Date.UTC(+partes.year, +partes.month - 1, +partes.day, +partes.hour, +partes.minute, +partes.second)
  const off = local - Math.floor(ms / 1000) * 1000
  cacheOffset.set(clave, off)
  return off
}

// Fecha local 'AAAA-MM-DD' de un instante
export function fechaLocal(ms, tz) {
  return new Date(ms + desfase(ms, tz)).toISOString().slice(0, 10)
}

// Hora local 'HH:MM' de un instante
export function horaLocal(ms, tz) {
  return new Date(ms + desfase(ms, tz)).toISOString().slice(11, 16)
}

export function fechaHoraLocal(ms, tz) {
  const d = new Date(ms + desfase(ms, tz)).toISOString()
  return `${d.slice(8, 10)}/${d.slice(5, 7)}/${d.slice(0, 4)} ${d.slice(11, 16)}`
}

// Instante UTC de las 00:00 locales del día 'AAAA-MM-DD'
export function inicioDia(fecha, tz) {
  const [a, m, d] = fecha.split('-').map(Number)
  const base = Date.UTC(a, m - 1, d)
  let t = base - desfase(base, tz)
  t = base - desfase(t, tz)
  return t
}

export function sumarDias(fecha, n) {
  const [a, m, d] = fecha.split('-').map(Number)
  return new Date(Date.UTC(a, m - 1, d + n)).toISOString().slice(0, 10)
}

// Lunes de la semana de la fecha dada
export function lunesDe(fecha) {
  const [a, m, d] = fecha.split('-').map(Number)
  const dow = (new Date(Date.UTC(a, m - 1, d)).getUTCDay() + 6) % 7
  return sumarDias(fecha, -dow)
}

export function diaSemana(fecha) {
  const [a, m, d] = fecha.split('-').map(Number)
  return ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'][
    new Date(Date.UTC(a, m - 1, d)).getUTCDay()
  ]
}

export function diasEnAnio(anio) {
  return (anio % 4 === 0 && anio % 100 !== 0) || anio % 400 === 0 ? 366 : 365
}

export function diasEntre(desde, hasta) {
  const a = Date.parse(desde + 'T00:00:00Z')
  const b = Date.parse(hasta + 'T00:00:00Z')
  return Math.round((b - a) / DIA) + 1
}

export function fechaES(fecha) {
  return fecha ? `${fecha.slice(8, 10)}/${fecha.slice(5, 7)}/${fecha.slice(0, 4)}` : ''
}

// Minutos → 'H:MM'
export function hhmm(minutos) {
  const s = minutos < 0 ? '-' : ''
  const m = Math.round(Math.abs(minutos))
  return `${s}${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`
}

export const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]
