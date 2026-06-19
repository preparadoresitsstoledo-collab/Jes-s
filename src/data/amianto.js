// Base documental para la herramienta de informes de amianto.
//
// ⚠️ SOLO FUENTES OFICIALES: Boletín Oficial del Estado (BOE) e Instituto
// Nacional de Seguridad y Salud en el Trabajo (INSST, antes INSHT). No se
// incluyen fuentes privadas ni interpretaciones de terceros.
//
// La norma de referencia es el RD 396/2006, de 31 de marzo, por el que se
// establecen las disposiciones mínimas de seguridad y salud aplicables a los
// trabajos con riesgo de exposición al amianto (BOE núm. 86, de 11/04/2006).

// Valor límite ambiental de exposición (art. 4 RD 396/2006).
export const VALOR_LIMITE = {
  valor: 0.1,
  unidad: 'fibras/cm³',
  referencia: 'media ponderada en el tiempo para un periodo de 8 horas',
  articulo: 'Art. 4 RD 396/2006',
}

// Periodo mínimo de conservación de la documentación (art. 18 RD 396/2006).
export const CONSERVACION_AÑOS = 40

// Normativa oficial aplicable (enlaces a texto consolidado del BOE).
export const NORMATIVA = [
  {
    titulo:
      'RD 396/2006, de 31 de marzo — disposiciones mínimas de seguridad y salud en trabajos con riesgo de exposición al amianto',
    ref: 'BOE-A-2006-6474',
    url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2006-6474',
    resumen:
      'Norma específica del amianto: ámbito, evaluación, límite de exposición, plan de trabajo, RERA, formación, vigilancia de la salud y conservación de la documentación.',
  },
  {
    titulo: 'Ley 31/1995, de 8 de noviembre, de Prevención de Riesgos Laborales',
    ref: 'BOE-A-1995-24292',
    url: 'https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292',
    resumen: 'Marco general de prevención: evaluación de riesgos, información, formación y vigilancia de la salud.',
  },
  {
    titulo:
      'RD 665/1997, de 12 de mayo, sobre la protección de los trabajadores contra los riesgos relacionados con la exposición a agentes cancerígenos durante el trabajo',
    ref: 'BOE-A-1997-11145',
    url: 'https://www.boe.es/buscar/act.php?id=BOE-A-1997-11145',
    resumen: 'El amianto es agente cancerígeno; este RD es de aplicación complementaria al RD 396/2006.',
  },
  {
    titulo: 'RD 39/1997, de 17 de enero, Reglamento de los Servicios de Prevención',
    ref: 'BOE-A-1997-1853',
    url: 'https://www.boe.es/buscar/act.php?id=BOE-A-1997-1853',
    resumen: 'Organización de la prevención y procedimiento de evaluación de riesgos.',
  },
  {
    titulo:
      'Ley 7/2022, de 8 de abril, de residuos y suelos contaminados para una economía circular (Disposición adicional 14ª: amianto)',
    ref: 'BOE-A-2022-5809',
    url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2022-5809',
    resumen:
      'Obliga a los municipios a elaborar un censo de instalaciones y emplazamientos con amianto, con un calendario que planifique su retirada.',
  },
]

// Documentación técnica oficial del INSST (orientativa).
export const DOCS_INSST = [
  {
    titulo: 'Guía técnica para la evaluación y prevención de los riesgos relacionados con la exposición al amianto',
    url: 'https://www.insst.es/documentacion/catalogo-de-publicaciones/guia-tecnica-para-la-evaluacion-y-prevencion-de-los-riesgos-relacionados-con-la-exposicion-al-amianto',
    nota: 'Guía técnica del INSST que desarrolla y orienta la aplicación del RD 396/2006.',
  },
  {
    titulo: 'Directrices para la retirada del amianto instalado',
    url: 'https://www.insst.es/documentacion/material-tecnico/documentos-tecnicos/directrices-retirada-amianto-instalado-2024',
    nota: 'Apoyo a la DA 14ª de la Ley 7/2022 (censos municipales y planificación de la retirada).',
  },
  {
    titulo: 'Portal del amianto del INSST (legislación, NTP y material técnico)',
    url: 'https://www.insst.es/materias/riesgos/riesgos-quimicos/amianto',
    nota: 'Punto de entrada oficial a la documentación técnica del INSST sobre amianto.',
  },
]

