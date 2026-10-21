// Motor de cálculo de «Dietas y jornada anual».
//
// Compara, por trabajador y año, los días efectivamente trabajados (inferidos
// de las dietas abonadas en nómina y de la actividad del tacógrafo) con los días
// hábiles teóricos que resultan de la jornada máxima anual del convenio, y
// analiza la regularidad de los importes de las dietas.

import { CONFIG_POR_DEFECTO, LIMITES_EXENTOS, TIPOS_DIETA, TIPOS_COTIZACION, CONCEPTOS_COTIZACION } from '../../data/dietasJornada.js'
import { diasEnAnio, diasEntre, sumarDias, MESES } from '../tacografo/tiempo.js'
import { precioHoraConvenio } from '../../data/conveniosTransporte.js'

// ─────────────────────────── Utilidades ───────────────────────────

// Convierte '1.234,56', '52,5', '52.50' o 52 en número; '' o no válido → null
export function aNumero(v) {
  if (v === null || v === undefined) return null
  if (typeof v === 'number') return Number.isFinite(v) ? v : null
  let s = String(v).trim().replace(/[€\s]/g, '')
  if (!s) return null
  if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.')
  const n = Number(s)
  return Number.isFinite(n) ? n : null
}

export function redondear(x, modo) {
  if (modo === 'superior') return Math.ceil(x - 1e-9)
  if (modo === 'inferior') return Math.floor(x + 1e-9)
  if (modo === 'ninguno') return Math.round(x * 100) / 100
  return Math.round(x + 1e-9)
}

const maxF = (a, b) => (a > b ? a : b)
const minF = (a, b) => (a < b ? a : b)
const diasMes = (anio, mes) => new Date(Date.UTC(anio, mes, 0)).getUTCDate()

export function normalizarConfig(cfg = {}) {
  const c = { ...CONFIG_POR_DEFECTO, ...cfg }
  for (const k of ['jornadaAnual', 'jornadaDiaria', 'vacacionesAnuales', 'limiteHEAnual']) {
    const n = aNumero(c[k])
    c[k] = n && n > 0 ? n : CONFIG_POR_DEFECTO[k]
  }
  return c
}

// Años naturales comprendidos en el periodo
export function aniosDelPeriodo(desde, hasta) {
  if (!desde || !hasta || desde > hasta) return []
  const r = []
  for (let y = +desde.slice(0, 4); y <= +hasta.slice(0, 4); y++) r.push(String(y))
  return r
}

// Fracción de año (0–1) que representa el tramo [desde, hasta] dentro de un mismo año
export function fraccionAnio(desde, hasta, modo) {
  if (!desde || !hasta || desde > hasta) return 0
  const anio = +desde.slice(0, 4)
  if (modo === 'dias') return diasEntre(desde, hasta) / diasEnAnio(anio)
  let suma = 0
  for (let m = +desde.slice(5, 7); m <= +hasta.slice(5, 7); m++) {
    const dm = diasMes(anio, m)
    const ini = `${anio}-${String(m).padStart(2, '0')}-01`
    const fin = `${anio}-${String(m).padStart(2, '0')}-${String(dm).padStart(2, '0')}`
    suma += diasEntre(maxF(ini, desde), minF(fin, hasta)) / dm
  }
  return suma / 12
}

// Días de [a1, b1] que caen dentro de [a2, b2]
function solape(a1, b1, a2, b2) {
  const a = maxF(a1, a2)
  const b = minF(b1, b2)
  return a <= b ? diasEntre(a, b) : 0
}

// ─────────────────────────── Trabajadores ───────────────────────────

let contador = 0
export function nuevoTrabajador(datos = {}) {
  contador++
  return {
    id: `t${Date.now().toString(36)}${contador}`,
    nombre: '',
    dni: '',
    naf: '', // número de afiliación a la Seguridad Social
    // Datos de afiliación para la hoja de bases (como en la relación nominal de trabajadores)
    afiliacion: { cto: '', ctp: '', gr: '', cnae: '', ocupacion: '', trl: '' },
    rnt: [], // líneas mensuales cotizadas { mes, desde, hasta, dias, cto, ctp, gr, cnae, ocupacion, trl, ccom, atep, hefm, her }
    categoria: '', // categoría profesional del convenio (vacía = la por defecto)
    bienios: '', // antigüedad: nº de bienios (0-2) y quinquenios (0-3)
    quinquenios: '',
    alta: '',
    baja: '',
    // Valores manuales por año (prevalecen sobre los calculados):
    // { '2023': { diasDieta, diasTacografo, horasEfectivas, horasPresencia, diasIT, vacaciones, diasEnVacaciones } }
    anios: {},
    dietas: [], // líneas de nómina { mes: 'AAAA-MM', tipo, dias, importe }
    vacaciones: [], // periodos { desde, hasta }
    tacografo: null, // { fechas: ['AAAA-MM-DD'], minutos: { fecha: min }, presencia: { fecha: min }, archivos: [] }
    ...datos,
  }
}

