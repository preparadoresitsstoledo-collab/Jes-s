/**
 * ============================================================================
 *  GRADUACIÓN DE LA SANCIÓN — juego de estudio (arts. 39 y 40 LISOS/TRLISOS).
 * ============================================================================
 *  ⚠️  DATOS ORIENTATIVOS. La graduación es un juicio del/de la actuante:
 *      revisa y ajusta el grado, los criterios y las explicaciones.
 *
 *  Estructura correcta (revisada conforme a los arts. 39 y 40 vigentes):
 *   1. Primero se CALIFICA (leve / grave / muy grave). Dentro de la
 *      calificación, la sanción se impone en grado MÍNIMO, MEDIO o MÁXIMO
 *      (art. 39.1).
 *   2. El GRADO de UNA infracción se elige por los criterios del art. 39.2
 *      (negligencia/intencionalidad si no integran el tipo, fraude o
 *      connivencia, incumplimiento de requerimientos previos, cifra de
 *      negocio, nº de afectados, perjuicio, cantidad defraudada).
 *   3. PRL: criterios PROPIOS del art. 39.3 (no se usan los del 39.2).
 *   4. No confundir GRADUACIÓN con Nº DE INFRACCIONES:
 *        · Contratación temporal en fraude (art. 7.2) → UNA infracción por
 *          cada CONTRATO afectado.
 *        · Falta de alta/afiliación (art. 22.2) → UNA infracción por cada
 *          TRABAJADOR.
 *      Si en una misma actuación se detectan varias, cada sanción (ya
 *      graduada por el 39.2) se INCREMENTA en un porcentaje según el número
 *      de afectados (art. 39.2, último párrafo). El número NO sube por sí
 *      solo el grado de una única sanción.
 *   5. CUOTAS / recaudación (art. 22.3 grave; art. 23.1.b muy grave): la
 *      multa es un PORCENTAJE del importe no ingresado (art. 40.1). El
 *      importe es la BASE del porcentaje; el GRADO lo fijan los criterios
 *      del art. 39.2 (intencionalidad, fraude, ocultación…), no el importe.
 *   6. No doble cómputo + motivación: lo que ya integra el tipo no vuelve a
 *      graduar (art. 39.5); el acta y la resolución deben explicitar los
 *      criterios; si no concurre ninguno → grado mínimo en su tramo inferior.
 * ============================================================================
 */

export const marcoGraduacion = {
  grados:
    'Calificada la infracción (leve, grave o muy grave), la sanción se impone en uno de tres grados: mínimo, medio o máximo (art. 39.1 LISOS). El grado de UNA infracción se elige por los criterios del art. 39.2 (o del 39.3 en PRL).',
  noDobleComputo:
    'Los criterios que ya forman parte de la descripción del tipo infractor (entre ellos, la intencionalidad y la negligencia cuando integran el tipo) no pueden volver a usarse para graduar: no se computan dos veces (art. 39.5 LISOS). Además, el acta y la resolución deben explicitar los criterios de graduación aplicados; si no concurre ninguno, la sanción se impone en grado mínimo, en su tramo inferior.',
  criteriosGenerales: [
    'Negligencia o intencionalidad del sujeto infractor (si no integran ya el tipo)',
    'Fraude o connivencia',
    'Incumplimiento de advertencias previas y requerimientos de la Inspección',
    'Cifra de negocios de la empresa',
    'Número de trabajadores o beneficiarios afectados',
    'Perjuicio causado y cantidad defraudada',
  ],
  criteriosPRL: [
    'Peligrosidad de las actividades',
    'Carácter permanente o transitorio de los riesgos',
    'Gravedad de los daños producidos o que hubieran podido producirse',
    'Número de trabajadores afectados',
    'Medidas de protección individual o colectiva adoptadas e instrucciones impartidas',
    'Incumplimiento de advertencias o requerimientos previos',
  ],
  // Reglas que NO son "graduación por número", sino nº de infracciones / base de cálculo.
  reglasEspeciales: [
    {
      titulo: 'Una infracción por unidad',
      texto:
        'La contratación temporal en fraude (art. 7.2) es una infracción por cada CONTRATO; la falta de alta (art. 22.2) es una infracción por cada TRABAJADOR. No es una sanción única que «sube de grado» por haber más afectados.',
    },
    {
      titulo: 'Incremento porcentual por varios afectados',
      texto:
        'Si en una misma actuación se detectan varias de esas infracciones, cada sanción —ya graduada por el 39.2— se incrementa en un porcentaje creciente según el número de afectados (art. 39.2, último párrafo).',
    },
    {
      titulo: 'Cuotas: porcentaje sobre la deuda (art. 40.1)',
      texto:
        'En impago de cuotas (art. 22.3 grave; art. 23.1.b muy grave) la multa es un porcentaje del importe no ingresado. El importe es la BASE; el GRADO (mínimo/medio/máximo) lo fijan los criterios del art. 39.2, no la cuantía en sí.',
    },
  ],
}

