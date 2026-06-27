/**
 * ============================================================================
 *  GRADUACIÓN DE LA SANCIÓN — juego de estudio (art. 39 LISOS).
 * ============================================================================
 *  ⚠️  DATOS ORIENTATIVOS. La graduación es un juicio del/de la actuante:
 *      revisa y ajusta el grado, los criterios y las explicaciones.
 *
 *  Reglas clave que recoge el juego:
 *   - Cada infracción se sanciona en grado MÍNIMO / MEDIO / MÁXIMO (art. 39.1).
 *   - Criterios generales de graduación: art. 39.2.
 *   - Prevención de Riesgos Laborales: criterios PROPIOS del art. 39.3.
 *   - Cotización / deuda: el grado se fija sobre todo por la CUANTÍA.
 *   - Falta de alta / compatibilización con varios trabajadores: la sanción se
 *     INCREMENTA en un porcentaje (varios afectados).
 *   - Intencionalidad y negligencia: si ya están en el tipo infractor, NO se
 *     vuelven a computar para graduar (art. 39.4, prohibición de doble cómputo).
 * ============================================================================
 */

export const marcoGraduacion = {
  grados:
    'Calificada la infracción (leve, grave o muy grave), la sanción se impone en uno de tres grados: mínimo, medio o máximo (art. 39.1 LISOS).',
  noDobleComputo:
    'La intencionalidad y la negligencia no pueden volver a usarse para graduar cuando ya forman parte de la descripción del tipo infractor (art. 39.4 LISOS): no se computan dos veces.',
  criteriosGenerales: [
    'Número de trabajadores o beneficiarios afectados',
    'Perjuicio causado',
    'Cantidad defraudada',
    'Cifra de negocios de la empresa',
    'Fraude o connivencia',
    'Incumplimiento de advertencias previas y requerimientos de la Inspección',
  ],
  criteriosPRL: [
    'Peligrosidad de las actividades',
    'Carácter permanente o transitorio de los riesgos',
    'Gravedad de los daños producidos o que hubieran podido producirse',
    'Número de trabajadores afectados',
    'Medidas de protección individual o colectiva adoptadas e instrucciones impartidas',
    'Incumplimiento de advertencias o requerimientos previos',
  ],
}

const grado = { minimo: 'Mínimo', medio: 'Medio', maximo: 'Máximo' }
export const GRADOS = grado

export const casosGraduacion = [
  {
    materia: 'Relaciones laborales',
    descripcion:
      'Pequeña empresa con 2 trabajadores con contrato temporal en fraude de ley (art. 7.2, grave). Es la primera actuación, sin requerimientos previos y con escaso perjuicio.',
    grado: 'minimo',
    peculiaridad: null,
    criterios: [
      'Pocos trabajadores afectados (2)',
      'Perjuicio causado limitado',
      'Sin incumplimiento de requerimientos previos',
    ],
    explicacion:
      'Graduación general (art. 39.2): pocos afectados y escaso perjuicio empujan al grado mínimo.',
  },
  {
    materia: 'Relaciones laborales',
    descripcion:
      'Impago reiterado de salarios a 25 trabajadores durante varios meses (art. 8.1, muy grave), con grave perjuicio económico.',
    grado: 'maximo',
    peculiaridad: null,
    criterios: ['Elevado número de trabajadores afectados (25)', 'Grave perjuicio causado'],
    explicacion:
      'Graduación general (art. 39.2): muchos afectados y perjuicio grave llevan al grado máximo.',
  },
  {
    materia: 'Prevención de riesgos (PRL)',
    descripcion:
      'Obra con trabajos en altura sin protección colectiva ni EPIs, 4 trabajadores expuestos a caída, y existía un requerimiento previo incumplido.',
    grado: 'maximo',
    peculiaridad: 'PRL → se gradúa por el art. 39.3 (criterios propios)',
    criterios: [
      'Peligrosidad de la actividad (trabajo en altura)',
      'Gravedad de los daños que podrían producirse',
      'Nº de trabajadores afectados',
      'Ausencia de medidas de protección',
      'Incumplimiento de requerimiento previo',
    ],
    explicacion:
      'En PRL NO se aplican los criterios del 39.2, sino los específicos del art. 39.3. Aquí casi todos agravan → grado máximo.',
  },
  {
    materia: 'Prevención de riesgos (PRL)',
    descripcion:
      'Falta de formación en PRL a un único trabajador de oficina, riesgo bajo, sin daños y sin antecedentes.',
    grado: 'minimo',
    peculiaridad: 'PRL → se gradúa por el art. 39.3 (criterios propios)',
    criterios: [
      'Baja peligrosidad de la actividad',
      'Sin daños producidos',
      'Un solo trabajador afectado',
    ],
    explicacion:
      'Criterios del art. 39.3: baja peligrosidad y ausencia de daños empujan al grado mínimo.',
  },
  {
    materia: 'Seguridad Social · cotización',
    descripcion:
      'Diferencias de cotización por importe reducido, regularizadas, sin ánimo defraudatorio (art. 22.3, grave).',
    grado: 'minimo',
    peculiaridad: 'Deuda → el grado se fija sobre todo por la CUANTÍA',
    criterios: ['Cuantía no ingresada reducida'],
    explicacion:
      'En cotización/recaudación el grado se determina principalmente por la cuantía no ingresada: importe bajo → grado mínimo.',
  },
  {
    materia: 'Seguridad Social · cotización',
    descripcion:
      'Falta de ingreso de cuotas por una cuantía muy elevada durante un periodo prolongado (art. 22.3, grave).',
    grado: 'maximo',
    peculiaridad: 'Deuda → el grado se fija sobre todo por la CUANTÍA',
    criterios: ['Cuantía no ingresada muy elevada'],
    explicacion:
      'A mayor cuantía no ingresada, mayor grado: importe muy elevado → grado máximo.',
  },
  {
    materia: 'Seguridad Social · altas',
    descripcion:
      'Un único trabajador sin alta, detectado y regularizado de inmediato, sin perjuicio para prestaciones.',
    grado: 'minimo',
    peculiaridad: null,
    criterios: ['Un solo trabajador afectado', 'Regularización inmediata, sin perjuicio'],
    explicacion:
      'Falta de alta (art. 22.2, grave) con un único afectado y sin perjuicio → grado mínimo.',
  },
  {
    materia: 'Seguridad Social · altas',
    descripcion:
      'En la visita se encuentran 5 trabajadores prestando servicios sin estar dados de alta.',
    grado: 'maximo',
    peculiaridad: 'Varios trabajadores → la sanción se incrementa en un porcentaje',
    criterios: ['Elevado número de trabajadores sin alta (5)'],
    explicacion:
      'Cada trabajador sin alta es una infracción independiente; además, con varios afectados la sanción se incrementa porcentualmente → grado máximo.',
  },
  {
    materia: 'Seguridad Social · prestaciones',
    descripcion:
      'Empresa que da ocupación a varios perceptores de prestaciones incompatibles con el trabajo (art. 23.1.a, muy grave).',
    grado: 'maximo',
    peculiaridad: 'Varios beneficiarios → la sanción se incrementa en un porcentaje',
    criterios: ['Varios beneficiarios implicados', 'Perjuicio a la caja de la Seguridad Social'],
    explicacion:
      'Compatibilización indebida con varios beneficiarios: además del grado máximo, opera el incremento porcentual por número de afectados.',
  },
]