/**
 * Resume el resultado de analizar() del tacógrafo en lo que necesita esta herramienta:
 * fechas con actividad, minutos de trabajo efectivo (conducción + otros trabajos) y de
 * presencia (disponibilidad) por fecha.
 */
export function resumenTacografo(resultado, archivos = []) {
  const fechas = []
  const minutos = {}
  const presencia = {}
  const extranjero = {} // fecha → países distintos de España registrados en la tarjeta
  for (const d of resultado.dias) {
    if (!d.conActividad) continue
    fechas.push(d.fecha)
    minutos[d.fecha] = d.trabajoEfectivo
    presencia[d.fecha] = d.presencia
    const fuera = (d.paises || '').split(', ').filter((x) => x && x !== 'E')
    if (fuera.length) extranjero[d.fecha] = fuera.join(', ')
  }
  return { fechas, minutos, presencia, extranjero, desde: resultado.desde, hasta: resultado.hasta, archivos }
}

// ─────────────────────────── Cuadrante anual ───────────────────────────

/**
 * Calcula el cuadrante anual de un trabajador.
 * @returns {{ filas: object[], totales: object, periodo: {desde, hasta} }}
 */
export function cuadranteTrabajador(t, cfgEntrada) {
  const cfg = normalizarConfig(cfgEntrada)
  const desde = maxF(cfg.desde, t.alta || cfg.desde)
  const hasta = minF(cfg.hasta, t.baja || cfg.hasta)
  const diasAnualesTeoricos = cfg.jornadaAnual / cfg.jornadaDiaria
  const filas = []

  for (const anio of aniosDelPeriodo(desde, hasta)) {
    const a = maxF(`${anio}-01-01`, desde)
    const b = minF(`${anio}-12-31`, hasta)
    const completo = a === `${anio}-01-01` && b === `${anio}-12-31`
    const manual = t.anios?.[anio] || {}
    // Días del periodo en los que no hay obligación de trabajar (incapacidad temporal
    // y demás suspensiones del contrato): no generan jornada exigible.
    const diasPeriodo = diasEntre(a, b)
    const diasSuspension = Math.min(diasPeriodo, Math.max(0, aNumero(manual.diasIT) || 0))
    const diasComputables = diasPeriodo - diasSuspension
    const fraccion = fraccionAnio(a, b, cfg.prorrateo) * (diasComputables / diasPeriodo)
    // Jornada exigible en el tramo, en proporción a los días naturales del año
    const jornadaProporcional = Math.round(((cfg.jornadaAnual * diasComputables) / diasEnAnio(+anio)) * 100) / 100

    // Días con dieta: dato manual o suma de las líneas de nómina del año dentro del periodo
    const lineas = (t.dietas || []).filter((l) => l.mes?.slice(0, 4) === anio && l.mes >= a.slice(0, 7) && l.mes <= b.slice(0, 7))
    const diasDietaNominas = lineas.reduce((s, l) => s + (aNumero(l.dias) || 0), 0)
    const diasDieta = aNumero(manual.diasDieta) ?? (lineas.length ? diasDietaNominas : null)
    const importeDietas = lineas.reduce((s, l) => s + (aNumero(l.dias) || 0) * (aNumero(l.importe) || 0), 0)

    // Tacógrafo
    const fechasTac = (t.tacografo?.fechas || []).filter((f) => f >= a && f <= b)
    const aHoras = (min) => Math.round((min / 60) * 100) / 100
    const minEfectivo = fechasTac.reduce((s, f) => s + (t.tacografo.minutos?.[f] || 0), 0)
    const minPresencia = fechasTac.reduce((s, f) => s + (t.tacografo.presencia?.[f] || 0), 0)
    const diasTacografo = aNumero(manual.diasTacografo) ?? (t.tacografo ? fechasTac.length : null)
    const fechasExtranjero = fechasTac.filter((f) => t.tacografo?.extranjero?.[f])
    const paisesExtranjero = [...new Set(fechasExtranjero.flatMap((f) => t.tacografo.extranjero[f].split(', ')))]
    const diasDietaExtranjero = lineas.filter((l) => String(l.tipo).startsWith('extranjero')).reduce((s2, l) => s2 + (aNumero(l.dias) || 0), 0)
    const horasEfectivas = aNumero(manual.horasEfectivas) ?? (t.tacografo ? aHoras(minEfectivo) : null)
    const horasPresencia = aNumero(manual.horasPresencia) ?? (t.tacografo ? aHoras(minPresencia) : null)

    // Cómputo horario: el tiempo total registrado (trabajo efectivo + presencia) que
    // rebasa la jornada exigible es el exceso total. De él, la parte de trabajo efectivo
    // que supera la jornada son horas extraordinarias (arts. 35 ET y 147.2 y 149 LGSS);
    // el resto es exceso de tiempo de presencia (art. 8.3 RD 1561/1995).
    let excesoTotal = null
    let excesoHE = null
    let excesoPresencia = null
    if (horasEfectivas !== null || horasPresencia !== null) {
      const ef = horasEfectivas ?? 0
      const r2 = (x) => Math.round(x * 100) / 100
      excesoTotal = r2(Math.max(0, ef + (horasPresencia ?? 0) - jornadaProporcional))
      excesoHE = r2(Math.max(0, ef - jornadaProporcional))
      excesoPresencia = r2(excesoTotal - excesoHE)
    }

    // Vacaciones
    const periodosVac = (t.vacaciones || []).filter((p) => p.desde && p.hasta && p.desde <= p.hasta)
    const vacPeriodos = periodosVac.reduce((s, p) => s + solape(p.desde, p.hasta, a, b), 0)
    const vacaciones = aNumero(manual.vacaciones) ?? (periodosVac.length ? vacPeriodos : null)
    const enVacTac = fechasTac.filter((f) => periodosVac.some((p) => f >= p.desde && f <= p.hasta)).length
    const diasEnVacaciones = aNumero(manual.diasEnVacaciones) ?? (periodosVac.length && t.tacografo ? enVacTac : null)

    let diasTrabajados = null
    if (cfg.criterioDias === 'dietas') diasTrabajados = diasDieta
    else if (cfg.criterioDias === 'tacografo') diasTrabajados = diasTacografo
    else if (diasDieta !== null || diasTacografo !== null) diasTrabajados = Math.max(diasDieta ?? 0, diasTacografo ?? 0)

    const diasTeoricos = redondear(diasAnualesTeoricos * fraccion, cfg.redondeo)
    const vacacionesDebidas = redondear(cfg.vacacionesAnuales * fraccion, cfg.redondeo)
    const excesoDias = diasTrabajados === null ? null : Math.max(0, Math.round((diasTrabajados - diasTeoricos) * 100) / 100)
    const excesoHoras = excesoDias === null ? null : Math.round(excesoDias * cfg.jornadaDiaria * 100) / 100
    const precio = aNumero(cfg.preciosHE?.[anio])
    const jornadaTeorica = Math.round(diasTeoricos * cfg.jornadaDiaria * 100) / 100

    filas.push({
      anio,
      desde: a,
      hasta: b,
      completo,
      fraccion,
      diasTeoricos,
      jornadaTeorica,
      diasDieta,
      importeDietas,
      lineasDieta: lineas.length,
      diasTacografo,
      diasExtranjero: t.tacografo ? fechasExtranjero.length : null,
      paisesExtranjero,
      diasDietaExtranjero: lineas.length ? diasDietaExtranjero : null,
      diasPeriodo,
      diasSuspension,
      diasComputables,
      jornadaProporcional,
      excesoTotal,
      horasEfectivas,
      horasPresencia,
      excesoHE,
      excesoPresencia,
      diasTrabajados,
      excesoDias,
      excesoHoras,
      superaLimiteHE: excesoHoras !== null && excesoHoras > cfg.limiteHEAnual,
      vacaciones,
      vacacionesDebidas,
      deficitVacaciones: vacaciones === null ? null : Math.max(0, vacacionesDebidas - vacaciones),
      diasEnVacaciones,
      precioHE: precio,
      importeHE: precio && excesoHoras ? Math.round(precio * excesoHoras * 100) / 100 : null,
    })
  }

  const suma = (k) => filas.reduce((s, f) => s + (f[k] || 0), 0)
  const totales = {
    diasTeoricos: suma('diasTeoricos'),
    diasDieta: suma('diasDieta'),
    diasTacografo: suma('diasTacografo'),
    diasTrabajados: suma('diasTrabajados'),
    excesoDias: Math.round(suma('excesoDias') * 100) / 100,
    excesoHoras: Math.round(suma('excesoHoras') * 100) / 100,
    deficitVacaciones: suma('deficitVacaciones'),
    jornadaProporcional: Math.round(suma('jornadaProporcional') * 100) / 100,
    horasEfectivas: Math.round(suma('horasEfectivas') * 100) / 100,
    horasPresencia: Math.round(suma('horasPresencia') * 100) / 100,
    excesoTotal: Math.round(suma('excesoTotal') * 100) / 100,
    excesoHE: Math.round(suma('excesoHE') * 100) / 100,
    excesoPresencia: Math.round(suma('excesoPresencia') * 100) / 100,
    diasEnVacaciones: suma('diasEnVacaciones'),
    importeHE: Math.round(suma('importeHE') * 100) / 100,
    importeDietas: Math.round(suma('importeDietas') * 100) / 100,
    aniosConExceso: filas.filter((f) => f.excesoDias > 0).length,
    aniosSinVacaciones: filas.filter((f) => f.deficitVacaciones > 0).length,
  }
  return { filas, totales, periodo: { desde, hasta } }
}

