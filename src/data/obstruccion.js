/**
 * ============================================================================
 *  OBSTRUCCIÓN A LA LABOR INSPECTORA — juego de casos prácticos.
 * ============================================================================
 *  Art. 50 TRLISOS (calificación) en relación con el art. 40 (cuantía) y el
 *  art. 39 (graduación), y con la Ley 23/2015 (arts. 13, 14, 16 y 18).
 *
 *  ⚠️  DATOS ORIENTATIVOS. Revísalos: cada acta debe verificar el precepto y
 *      la cuantía vigentes y las circunstancias del caso concreto.
 * ============================================================================
 */

const eur = (n) => n.toLocaleString('es-ES') + ' €'

export const marcoObstruccion = {
  concepto:
    'La obstrucción sanciona el incumplimiento del deber de colaboración del art. 18 de la Ley 23/2015 (no el deber institucional del art. 16, que no es sancionable). Se citan además, como preceptos relacionados, los arts. 13 y 14 (facultades de los actuantes). Requiere dolo o culpa (también culpa in vigilando del empresario).',
  calificacion: [
    'LEVE (art. 50.3): mero retraso en obligaciones de información, comunicación o comparecencia (salvo que se requieran en visita y deban obrar en el centro).',
    'GRAVE (art. 50.2, cláusula general): acciones u omisiones que perturben, retrasen o impidan las funciones inspectoras, salvo que sean leves o muy graves.',
    'MUY GRAVE (art. 50.4): a) impedir entrada/permanencia o negarse a identificar a quien esté trabajando en el centro; b) coacción, amenaza o violencia, y la reiteración de obstrucciones graves; c) incumplir el art. 18.2; d) no entregar en soporte informático la información requerida.',
  ],
  escalas:
    'El art. 40 prevé DOS escalas: (1) la NORMAL — art. 40.1.a) leve 70–750 €, 40.1.b) grave 751–7.500 €, 40.1.c) muy grave 7.501–225.018 €; y (2) la AGRAVADA — art. 40.1.f) — solo cuando la actuación obstruida iba dirigida a comprobar el ALTA de los trabajadores (posibles infracciones de los arts. 22.2 y 23.1.a).',
  graduacion:
    'La sanción se gradúa por el art. 39.2 (negligencia/intencionalidad cualificadas, fraude, requerimientos previos, cifra de negocio, nº de trabajadores afectados, perjuicio). El número de trabajadores es SOLO criterio de graduación: en obstrucción NO hay una infracción por cada trabajador. Una sola agravante → grado mínimo; sin ninguna → grado mínimo en su tramo inferior (art. 39.5-6).',
  competencia:
    'Resuelve la Administración competente por la materia obstruida (estatal o autonómica), art. 4.3 RD 928/1998. Es orden social: cabe el pronto pago (−40 %, RD 688/2021) si la sanción es exclusivamente pecuniaria.',
}

