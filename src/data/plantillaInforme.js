// Plantilla del informe de control de legalidad de convenios colectivos
// (art. 90.5 y 6 del Estatuto de los Trabajadores), reproduciendo el "cuadro"
// de verificación que utiliza la Inspección de Trabajo y Seguridad Social.
//
// Cada punto del cuadro se valora con uno de estos estados:
//   - conforme    → Se regula conforme a la legalidad / respeta el mínimo.
//   - vulneracion → Restricción o vulneración (la "X" del informe).
//   - no_regula   → No se regula; se remite a la legislación laboral común.
//   - remision    → Remisión expresa al ET u otra norma.
//   - na          → No aplica.
//   - pendiente   → Sin revisar (estado inicial).

export const ESTADOS = {
  pendiente: { etiqueta: 'Sin revisar', color: 'gris' },
  conforme: { etiqueta: 'Conforme', color: 'verde' },
  vulneracion: { etiqueta: 'Restricción o vulneración', color: 'rojo' },
  no_regula: { etiqueta: 'No se regula (remisión a la ley)', color: 'ambar' },
  remision: { etiqueta: 'Remisión expresa al ET', color: 'azul' },
  na: { etiqueta: 'No aplica', color: 'gris' },
}

// Datos de cabecera del documento (editables en la herramienta).
// Sin membrete oficial: es una revisión privada, no un informe del Estado.
export const CABECERA_DEFECTO = {
  encabezado: '',
  asunto: 'REVISIÓN DE CONVENIO COLECTIVO',
  autor: '',
}

// Fórmula de apertura de la revisión (neutra, sin referencia al art. 90.5/6 ET).
export function parrafoApertura(nombreConvenio) {
  const nombre = (nombreConvenio || '[NOMBRE DEL CONVENIO]').toUpperCase()
  return (
    `Revisión del contenido del ${nombre}, de cuyo análisis resultan las siguientes ` +
    'observaciones:'
  )
}

// Texto introductorio del apartado de conclusiones.
export const RESULTADO_INTRO = {
  conVulneraciones:
    'De la revisión realizada se desprende que convendría revisar o subsanar los siguientes aspectos ' +
    'del convenio colectivo examinado:',
  sinVulneraciones:
    'En las materias revisadas, el convenio remite a la legislación laboral común o no contiene una ' +
    'regulación que contradiga la normativa vigente.',
}

export const CIERRE =
  'Estas observaciones tienen carácter orientativo y no constituyen un informe oficial ni asesoramiento jurídico.'