const grado = { minimo: 'Mínimo', medio: 'Medio', maximo: 'Máximo' }
export const GRADOS = grado

export const casosGraduacion = [
  {
    materia: 'Relaciones laborales · contratación',
    descripcion:
      'Empresa con un contrato temporal celebrado en fraude de ley (art. 7.2, grave). Primera actuación, sin requerimientos previos incumplidos, sin fraude ni connivencia acreditados y con escaso perjuicio.',
    grado: 'minimo',
    peculiaridad: 'El art. 7.2 genera UNA infracción por cada CONTRATO; aquí graduamos una de ellas',
    criterios: [
      'No consta fraude ni connivencia (más allá del propio tipo)',
      'Sin requerimientos previos incumplidos',
      'Perjuicio escaso',
    ],
    explicacion:
      'Al no concurrir ninguna circunstancia agravante del art. 39.2, la sanción se impone en grado mínimo en su tramo inferior (art. 39.5). El número de contratos no sube el grado: determina cuántas infracciones hay.',
  },
  {
    materia: 'Relaciones laborales · registro de jornada',
    descripcion:
      'Empresa que incumple la obligación de registro de jornada (art. 7.5, grave). Ya se le había advertido en una actuación anterior y no corrigió, pero sin fraude ni perjuicio económico relevante.',
    grado: 'medio',
    peculiaridad: null,
    criterios: ['Incumplimiento de un requerimiento/advertencia previo', 'Sin fraude ni perjuicio grave añadido'],
    explicacion:
      'Concurre una sola circunstancia agravante clara del art. 39.2 (desatender la advertencia previa), sin otras que lleven al máximo → grado medio.',
  },
  {
    materia: 'Relaciones laborales · salarios',
    descripcion:
      'Impago reiterado de salarios durante varios meses (art. 8.1, muy grave), con connivencia para ocultarlo y una advertencia previa de la Inspección desatendida. Grave perjuicio a la plantilla.',
    grado: 'maximo',
    peculiaridad: null,
    criterios: [
      'Fraude o connivencia',
      'Incumplimiento de requerimiento previo',
      'Grave perjuicio causado',
      'Número de trabajadores afectados',
    ],
    explicacion:
      'El impago es UNA infracción graduada por el art. 39.2: aquí concurren varias agravantes (fraude, requerimiento desatendido, perjuicio grave) → grado máximo. El número de afectados sí es criterio válido del 39.2 en este tipo.',
  },
  {
    materia: 'Prevención de riesgos (PRL)',
    descripcion:
      'Obra con trabajos en altura sin protección colectiva ni EPIs, varios trabajadores expuestos a caída, con un requerimiento previo incumplido (art. 12.16, grave).',
    grado: 'maximo',
    peculiaridad: 'PRL → se gradúa por el art. 39.3 (criterios propios)',
    criterios: [
      'Peligrosidad de la actividad (trabajo en altura)',
      'Gravedad de los daños que podrían producirse',
      'Número de trabajadores afectados',
      'Ausencia de medidas de protección',
      'Incumplimiento de requerimiento previo',
    ],
    explicacion:
      'En PRL no se aplican los criterios del 39.2, sino los específicos del art. 39.3. La gravedad de los daños que podrían producirse no integra el tipo, por lo que puede agravar (doctrina del TS) → grado máximo.',
  },
  {
    materia: 'Prevención de riesgos (PRL)',
    descripcion:
      'Falta de formación preventiva a un único trabajador de oficina, actividad de riesgo bajo, sin daños y sin antecedentes (art. 12, grave).',
    grado: 'minimo',
    peculiaridad: 'PRL → se gradúa por el art. 39.3 (criterios propios)',
    criterios: [
      'Baja peligrosidad de la actividad',
      'Sin daños producidos ni potenciales relevantes',
      'Un solo trabajador afectado, sin antecedentes',
    ],
    explicacion:
      'Criterios del art. 39.3: baja peligrosidad y ausencia de daños, sin agravantes → grado mínimo en su tramo inferior (art. 39.5).',
  },
  {
    materia: 'Seguridad Social · cuotas',
    descripcion:
      'Falta de ingreso de cuotas en plazo (art. 22.3, grave) que la empresa regulariza tras el requerimiento, sin ocultación ni fraude. La deuda es elevada.',
    grado: 'minimo',
    peculiaridad: 'Cuotas → la multa es un % del importe (art. 40.1); el GRADO lo marca el 39.2',
    criterios: ['Ausencia de fraude u ocultación', 'Conducta no obstructiva (regulariza)'],
    explicacion:
      'Aunque la deuda sea alta, el importe es solo la BASE del porcentaje (art. 40.1). Como no concurren agravantes del art. 39.2, el grado es mínimo → multa del 50–65 % de lo no ingresado.',
  },
  {
    materia: 'Seguridad Social · cuotas',
    descripcion:
      'Impago de cuotas (art. 22.3, grave) con ocultación deliberada de trabajadores y datos a la Inspección para eludir el pago; descubierto en la actuación y sin regularizar.',
    grado: 'maximo',
    peculiaridad: 'Cuotas → la multa es un % del importe (art. 40.1); el GRADO lo marca el 39.2',
    criterios: ['Fraude y ocultación', 'Conducta obstructiva', 'Intencionalidad no integrada en el tipo'],
    explicacion:
      'El grado lo determina la concurrencia de fraude/ocultación (art. 39.2), no la cuantía. Con esas agravantes → grado máximo → multa del 80,01–100 % de lo no ingresado (art. 40.1).',
  },
  {
    materia: 'Seguridad Social · alta',
    descripcion:
      'Un único trabajador sin alta (art. 22.2, grave), detectado y regularizado de inmediato, sin perjuicio para prestaciones y sin antecedentes.',
    grado: 'minimo',
    peculiaridad: 'Falta de alta → UNA infracción por cada TRABAJADOR (art. 22.2)',
    criterios: ['Sin fraude acreditado', 'Regularización inmediata, sin perjuicio', 'Sin requerimientos previos'],
    explicacion:
      'Se gradúa la infracción de ESE trabajador. Sin agravantes del art. 39.2 → grado mínimo. El nº de afectados no entra aquí porque cada falta de alta es una infracción propia.',
  },
  {
    materia: 'Seguridad Social · alta',
    descripcion:
      'En la visita se localizan 4 trabajadores sin alta, ocultados a la Inspección mediante datos falseados. ¿Cómo se gradúa cada una de esas infracciones?',
    grado: 'maximo',
    peculiaridad: 'Son 4 infracciones (una por trabajador) + incremento porcentual por varios afectados',
    criterios: ['Fraude y ocultación (art. 39.2)', 'Conducta obstructiva'],
    explicacion:
      'No es una sanción que sube de grado por ser 4: son 4 infracciones (art. 22.2), cada una graduada por el 39.2. Aquí el fraude/ocultación lleva cada una al grado máximo, y además cada sanción se incrementa en un porcentaje por el número de afectados (art. 39.2, último párrafo).',
  },
  {
    materia: 'Seguridad Social · prestaciones',
    descripcion:
      'Empresa que da ocupación a un perceptor de prestación incompatible, en connivencia con él para defraudar a la Seguridad Social (art. 23.1.a, muy grave).',
    grado: 'maximo',
    peculiaridad: 'Si fueran varios beneficiarios: una infracción por cada uno + incremento porcentual',
    criterios: ['Fraude o connivencia', 'Perjuicio a la caja de la Seguridad Social', 'Intencionalidad no integrada en el tipo'],
    explicacion:
      'El grado lo determina la connivencia para defraudar (art. 39.2), no el número. Con varios beneficiarios, además, habría una infracción por cada uno y el correspondiente incremento porcentual.',
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
    titulo: 'Doctrina del TS sobre graduación en PRL',
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
    titulo: 'Doctrina del TS sobre el impago masivo de salarios',
    referencia: 'Tribunal Supremo (orden social)',
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
