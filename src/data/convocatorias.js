/**
 * ============================================================================
 *  DATOS DE CONVOCATORIAS — Cuerpo Superior de Inspectores de Trabajo y S.S.
 * ============================================================================
 *
 *  Fuente: datos de plazas convocadas y aprobados facilitados por el preparador
 *  (recopilación de convocatorias y resoluciones del Tribunal, BOE).
 *
 *  El año corresponde a la Oferta de Empleo Público (OEP). Los aprobados de las
 *  últimas convocatorias aparecen como `null` mientras el proceso no ha finalizado.
 *
 *  Campos:
 *    año             -> Año (OEP) de la convocatoria.
 *    plazasLibre     -> Plazas convocadas por acceso libre.
 *    plazasPI        -> Plazas convocadas por promoción interna.
 *    aprobadosLibre  -> Aprobados por acceso libre (null = pendiente).
 *    aprobadosPI     -> Aprobados por promoción interna (null = pendiente).
 *    boe / boeRef    -> Enlace y referencia de la convocatoria en el BOE.
 * ============================================================================
 */

export const convocatorias = [
  { año: 2019, plazasLibre: 50, plazasPI: 10, aprobadosLibre: 48, aprobadosPI: 7, boe: '', boeRef: '' },
  { año: 2021, plazasLibre: 58, plazasPI: 15, aprobadosLibre: 52, aprobadosPI: 15, boe: '', boeRef: '' },
  { año: 2022, plazasLibre: 146, plazasPI: 35, aprobadosLibre: 86, aprobadosPI: 18, boe: '', boeRef: '' },
  {
    año: 2024,
    plazasLibre: 99,
    plazasPI: 30,
    aprobadosLibre: 45,
    aprobadosPI: 26,
    boe: 'https://www.boe.es/diario_boe/txt.php?id=BOE-A-2024-5637',
    boeRef: 'BOE-A-2024-5637',
  },
  {
    año: 2025,
    plazasLibre: 158,
    plazasPI: 46,
    aprobadosLibre: 55,
    aprobadosPI: 14,
    boe: 'https://www.boe.es/diario_boe/txt.php?id=BOE-A-2025-254',
    boeRef: 'BOE-A-2025-254',
    destacado: true,
  },
  {
    año: 2026,
    plazasLibre: 151,
    plazasPI: 34,
    aprobadosLibre: null,
    aprobadosPI: null,
    boe: 'https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-165',
    boeRef: 'BOE-A-2026-165',
  },
]

/** Plazas convocadas totales (libre + promoción interna). */
export function plazasTotales(c) {
  return (c.plazasLibre || 0) + (c.plazasPI || 0)
}

/** Aprobados totales (null si todavía no hay datos del proceso). */
export function aprobadosTotales(c) {
  if (c.aprobadosLibre == null && c.aprobadosPI == null) return null
  return (c.aprobadosLibre || 0) + (c.aprobadosPI || 0)
}

/**
 * Convocatoria con cálculos:
 *  plazas            -> plazas convocadas totales.
 *  aprobados         -> aprobados totales (null si pendiente).
 *  tasaCobertura     -> % de plazas cubiertas por aprobados (null si pendiente).
 */
export function convocatoriaConCalculos(c) {
  const plazas = plazasTotales(c)
  const aprobados = aprobadosTotales(c)
  return {
    ...c,
    plazas,
    aprobados,
    tasaCobertura: aprobados != null && plazas ? (aprobados / plazas) * 100 : null,
  }
}

export const convocatoriasCalculadas = convocatorias.map(convocatoriaConCalculos)

/** Totales agregados del periodo. */
export const totales = convocatorias.reduce(
  (acc, c) => ({
    plazasLibre: acc.plazasLibre + (c.plazasLibre || 0),
    plazasPI: acc.plazasPI + (c.plazasPI || 0),
    plazas: acc.plazas + plazasTotales(c),
    aprobados: acc.aprobados + (aprobadosTotales(c) || 0),
    // Plazas de los años que ya tienen aprobados (para la tasa media).
    plazasConDatos: acc.plazasConDatos + (aprobadosTotales(c) != null ? plazasTotales(c) : 0),
  }),
  { plazasLibre: 0, plazasPI: 0, plazas: 0, aprobados: 0, plazasConDatos: 0 },
)

/** Tasa media de cobertura (aprobados / plazas) de los años con datos. */
export const tasaMediaCobertura =
  totales.plazasConDatos > 0 ? (totales.aprobados / totales.plazasConDatos) * 100 : null

/** Convocatoria más reciente (para destacar en la portada). */
export const ultimaConvocatoria = convocatorias[convocatorias.length - 1]