// Cuadro de verificación. Estructura idéntica a la de los informes reales.
export const CUADRO_VERIFICACION = [
  {
    num: '1',
    titulo: 'Sistema de clasificación profesional',
    items: [
      {
        id: 'clasificacion_grupos',
        etiqueta: 'Se regula la clasificación por grupos profesionales (no por categorías)',
        fundamento: 'Art. 22 ET',
        articulo: 'et22',
      },
      {
        id: 'discriminacion_grupos',
        etiqueta:
          'Indicios de discriminación en la denominación y/o definición de los grupos profesionales',
        fundamento: 'Art. 22 y 17 ET',
        marcaEsVulneracion: true,
      },
      {
        id: 'jubilacion_forzosa',
        etiqueta: 'Jubilación obligatoria por edad contraria a la DA 10ª ET',
        fundamento: 'DA 10ª ET',
        articulo: 'da10',
        marcaEsVulneracion: true,
      },
      {
        id: 'msct',
        etiqueta:
          'Modificación sustancial de condiciones de trabajo regulada de forma menos favorable que el art. 41 ET',
        fundamento: 'Art. 41 ET',
        articulo: 'et41',
        marcaEsVulneracion: true,
      },
    ],
  },
  {
    num: '4',
    titulo: 'Vacaciones',
    items: [
      {
        id: 'vacaciones_it',
        etiqueta:
          'Vacaciones en situación de IT por embarazo, parto, lactancia y maternidad sin recoger el art. 38.3 ET',
        fundamento: 'Art. 38.3 ET',
        articulo: 'et383',
        marcaEsVulneracion: true,
      },
    ],
  },
  {
    num: '5',
    titulo: 'Reducción de jornada por guarda legal y permisos',
    items: [
      {
        id: 'reduccion_376',
        etiqueta: 'Reducción de jornada conforme al art. 37.6 ET',
        fundamento: 'Art. 37.6 ET',
        articulo: 'et376',
      },
      {
        id: 'reduccion_12',
        etiqueta: 'Se regula hasta los 12 años del menor',
        fundamento: 'Art. 37.6 ET',
      },
      {
        id: 'reduccion_cancer',
        etiqueta: 'Se incluyen los supuestos de menores con cáncer / enfermedad grave',
        fundamento: 'Art. 37.6 ET',
      },
      {
        id: 'permisos_373',
        etiqueta: 'Los permisos y licencias respetan como mínimo el art. 37.3 ET',
        fundamento: 'Art. 37.3 ET',
      },
    ],
  },
  {
    num: '7',
    titulo: 'Contratación, excedencias y retribución',
    items: [
      {
        id: 'excedencia_simultanea',
        etiqueta:
          'Excedencia simultánea de padre y madre limitada sin considerar razones justificadas de funcionamiento',
        fundamento: 'Art. 46.3 ET',
        marcaEsVulneracion: true,
      },
      {
        id: 'contrato_eventual',
        etiqueta: 'Duración del contrato eventual regulada de modo diferente al art. 15.2 ET',
        fundamento: 'Art. 15.2 ET',
        marcaEsVulneracion: true,
      },
      {
        id: 'fijos_discontinuos',
        etiqueta: 'Contratos fijos discontinuos regulados de manera distinta al art. 16 ET',
        fundamento: 'Art. 16 ET',
        marcaEsVulneracion: true,
      },
      {
        id: 'formativos',
        etiqueta: 'Contratos formativos regulados de manera diferente al art. 11 ET',
        fundamento: 'Art. 11 ET',
        marcaEsVulneracion: true,
      },
      {
        id: 'obra_servicio',
        etiqueta:
          'Contrato para obra o servicio sin tener en cuenta su derogación desde el 1-4-2022 (RDL 36/2021)',
        fundamento: 'RDL 36/2021',
        marcaEsVulneracion: true,
      },
      {
        id: 'jubilacion_parcial',
        etiqueta: 'Jubilación parcial y contrato de relevo conculcando el art. 12.6 y 7 ET',
        fundamento: 'Art. 12.6 y 7 ET',
        marcaEsVulneracion: true,
      },
      {
        id: 'retrib_a',
        etiqueta:
          'A) Diferencias retributivas para el mismo puesto a trabajadores de nuevo ingreso sin justificación objetiva',
        fundamento: 'Art. 17 ET',
        marcaEsVulneracion: true,
      },
      {
        id: 'retrib_b',
        etiqueta: 'B) Desigualdad por razón de edad',
        fundamento: 'Art. 17 ET',
        marcaEsVulneracion: true,
      },
      {
        id: 'retrib_c',
        etiqueta: 'C) Salario de aprendiz o aspirante inferior al SMI',
        fundamento: 'Art. 27 ET',
        marcaEsVulneracion: true,
      },
      {
        id: 'retrib_d',
        etiqueta: 'D) Compensación económica por trabajo en festivo inferior a la fijada en convenio',
        fundamento: 'Art. 37.2 ET',
        marcaEsVulneracion: true,
      },
      {
        id: 'retrib_e',
        etiqueta: 'E) Retribución durante los permisos del 37.3 ET inferior a la legal',
        fundamento: 'Art. 37.3 ET',
        marcaEsVulneracion: true,
      },
      {
        id: 'retrib_f',
        etiqueta: 'F) Sustitución de vacaciones por compensación económica',
        fundamento: 'Art. 38.1 ET',
        marcaEsVulneracion: true,
      },
      {
        id: 'subrogacion',
        etiqueta: 'Subrogación empresarial regulada por convenio de empresa',
        fundamento: 'Art. 44 ET',
      },
      {
        id: 'movilidad_funcional',
        etiqueta: 'Movilidad funcional sin respetar los límites del art. 39 ET',
        fundamento: 'Art. 39 ET',
        marcaEsVulneracion: true,
      },
    ],
  },
  {
    num: '12',
    titulo: 'Tiempo de trabajo y descansos',
    items: [
      {
        id: 'descansos',
        etiqueta:
          'Descanso semanal, descanso entre jornadas y descanso alternativo acumulado en periodos superiores a 14 días; compensación económica sin cumplir requisitos del ET',
        fundamento: 'Art. 34 y 37.1 ET',
        marcaEsVulneracion: true,
      },
    ],
  },
  {
    num: '13',
    titulo: 'Régimen disciplinario',
    items: [
      {
        id: 'prescripcion_faltas',
        etiqueta: 'Prescripción de las faltas con periodos superiores al art. 60 ET',
        fundamento: 'Art. 60 ET',
        articulo: 'et60',
        marcaEsVulneracion: true,
      },
      {
        id: 'acoso_falta_grave',
        etiqueta: 'Se tipifica como infracción muy grave el acoso sexual y por razón de sexo',
        fundamento: 'LO 3/2007',
      },
    ],
  },
  {
    num: '14',
    titulo: 'Igualdad y prevención del acoso',
    items: [
      {
        id: 'plan_igualdad',
        etiqueta:
          'Se ha cumplido el deber de negociar medidas para promover la igualdad de trato y oportunidades o, en su caso, planes de igualdad',
        fundamento: 'Art. 85.1 ET y LO 3/2007',
        articulo: 'et851',
      },
      {
        id: 'protocolo_acoso',
        etiqueta:
          'Se han incluido procedimientos específicos para la prevención y denuncia del acoso sexual y por razón de sexo',
        fundamento: 'Art. 48 LO 3/2007',
        articulo: 'lo3_48',
      },
    ],
  },
  {
    num: '16',
    titulo: 'Lactancia',
    items: [
      {
        id: 'lactancia_acumulacion',
        etiqueta:
          'En caso de acumulación de la lactancia, se ha fijado el número de días que corresponden',
        fundamento: 'Art. 37.4 ET',
      },
    ],
  },
]

// Lista plana de todos los puntos del cuadro (útil para recorrerlos).
export const TODOS_LOS_ITEMS = CUADRO_VERIFICACION.flatMap((s) =>
  s.items.map((it) => ({ ...it, seccion: s.num, seccionTitulo: s.titulo })),
)
