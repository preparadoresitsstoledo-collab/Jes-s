// Contenido obligatorio del PLAN DE TRABAJO CON AMIANTO y demás obligaciones,
// conforme al Real Decreto 396/2006, de 31 de marzo, por el que se establecen
// las disposiciones mínimas de seguridad y salud aplicables a los trabajos con
// riesgo de exposición al amianto.
//
// ⚠️ Lista de verificación orientativa para el control del plan. No sustituye
// el criterio técnico ni el dictamen de la autoridad laboral.

export const ESTADOS_AMIANTO = {
  pendiente: { etiqueta: 'Sin revisar', color: 'gris' },
  conforme: { etiqueta: 'Consta / Conforme', color: 'verde' },
  no_consta: { etiqueta: 'No consta / Deficiencia', color: 'rojo' },
  revisar: { etiqueta: 'Revisar', color: 'ambar' },
  na: { etiqueta: 'No aplica', color: 'gris' },
}

// Bloques del cuadro de verificación del plan.
export const CHECKLIST_AMIANTO = [
  {
    num: '1',
    titulo: 'Datos y tramitación del plan',
    items: [
      {
        id: 'rera',
        etiqueta: 'Empresa inscrita en el RERA (Registro de Empresas con Riesgo por Amianto)',
        claves: ['rera', 'registro de empresas con riesgo', 'inscripcion en el registro'],
        fundamento: 'Art. 17 RD 396/2006',
      },
      {
        id: 'presentacion',
        etiqueta: 'Presentación del plan a la autoridad laboral antes del inicio de los trabajos',
        claves: ['autoridad laboral', 'presentacion del plan', 'aprobacion del plan', 'remision a la autoridad'],
        fundamento: 'Art. 11.1 RD 396/2006',
      },
      {
        id: 'descripcion',
        etiqueta: 'Descripción del trabajo a realizar y tipo de actividad',
        claves: ['descripcion del trabajo', 'objeto del plan', 'tipo de actividad', 'naturaleza de los trabajos', 'retirada', 'desamiantado', 'demolicion'],
        fundamento: 'Art. 11.2.a) RD 396/2006',
      },
      {
        id: 'tipo_material',
        etiqueta: 'Tipo y cantidad de amianto / material (friable o no friable)',
        claves: ['friable', 'no friable', 'amianto', 'fibrocemento', 'uralita', 'cantidad', 'tipo de material'],
        fundamento: 'Art. 11.2.b) RD 396/2006',
      },
      {
        id: 'ubicacion',
        etiqueta: 'Ubicación del lugar de trabajo',
        claves: ['ubicacion', 'emplazamiento', 'direccion del', 'lugar de trabajo', 'situacion de la obra'],
        fundamento: 'Art. 11.2.c) RD 396/2006',
      },
      {
        id: 'fechas',
        etiqueta: 'Fecha de inicio y duración prevista de los trabajos',
        claves: ['fecha de inicio', 'duracion prevista', 'plazo de ejecucion', 'cronograma', 'calendario'],
        fundamento: 'Art. 11.2.d) RD 396/2006',
      },
    ],
  },
  {
    num: '2',
    titulo: 'Trabajadores',
    items: [
      {
        id: 'relacion_trabajadores',
        etiqueta: 'Relación nominal de trabajadores y su categoría profesional',
        claves: ['relacion nominal', 'relacion de trabajadores', 'trabajadores implicados', 'personal interviniente', 'nominal de los trabajadores'],
        fundamento: 'Art. 11.2.e) RD 396/2006',
      },
      {
        id: 'formacion',
        etiqueta: 'Formación específica de los trabajadores sobre el riesgo de amianto',
        claves: ['formacion', 'formados', 'capacitacion', 'informacion a los trabajadores'],
        fundamento: 'Art. 13 RD 396/2006',
      },
      {
        id: 'vigilancia_salud',
        etiqueta: 'Aptitud médica / vigilancia de la salud',
        claves: ['vigilancia de la salud', 'aptitud medica', 'reconocimiento medico', 'apto', 'examen de salud'],
        fundamento: 'Art. 16 RD 396/2006',
      },
      {
        id: 'registro_datos',
        etiqueta: 'Registro de datos de exposición y su conservación (40 años)',
        claves: ['registro de datos', 'fichas de exposicion', '40 años', 'cuarenta años', 'conservacion de los datos'],
        fundamento: 'Art. 18 RD 396/2006',
      },
    ],
  },
  {
    num: '3',
    titulo: 'Medidas preventivas y de protección',
    items: [
      {
        id: 'procedimientos',
        etiqueta: 'Procedimientos de trabajo y adecuación de equipos/medios',
        claves: ['procedimiento de trabajo', 'metodo de trabajo', 'procedimientos a aplicar', 'tecnicas de'],
        fundamento: 'Art. 11.2.f) RD 396/2006',
      },
      {
        id: 'limitar_fibras',
        etiqueta: 'Medidas para limitar la generación y dispersión de fibras (encapsulado, humectación, aspiración)',
        claves: ['dispersion', 'humect', 'encapsul', 'aspiracion', 'extraccion localizada', 'sellado', 'impregnacion'],
        fundamento: 'Art. 6 y 11.2.g) RD 396/2006',
      },
      {
        id: 'epi',
        etiqueta: 'Equipos de protección individual (mascarillas/equipos respiratorios, buzos)',
        claves: ['epi', 'equipo de proteccion', 'mascarilla', 'proteccion respiratoria', 'buzo', 'mono desechable', 'ffp3'],
        fundamento: 'Art. 8 RD 396/2006',
      },
      {
        id: 'descontaminacion',
        etiqueta: 'Unidad/procedimiento de descontaminación de trabajadores y equipos',
        claves: ['descontaminacion', 'unidad de descontaminacion', 'duchas', 'esclusa', 'higiene personal'],
        fundamento: 'Art. 7 RD 396/2006',
      },
      {
        id: 'terceros',
        etiqueta: 'Medidas para evitar la exposición de terceros y señalización de zonas',
        claves: ['terceros', 'personas ajenas', 'señalizacion', 'balizamiento', 'zona restringida', 'acceso restringido', 'confinamiento'],
        fundamento: 'Art. 6 y 7 RD 396/2006',
      },
      {
        id: 'residuos',
        etiqueta: 'Gestión de residuos de amianto (residuo peligroso, transporte y vertedero autorizado)',
        claves: ['residuo', 'residuos peligrosos', 'gestor autorizado', 'vertedero', 'transporte de residuos', 'big bag', 'doble bolsa'],
        fundamento: 'Art. 7 RD 396/2006 y normativa de residuos',
      },
      {
        id: 'mediciones',
        etiqueta: 'Evaluación/medición de la exposición (VLA: 0,1 fibras/cm³ en 8 h)',
        claves: ['medicion', 'evaluacion de la exposicion', 'fibras', 'vla', 'valor limite', '0,1 fibras', 'muestreo ambiental'],
        fundamento: 'Art. 3, 4 y 5 RD 396/2006',
      },
      {
        id: 'recursos_preventivos',
        etiqueta: 'Recursos preventivos presentes durante los trabajos',
        claves: ['recurso preventivo', 'recursos preventivos', 'presencia de recursos'],
        fundamento: 'Ley 31/1995, art. 32 bis',
      },
    ],
  },
  {
    num: '4',
    titulo: 'Participación',
    items: [
      {
        id: 'consulta',
        etiqueta: 'Consulta a los representantes de los trabajadores sobre el plan',
        claves: ['representantes de los trabajadores', 'consulta', 'delegados de prevencion', 'comite de seguridad'],
        fundamento: 'Art. 11.5 RD 396/2006',
      },
    ],
  },
]

export const TODOS_AMIANTO = CHECKLIST_AMIANTO.flatMap((s) =>
  s.items.map((it) => ({ ...it, seccion: s.num, seccionTitulo: s.titulo })),
)
