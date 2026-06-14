/**
 * ============================================================================
 *  PROCESO SELECTIVO — Acceso libre (Cuerpo Superior de Inspectores de
 *  Trabajo y Seguridad Social).
 * ============================================================================
 *  Datos extraídos de la convocatoria 2026 (Resolución de 26 de diciembre de
 *  2025, BOE-A-2026-165). La fase de oposición consta de CUATRO ejercicios,
 *  todos obligatorios y eliminatorios. Se celebran en Madrid, salvo el primer
 *  ejercicio, simultáneo en Madrid y Barcelona. Quienes superan la oposición
 *  realizan después un curso selectivo como personal funcionario en prácticas.
 * ============================================================================
 */

export const procesoIntro =
  'La oposición de acceso libre consta de cuatro ejercicios, todos obligatorios y eliminatorios. ' +
  'Se celebran en Madrid (el primero, también en Barcelona). Superada la fase de oposición, se realiza un curso selectivo como funcionario en prácticas. Datos conforme a la convocatoria 2026 (BOE-A-2026-165).'

export const ejercicios = [
  {
    n: 1,
    titulo: 'Primer ejercicio',
    forma: 'Escrito',
    tiempo: '4 horas',
    temas: '2 temas',
    descripcion:
      'Desarrollo por escrito de dos temas: uno del bloque general obligatorio (Organización de las Administraciones Públicas, Derecho de la Unión Europea y Derecho Administrativo) y otro de la parte optativa, eligiendo entre la Opción 1 (Derecho Civil, Mercantil, Penal, Tributario y Economía y Contabilidad) o la Opción 2 (Prevención de Riesgos Laborales). Cada tema se elige entre 2 sacados a la suerte.',
    calificacion: '0 a 60 puntos (mínimo 30). Conocimientos 75 %, expresión escrita 15 %, presentación 10 %.',
  },
  {
    n: 2,
    titulo: 'Segundo ejercicio',
    forma: 'Oral',
    tiempo: '50 minutos',
    temas: '4 temas',
    descripcion:
      'Exposición oral de cuatro temas sacados a la suerte: dos de la primera parte (Derecho del Trabajo, Relaciones Laborales Individuales y Colectivas, Derecho Sindical) y dos de la segunda (Seguridad Social). Antes de empezar se dispone de 5 minutos de preparación; al finalizar, el tribunal puede preguntar durante 10 minutos.',
    calificacion: '0 a 70 puntos (mínimo 35). Conocimientos 75 %, comunicación oral 15 %, claridad y orden 10 %.',
  },
  {
    n: 3,
    titulo: 'Tercer ejercicio',
    forma: 'Escrito',
    tiempo: '4 horas',
    temas: '2 temas',
    descripcion:
      'Desarrollo por escrito de dos temas sacados a la suerte: uno de la tercera parte (Prevención de Riesgos Laborales) y otro de la cuarta parte (Inspección de Trabajo y Procedimiento).',
    calificacion: '0 a 60 puntos (mínimo 30). Conocimientos 75 %, expresión escrita 15 %, presentación 10 %.',
  },
  {
    n: 4,
    titulo: 'Cuarto ejercicio',
    forma: 'Caso práctico + idioma',
    tiempo: '4 horas + 1 hora',
    temas: 'Supuesto práctico e idioma',
    descripcion:
      'Dos partes, ambas eliminatorias. 1) Supuesto práctico: informe o resolución por escrito (máx. 4 horas) sobre cuestiones de inspección, sin uso de textos legales. 2) Prueba de idioma (inglés, francés o alemán): traducción escrita de 1 hora, o acreditación de un nivel B2 o superior (MCER) mediante titulación.',
    calificacion: '1.ª parte: 0 a 60 puntos (mínimo 30), análisis técnico-jurídico 90 %. 2.ª parte: apto / no apto.',
  },
]

/**
 * Requisitos de acceso (sistema general de acceso libre), conforme a la
 * convocatoria 2026 (BOE-A-2026-165). Conviene revisar siempre las bases de
 * la convocatoria vigente.
 */
export const requisitos = [
  'Tener la nacionalidad española.',
  'Tener cumplidos 18 años y no exceder de la edad máxima de jubilación forzosa.',
  'Estar en posesión (o en condiciones de obtener) de un título universitario: Grado, Licenciatura, Ingeniería, Arquitectura o Doctorado. Las titulaciones extranjeras deben estar homologadas.',
  'Poseer la capacidad funcional para el desempeño de las tareas.',
  'No haber sido separado del servicio por expediente disciplinario ni hallarse inhabilitado para empleos o cargos públicos, ni pertenecer ya al mismo cuerpo.',
]

export const requisitosNota =
  'Requisitos del turno de acceso libre conforme a la convocatoria 2026 (BOE-A-2026-165). Revisa siempre las bases de la convocatoria en vigor.'

/**
 * Modelos de examen para descargar (PDF). Documentos del Tribunal de
 * Oposiciones (Ministerio de Trabajo y Economía Social). Los archivos están
 * en public/modelos/.
 */
export const modelosExamen = [
  {
    titulo: 'Modelos de examen 2023 (recopilación)',
    descripcion: 'Recopilación de modelos de los ejercicios del proceso selectivo (acceso libre).',
    archivo: 'modelos/2023-modelos-examenes.pdf',
    meta: 'PDF · 57 págs',
  },
  {
    titulo: 'Caso práctico e idiomas · Turno libre',
    descripcion: 'Cuarto ejercicio: supuesto práctico y prueba de idioma del turno de acceso libre.',
    archivo: 'modelos/caso-practico-idiomas-turno-libre.pdf',
    meta: 'PDF · 18 págs',
  },
  {
    titulo: 'Casos prácticos e idioma · Promoción interna',
    descripcion: 'Casos prácticos de los ejercicios 1 y 2 y prueba de idioma (promoción interna).',
    archivo: 'modelos/casos-practicos-idioma-promocion-interna.pdf',
    meta: 'PDF · 27 págs',
  },
  {
    titulo: 'Modelos de examen 2024 · Promoción interna (Letra E)',
    descripcion: 'Modelos de examen del turno de promoción interna (Letra E).',
    archivo: 'modelos/2024-modelos-promocion-interna-letra-e.pdf',
    meta: 'PDF · 4 págs',
  },
]

/** Temario de preparación. */
export const temario = {
  intro:
    'El temario de referencia es el del CEF. Además, facilito temario propio acotado a unas 3.500 palabras por tema (variable según el tema), redactado para optimizar el estudio, el repaso y la exposición oral.',
  puntos: [
    'Temario base de referencia: CEF.',
    'Temario propio acotado a ~3.500 palabras por tema (según el tema).',
    'Material orientado a la memorización y a la exposición de los temas.',
    'Actualización conforme a la convocatoria vigente.',
  ],
  // Enlaces oficiales de compra del temario CEF.
  comprar: [
    {
      etiqueta: 'Temario CEF · Ejercicio 1 (bloque obligatorio y específico)',
      url: 'https://tienda.cef.udima.es/temario-oposiciones/INSPECCION-DE-TRABAJO-Y-SEGURIDAD-SOCIAL-EJERCICIO-1-ID1660.asp',
    },
    {
      etiqueta: 'Temario CEF · Ejercicio 2',
      url: 'https://tienda.cef.udima.es/temario-oposiciones/inspeccion-trabajo-seguridad-social-ejercicio-2.html',
    },
  ],
}