// Resumen de los artículos clave del RD 396/2006 (para citar en el informe).
export const ARTICULOS_396 = [
  {
    id: 'art3',
    titulo: 'Art. 3 — Ámbito de aplicación',
    texto:
      'Se aplica a todas las actividades con riesgo de exposición al amianto. El art. 3.2 contempla las exposiciones esporádicas y de baja intensidad (ESBI), en las que no son exigibles determinadas obligaciones.',
  },
  {
    id: 'art4',
    titulo: 'Art. 4 — Valor límite',
    texto:
      'La exposición no superará el valor límite ambiental de 0,1 fibras por cm³, medido como media ponderada en el tiempo para un periodo de 8 horas.',
  },
  {
    id: 'art5',
    titulo: 'Art. 5 — Evaluación y control del ambiente de trabajo',
    texto:
      'Evaluación de riesgos con mediciones de la concentración de fibras de amianto en el aire del lugar de trabajo, conforme a los métodos del anexo correspondiente.',
  },
  {
    id: 'art11',
    titulo: 'Art. 11 — Planes de trabajo',
    texto:
      'Antes de comenzar trabajos con amianto, el empresario debe elaborar un plan de trabajo con el contenido mínimo establecido (descripción del trabajo, materiales, procedimientos, medidas preventivas, EPI, residuos, formación y mediciones).',
  },
  {
    id: 'art12',
    titulo: 'Art. 12 — Tramitación del plan de trabajo',
    texto:
      'El plan de trabajo se presenta para su aprobación ante la autoridad laboral competente antes del inicio de los trabajos.',
  },
  {
    id: 'art13',
    titulo: 'Art. 13 — Formación de los trabajadores',
    texto:
      'Los trabajadores expuestos deben recibir formación específica, suficiente y adecuada, de forma periódica.',
  },
  {
    id: 'art16',
    titulo: 'Art. 16 — Vigilancia de la salud',
    texto:
      'Vigilancia sanitaria específica de los trabajadores antes del inicio, periódicamente durante la exposición y tras el cese, según los criterios de los anexos.',
  },
  {
    id: 'art17',
    titulo: 'Art. 17 — Inscripción en el RERA',
    texto:
      'Las empresas que vayan a realizar trabajos con riesgo de amianto deben estar inscritas en el Registro de Empresas con Riesgo de Amianto (RERA) de la autoridad laboral correspondiente.',
  },
  {
    id: 'art18',
    titulo: 'Art. 18 — Registro de datos y archivo de documentación',
    texto:
      'Los registros de evaluación de la exposición y de vigilancia de la salud se conservan durante un mínimo de 40 años tras finalizar la exposición.',
  },
]

// ─── Informe de la Inspección/autoridad laboral sobre el plan de trabajo ───
// (arts. 11 y 12 RD 396/2006)

// Estados de cada punto del cuadro de verificación.
export const ESTADOS_VERIFICACION = [
  { id: 'pendiente', etiqueta: 'Pendiente', color: 'gris' },
  { id: 'correcto', etiqueta: 'Consta / correcto', color: 'verde' },
  { id: 'subsanar', etiqueta: 'A subsanar', color: 'ambar' },
  { id: 'noconsta', etiqueta: 'No consta', color: 'rojo' },
  { id: 'naplica', etiqueta: 'No aplica', color: 'gris' },
]

