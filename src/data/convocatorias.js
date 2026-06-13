/**
 * ============================================================================
 *  DATOS DE CONVOCATORIAS — Cuerpo Superior de Inspectores de Trabajo y S.S.
 * ============================================================================
 *
 *  ✅ PLAZAS y ENLACES AL BOE: datos OFICIALES (verificados en las
 *     resoluciones de convocatoria publicadas en el BOE).
 *
 *  ⏳ aspirantes / presentados / aprobados: PENDIENTES de completar.
 *     Están en otras resoluciones del BOE (relación de admitidos y relación
 *     de aprobados). Pon el número y la web calculará sola los porcentajes.
 *     Mientras sean `null`, la web muestra "—" en esas celdas.
 *
 *  Resoluciones útiles para completar esos números:
 *    - Convocatoria 2024 (Res. 12-mar-2024, BOE-A-2024-5637):
 *        · Admitidos/excluidos: BOE-A-2024-9121
 *        · Aprobados (relación final): BOE-A-2025-13095
 *    - Convocatoria 2025 (Res. 27-dic-2024, BOE-A-2025-254):
 *        · Admitidos/excluidos: BOE-A-2025-6974
 *        · Aprobados (relación final): BOE-A-2026-9374
 *    - Convocatoria 2026 (Res. 26-dic-2025, BOE-A-2026-165):
 *        · Admitidos/excluidos: BOE-A-2026-5736
 *
 *  Campos de cada convocatoria:
 *    año            -> Año de la convocatoria.
 *    plazasLibre    -> Plazas por el sistema general de acceso libre.
 *    plazasPI       -> Plazas por promoción interna (null si no aplica/desconocido).
 *    aspirantes     -> Aspirantes admitidos (null = pendiente).
 *    presentados    -> Presentados al 1er ejercicio (null = pendiente).
 *    aprobados      -> Aprobados que obtuvieron plaza (null = pendiente).
 *    boe / boeRef   -> Enlace y referencia de la convocatoria en el BOE.
 *    nota           -> Texto descriptivo de la resolución.
 * ============================================================================
 */

export const convocatorias = [
  {
    año: 2024,
    plazasLibre: 99,
    plazasPI: 30,
    aspirantes: null,
    presentados: null,
    aprobados: null,
    boe: 'https://www.boe.es/diario_boe/txt.php?id=BOE-A-2024-5637',
    boeRef: 'BOE-A-2024-5637',
    nota: 'Resolución de 12 de marzo de 2024 (convocatoria). 99 plazas de acceso libre y 30 de promoción interna.',
  },
  {
    año: 2025,
    plazasLibre: 150,
    plazasPI: 48,
    aspirantes: null,
    presentados: null,
    aprobados: null,
    boe: 'https://www.boe.es/diario_boe/txt.php?id=BOE-A-2025-254',
    boeRef: 'BOE-A-2025-254',
    nota: 'Resolución de 27 de diciembre de 2024 (convocatoria), publicada el 6 de enero de 2025. 150 plazas de acceso libre (12 discapacidad) y 48 de promoción interna (3 discapacidad).',
  },
  {
    año: 2026,
    plazasLibre: 151,
    plazasPI: 34,
    aspirantes: null,
    presentados: null,
    aprobados: null,
    boe: 'https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-165',
    boeRef: 'BOE-A-2026-165',
    nota: 'Resolución de 26 de diciembre de 2025 (convocatoria), publicada el 3 de enero de 2026. 151 plazas de acceso libre (12 discapacidad) y 34 de promoción interna (3 discapacidad).',
  },
]

/** Total de plazas (libre + PI si se conoce) de una convocatoria. */
export function plazasTotales(c) {
  return (c.plazasLibre || 0) + (c.plazasPI || 0)
}

/**
 * Devuelve la convocatoria con los porcentajes calculados.
 * Si falta el dato base, el porcentaje correspondiente es `null`.
 */
export function convocatoriaConCalculos(c) {
  const pct = (num, den) => (num != null && den ? (num / den) * 100 : null)
  return {
    ...c,
    plazasTotales: plazasTotales(c),
    tasaAprobadosPresentados: pct(c.aprobados, c.presentados),
    tasaAprobadosAspirantes: pct(c.aprobados, c.aspirantes),
    ratioAspirantesPlaza:
      c.aspirantes != null && c.plazasLibre ? c.aspirantes / c.plazasLibre : null,
  }
}

export const convocatoriasCalculadas = convocatorias.map(convocatoriaConCalculos)

/** Totales agregados (los campos pendientes solo suman lo que haya disponible). */
export const totales = convocatorias.reduce(
  (acc, c) => ({
    plazasLibre: acc.plazasLibre + (c.plazasLibre || 0),
    plazasPI: acc.plazasPI + (c.plazasPI || 0),
    aspirantes: acc.aspirantes + (c.aspirantes || 0),
    presentados: acc.presentados + (c.presentados || 0),
    aprobados: acc.aprobados + (c.aprobados || 0),
  }),
  { plazasLibre: 0, plazasPI: 0, aspirantes: 0, presentados: 0, aprobados: 0 },
)

/** ¿Hay ya datos de aprobados/presentados cargados? */
export const hayDatosAprobados = convocatorias.some(
  (c) => c.aprobados != null && c.presentados != null,
)

/** Tasa media de aprobados sobre presentados (null si aún no hay datos). */
export const tasaMediaAprobados =
  totales.presentados > 0 ? (totales.aprobados / totales.presentados) * 100 : null

/** Convocatoria más reciente (para destacar en la portada). */
export const ultimaConvocatoria = convocatorias[convocatorias.length - 1]
