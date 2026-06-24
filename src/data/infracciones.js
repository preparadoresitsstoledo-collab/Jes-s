/**
 * ============================================================================
 *  INFRACCIONES — Herramienta de estudio "Simulador de visita de inspección".
 * ============================================================================
 *  ⚠️  DATOS ORIENTATIVOS. Revisa y ajusta artículos, calificación y cuantías
 *      conforme a la LISOS (RDLeg 5/2000), la LOEX (LO 4/2000) y sus
 *      actualizaciones (Ley 10/2021, etc.). Eres el inspector: afina lo que veas.
 *
 *  Campos:
 *    ref          -> Artículo de referencia.
 *    materia      -> Bloque (Relaciones laborales / Seguridad Social / ...).
 *    titulo       -> Nombre corto de la infracción.
 *    descripcion  -> Situación que se "encuentra" en la visita.
 *    calificacion -> 'grave' | 'muy-grave'  (es lo que el usuario debe acertar).
 *    sancion      -> Rango de sanción (texto).
 * ============================================================================
 */

export const infracciones = [
  {
    ref: 'Art. 7.2 LISOS',
    materia: 'Relaciones laborales',
    titulo: 'Contratación / modalidades contractuales',
    descripcion:
      'Transgresión de la normativa sobre modalidades contractuales y contratos temporales (p. ej. temporalidad en fraude de ley).',
    calificacion: 'grave',
    sancion: '751 € – 7.500 €',
  },
  {
    ref: 'Art. 7.5 LISOS',
    materia: 'Relaciones laborales',
    titulo: 'Tiempo de trabajo',
    descripcion:
      'Incumplimiento de jornada, horas extraordinarias, descansos, vacaciones o permisos.',
    calificacion: 'grave',
    sancion: '751 € – 7.500 €',
  },
  {
    ref: 'Art. 7.10 LISOS',
    materia: 'Relaciones laborales',
    titulo: 'Cajón de sastre',
    descripcion:
      'Condiciones de trabajo inferiores a las legales o de convenio, u otros actos contrarios a los derechos de los trabajadores.',
    calificacion: 'grave',
    sancion: '751 € – 7.500 €',
  },
  {
    ref: 'Art. 8.1 LISOS',
    materia: 'Relaciones laborales',
    titulo: 'Impago de salarios',
    descripcion: 'Impago y retrasos reiterados en el pago del salario debido.',
    calificacion: 'muy-grave',
    sancion: '7.501 € – 225.018 €',
  },
  {
    ref: 'Art. 8.2 LISOS',
    materia: 'Relaciones laborales',
    titulo: 'Cesión ilegal de trabajadores',
    descripcion: 'Cesión de trabajadores en los términos prohibidos por la legislación.',
    calificacion: 'muy-grave',
    sancion: '7.501 € – 225.018 €',
  },
  {
    ref: 'Art. 22.2 LISOS',
    materia: 'Seguridad Social',
    titulo: 'Falta de alta',
    descripcion:
      'No solicitar el alta de los trabajadores en plazo (una infracción por cada trabajador).',
    calificacion: 'grave',
    sancion: '3.750 € – 12.000 € por trabajador',
  },
  {
    ref: 'Art. 22.3 LISOS',
    materia: 'Seguridad Social',
    titulo: 'Diferencias de cotización',
    descripcion:
      'No ingresar en plazo las cuotas o las diferencias de cotización (sin ánimo defraudatorio).',
    calificacion: 'grave',
    sancion: '3.750 € – 12.000 €',
  },
  {
    ref: 'Art. 23.1.a LISOS',
    materia: 'Seguridad Social',
    titulo: 'Compatibilización indebida',
    descripcion:
      'Dar ocupación a beneficiarios de pensiones o prestaciones incompatibles con el trabajo.',
    calificacion: 'muy-grave',
    sancion: '12.001 € – 225.018 €',
  },
  {
    ref: 'Art. 23.1.c LISOS',
    materia: 'Seguridad Social',
    titulo: 'Connivencia',
    descripcion:
      'Connivencia con trabajadores o beneficiarios para la obtención indebida de prestaciones.',
    calificacion: 'muy-grave',
    sancion: '12.001 € – 225.018 €',
  },
  {
    ref: 'Art. 26 LISOS',
    materia: 'Prestaciones · trabajador',
    titulo: 'Infracción del trabajador/beneficiario',
    descripcion:
      'P. ej. compatibilizar la prestación o el subsidio por desempleo con el trabajo. Conlleva la extinción de la prestación y la devolución de lo percibido indebidamente.',
    calificacion: 'muy-grave',
    sancion: 'Extinción de la prestación + devolución',
  },
  {
    ref: 'Art. 37.1 LISOS',
    materia: 'Extranjería',
    titulo: 'Trabajo de extranjeros (LISOS)',
    descripcion: 'Infracciones en materia de trabajo de personas extranjeras (LISOS).',
    calificacion: 'muy-grave',
    sancion: '7.501 € – 225.018 €',
  },
  {
    ref: 'Art. 54.1.d LOEX',
    materia: 'Extranjería',
    titulo: 'Contratar sin autorización',
    descripcion:
      'Contratar trabajadores extranjeros sin la autorización de residencia y trabajo (una infracción por cada trabajador).',
    calificacion: 'muy-grave',
    sancion: '10.001 € – 100.000 € por trabajador',
  },
]