// Contenido mínimo del plan de trabajo a verificar (art. 11.2 RD 396/2006).
export const CONTENIDO_PLAN = [
  {
    id: 'descripcion',
    titulo: 'Descripción del trabajo y tipo de actividad',
    base: 'Art. 11.2.a) RD 396/2006',
    ayuda: 'Tipo de actividad: retirada/desamiantado, demolición, mantenimiento o reparación.',
  },
  {
    id: 'material',
    titulo: 'Tipo de material (friable / no friable) y cantidad',
    base: 'Art. 11.2.b) RD 396/2006',
    ayuda: 'Identificación del material con amianto, su carácter friable o no friable y la cantidad estimada.',
  },
  {
    id: 'ubicacion',
    titulo: 'Ubicación del lugar de los trabajos',
    base: 'Art. 11.2.c) RD 396/2006',
    ayuda: 'Emplazamiento concreto donde se ejecutarán los trabajos.',
  },
  {
    id: 'fechas',
    titulo: 'Fecha de inicio y duración prevista',
    base: 'Art. 11.2.d) RD 396/2006',
    ayuda: 'Cronograma de la actuación.',
  },
  {
    id: 'trabajadores',
    titulo: 'Relación de trabajadores, formación y aptitud médica',
    base: 'Art. 11.2.e) RD 396/2006',
    ayuda: 'Relación nominal, categoría/oficio, formación específica y aptitud según vigilancia de la salud.',
  },
  {
    id: 'procedimientos',
    titulo: 'Procedimientos de trabajo y su adecuación',
    base: 'Art. 11.2.f) RD 396/2006',
    ayuda: 'Procedimientos aplicables y particularidades de adecuación al trabajo concreto.',
  },
  {
    id: 'medidasPrev',
    titulo: 'Medidas para limitar la generación, dispersión y exposición a fibras',
    base: 'Art. 11.2.g) RD 396/2006',
    ayuda: 'Medidas técnicas y organizativas para reducir al mínimo la emisión y la exposición.',
  },
  {
    id: 'epi',
    titulo: 'Equipos de protección colectiva e individual',
    base: 'Art. 11.2.h) RD 396/2006',
    ayuda: 'Protección respiratoria, ropa de trabajo y demás equipos, con sus características.',
  },
  {
    id: 'terceros',
    titulo: 'Medidas para proteger a terceros en el lugar',
    base: 'Art. 11.2.i) RD 396/2006',
    ayuda: 'Medidas para evitar la exposición de otras personas presentes en el emplazamiento.',
  },
  {
    id: 'informacion',
    titulo: 'Medidas de información a los trabajadores',
    base: 'Art. 11.2.j) RD 396/2006',
    ayuda: 'Información sobre los riesgos y las precauciones a adoptar.',
  },
  {
    id: 'residuos',
    titulo: 'Gestión y eliminación de residuos (gestor y destino autorizados)',
    base: 'Art. 11.2.k) RD 396/2006',
    ayuda: 'Envasado, etiquetado, transportista y vertedero/gestor autorizados conforme a la normativa de residuos.',
  },
  {
    id: 'mediciones',
    titulo: 'Procedimiento de evaluación y control del ambiente (mediciones)',
    base: 'Art. 11.2.l) RD 396/2006 (en relación con art. 5)',
    ayuda: 'Plan de mediciones de fibras en aire y comparación con el valor límite (0,1 fibras/cm³).',
  },
]

// Comprobaciones complementarias del expediente.
export const COMPROBACIONES = [
  {
    id: 'rera',
    titulo: 'Empresa inscrita en el RERA',
    base: 'Art. 17 RD 396/2006',
    ayuda: 'La empresa que ejecuta debe estar inscrita en el Registro de Empresas con Riesgo de Amianto.',
  },
  {
    id: 'presentacion',
    titulo: 'Presentación del plan ante la autoridad laboral competente',
    base: 'Art. 12 RD 396/2006',
    ayuda: 'El plan se presenta para su aprobación antes del inicio de los trabajos.',
  },
  {
    id: 'recursos',
    titulo: 'Designación de recursos preventivos',
    base: 'Art. 32 bis LPRL y disp. relacionadas',
    ayuda: 'Presencia de recursos preventivos durante los trabajos con amianto.',
  },
  {
    id: 'formacion',
    titulo: 'Acreditación de la formación específica',
    base: 'Art. 13 RD 396/2006',
    ayuda: 'Formación específica, suficiente y adecuada de los trabajadores expuestos.',
  },
  {
    id: 'salud',
    titulo: 'Vigilancia de la salud de los trabajadores',
    base: 'Art. 16 RD 396/2006',
    ayuda: 'Reconocimientos médicos específicos y aptitud para el puesto.',
  },
]

// Propuesta/conclusión del informe.
export const PROPUESTAS = [
  {
    id: 'favorable',
    etiqueta: 'Favorable a la aprobación del plan de trabajo',
    color: 'verde',
  },
  {
    id: 'subsanacion',
    etiqueta: 'Requerimiento de subsanación previo a la aprobación',
    color: 'ambar',
  },
  {
    id: 'desfavorable',
    etiqueta: 'Desfavorable / propuesta de no aprobación',
    color: 'rojo',
  },
]