export const casosObstruccion = [
  {
    materia: 'Comparecencia',
    relato:
      'La Inspección cita por escrito a la empresa, mediante correo con acuse de recibo, para comparecer en las oficinas un día concreto y aportar unas nóminas que no tienen por qué estar en el centro de trabajo. La empresa no comparece ni justifica su ausencia.',
    pregunta: '¿Cómo se califica esta conducta?',
    opciones: [
      { k: 'leve', t: 'Leve' },
      { k: 'grave', t: 'Grave' },
      { k: 'muygrave', t: 'Muy grave' },
    ],
    correcta: 'leve',
    tipo: 'Art. 50.3.a) TRLISOS — mero retraso/incomparecencia (LEVE).',
    preceptos: 'Art. 18.1 de la Ley 23/2015 (deber de colaborar), en relación con los arts. 13 y 14.',
    cuantia: `Escala normal — art. 40.1.a): LEVE ${eur(70)}–${eur(750)} (mín. 70–150, medio 151–370, máx. 371–750).`,
    graduacion: 'Se gradúa por el art. 39.2 (cifra de negocio, etc.).',
    nota: 'Solo es sancionable si la citación se hizo debidamente (acuse de recibo) y fijaba día concreto. Si el documento debía obrar en el centro y se requirió en visita, sería GRAVE (art. 50.2).',
  },
  {
    materia: 'Documentación en visita',
    relato:
      'Durante una visita, el actuante requiere por escrito la documentación laboral que debe obrar en el centro (contratos, registro de jornada). La empresa, sin causa justificada, no la aporta y perturba la actuación. No hay violencia ni se impide la entrada.',
    pregunta: '¿Cómo se califica?',
    opciones: [
      { k: 'leve', t: 'Leve' },
      { k: 'grave', t: 'Grave' },
      { k: 'muygrave', t: 'Muy grave' },
    ],
    correcta: 'grave',
    tipo: 'Art. 50.2 TRLISOS — cláusula general de obstrucción (GRAVE).',
    preceptos: 'Arts. 13, 14 y 18.1 de la Ley 23/2015; concordantes arts. 7 y 8 del RD 138/2000.',
    cuantia: `Escala normal — art. 40.1.b): GRAVE ${eur(751)}–${eur(7500)} (mín. 751–1.500, medio 1.501–3.750, máx. 3.751–7.500).`,
    graduacion: 'Art. 39.2. Requiere dolo o culpa; el requerimiento debe ser escrito, notificado en forma y con plazo razonable.',
    nota: 'Si el plazo fue irrazonablemente corto o no se acreditó la urgencia, puede decaer el tipo.',
  },
  {
    materia: 'No identificar a trabajadores',
    relato:
      'En una visita, el actuante observa a varias personas trabajando. El empresario se niega a identificarlas y a dar razón de su presencia. La actuación iba dirigida al control de jornada (materia autonómica), no a comprobar el alta.',
    pregunta: '¿Calificación y cómo influye el número de personas?',
    opciones: [
      { k: 'a', t: 'Grave; una infracción por cada trabajador' },
      { k: 'b', t: 'Muy grave; el nº de personas es solo criterio de graduación' },
      { k: 'c', t: 'Leve' },
    ],
    correcta: 'b',
    tipo: 'Art. 50.4.a) TRLISOS — negativa a identificar a quien está trabajando en el centro (MUY GRAVE).',
    preceptos: 'Arts. 13, 14 y 18.1 de la Ley 23/2015.',
    cuantia: `Escala normal — art. 40.1.c): MUY GRAVE ${eur(7501)}–${eur(225018)} (grado mínimo 7.501–30.000).`,
    graduacion: 'Es UNA sola infracción. El número de personas no identificadas es solo criterio de graduación (art. 39.2), NO una infracción por trabajador (a diferencia de la falta de alta).',
    nota: 'La obligación de identificar recae sobre cualquiera que esté trabajando en el centro, exista o no relación laboral, y siempre que su presencia se constate al tiempo de la visita.',
  },
  {
    materia: 'Obstrucción a la comprobación del alta',
    relato:
      'Misma negativa a identificar, pero ahora la visita iba dirigida a comprobar el ALTA en la Seguridad Social de los trabajadores (posibles infracciones de los arts. 22.2 y 23.1.a LISOS). El empresario impide identificar a quienes están trabajando.',
    pregunta: '¿Qué escala de sanción se aplica?',
    opciones: [
      { k: 'a', t: 'Escala normal — art. 40.1.c)' },
      { k: 'b', t: 'Escala AGRAVADA — art. 40.1.f)' },
      { k: 'c', t: 'No es sancionable' },
    ],
    correcta: 'b',
    tipo: 'Art. 50.4.a) TRLISOS (MUY GRAVE), obstrucción a la comprobación del alta.',
    preceptos: 'Arts. 13, 14 y 18.1 de la Ley 23/2015, en conexión con los arts. 22.2 y 23.1.a) LISOS.',
    cuantia: 'Escala AGRAVADA — art. 40.1.f): reservada a la obstrucción de actuaciones dirigidas a comprobar el alta (arts. 22.2/23.1.a). Cuantías superiores a la escala normal; competencia ESTATAL (Seguridad Social). Verifica los importes vigentes del 40.1.f).',
    graduacion: 'Art. 39.2 (nº de afectados como graduación, cifra de negocio, perjuicio a la Seguridad Social…).',
    nota: 'El 40.1.f) SOLO opera si la actuación obstruida iba dirigida al alta. Si la materia era autonómica (p. ej., jornada), se aplica la escala normal del 40.1.c).',
  },
  {
    materia: 'Coacción y violencia',
    relato:
      'El empresario impide físicamente la entrada del actuante al centro y, además, le amenaza y profiere coacciones para que se marche.',
    pregunta: '¿Cuántas infracciones hay y cómo se sancionan?',
    opciones: [
      { k: 'a', t: 'Una sola infracción muy grave' },
      { k: 'b', t: 'Dos muy graves separadas: 50.4.a) + 50.4.b)' },
      { k: 'c', t: 'Una grave' },
    ],
    correcta: 'b',
    tipo: 'Art. 50.4.a) (impedir la entrada) y art. 50.4.b) (coacción/amenaza): DOS infracciones muy graves.',
    preceptos: 'Arts. 13, 14 y 18 de la Ley 23/2015.',
    cuantia: `Cada una por la escala normal — art. 40.1.c): MUY GRAVE ${eur(7501)}–${eur(225018)}.`,
    graduacion: 'Art. 39.2 y 3, para cada una de las infracciones.',
    nota: 'Son dos conductas distintas (obstrucción + atentado a la integridad del funcionario): se sancionan por separado. Si la coacción/violencia ya se depuró penalmente, no cabe sanción administrativa por identidad de sujeto, hecho y fundamento (art. 3.1 LISOS; non bis in idem).',
  },
  {
    materia: 'Reiteración',
    relato:
      'Una empresa ha sido sancionada por dos actas de obstrucción GRAVES, con resoluciones firmes en vía administrativa. En una nueva actuación vuelve a obstruir de forma grave.',
    pregunta: '¿Cómo se califica la nueva obstrucción?',
    opciones: [
      { k: 'a', t: 'Grave (art. 50.2)' },
      { k: 'b', t: 'Muy grave por reiteración (art. 50.4.b)' },
      { k: 'c', t: 'Leve' },
    ],
    correcta: 'b',
    tipo: 'Art. 50.4.b) TRLISOS — reiteración en conductas de obstrucción graves (MUY GRAVE).',
    preceptos: 'Arts. 13, 14 y 18 de la Ley 23/2015.',
    cuantia: `Escala normal — art. 40.1.c) MUY GRAVE. Se impone en el límite inferior del grado mínimo (${eur(7501)}), salvo que los criterios del art. 39 justifiquen elevarla.`,
    graduacion: 'Art. 39.2 y 3.',
    nota: 'Reiteración = dos o más obstrucciones graves con resoluciones firmes en vía administrativa (no sujeta al plazo de 365 días de la reincidencia). Si la persistencia se da dentro de una MISMA actuación, no hay reiteración: sigue siendo grave (50.2), agravable por el art. 39.2.',
  },
]

