/**
 * ============================================================================
 *  CONFIGURACIÓN DEL SITIO — edita aquí tus datos personales y de contacto.
 * ============================================================================
 *  ⚠️  Los textos marcados con (EDITAR) son de ejemplo: cámbialos por los
 *      tuyos reales antes de publicar.
 * ============================================================================
 */

/** Datos de marca / cabecera. */
export const marca = {
  nombre: 'Preparación ITSS Toledo',
  claim: 'Preparación presencial para el Cuerpo Superior de Inspección de Trabajo y Seguridad Social',
  ciudad: 'Toledo',
  email: 'preparadoresitsstoledo@gmail.com',
  telefono: '+34 600 000 000', // (EDITAR) tu teléfono real
  whatsapp: '34600000000', // (EDITAR) número para enlace de WhatsApp, sin signos
}

/** Sección "El preparador" / Quién soy. */
export const preparador = {
  nombre: 'Jesús María Prieto Valbuena',
  cargo: 'Inspector de Trabajo y Seguridad Social · Preparador de la oposición',
  // Ruta a tu foto. Coloca el archivo en /public/preparador.jpg
  foto: '', // ej: './preparador.jpg' (déjalo vacío para mostrar un avatar genérico)
  // Bio redactada a partir de tu entrevista en La Revista de Valdemoro (jun. 2025).
  // Revisa y ajusta cualquier dato que quieras matizar.
  bio: [
    'Soy Jesús María Prieto Valbuena, Inspector de Trabajo y Seguridad Social. Cuando terminé la carrera de Derecho descubrí la oposición a la Inspección y, en cuanto indagué de qué se trataba, supe que ese iba a ser mi trabajo: lo que quería hacer el resto de mi vida.',
    'Comencé como subinspector de empleo y hoy soy jefe de la Unidad de Seguridad Social de la Inspección Provincial de Toledo. Esa experiencia diaria —garantizar el cumplimiento de la legislación laboral y de Seguridad Social y proteger los derechos de los trabajadores— es la base con la que preparo a quienes quieren conseguir su plaza. Además soy vocal del Sindicato de Inspectores de Trabajo y Seguridad Social.',
    'Preparar a futuros inspectores es mi proyecto personal. Conozco de primera mano lo exigente que es esta oposición —y lo que cuesta sostener años de estudio—, por eso preparo de forma 100% presencial en Toledo, con un método cercano, exigente y orientado a resultados.',
  ],
  // Cita destacada (literal de la entrevista en La Revista de Valdemoro).
  cita: {
    texto:
      'El rigor de nuestros procesos de oposiciones elige a profesionales muy cualificados, bien formados y personalmente capacitados.',
    fuente: 'Entrevista en La Revista de Valdemoro, junio de 2025',
  },
  // Vídeo de presentación. Pega el ID o la URL de embed de YouTube/Vimeo.
  // (EDITAR) Vídeo público encontrado sobre la oposición. Sustitúyelo si prefieres
  // tu propio vídeo de presentación.
  videoUrl: 'https://www.youtube.com/watch?v=xHMBxCNN-4I',
  // Méritos / referencias rápidas que se muestran como tarjetas.
  meritos: [
    'Inspector de Trabajo y Seguridad Social en activo',
    'Jefe de la Unidad de Seguridad Social · Inspección Provincial de Toledo',
    'Vocal del Sindicato de Inspectores de Trabajo y Seguridad Social',
    '10 alumnos aprobados en las últimas convocatorias (grupo reducido)',
  ],
  // Apariciones en medios (mencionadas en la entrevista).
  medios: [
    'TVE — «Aquí hay trabajo» (La 2)',
    'Antena 3 — «Espejo Público»',
    'Antena 3 Noticias',
    'La Sexta',
    'Telemadrid',
  ],
}

/**
 * Resultados de la preparación (alumnos aprobados por convocatoria).
 * Grupo único y reducido, 100% presencial.
 */
export const resultados = {
  nota: 'Datos de un grupo único y reducido, 100% presencial en Toledo.',
  porConvocatoria: [
    { año: 2023, libre: 3, promocionInterna: 3 },
    { año: 2024, libre: 1, promocionInterna: 0 },
    { año: 2025, libre: 2, promocionInterna: 1 },
  ],
}

