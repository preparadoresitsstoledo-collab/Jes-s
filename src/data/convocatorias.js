/**
 * ============================================================================
 *  DATOS DE CONVOCATORIAS — Cuerpo Superior de Inspección de Trabajo y S.S.
 * ============================================================================
 *
 *  ⚠️  IMPORTANTE: TODOS LOS NÚMEROS DE ESTE ARCHIVO SON DATOS DE EJEMPLO.
 *      Debes sustituirlos por las cifras OFICIALES de cada convocatoria y
 *      pegar el enlace REAL al BOE correspondiente en el campo `boe`.
 *
 *  ¿Dónde encontrar los datos oficiales?
 *    - Plazas convocadas y bases:  Convocatoria en el BOE (boe.es)
 *    - Aspirantes admitidos / presentados / aprobados:
 *        Resoluciones del Tribunal y listados publicados por la
 *        Subsecretaría del Ministerio de Trabajo / OEP correspondiente.
 *
 *  Campos de cada convocatoria:
 *    año        -> Año de la convocatoria (número).
 *    plazas     -> Nº de plazas convocadas (acceso libre).
 *    aspirantes -> Nº de aspirantes admitidos / inscritos.
 *    presentados-> Nº de aspirantes que se presentaron al 1er ejercicio.
 *    aprobados  -> Nº de aprobados que obtuvieron plaza.
 *    boe        -> URL al anuncio del BOE (déjalo en '' si aún no lo tienes).
 *    boeRef     -> Texto de referencia del BOE (ej. "BOE-A-2024-XXXXX").
 *
 *  El porcentaje de aprobados sobre presentados se calcula automáticamente
 *  en la web; no hace falta que lo escribas aquí.
 * ============================================================================
 */

export const convocatorias = [
  {
    año: 2020,
    plazas: 90,
    aspirantes: 2100,
    presentados: 1400,
    aprobados: 88,
    boe: '',
    boeRef: 'BOE-A-2020-XXXXX (sustituir)',
  },
  {
    año: 2021,
    plazas: 95,
    aspirantes: 2350,
    presentados: 1520,
    aprobados: 93,
    boe: '',
    boeRef: 'BOE-A-2021-XXXXX (sustituir)',
  },
  {
    año: 2022,
    plazas: 110,
    aspirantes: 2600,
    presentados: 1680,
    aprobados: 108,
    boe: '',
    boeRef: 'BOE-A-2022-XXXXX (sustituir)',
  },
  {
    año: 2023,
    plazas: 120,
    aspirantes: 2900,
    presentados: 1850,
    aprobados: 117,
    boe: '',
    boeRef: 'BOE-A-2023-XXXXX (sustituir)',
  },
  {
    año: 2024,
    plazas: 130,
    aspirantes: 3100,
    presentados: 1980,
    aprobados: 126,
    boe: '',
    boeRef: 'BOE-A-2024-XXXXX (sustituir)',
  },
]

/**
 * Devuelve la convocatoria enriquecida con los porcentajes calculados.
 *   tasaAprobadosPresentados -> % aprobados sobre los presentados.
 *   tasaAprobadosPlazas      -> % de cobertura de plazas.
 *   ratioAspirantesPlaza     -> aspirantes por cada plaza.
 */
export function convocatoriaConCalculos(c) {
  const pct = (num, den) => (den > 0 ? (num / den) * 100 : 0)
  return {
    ...c,
    tasaAprobadosPresentados: pct(c.aprobados, c.presentados),
    tasaAprobadosAspirantes: pct(c.aprobados, c.aspirantes),
    tasaCoberturaPlazas: pct(c.aprobados, c.plazas),
    ratioAspirantesPlaza: c.plazas > 0 ? c.aspirantes / c.plazas : 0,
  }
}

export const convocatoriasCalculadas = convocatorias.map(convocatoriaConCalculos)

/** Totales agregados de todas las convocatorias cargadas. */
export const totales = convocatorias.reduce(
  (acc, c) => ({
    plazas: acc.plazas + c.plazas,
    aspirantes: acc.aspirantes + c.aspirantes,
    presentados: acc.presentados + c.presentados,
    aprobados: acc.aprobados + c.aprobados,
  }),
  { plazas: 0, aspirantes: 0, presentados: 0, aprobados: 0 },
)

/** Tasa media de aprobados sobre presentados en el periodo cargado. */
export const tasaMediaAprobados =
  totales.presentados > 0 ? (totales.aprobados / totales.presentados) * 100 : 0
