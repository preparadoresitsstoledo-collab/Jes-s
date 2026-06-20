// Base documental para la herramienta de informes de amianto.
//
// ⚠️ SOLO FUENTES OFICIALES: Boletín Oficial del Estado (BOE) e Instituto
// Nacional de Seguridad y Salud en el Trabajo (INSST, antes INSHT).
//
// Esta herramienta NO almacena ninguna plantilla de informe: aporta únicamente
// la estructura legal de apartados (art. 11.2 RD 396/2006) y el marco normativo
// oficial. El contenido de cada apartado lo redacta la persona usuaria.

// Valor límite ambiental de exposición (art. 4 RD 396/2006).
export const VALOR_LIMITE = {
  valor: 0.1,
  unidad: 'fibras/cm³',
  referencia: 'media ponderada en el tiempo para un periodo de 8 horas',
  articulo: 'Art. 4 RD 396/2006',
}

// Periodo mínimo de conservación de la documentación (art. 18 RD 396/2006).
export const CONSERVACION_AÑOS = 40

// Datos identificativos del informe (etiquetas del formulario; sin contenido
// predefinido).
export const DATOS_CAMPOS = [
  { id: 'solicitante', label: 'Órgano solicitante', placeholder: 'p. ej. Dirección Provincial de…' },
  { id: 'expediente', label: 'Nº de plan de trabajo / expediente' },
  { id: 'empresa', label: 'Empresa autora del Plan', ancho: 'full' },
  { id: 'cif', label: 'CIF / NIF' },
  { id: 'rera', label: 'Nº de inscripción RERA' },
  { id: 'emplazamiento', label: 'Emplazamiento de los trabajos', ancho: 'full' },
  { id: 'provincia', label: 'Provincia / ámbito' },
  { id: 'fechaEntrada', label: 'Fecha de entrada del plan' },
  { id: 'fechaInforme', label: 'Fecha del informe' },
  { id: 'actuante', label: 'Inspector/a o técnico/a actuante' },
  { id: 'lugarFecha', label: 'Lugar y fecha de firma', placeholder: 'En …, a … de … de …' },
]

// Estructura oficial del contenido del plan de trabajo (art. 11.2 RD 396/2006).
// Solo títulos y base legal; el contenido se rellena en la herramienta.
export const APARTADOS = [
  { id: 'a', num: 1, titulo: 'Descripción del trabajo a realizar', base: 'Art. 11.2.a) RD 396/2006' },
  { id: 'b', num: 2, titulo: 'Tipo de material a intervenir', base: 'Art. 11.2.b) RD 396/2006' },
  { id: 'c', num: 3, titulo: 'Ubicación del lugar en el que se efectuarán los trabajos', base: 'Art. 11.2.c) RD 396/2006' },
  { id: 'd', num: 4, titulo: 'Fecha de inicio y duración prevista', base: 'Art. 11.2.d) RD 396/2006' },
  { id: 'e', num: 5, titulo: 'Relación nominal de los trabajadores implicados', base: 'Art. 11.2.e) RD 396/2006' },
  { id: 'f', num: 6, titulo: 'Procedimientos que se aplicarán para el trabajo', base: 'Art. 11.2.f) RD 396/2006' },
  {
    id: 'g',
    num: 7,
    titulo: 'Medidas para evitar la dispersión de fibras y limitar la exposición de los trabajadores',
    base: 'Art. 11.2.g) RD 396/2006',
  },
  { id: 'h', num: 8, titulo: 'Equipos utilizados para la protección de los trabajadores', base: 'Art. 11.2.h) RD 396/2006' },
  {
    id: 'i',
    num: 9,
    titulo: 'Medidas para evitar la exposición de otras personas en el lugar o sus proximidades',
    base: 'Art. 11.2.i) RD 396/2006',
  },
  { id: 'j', num: 10, titulo: 'Información a los trabajadores', base: 'Art. 11.2.j) RD 396/2006' },
  { id: 'k', num: 11, titulo: 'Medidas para la eliminación de residuos', base: 'Art. 11.2.k) RD 396/2006' },
  {
    id: 'l',
    num: 12,
    titulo: 'Procedimiento para la evaluación y control del ambiente de trabajo',
    base: 'Art. 11.2.l) RD 396/2006 (en relación con el art. 5)',
  },
  { id: 'rp', num: 13, titulo: 'Recursos preventivos de la empresa', base: 'Art. 32 bis Ley 31/1995 (LPRL)' },
]

// Normativa oficial aplicable (enlaces a texto consolidado del BOE).
export const NORMATIVA = [
  {
    titulo:
      'RD 396/2006, de 31 de marzo — disposiciones mínimas de seguridad y salud en trabajos con riesgo de exposición al amianto',
    ref: 'BOE-A-2006-6474',
    url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2006-6474',
    resumen:
      'Norma específica del amianto: ámbito, evaluación, límite de exposición, plan de trabajo (art. 11), tramitación e informe (art. 12), RERA (art. 17) y vigilancia de la salud.',
  },
  {
    titulo: 'Ley 31/1995, de 8 de noviembre, de Prevención de Riesgos Laborales',
    ref: 'BOE-A-1995-24292',
    url: 'https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292',
    resumen: 'Marco general de prevención: evaluación de riesgos, información, formación, recursos preventivos y vigilancia de la salud.',
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

// Resumen de los artículos clave del RD 396/2006 (para consulta).
export const ARTICULOS_396 = [
  { id: 'art4', titulo: 'Art. 4 — Valor límite', texto: 'La exposición no superará el valor límite ambiental de 0,1 fibras por cm³, medido como media ponderada en el tiempo para un periodo de 8 horas.' },
  { id: 'art11', titulo: 'Art. 11 — Planes de trabajo', texto: 'Antes de comenzar trabajos con amianto, el empresario debe elaborar un plan de trabajo con el contenido mínimo del art. 11.2.' },
  { id: 'art12', titulo: 'Art. 12 — Tramitación del plan de trabajo', texto: 'El plan se presenta para su aprobación ante la autoridad laboral competente antes del inicio de los trabajos; el art. 12.2 prevé el informe de la Inspección de Trabajo y Seguridad Social.' },
  { id: 'art17', titulo: 'Art. 17 — Inscripción en el RERA', texto: 'Las empresas que realicen trabajos con riesgo de amianto deben estar inscritas en el Registro de Empresas con Riesgo de Amianto (RERA).' },
  { id: 'art18', titulo: 'Art. 18 — Registro y archivo de documentación', texto: 'Los registros de evaluación de la exposición y de vigilancia de la salud se conservan durante un mínimo de 40 años tras finalizar la exposición.' },
]
