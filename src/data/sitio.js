/**
 * ============================================================================
 *  CONFIGURACIÓN DEL SITIO — edita aquí tus datos personales y de contacto.
 * ============================================================================
 *  ⚠️  Los textos marcados con (EDITAR) son de ejemplo: cámbialos por los
 *      tuyos reales antes de publicar.
 * ============================================================================
 */

import fotoPreparador from '../assets/preparador.jpg'
import mediaTve1 from '../assets/media-tve-1.jpg'
import mediaTve2 from '../assets/media-tve-2.jpg'


/** Datos de marca / cabecera. */
export const marca = {
  nombre: 'Preparación ITSS Toledo',
  claim: 'Preparación presencial para el Cuerpo Superior de Inspección de Trabajo y Seguridad Social',
  ciudad: 'Toledo',
  email: 'info@preparadoritsstoledo.es',
  // TELÉFONO Y WHATSAPP OCULTOS. Para volver a activarlos, escribe el número en
  // los campos `telefono` / `whatsapp` y pon el `mostrar...` correspondiente a true.
  mostrarTelefono: false,
  telefono: '', // ej. '+34 600 00 00 00'
  whatsapp: '', // ej. '34600000000' (sin signos). Vacío = sin botón de WhatsApp.
  // Redes sociales (deja la cadena vacía para ocultar el enlace).
  x: 'https://x.com/Jesus_Prieto_V',
  xUsuario: '@Jesus_Prieto_V',
  linkedin: 'https://www.linkedin.com/in/jes%C3%BAs-mar%C3%ADa-prieto-valbuena-7163022ba/',
}

/**
 * Sección "La profesión": en qué consiste el trabajo de Inspector de Trabajo
 * y Seguridad Social. Redactado a partir de la entrevista del preparador.
 */
export const profesion = {
  intro:
    'La Inspección de Trabajo y Seguridad Social es un servicio público y gratuito, como la educación o la sanidad. El inspector es el garante del cumplimiento de la legalidad y de los derechos de las personas trabajadoras. Es una profesión apasionante y con sentido: una parte del Derecho muy viva, que nos afecta a todos.',
  cita: {
    texto:
      'Me gusta pensar que nuestro puesto de trabajo no es una oficina, sino el puesto de trabajo de la gente.',
  },
  // Marco normativo de la Inspección de Trabajo y Seguridad Social.
  marco: {
    titulo: 'Marco normativo',
    normas: [
      {
        nombre: 'Convenio n.º 81 de la OIT',
        detalle: 'Sobre la inspección del trabajo en la industria y el comercio (1947).',
        url: 'https://normlex.ilo.org/dyn/nrmlx_es/f?p=NORMLEXPUB:12100:0::NO::P12100_ILO_CODE:C081',
      },
      {
        nombre: 'Convenio n.º 129 de la OIT',
        detalle: 'Sobre la inspección del trabajo en la agricultura (1969).',
        url: 'https://normlex.ilo.org/dyn/nrmlx_es/f?p=NORMLEXPUB:12100:0::NO::P12100_ILO_CODE:C129',
      },
      {
        nombre: 'Ley 23/2015, de 21 de julio',
        detalle: 'Ordenadora del Sistema de Inspección de Trabajo y Seguridad Social.',
        url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2015-8168',
      },
    ],
  },
  puntos: [
    {
      icono: '🛡️',
      titulo: 'Garante de la legalidad',
      texto: 'Vela por el cumplimiento de la legislación laboral, de Seguridad Social y de prevención de riesgos.',
    },
    {
      icono: '🤝',
      titulo: 'Servicio público y gratuito',
      texto: 'Al servicio de la ciudadanía y de las empresas, como la educación o la sanidad.',
    },
    {
      icono: '👷',
      titulo: 'Protección de las personas trabajadoras',
      texto: 'Defiende sus derechos y la prevención de los riesgos laborales en el día a día.',
    },
    {
      icono: '🚶',
      titulo: 'Las visitas de inspección',
      texto: 'El trabajo se desarrolla sobre el terreno: visitas a empresas y centros para comprobar la realidad de cada puesto de trabajo.',
    },
    {
      icono: '⚖️',
      titulo: 'Procedimientos ágiles',
      texto: 'Procedimientos administrativos rápidos y eficaces para resolver irregularidades laborales.',
    },
    {
      icono: '🌍',
      titulo: 'Un trabajo con sentido',
      texto: 'Contribuir, con su granito de arena, a que la sociedad sea un poco mejor.',
    },
  ],
}

/** Franja de ventajas / "por qué elegir esta preparación". */
export const ventajas = [
  {
    icono: '🏛️',
    titulo: 'Presencial en Toledo',
    texto: 'Clases 100% presenciales, sin videoconferencia.',
  },
  {
    icono: '🕵️',
    titulo: 'Inspector en activo',
    texto: 'Te prepara quien ejerce la profesión cada día.',
  },
  {
    icono: '👥',
    titulo: 'Grupo único y reducido',
    texto: 'Atención personalizada y plazas limitadas.',
  },
  {
    icono: '🏅',
    titulo: 'Resultados probados',
    texto: '10 alumnos aprobados en las últimas convocatorias.',
  },
]

/** Pasos para empezar la preparación. */
export const pasos = [
  {
    titulo: 'Contacta',
    texto: 'Escríbeme por email o por el formulario de contacto y cuéntame en qué punto estás.',
  },
  {
    titulo: 'Reunión inicial',
    texto: 'Valoramos tu punto de partida, te explico el método y resolvemos tus dudas.',
  },
  {
    titulo: 'Plan personalizado',
    texto: 'Diseñamos tu planificación de estudio adaptada a tu disponibilidad.',
  },
  {
    titulo: 'Empiezas a preparar',
    texto: 'Te incorporas al grupo presencial en Toledo y arranca la preparación.',
  },
]

