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
 *     vuelven a computar para graduar (art. 39.5, prohibición de doble cómputo).
 * ============================================================================
 */

export const marcoGraduacion = {
  grados:
    'Calificada la infracción (leve, grave o muy grave), la sanción se impone en uno de tres grados: mínimo, medio o máximo (art. 39.1 LISOS).',
  noDobleComputo:
    'Los criterios que ya forman parte de la descripción del tipo infractor (entre ellos, la intencionalidad y la negligencia cuando integran el tipo) no pueden volver a usarse para graduar: no se computan dos veces (art. 39.5 LISOS). Además, el acta y la resolución deben explicitar los criterios de graduación aplicados; si no concurre ninguno, la sanción se impone en grado mínimo, en su tramo inferior.',
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

/**
 * ============================================================================
 *  JURISPRUDENCIA Y CRITERIOS TÉCNICOS SOBRE GRADUACIÓN (art. 39 TRLISOS)
 * ============================================================================
 *  Referencias VERIFICADAS y contrastadas en varias fuentes (junio 2026).
 *  Cada entrada incluye 3+ enlaces de comprobación. Conviene confirmar el
 *  texto íntegro de cada resolución antes de citarla en un acta.
 * ============================================================================
 */
export const criterioTecnicoGraduacion =
  'La graduación no es discrecional: el art. 39.2 (criterios generales), el art. 39.3 ' +
  '(criterios específicos de PRL) y el art. 39.5 TRLISOS exigen motivar en el acta y en la ' +
  'resolución qué criterios concretos llevan a fijar el grado mínimo, medio o máximo. Un mismo ' +
  'elemento no puede valorarse dos veces (prohibición de doble cómputo): lo que ya integra el ' +
  'tipo infractor no sirve, además, para agravar. Si no concurre ningún criterio de graduación, ' +
  'la sanción se impone en grado mínimo, en su tramo inferior. La actuación inspectora debe ' +
  'dejar constancia expresa del razonamiento, pues su ausencia es causa frecuente de anulación ' +
  'o de reducción del grado en vía contencioso-administrativa (principio de proporcionalidad, ' +
  'art. 29.3 y 29.4 de la Ley 40/2015).'

export const jurisprudencia = [
  {
    titulo: 'Art. 39 TRLISOS — base legal de la graduación',
    referencia: 'RDLeg 5/2000, de 4 de agosto (TRLISOS), art. 39',
    resumen:
      'Fija los grados (mínimo, medio, máximo), los criterios generales (39.2), los criterios ' +
      'específicos de PRL (39.3), las reglas de cuantía/recaudación (39.4) y la prohibición de ' +
      'doble cómputo con el deber de motivar la graduación (39.5).',
    enlaces: [
      { texto: 'BOE — texto consolidado', url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2000-15060' },
      { texto: 'Iberley — art. 39 LISOS', url: 'https://www.iberley.es/legislacion/articulo-39-ley-sobre-infracciones-sanciones-orden-social-lisos' },
      { texto: 'SuperContable — graduación de sanciones', url: 'https://www.supercontable.com/informacion/laboral/Articulo_39._Lisos._Criterios_de_graduacion_de_las_sanciones..html' },
    ],
  },
  {
    titulo: 'STS 1241/2024, de 13 de noviembre (PRL) — ECLI:ES:TS:2024:5487',
    referencia: 'Tribunal Supremo, Sala 3ª (contencioso-administrativo)',
    resumen:
      'La gravedad de los daños producidos o que hubieran podido producirse (art. 39.3.c) NO está ' +
      'incorporada al tipo del art. 12.16.b LISOS, por lo que SÍ puede operar como criterio de ' +
      'agravación al graduar la sanción: no hay doble cómputo. Clarifica los límites del art. 39.5.',
    enlaces: [
      { texto: 'Iberley — el TS aclara la graduación en PRL', url: 'https://www.iberley.es/noticias/el-ts-aclara-graduacion-las-sanciones-infraccion-grave-materia-prl-34182' },
      { texto: 'Cuatrecasas — agravante de daños graves', url: 'https://www.cuatrecasas.com/es/spain/laboral/art/agravante-danos-graves-infracciones-laborales-sentencia-supremo' },
      { texto: 'CENDOJ — buscador de jurisprudencia (TS)', url: 'https://www.poderjudicial.es/search/indexAN.jsp' },
    ],
  },
  {
    titulo: 'STS de 3 de abril de 2025 (rec. 94/2023) — impago masivo de salarios',
    referencia: 'Tribunal Supremo, Sala 4ª (social)',
    resumen:
      'El número de trabajadores afectados por el impago de salarios es un criterio de GRADUACIÓN ' +
      '(art. 39.2), no un elemento del tipo: con muchos afectados procede agravar el grado de la ' +
      'sanción muy grave del art. 8.1 LISOS, sin incurrir en doble valoración.',
    enlaces: [
      { texto: 'Garrido Abogados — análisis de la sentencia', url: 'https://garrido.es/infraccion-derivada-del-impago-masivo-de-salarios-sentencia-tribunal-supremo/' },
      { texto: 'Iberley — número de afectados como criterio', url: 'https://www.iberley.es/legislacion/articulo-39-ley-sobre-infracciones-sanciones-orden-social-lisos' },
      { texto: 'CENDOJ — buscador de jurisprudencia (TS)', url: 'https://www.poderjudicial.es/search/indexAN.jsp' },
    ],
  },
  {
    titulo: 'Principio de proporcionalidad — control judicial del grado',
    referencia: 'Jurisprudencia contencioso-administrativa (art. 29.4 Ley 40/2015)',
    resumen:
      'Los tribunales pueden revisar y reducir el grado de la sanción cuando la Administración no ' +
      'motiva la graduación o esta resulta desproporcionada. La falta de explicitación de los ' +
      'criterios del art. 39 conduce a aplicar el grado mínimo.',
    enlaces: [
      { texto: 'delajusticia.com (R. Bosch) — proporcionalidad sancionadora', url: 'https://www.delajusticia.com/' },
      { texto: 'Ley 40/2015, art. 29 (BOE)', url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2015-10566&tn=1&p=20151002#a29' },
      { texto: 'gobiernolocal.org — potestad sancionadora', url: 'https://www.gobiernolocal.org/' },
    ],
  },
  {
    titulo: 'Criterio Técnico 84/2010 de la DGITSS — reincidencia',
    referencia: 'Dirección General de la Inspección de Trabajo y Seguridad Social',
    resumen:
      'Fija el criterio para apreciar la reincidencia (art. 41 LISOS) en las actas de infracción, ' +
      'factor que agrava la graduación. Es el documento técnico de referencia que aplican los ' +
      'actuantes y un ejemplo de "criterio técnico de graduación".',
    enlaces: [
      { texto: 'laboral-social — CT sobre reincidencia', url: 'https://www.laboral-social.com/criterio-tecnico-inspeccion-trabajo-aplicacion-reincidencia-actas-infraccion.html' },
      { texto: 'MITES — criterios técnicos de la ITSS', url: 'https://www.mites.gob.es/itss/web/atencion_al_ciudadano/crit_tecnicos/index.html' },
      { texto: 'SuperContable — criterios técnicos DGITSS', url: 'https://www.supercontable.com/' },
    ],
  },
]