// ─────────────────────────── Análisis de las dietas ───────────────────────────

/**
 * Analiza la regularidad de los importes de las dietas de un trabajador.
 * @param {object[]} lineas líneas de nómina { mes, tipo, dias, importe }
 * @param {object} limites importe diario exento por tipo
 */
export function analizarDietas(lineas = [], limites = LIMITES_EXENTOS) {
  const porTipo = []
  for (const tipo of TIPOS_DIETA) {
    const ls = lineas.filter((l) => l.tipo === tipo.id && aNumero(l.importe) !== null)
    if (!ls.length) continue
    const precios = [...new Set(ls.map((l) => aNumero(l.importe)))].sort((x, y) => x - y)
    const dias = ls.reduce((s, l) => s + (aNumero(l.dias) || 0), 0)
    const total = ls.reduce((s, l) => s + (aNumero(l.dias) || 0) * aNumero(l.importe), 0)
    const limite = aNumero(limites?.[tipo.id])
    const exceso = limite
      ? ls.reduce((s, l) => s + Math.max(0, aNumero(l.importe) - limite) * (aNumero(l.dias) || 0), 0)
      : 0
    porTipo.push({
      tipo: tipo.id,
      nombre: tipo.nombre,
      lineas: ls.length,
      dias,
      total: Math.round(total * 100) / 100,
      precios,
      min: precios[0],
      max: precios[precios.length - 1],
      media: dias ? Math.round((total / dias) * 100) / 100 : null,
      limite,
      excesoNoExento: Math.round(exceso * 100) / 100,
    })
  }

  // Nóminas (meses) con más de un precio para un mismo tipo de dieta
  const grupos = new Map()
  for (const l of lineas) {
    const imp = aNumero(l.importe)
    if (imp === null || !l.mes) continue
    const k = `${l.mes}|${l.tipo}`
    if (!grupos.has(k)) grupos.set(k, new Set())
    grupos.get(k).add(imp)
  }
  const mesesVariacion = [...grupos.entries()]
    .filter(([, s]) => s.size > 1)
    .map(([k, s]) => {
      const [mes, tipo] = k.split('|')
      return { mes, tipo, precios: [...s].sort((x, y) => x - y) }
    })
    .sort((x, y) => (x.mes < y.mes ? -1 : 1))

  const meses = new Set(lineas.filter((l) => l.mes && (aNumero(l.dias) || 0) > 0).map((l) => l.mes))
  return {
    porTipo,
    mesesVariacion,
    mesesConDieta: meses.size,
    preciosDistintos: new Set(lineas.map((l) => aNumero(l.importe)).filter((x) => x !== null)).size,
    excesoNoExento: Math.round(porTipo.reduce((s, x) => s + x.excesoNoExento, 0) * 100) / 100,
  }
}

