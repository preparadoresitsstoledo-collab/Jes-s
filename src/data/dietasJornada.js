// Parámetros por defecto de la herramienta «Dietas y jornada anual».
//
// ⚠️ Comprueba siempre la jornada anual en el convenio colectivo aplicable y
// los límites de exención de dietas vigentes en el periodo examinado.

export const CONFIG_POR_DEFECTO = {
  desde: '',
  hasta: '',
  jornadaAnual: 1800, // horas de trabajo efectivo/año según convenio (art. 34.1 ET)
  jornadaDiaria: 8, // horas por día para convertir la jornada anual en días hábiles
  vacacionesAnuales: 30, // días naturales (art. 38.1 ET)
  limiteHEAnual: 80, // art. 35.2 ET
  prorrateo: 'meses', // 'meses' | 'dias'
  redondeo: 'proximo', // 'proximo' | 'superior' | 'inferior' | 'ninguno'
  criterioDias: 'maximo', // 'maximo' | 'dietas' | 'tacografo'
  preciosHE: {}, // { '2023': 14.5 } €/hora para valorar el exceso (opcional)
}

export const CRITERIOS_DIAS = [
  {
    id: 'maximo',
    nombre: 'El mayor de los dos',
    detalle: 'Días trabajados = el mayor entre los días con dieta (nóminas) y los días con actividad en el tacógrafo.',
  },
  { id: 'dietas', nombre: 'Días con dieta', detalle: 'Solo los días con dieta que constan en las nóminas.' },
  { id: 'tacografo', nombre: 'Días de tacógrafo', detalle: 'Solo los días con actividad registrada en la tarjeta del conductor.' },
]

export const PRORRATEOS = [
  { id: 'meses', nombre: 'Por meses', detalle: 'Ej.: enero–octubre = 10/12 de la jornada anual.' },
  { id: 'dias', nombre: 'Por días naturales', detalle: 'Ej.: 304 días de 365.' },
]

export const REDONDEOS = [
  { id: 'proximo', nombre: 'Al entero más próximo' },
  { id: 'superior', nombre: 'Al entero superior' },
  { id: 'inferior', nombre: 'Al entero inferior' },
  { id: 'ninguno', nombre: 'Sin redondear' },
]

// Tipos de dieta que se pueden registrar por nómina
export const TIPOS_DIETA = [
  { id: 'nacional_sin', nombre: 'Nacional sin pernocta', ambito: 'nacional', pernocta: false },
  { id: 'nacional_con', nombre: 'Nacional con pernocta', ambito: 'nacional', pernocta: true },
  { id: 'extranjero_sin', nombre: 'Extranjero sin pernocta', ambito: 'extranjero', pernocta: false },
  { id: 'extranjero_con', nombre: 'Extranjero con pernocta', ambito: 'extranjero', pernocta: true },
]

// Límites diarios exentos (art. 147.2.a LGSS en relación con el art. 9.A RIRPF).
// Manutención: art. 9.A.3.a RIRPF. Estancia de conductores de transporte de
// mercancías por carretera sin justificación: art. 9.A.3.b RIRPF (15 € / 25 €).
// ⚠️ Verifica las cuantías vigentes en cada ejercicio.
export const LIMITES_EXENTOS = {
  nacional_sin: 26.67,
  nacional_con: 53.34 + 15,
  extranjero_sin: 48.08,
  extranjero_con: 91.35 + 25,
}

export const DATOS_EXPEDIENTE = [
  { id: 'empresa', label: 'Empresa' },
  { id: 'nif', label: 'NIF' },
  { id: 'ccc', label: 'Código de cuenta de cotización' },
  {
    id: 'actividad',
    label: 'Actividad',
    placeholder: 'transporte de mercancías por carretera a nivel nacional e internacional',
  },
  {
    id: 'convenio',
    label: 'Convenio colectivo aplicable',
    placeholder: 'Convenio colectivo de transporte de mercancías por carretera de la provincia de …',
  },
  { id: 'ordenServicio', label: 'Orden de servicio / expediente' },
]

// Comprobaciones que el actuante marca para incluir en los hechos
export const COMPROBACIONES = [
  { id: 'sinJustificantes', texto: 'La empresa no aporta facturas ni tiques que justifiquen el gasto de las dietas.' },
  { id: 'partesTrabajo', texto: 'Aporta partes de trabajo con fechas, servicios, matrícula y kilómetros.' },
  { id: 'dietasMensuales', texto: 'Los trabajadores perciben dietas exentas de forma habitual todos los meses.' },
  { id: 'variacionPrecios', texto: 'El importe de la dieta varía sin justificación objetiva, incluso dentro de la misma nómina.' },
  { id: 'dietasEnVacaciones', texto: 'Se perciben dietas durante periodos que deberían ser de vacaciones.' },
  { id: 'sinHE', texto: 'No consta abono de horas extraordinarias en nóminas ni en los CRA comunicados (eSIL), ni su compensación con descanso.' },
]

export const NORMAS = [
  'Arts. 34.1, 35 y 38 del Estatuto de los Trabajadores (jornada, horas extraordinarias y vacaciones).',
  'Art. 147 del texto refundido de la Ley General de la Seguridad Social (base de cotización y conceptos excluidos).',
  'Art. 9.A del Reglamento del IRPF (dietas exentas y obligación del pagador de acreditar día, lugar y motivo del desplazamiento).',
  'Art. 7.5 LISOS (infracción grave en materia de jornada, horas extraordinarias y vacaciones).',
]
