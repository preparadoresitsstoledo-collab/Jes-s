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

// Tipos de informe que la herramienta podrá generar. (Estructura provisional,
// se ajustará al modelo oficial que proporcione el usuario.)
export const TIPOS_INFORME = [
  {
    id: 'plan',
    nombre: 'Plan de trabajo (art. 11 RD 396/2006)',
    descripcion:
      'Documento previo, obligatorio, para la realización de trabajos con riesgo de exposición al amianto, que se presenta ante la autoridad laboral para su aprobación (art. 12).',
  },
  {
    id: 'identificacion',
    nombre: 'Identificación / diagnóstico de materiales con amianto (MCA)',
    descripcion:
      'Localización e identificación de materiales con amianto instalados y valoración de su riesgo potencial, de apoyo a la gestión y, en su caso, al censo de la Ley 7/2022.',
  },
  {
    id: 'evaluacion',
    nombre: 'Evaluación de la exposición (mediciones)',
    descripcion:
      'Resultado de la evaluación de riesgos con mediciones de concentración de fibras en aire y comparación con el valor límite del art. 4.',
  },
]

// Secciones por defecto del informe (provisional, alineadas con el contenido
// mínimo del plan de trabajo del art. 11 RD 396/2006). Cada sección es un
// bloque de texto editable en la herramienta.
export const SECCIONES_DEFECTO = [
  {
    id: 'objeto',
    titulo: '1. Objeto y descripción del trabajo',
    ayuda: 'Tipo de actividad (retirada, demolición, mantenimiento…), ubicación y duración prevista.',
  },
  {
    id: 'materiales',
    titulo: '2. Materiales con amianto',
    ayuda: 'Tipo de material (friable / no friable, amianto-cemento…), cantidad estimada y estado de conservación.',
  },
  {
    id: 'procedimientos',
    titulo: '3. Procedimientos de trabajo y medidas preventivas',
    ayuda: 'Método de intervención, medidas técnicas y organizativas para reducir la exposición al mínimo (arts. 6 y 7).',
  },
  {
    id: 'epi',
    titulo: '4. Protección individual y colectiva',
    ayuda: 'Equipos de protección (vías respiratorias, ropa de trabajo), descontaminación e higiene personal (art. 8).',
  },
  {
    id: 'mediciones',
    titulo: '5. Mediciones ambientales',
    ayuda: 'Plan de mediciones de fibras en aire y comparación con el valor límite (0,1 fibras/cm³, art. 4).',
  },
  {
    id: 'residuos',
    titulo: '6. Gestión de residuos',
    ayuda: 'Identificación, envasado, etiquetado, transporte y entrega a gestor autorizado conforme a la normativa de residuos.',
  },
  {
    id: 'formacion',
    titulo: '7. Formación e información',
    ayuda: 'Formación específica de los trabajadores expuestos (art. 13) e información (art. 14).',
  },
  {
    id: 'salud',
    titulo: '8. Vigilancia de la salud',
    ayuda: 'Reconocimientos médicos específicos antes, durante y tras la exposición (art. 16).',
  },
]
