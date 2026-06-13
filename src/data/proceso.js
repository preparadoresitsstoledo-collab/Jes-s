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
}