/** Referencias / testimonios de antiguos alumnos. */
export const testimonios = [
  {
    nombre: 'Alumno/a aprobado/a (EDITAR)',
    promocion: 'Promoción 2023',
    texto: 'Testimonio de ejemplo. Sustituye por una referencia real de un alumno o alumna que haya aprobado contigo.',
  },
  {
    nombre: 'Alumno/a aprobado/a (EDITAR)',
    promocion: 'Promoción 2022',
    texto: 'Otro testimonio de ejemplo. Las referencias reales aportan mucha confianza a quien visita la web.',
  },
  {
    nombre: 'Alumno/a aprobado/a (EDITAR)',
    promocion: 'Promoción 2021',
    texto: 'Tercer testimonio de ejemplo.',
  },
]

/** Pasos de la metodología (todo presencial en Toledo). */
export const metodologia = [
  {
    titulo: 'Clases 100% presenciales en Toledo',
    texto: 'Todas las sesiones son presenciales en la provincia de Toledo. No se imparten clases por videoconferencia: el contacto directo permite resolver dudas al momento y mantener el ritmo de estudio.',
    icono: '🏛️',
  },
  {
    titulo: 'Grupo único y reducido',
    texto: 'Un solo grupo, con plazas muy limitadas, para garantizar atención personalizada y seguimiento individual de cada aspirante.',
    icono: '👥',
  },
  {
    titulo: 'Temario y casos prácticos',
    texto: 'Trabajo del temario oficial, casos prácticos reales de la Inspección y supuestos tipo examen, con corrección detallada.',
    icono: '📚',
  },
  {
    titulo: 'Simulacros y exposiciones',
    texto: 'Simulacros periódicos en condiciones de examen y práctica de exposición oral para preparar todas las fases del proceso selectivo.',
    icono: '✍️',
  },
  {
    titulo: 'Seguimiento continuo',
    texto: 'Planificación del estudio, control de progreso y orientación durante toda la convocatoria.',
    icono: '📈',
  },
]

/**
 * Planes de precios. (EDITAR) Ajusta importes y conceptos a tu oferta real.
 * Pon `destacado: true` en el plan que quieras resaltar.
 */
export const planes = [
  {
    nombre: 'Mensualidad',
    precio: '—',
    periodo: '/ mes',
    descripcion: 'Cuota mensual de preparación presencial.',
    incluye: [
      'Clases presenciales semanales en Toledo',
      'Material y casos prácticos',
      'Corrección de supuestos',
      'Resolución de dudas en clase',
    ],
    destacado: true,
    nota: 'Importe a definir (EDITAR)',
  },
  {
    nombre: 'Matrícula',
    precio: '—',
    periodo: 'pago único',
    descripcion: 'Matrícula inicial de acceso al curso.',
    incluye: [
      'Alta en el grupo',
      'Acceso al material base',
      'Plan de estudio personalizado',
    ],
    destacado: false,
    nota: 'Importe a definir (EDITAR)',
  },
  {
    nombre: 'Clases sueltas / repaso',
    precio: '—',
    periodo: 'según necesidad',
    descripcion: 'Sesiones puntuales de refuerzo o repaso intensivo.',
    incluye: [
      'Sesiones presenciales puntuales',
      'Repaso intensivo antes del examen',
      'Corrección individual',
    ],
    destacado: false,
    nota: 'Importe a definir (EDITAR)',
  },
]

/** Preguntas frecuentes. (EDITAR) Adáptalas a tu caso. */
export const faqs = [
  {
    pregunta: '¿Las clases son presenciales u online?',
    respuesta: 'Exclusivamente presenciales en la provincia de Toledo. No se ofrece preparación por videoconferencia.',
  },
  {
    pregunta: '¿Necesito tener una titulación concreta para presentarme?',
    respuesta: 'La oposición al Cuerpo Superior de Inspección de Trabajo y Seguridad Social exige titulación universitaria según las bases de cada convocatoria. Te orientamos sobre los requisitos vigentes. (EDITAR / confirmar con la convocatoria en vigor).',
  },
  {
    pregunta: '¿Cuándo empiezan los grupos?',
    respuesta: 'Consulta las fechas de inicio y disponibilidad de plazas por email o teléfono. (EDITAR)',
  },
  {
    pregunta: '¿Cuánto cuesta la preparación?',
    respuesta: 'Consulta el apartado de precios. Los importes definitivos se confirman al formalizar la matrícula. (EDITAR)',
  },
]