/**
 * ============================================================================
 *  CRITERIO TÉCNICO Y JURISPRUDENCIA — obstrucción a la labor inspectora.
 *  Referencias contrastadas en varias fuentes. Conviene verificar el texto
 *  íntegro de cada resolución (CENDOJ) antes de citarla en un acta.
 * ============================================================================
 */
export const criterioTecnicoObstruccion =
  'La obstrucción sanciona el incumplimiento del deber de colaboración del art. 18 de la Ley ' +
  '23/2015 y requiere dolo o culpa. La calificación (art. 50) y la cuantía (art. 40) deben ' +
  'motivarse: el acta ha de explicitar los criterios de graduación del art. 39 aplicados, y si no ' +
  'concurre ninguno la sanción se impone en el grado mínimo en su tramo inferior. El número de ' +
  'trabajadores no identificados es solo un criterio de graduación, no una infracción por ' +
  'trabajador. Existen dos escalas de multa (la normal del art. 40.1.a-c y la agravada del ' +
  '40.1.f, reservada a la obstrucción de la comprobación del alta). La coacción, amenaza o ' +
  'violencia integra una infracción autónoma (art. 50.4.b) que se sanciona por separado, sin ' +
  'perjuicio del non bis in idem cuando los hechos se hayan depurado ya en la vía penal.'