/** Sección "El preparador" / Quién soy. */
export const preparador = {
  nombre: 'Jesús María Prieto Valbuena',
  cargo: 'Inspector de Trabajo y Seguridad Social · Preparador de la oposición',
  // Foto del preparador (importada desde src/assets/preparador.jpg).
  foto: fotoPreparador,
  // Galería "En los medios" (apariciones en televisión).
  galeria: [
    { src: mediaTve1, alt: 'Jesús Prieto en «Aquí hay trabajo» (TVE)' },
    { src: mediaTve2, alt: 'Jesús Prieto en «Aquí hay trabajo» (TVE)' },
  ],
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
  // Vídeo de presentación del preparador (YouTube). Confirmado por Jesús Prieto.
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
    titulo: 'Sistema de bloques y semiarrastre',
    texto: 'Cada cuatro semanas se refresca lo estudiado en las tres anteriores, fijando el temario a largo plazo. Es una carrera de fondo: constancia semanal por encima del número de temas.',
    icono: '🔁',
  },
  {
    titulo: '«Cantar» los temas',
    texto: 'Desde el inicio se recitan los temas en voz alta, preparando a la vez el primer ejercicio escrito y, sobre todo, el segundo ejercicio oral, donde se gana la soltura que marca la diferencia.',
    icono: '🗣️',
  },
  {
    titulo: 'Técnicas de memorización',
    texto: 'Reglas mnemotécnicas para memorizar fechas, reales decretos y textos con la rigurosidad que exige la oposición, optimizando el tiempo de estudio.',
    icono: '🧠',
  },
  {
    titulo: 'Planificación semanal del estudio',
    texto: 'Cada semana se planifica qué hay que estudiar, marcando objetivos concretos para avanzar de forma ordenada y constante a lo largo de toda la convocatoria.',
    icono: '🗓️',
  },
  {
    titulo: 'Exámenes y simulacros',
    texto: 'Exámenes escritos periódicos con lectura y corrección posterior, casos prácticos y práctica de exposición oral para preparar todas las fases del proceso selectivo.',
    icono: '✍️',
  },
  {
    titulo: 'Seguimiento continuo',
    texto: 'Control del progreso y orientación personalizada durante todo el proceso, ajustando el plan según la evolución de cada aspirante.',
    icono: '📈',
  },
]

/** Precio de la preparación. */
export const precio = {
  importe: 'Cuota mensual',
  descripcion: 'El importe se indicará en el correo de respuesta.',
  incluye: [
    'Clases presenciales en grupo único y reducido',
    'Planificación semanal del estudio',
    'Casos prácticos y simulacros de examen',
    'Corrección y seguimiento personalizado',
    'Práctica de exposición oral («cantar» los temas)',
  ],
  nota: 'Plazas limitadas. Consulta la disponibilidad del grupo.',
}

/** Testimonios reales de alumnos (publicados con su consentimiento). */
export const testimonios = [
  {
    texto:
      'Ser opositor implica no solo enfrentarte a un temario y a los exámenes, sino a ti mismo. Con esto quiero decir que habrá momentos de alegría, tristeza, concentración, vagueza, enfado, frustración y cuantos estados sentimentales se te puedan ocurrir, pero el final del camino supera a todos ellos. Haber preparado con «Preparadores ITSS Toledo» me ha ayudado a llevar una buena organización a efectos de acumular y arrastrar todos los temas. Siempre con una planificación individual de cada uno, sabiendo cuándo hay que exigir y cuándo hay que aflojar con cada persona. Agradezco la cercanía y, sobre todo, la rigurosidad en el estudio de los temas. Sin ellos no hubiera podido alcanzar la meta: ser Inspectora de Trabajo y Seguridad Social.',
    autor: 'África',
    cargo: 'Alumna aprobada · Inspectora de Trabajo y Seguridad Social',
  },
]

/** Preguntas frecuentes. */
export const faqs = [
  {
    pregunta: '¿Dónde se preparan las oposiciones de Inspección de Trabajo en Toledo?',
    respuesta: 'La preparación es presencial en la provincia de Toledo, impartida por un Inspector de Trabajo y Seguridad Social en activo, en un grupo único y reducido.',
  },
  {
    pregunta: '¿Las clases son presenciales u online?',
    respuesta: 'Exclusivamente presenciales en la provincia de Toledo. No se ofrece preparación por videoconferencia.',
  },
  {
    pregunta: '¿Necesito tener una titulación concreta para presentarme?',
    respuesta: 'Hay que estar en posesión —o en condiciones de obtener— del título de Doctor, Licenciado, Ingeniero, Arquitecto o Grado, conforme a la última convocatoria (BOE-A-2026-165). Las titulaciones obtenidas en el extranjero deben estar homologadas.',
  },
  {
    pregunta: '¿Cuándo empiezan los grupos?',
    respuesta: 'Empiezan en función de lo que se pacte de forma individualizada con cada alumno, atendiendo a su situación particular. Al ser un grupo pequeño y una preparación individualizada, no existe la misma preparación para dos alumnos: es personal de cada uno.',
  },
  {
    pregunta: '¿Cómo solicito información o reservo plaza?',
    respuesta: 'Escríbeme por email o por el formulario de contacto y te explico cómo funciona la preparación y la disponibilidad del grupo.',
  },
]