// Meses del periodo (para saber si hay dietas «todos los meses»)
export function mesesDelPeriodo(desde, hasta) {
  if (!desde || !hasta || desde > hasta) return []
  const r = []
  let f = `${desde.slice(0, 7)}-01`
  while (f.slice(0, 7) <= hasta.slice(0, 7)) {
    r.push(f.slice(0, 7))
    f = sumarDias(f, diasMes(+f.slice(0, 4), +f.slice(5, 7)))
  }
  return r
}

// ─────────────────────────── Importación de dietas (CSV / Excel pegado) ───────────────────────────

export function mesDesdeTexto(txt) {
  const s = String(txt || '').trim().toLowerCase()
  let m = s.match(/^(\d{4})[-/.](\d{1,2})/)
  if (m) return `${m[1]}-${m[2].padStart(2, '0')}`
  m = s.match(/^(\d{1,2})[-/.](\d{4})$/)
  if (m) return `${m[2]}-${m[1].padStart(2, '0')}`
  m = s.match(/^\d{1,2}[-/.](\d{1,2})[-/.](\d{4})$/)
  if (m) return `${m[2]}-${m[1].padStart(2, '0')}`
  const i = MESES.findIndex((nombre) => s.startsWith(nombre) || s.startsWith(nombre.slice(0, 3)))
  m = s.match(/(\d{4})/)
  if (i >= 0 && m) return `${m[1]}-${String(i + 1).padStart(2, '0')}`
  return ''
}