export const jurisprudenciaObstruccion = [
  {
    titulo: 'Art. 50 TRLISOS — calificación de la obstrucción',
    referencia: 'RDLeg 5/2000 (TRLISOS), art. 50',
    resumen:
      'Define la obstrucción como leve (50.3), grave (50.2, cláusula general) y muy grave (50.4: ' +
      'impedir entrada/identificar, coacción o violencia, reiteración, incumplir el art. 18.2 o no ' +
      'entregar la información en soporte informático).',
    enlaces: [
      { texto: 'BOE — texto consolidado', url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2000-15060' },
      { texto: 'Iberley — art. 50 LISOS', url: 'https://www.iberley.es/legislacion/articulo-50-ley-sobre-infracciones-sanciones-orden-social-lisos' },
      { texto: 'SuperContable — obstrucción a la ITSS', url: 'https://www.supercontable.com/informacion/inspeccion_laboral/Infracciones_por_obstruccion_a_la_labor_inspectora.html' },
    ],
  },
  {
    titulo: 'Art. 40 TRLISOS — las dos escalas de multa',
    referencia: 'RDLeg 5/2000 (TRLISOS), art. 40.1 letras a-c y f',
    resumen:
      'Escala normal (40.1.a leve 70–750 €, 40.1.b grave 751–7.500 €, 40.1.c muy grave 7.501–' +
      '225.018 €) y escala agravada (40.1.f) cuando la actuación obstruida iba dirigida a comprobar ' +
      'el alta de los trabajadores (arts. 22.2 y 23.1.a).',
    enlaces: [
      { texto: 'Iberley — art. 40 LISOS', url: 'https://www.iberley.es/legislacion/articulo-40-ley-sobre-infracciones-sanciones-orden-social-lisos' },
      { texto: 'BOE — texto consolidado', url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2000-15060' },
      { texto: 'SuperContable — obstrucción a la ITSS', url: 'https://www.supercontable.com/informacion/inspeccion_laboral/Infracciones_por_obstruccion_a_la_labor_inspectora.html' },
    ],
  },
  {
    titulo: 'STS 436/2025, de 20 de mayo — sanción máxima por no identificar',
    referencia: 'Tribunal Supremo (contencioso-administrativo)',
    resumen:
      'Confirma la sanción máxima de 225.018 € (muy grave, art. 50.4.a) a una empresa agrícola: 22 ' +
      'personas huyeron sin identificarse y no se facilitó su identificación. El número de ' +
      'afectados, la intencionalidad/fraude y el perjuicio operan como criterios de graduación ' +
      '(art. 39.2) hasta el grado máximo.',
    enlaces: [
      { texto: 'SuperContable — STS 436/2025', url: 'https://www.supercontable.com/informacion/inspeccion_laboral/STS_436-2025.Confirma_sancion_por_infraccion_muy_.html' },
      { texto: 'Iberley — sanción de 225.018 €', url: 'https://www.iberley.es/noticias/sancion-225-018-euros-obstruccion-labor-inspectora-sector-agricola-34934' },
      { texto: 'CENDOJ — buscador de jurisprudencia (TS)', url: 'https://www.poderjudicial.es/search/indexAN.jsp' },
    ],
  },
  {
    titulo: 'Coacción o violencia: infracción autónoma (50.4.a + 50.4.b)',
    referencia: 'Doctrina de suplicación (TSJ) y art. 3.1 LISOS',
    resumen:
      'Impedir la entrada (50.4.a) y coaccionar, amenazar o ejercer violencia sobre el actuante ' +
      '(50.4.b) son dos conductas distintas que se sancionan por separado. Si la coacción/violencia ' +
      'ya se depuró penalmente, no cabe sanción administrativa (non bis in idem, art. 3.1 LISOS).',
    enlaces: [
      { texto: 'Iberley — jurisprudencia sobre obstrucción', url: 'https://www.iberley.es/jurisprudencia/obstruccion-labor-inspectora' },
      { texto: 'SuperContable — jurisprudencia sobre obstrucción', url: 'https://www.supercontable.com/informacion/inspeccion_laboral/Jurisprudencia_sobre_obstruccion_a_la_Inspeccion_de_.html' },
      { texto: 'CENDOJ — buscador de jurisprudencia', url: 'https://www.poderjudicial.es/search/indexAN.jsp' },
    ],
  },
  {
    titulo: 'Criterios Técnicos de la ITSS sobre obstrucción',
    referencia: 'CT 1/1997 (actas de obstrucción) y CT 45/2006 (graduación)',
    resumen:
      'El CT 1/1997 fija los criterios interpretativos sobre las actas de infracción por ' +
      'obstrucción; el CT 45/2006 orienta sobre las circunstancias de graduación en dichas actas ' +
      '(motivación específica de cada criterio del art. 39).',
    enlaces: [
      { texto: 'MITES — criterios técnicos de la ITSS', url: 'https://www.mites.gob.es/itss/web/atencion_al_ciudadano/crit_tecnicos/index.html' },
      { texto: 'OEITSS — criterios técnicos', url: 'https://oeitss.gob.es/informacion-y-normativa/documentacion/criterios-tecnicos' },
      { texto: 'Relación de criterios técnicos (auditores sociolaborales)', url: 'https://www.auditoressociolaborales.com/documentacion_criterios_tecnicos.php' },
    ],
  },
]