export function tipoDesdeTexto(txt) {
  const s = String(txt || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
  if (TIPOS_DIETA.some((t) => t.id === s)) return s
  const extranjero = /extr|intern|portug|franc|europ|fuera/.test(s)
  const sin = /sin|media|1\/2|desay|comida|cena/.test(s) && !/con pern|completa/.test(s)
  const con = !sin && /con|pern|complet|entera/.test(s)
  return `${extranjero ? 'extranjero' : 'nacional'}_${con ? 'con' : 'sin'}`
}

/**
 * Lee líneas de dietas pegadas desde Excel o un CSV.
 * Columnas: trabajador ; mes ; tipo ; días ; importe por día
 * (la primera fila puede ser de cabecera). Separador: tabulador, «;» o «,».
 */
export function leerLineasDietas(texto) {
  const filas = String(texto || '')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
  if (!filas.length) return { lineas: [], errores: [] }
  const sep = filas[0].includes('\t') ? '\t' : filas[0].includes(';') ? ';' : ','
  const lineas = []
  const errores = []
  filas.forEach((fila, i) => {
    const c = fila.split(sep).map((x) => x.trim().replace(/^"|"$/g, ''))
    if (c.length < 5) {
      errores.push({ fila: i + 1, error: 'Faltan columnas (trabajador; mes; tipo; días; importe)' })
      return
    }
    const mes = mesDesdeTexto(c[1])
    const dias = aNumero(c[3])
    const importe = aNumero(c[4])
    if (!mes || dias === null || importe === null) {
      if (i > 0 || mes) errores.push({ fila: i + 1, error: 'Mes, días o importe no válidos' })
      return // la primera fila no válida se toma como cabecera
    }
    lineas.push({ trabajador: c[0], mes, tipo: tipoDesdeTexto(c[2]), dias, importe })
  })
  return { lineas, errores }
}

// Clave para emparejar trabajadores por nombre (sin acentos ni mayúsculas ni comas)
export function claveNombre(nombre) {
  return String(nombre || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9ñ ]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .sort()
    .join(' ')
}

export function buscarTrabajador(trabajadores, nombreODni) {
  const k = claveNombre(nombreODni)
  const dni = String(nombreODni || '').replace(/[\s-]/g, '').toUpperCase()
  return (
    trabajadores.find((t) => t.dni && t.dni.replace(/[\s-]/g, '').toUpperCase() === dni) ||
    trabajadores.find((t) => claveNombre(t.nombre) === k) ||
    null
  )
}

// ─────────────────────────── Resumen del expediente ───────────────────────────

export function resumenExpediente(trabajadores, cfg) {
  const datos = trabajadores.map((t) => ({
    trabajador: t,
    cuadrante: cuadranteTrabajador(t, cfg),
    dietas: analizarDietas(t.dietas),
  }))
  const conExcesoDias = datos.filter((d) => d.cuadrante.totales.excesoDias > 0)
  const conExceso = datos.filter((d) => d.cuadrante.totales.excesoDias > 0 || d.cuadrante.totales.excesoHE > 0 || d.cuadrante.totales.excesoPresencia > 0)
  const sinVacaciones = datos.filter((d) => d.cuadrante.totales.deficitVacaciones > 0)
  const conVacTrabajadas = datos.filter((d) => d.cuadrante.totales.diasEnVacaciones > 0)
  const conVariacion = datos.filter((d) => d.dietas.mesesVariacion.length > 0)
  return {
    datos,
    conExceso,
    conExcesoDias,
    sinVacaciones,
    conVacTrabajadas,
    conVariacion,
    excesoHoras: Math.round(datos.reduce((s, d) => s + d.cuadrante.totales.excesoHoras, 0) * 100) / 100,
    excesoDias: Math.round(datos.reduce((s, d) => s + d.cuadrante.totales.excesoDias, 0) * 100) / 100,
    importeHE: Math.round(datos.reduce((s, d) => s + d.cuadrante.totales.importeHE, 0) * 100) / 100,
    excesoNoExento: Math.round(datos.reduce((s, d) => s + d.dietas.excesoNoExento, 0) * 100) / 100,
    excesoHE: Math.round(datos.reduce((s, d) => s + d.cuadrante.totales.excesoHE, 0) * 100) / 100,
    excesoPresencia: Math.round(datos.reduce((s, d) => s + d.cuadrante.totales.excesoPresencia, 0) * 100) / 100,
    conHoras: datos.filter((d) => d.cuadrante.filas.some((f) => f.excesoHE !== null)),
  }
}

// ─────────────────────────── Valoración salarial y de cotización ───────────────────────────

// Tipos de cotización del año: los por defecto (o los del año más próximo) con los cambios del usuario
export function tiposDelAnio(anio, cfg = {}) {
  const anios = Object.keys(TIPOS_COTIZACION).map(Number)
  const cercano = anios.reduce((a, b) => (Math.abs(b - anio) < Math.abs(a - anio) ? b : a), anios[0])
  const base = TIPOS_COTIZACION[anio] || TIPOS_COTIZACION[cercano]
  const propios = cfg.tiposCotizacion?.[anio] || {}
  const r = {}
  for (const { id } of CONCEPTOS_COTIZACION) {
    const [e, t] = base[id] || [0, 0]
    r[id] = [aNumero(propios[id]?.[0]) ?? e, aNumero(propios[id]?.[1]) ?? t]
  }
  return r
}

const red2 = (x) => Math.round(x * 100) / 100

/**
 * Precio de la hora extraordinaria y de la ordinaria para un trabajador y año:
 * el introducido a mano para el año prevalece; si no, el que resulta de las
 * tablas del convenio seleccionado según la categoría y antigüedad del trabajador.
 */
export function preciosHora(t, anio, cfg) {
  const manualHE = aNumero(cfg.preciosHE?.[anio])
  const manualOrd = aNumero(cfg.preciosOrdinaria?.[anio])
  const conv = cfg.convenio
    ? precioHoraConvenio(cfg.convenio, anio, {
        categoria: t.categoria || cfg.categoria,
        bienios: t.bienios,
        quinquenios: t.quinquenios,
        plusTransporte: cfg.plusTransporteEnHora,
      })
    : null
  return {
    precioHE: manualHE ?? conv?.extra ?? null,
    precioOrd: manualOrd ?? conv?.ordinaria ?? null,
    origenPrecio: manualHE !== null || manualOrd !== null ? 'manual' : conv ? 'convenio' : null,
    detalle: conv?.detalle || '',
  }
}

// Importe de las dietas del año que se integra en la base de cotización
function dietasSalarioAnio(t, f, criterio) {
  if (criterio === 'ninguna') return 0
  const lineas = (t.dietas || []).filter((l) => l.mes?.slice(0, 4) === f.anio && l.mes >= f.desde.slice(0, 7) && l.mes <= f.hasta.slice(0, 7))
  return red2(
    lineas.reduce((s, l) => {
      const imp = aNumero(l.importe) || 0
      const dias = aNumero(l.dias) || 0
      if (criterio === 'todas') return s + imp * dias
      const lim = aNumero(LIMITES_EXENTOS[l.tipo])
      return s + (lim ? Math.max(0, imp - lim) * dias : 0)
    }, 0),
  )
}

/**
 * Diferencias salariales y de cotización por trabajador y año.
 * - Horas extraordinarias (cómputo horario del tacógrafo o, si no hay horas, exceso por días):
 *   cotizan en la base de contingencias profesionales (AT/EP, desempleo, FOGASA, FP)
 *   más la cotización adicional por horas extraordinarias.
 * - Exceso de presencia valorado a precio de hora ordinaria y dietas integradas:
 *   cotizan en ambas bases (CC, MEI, AT/EP, desempleo, FOGASA, FP).
 * No aplica topes de bases máximas ni cotización de solidaridad.
 */
export function valoracion(resumen, cfgEntrada) {
  const cfg = normalizarConfig(cfgEntrada)
  const filas = []
  for (const d of resumen.datos) {
    for (const f of d.cuadrante.filas) {
      const porHoras = f.excesoHE !== null
      const horasHE = porHoras ? f.excesoHE : f.excesoHoras || 0
      const horasOrd = porHoras ? f.excesoPresencia || 0 : 0
      const { precioHE, precioOrd, origenPrecio } = preciosHora(d.trabajador, f.anio, cfg)
      const importeHE = red2(horasHE * (precioHE || 0))
      const importeOrd = red2(horasOrd * (precioOrd || 0))
      const dietas = dietasSalarioAnio(d.trabajador, f, cfg.dietasSalario)
      const tipos = tiposDelAnio(+f.anio, cfg)
      const baseAmbas = importeOrd + dietas
      const cuotas = {}
      let empresa = 0
      let trabajador = 0
      for (const { id } of CONCEPTOS_COTIZACION) {
        const base = id === 'cc' || id === 'mei' ? baseAmbas : id === 'he' ? importeHE : baseAmbas + importeHE
        const e = red2((base * tipos[id][0]) / 100)
        const t = red2((base * tipos[id][1]) / 100)
        cuotas[id] = [e, t]
        empresa += e
        trabajador += t
      }
      filas.push({
        trabajador: d.trabajador,
        anio: f.anio,
        metodo: porHoras ? 'horas' : 'dias',
        horasHE,
        precioHE,
        importeHE,
        horasOrd,
        precioOrd,
        origenPrecio,
        importeOrd,
        dietas,
        totalSalarial: red2(importeHE + importeOrd + dietas),
        baseCC: red2(baseAmbas),
        baseCP: red2(baseAmbas + importeHE),
        cuotas,
        cuotaEmpresa: red2(empresa),
        cuotaTrabajador: red2(trabajador),
        cuotaTotal: red2(empresa + trabajador),
        sinPrecio: (horasHE > 0 && !precioHE) || (horasOrd > 0 && !precioOrd),
      })
    }
  }
  const suma = (k) => red2(filas.reduce((s, x) => s + (x[k] || 0), 0))
  return {
    filas,
    totales: {
      importeHE: suma('importeHE'),
      importeOrd: suma('importeOrd'),
      dietas: suma('dietas'),
      totalSalarial: suma('totalSalarial'),
      cuotaEmpresa: suma('cuotaEmpresa'),
      cuotaTrabajador: suma('cuotaTrabajador'),
      cuotaTotal: suma('cuotaTotal'),
    },
    faltanPrecios: filas.some((x) => x.sinPrecio),
  }
}

// ─────────────────────────── Plazos para reclamar ───────────────────────────

// Último día del mes de 'AAAA-MM' desplazado n meses
function finDeMes(mes, n = 0) {
  const a = +mes.slice(0, 4)
  const m = +mes.slice(5, 7) - 1 + n
  return new Date(Date.UTC(a, m + 1, 0)).toISOString().slice(0, 10)
}
function masAnios(fecha, n) {
  const a = +fecha.slice(0, 4) + n
  // El 29 de febrero pasa al 28 en los años no bisiestos
  const bisiesto = (a % 4 === 0 && a % 100 !== 0) || a % 400 === 0
  return `${a}${fecha.slice(4)}`.replace(/-02-29$/, bisiesto ? '-02-29' : '-02-28')
}

function estadoPlazo(primero, ultimo, hoy) {
  if (hoy > ultimo) return 'prescrito'
  if (hoy > primero) return 'parcial'
  return 'vigente'
}

/**
 * Plazos orientativos para reclamar, por tramo anual:
 * - Salarios: 1 año desde que pudo ejercitarse la acción (art. 59.2 ET); se toma
 *   el último día de cada mes como fecha de pago de lo devengado ese mes.
 * - Cotizaciones: 4 años desde el fin del plazo reglamentario de ingreso, que
 *   termina el último día del mes siguiente al del devengo (art. 24 LGSS).
 * @param {object[]} filas filas del cuadrante (con desde y hasta)
 * @param {string} hoy fecha 'AAAA-MM-DD'
 */
export function plazosReclamacion(filas, hoy = new Date().toISOString().slice(0, 10)) {
  return filas.map((f) => {
    const m1 = f.desde.slice(0, 7)
    const m2 = f.hasta.slice(0, 7)
    const salario = { primero: masAnios(finDeMes(m1), 1), ultimo: masAnios(finDeMes(m2), 1) }
    const cotizacion = { primero: masAnios(finDeMes(m1, 1), 4), ultimo: masAnios(finDeMes(m2, 1), 4) }
    salario.estado = estadoPlazo(salario.primero, salario.ultimo, hoy)
    cotizacion.estado = estadoPlazo(cotizacion.primero, cotizacion.ultimo, hoy)
    return { anio: f.anio, desde: f.desde, hasta: f.hasta, salario, cotizacion }
  })
}

// ─────────────────────────── Bases de cotización mensuales ───────────────────────────

const COLUMNAS_RNT = ['naf', 'ipf', 'nombre', 'cto', 'ctp', 'gr', 'cnae', 'ocupacion', 'periodo', 'desde', 'hasta', 'dias', 'trl', 'ccom', 'atep', 'hefm', 'her']

/**
 * Lee líneas de la relación nominal de trabajadores pegadas desde Excel, con las columnas:
 * NAF · Número identificativo · Trabajador · CTO · CTP · GR · EPI/CNAE · Ocupación · Periodo (MM/AAAA) ·
 * Días desde · Días hasta · Total días · TRL · C_COM · AT EP · HEFM · HER
 */
export function leerRNT(texto) {
  const filas = String(texto || '').split(/\r?\n/).filter((l) => l.trim())
  if (!filas.length) return { lineas: [], errores: [] }
  const sep = filas[0].includes('\t') ? '\t' : ';'
  const lineas = []
  const errores = []
  filas.forEach((fila, i) => {
    const c = fila.split(sep).map((x) => x.trim().replace(/^"|"$/g, ''))
    const o = Object.fromEntries(COLUMNAS_RNT.map((k, j) => [k, c[j] ?? '']))
    const mes = mesDesdeTexto(o.periodo)
    const ccom = aNumero(o.ccom)
    if (!mes || ccom === null) {
      if (!/periodo|naf|trabajador/i.test(fila)) errores.push({ fila: i + 1, error: 'Periodo o base de contingencias comunes no válidos' })
      return
    }
    const dm = new Date(Date.UTC(+mes.slice(0, 4), +mes.slice(5, 7), 0)).getUTCDate()
    const desde = Math.min(dm, Math.max(1, parseInt(o.desde, 10) || 1))
    const hasta = Math.min(dm, Math.max(desde, parseInt(o.hasta, 10) || dm))
    lineas.push({
      naf: o.naf.replace(/\s/g, ''),
      ipf: o.ipf,
      nombre: o.nombre,
      mes,
      desde,
      hasta,
      dias: aNumero(o.dias) ?? hasta - desde + 1,
      cto: o.cto,
      ctp: o.ctp,
      gr: o.gr,
      cnae: o.cnae,
      ocupacion: o.ocupacion,
      trl: o.trl,
      ccom,
      atep: aNumero(o.atep) ?? ccom,
      hefm: aNumero(o.hefm) ?? 0,
      her: aNumero(o.her) ?? 0,
    })
  })
  return { lineas, errores }
}

/**
 * Reparte, mes a mes, las diferencias de cotización de cada año en proporción a los días
 * cotizados de cada mes (los de la relación nominal si se han cargado; si no, los días
 * naturales del tramo). Las horas extraordinarias van a la base de AT/EP y a la de horas
 * extraordinarias; el exceso de presencia y las dietas a cotizar, a las de contingencias
 * comunes y AT/EP.
 */
export function basesMensuales(resumen, cfgEntrada) {
  const cfg = normalizarConfig(cfgEntrada)
  const v = valoracion(resumen, cfg)
  const filas = []
  for (const x of v.filas) {
    const t = x.trabajador
    const f = resumen.datos.find((d) => d.trabajador === t).cuadrante.filas.find((y) => y.anio === x.anio)
    const lineas = []
    for (const mes of mesesDelPeriodo(f.desde, f.hasta)) {
      const propias = (t.rnt || []).filter((l) => l.mes === mes)
      if (propias.length) {
        for (const l of propias) lineas.push({ ...l })
      } else {
        const dm = new Date(Date.UTC(+mes.slice(0, 4), +mes.slice(5, 7), 0)).getUTCDate()
        const desde = mes === f.desde.slice(0, 7) ? +f.desde.slice(8, 10) : 1
        const hasta = mes === f.hasta.slice(0, 7) ? +f.hasta.slice(8, 10) : dm
        lineas.push({ mes, desde, hasta, dias: hasta - desde + 1, ...t.afiliacion, ccom: null, atep: null, hefm: null, her: null })
      }
    }
    const totalDias = lineas.reduce((s2, l) => s2 + (l.dias || 0), 0) || 1
    const baseComun = red2(x.importeOrd + x.dietas)
    let restoHER = x.importeHE
    let restoCCOM = baseComun
    lineas.forEach((l, i) => {
      const parte = (l.dias || 0) / totalDias
      // La última línea recibe el resto, para que la suma coincida al céntimo con el total anual
      const ultima = i === lineas.length - 1
      const difHER = ultima ? red2(restoHER) : red2(x.importeHE * parte)
      const difCCOM = ultima ? red2(restoCCOM) : red2(baseComun * parte)
      restoHER -= difHER
      restoCCOM -= difCCOM
      filas.push({
        trabajador: t,
        anio: x.anio,
        ...l,
        cto: l.cto || t.afiliacion?.cto || '',
        ctp: l.ctp || t.afiliacion?.ctp || '',
        gr: l.gr || t.afiliacion?.gr || '',
        cnae: l.cnae || t.afiliacion?.cnae || '',
        ocupacion: l.ocupacion || t.afiliacion?.ocupacion || '',
        trl: l.trl || t.afiliacion?.trl || '',
        dif: { ccom: difCCOM, atep: red2(difCCOM + difHER), hefm: 0, her: difHER },
      })
    })
  }
  return filas
}

// Añade las líneas de la relación nominal a los trabajadores (por NAF, DNI o nombre)
export function asignarRNT(trabajadores, lineas) {
  let ts = trabajadores.map((t) => ({ ...t, rnt: [...(t.rnt || [])], afiliacion: { ...(t.afiliacion || {}) } }))
  const resumen = []
  for (const l of lineas) {
    let t = ts.find((x) => l.naf && x.naf && x.naf.replace(/\s/g, '') === l.naf) || buscarTrabajador(ts, l.ipf) || (l.nombre ? buscarTrabajador(ts, l.nombre) : null)
    if (!t) {
      const vacio = ts.length === 1 && !ts[0].tacografo && !ts[0].dietas.length && !ts[0].rnt.length && /^Trabajador \d+$/.test(ts[0].nombre)
      t = vacio ? ts[0] : nuevoTrabajador({ rnt: [], afiliacion: {} })
      if (!vacio) ts.push(t)
      t.nombre = l.nombre || l.ipf || l.naf || t.nombre
    }
    if (!t.naf && l.naf) t.naf = l.naf
    if (!t.dni && l.ipf) t.dni = l.ipf
    for (const k of ['cto', 'ctp', 'gr', 'cnae', 'ocupacion', 'trl']) if (!t.afiliacion[k] && l[k]) t.afiliacion[k] = l[k]
    const linea = { ...l }
    delete linea.naf
    delete linea.ipf
    delete linea.nombre
    if (!t.rnt.some((r) => r.mes === linea.mes && r.desde === linea.desde && r.cto === linea.cto)) t.rnt.push(linea)
    resumen.push(t.nombre)
  }
  for (const t of ts) t.rnt.sort((a, b) => (a.mes + String(a.desde).padStart(2, '0') < b.mes + String(b.desde).padStart(2, '0') ? -1 : 1))
  return { trabajadores: ts, nombres: [...new Set(resumen)] }
}
