// Cálculo de indemnizaciones por extinción del contrato — régimen común del
// Estatuto de los Trabajadores y relaciones laborales de carácter especial
// (art. 2 ET). Reconstrucción de la calculadora específica original.
//
// ⚠️ Estimación orientativa. No sustituye el asesoramiento jurídico. Prevalecen
// los pactos individuales o de convenio y las cuantías fijadas judicialmente.

const FECHA_REFORMA = new Date(2012, 1, 12) // 12/02/2012 (Ley 3/2012)
const TOPE_720 = 720 // 24 mensualidades (días)
const TOPE_1260 = 1260 // 42 mensualidades (días)

// Unidades de salario admitidas en la entrada.
export const UNIDADES = [
  { k: 'diario', label: 'Diario' },
  { k: 'mensual', label: 'Mensual' },
  { k: 'anual', label: 'Anual' },
]

// Convierte el salario introducido a salario DIARIO regulador.
function aDiario(valor, unidad) {
  const v = Number(valor)
  if (!v || v <= 0) return NaN
  if (unidad === 'mensual') return (v * 12) / 365
  if (unidad === 'anual') return v / 365
  return v // diario
}

function diasEntre(desde, hasta) {
  return Math.max(0, Math.round((hasta.getTime() - desde.getTime()) / 86400000))
}

function descomponerAntiguedad(inicio, fin) {
  let años = fin.getFullYear() - inicio.getFullYear()
  let meses = fin.getMonth() - inicio.getMonth()
  let dias = fin.getDate() - inicio.getDate()
  if (dias < 0) {
    meses -= 1
    dias += new Date(fin.getFullYear(), fin.getMonth(), 0).getDate()
  }
  if (meses < 0) {
    años -= 1
    meses += 12
  }
  return { años, meses, dias }
}

/**
 * Catálogo de relaciones laborales y sus causas de extinción indemnizables.
 * Cada causa lleva su base legal, descripción y una nota, además del régimen
 * de cálculo:
 *   - calculo: 'improcedente' (33/45 días, tope 24/42 mens.),
 *              'dias' (modulo días/año con topeMens opcional),
 *              'deportista' (mínimo 2 mensualidades/año),
 *              'ninguna' (sin indemnización tasada).
 */
export const RELACIONES = [
  {
    id: 'comun',
    nombre: 'Relación laboral común',
    normativa: 'Estatuto de los Trabajadores (RDLeg 2/2015)',
    descripcion:
      'Régimen general aplicable a la mayoría de personas trabajadoras por cuenta ajena (art. 1 ET).',
    causas: [
      {
        id: 'improcedente',
        nombre: 'Despido improcedente',
        baseLegal: 'Art. 56.1 ET y DT 11ª ET',
        descripcion:
          'Despido (disciplinario u objetivo) calificado como improcedente cuando la empresa opta por la indemnización en lugar de la readmisión. 33 días de salario por año, con tope de 24 mensualidades.',
        nota: 'Para contratos anteriores al 12/02/2012 se aplica el cálculo doble (45 días hasta el 11/02/2012 + 33 días desde el 12/02/2012) con los topes de la DT 11ª ET.',
        calculo: 'improcedente',
      },
      {
        id: 'objetivo',
        nombre: 'Despido objetivo / colectivo (causas ETOP)',
        baseLegal: 'Arts. 53.1.b) y 51 ET (en relación con el art. 52 ET)',
        descripcion:
          'Despido por causas económicas, técnicas, organizativas o de producción, individual (objetivo) o colectivo (ERE). 20 días de salario por año, con tope de 12 mensualidades.',
        nota: 'Si el despido objetivo o colectivo se declara improcedente, la indemnización pasa a ser la del despido improcedente (33/45 días).',
        calculo: 'dias',
        modulo: 20,
        topeMens: 12,
      },
      {
        id: 'fuerzaMayor',
        nombre: 'Extinción por fuerza mayor',
        baseLegal: 'Art. 51.7 ET',
        descripcion:
          'Extinción por fuerza mayor constatada por la autoridad laboral. Misma indemnización que el despido objetivo: 20 días por año, tope 12 mensualidades.',
        nota: null,
        calculo: 'dias',
        modulo: 20,
        topeMens: 12,
      },
      {
        id: 'movilidad',
        nombre: 'Extinción por movilidad geográfica (art. 40 ET)',
        baseLegal: 'Art. 40.1 ET',
        descripcion:
          'Cuando se ordena un traslado que exige cambio de residencia y la persona trabajadora opta por extinguir el contrato. 20 días por año, tope 12 mensualidades.',
        nota: null,
        calculo: 'dias',
        modulo: 20,
        topeMens: 12,
      },
      {
        id: 'msct',
        nombre: 'Extinción por modificación sustancial (art. 41 ET)',
        baseLegal: 'Art. 41.3 ET',
        descripcion:
          'Cuando una modificación sustancial de condiciones perjudica a la persona trabajadora y esta opta por extinguir. 20 días por año, tope 9 mensualidades.',
        nota: null,
        calculo: 'dias',
        modulo: 20,
        topeMens: 9,
      },
      {
        id: 'art50',
        nombre: 'Extinción a instancia del trabajador (art. 50 ET)',
        baseLegal: 'Art. 50.2 ET',
        descripcion:
          'Extinción indemnizada a petición de la persona trabajadora por incumplimiento grave del empresario. Se indemniza como el despido improcedente (33/45 días).',
        nota: null,
        calculo: 'improcedente',
      },
      {
        id: 'temporal',
        nombre: 'Fin de contrato temporal',
        baseLegal: 'Art. 49.1.c) ET',
        descripcion:
          'Finalización válida de un contrato de duración determinada (por circunstancias de la producción). 12 días de salario por año de servicio.',
        nota: 'NO generan esta indemnización el contrato de sustitución (interinidad) ni los contratos formativos. El fijo-discontinuo es indefinido: su extinción no es un fin de temporal.',
        calculo: 'dias',
        modulo: 12,
        topeMens: null,
      },
      {
        id: 'sinIndemnizacion',
        nombre: 'Sin derecho a indemnización',
        baseLegal: 'Arts. 54, 49.1.b) y 49.1.d) ET',
        descripcion:
          'Despido disciplinario procedente, dimisión o baja voluntaria, no superación del periodo de prueba, fin de contratos formativos o de sustitución, y abandono. No generan indemnización.',
        nota: null,
        calculo: 'ninguna',
      },
    ],
  },
  {
    id: 'altadireccion',
    nombre: 'Personal de alta dirección',
    normativa: 'RD 1382/1985, de 1 de agosto',
    descripcion:
      'Relación laboral especial del art. 2.1.a) ET. Prima el pacto individual; los importes legales operan en su defecto.',
    causas: [
      {
        id: 'desistimiento',
        nombre: 'Desistimiento del empresario',
        baseLegal: 'Art. 11.1 RD 1382/1985',
        descripcion:
          'El empresario puede desistir libremente con preaviso. A falta de pacto, 7 días de salario en metálico por año, con el límite de 6 mensualidades.',
        nota: 'Salvo pacto en contrario en el contrato, que es habitual y puede mejorar esta cuantía.',
        calculo: 'dias',
        modulo: 7,
        topeMens: 6,
      },
      {
        id: 'improcedente',
        nombre: 'Despido declarado improcedente',
        baseLegal: 'Art. 11.2 RD 1382/1985',
        descripcion:
          'Despido del alto directivo declarado improcedente. A falta de pacto, 20 días de salario por año, con el límite de 12 mensualidades.',
        nota: 'Salvo pacto que mejore la indemnización.',
        calculo: 'dias',
        modulo: 20,
        topeMens: 12,
      },
      {
        id: 'voluntadDirectivo',
        nombre: 'Extinción por voluntad del alto directivo (incumplimiento empresarial)',
        baseLegal: 'Art. 10.3 RD 1382/1985',
        descripcion:
          'Extinción por voluntad del directivo fundada en incumplimientos graves del empresario. Se aplican las cuantías del despido improcedente: 20 días por año, tope 12 mensualidades.',
        nota: null,
        calculo: 'dias',
        modulo: 20,
        topeMens: 12,
      },
    ],
  },
  {
    id: 'hogar',
    nombre: 'Empleados del hogar familiar',
    normativa: 'RD 1620/2011, de 14 de noviembre',
    descripcion:
      'Relación laboral especial del art. 2.1.b) ET. Servicios prestados en el ámbito del hogar familiar.',
    causas: [
      {
        id: 'desistimiento',
        nombre: 'Desistimiento del empleador',
        baseLegal: 'Art. 11.2 RD 1620/2011',
        descripcion:
          'El empleador puede desistir con preaviso y comunicación escrita. Indemnización de 12 días de salario por año, con el límite de 6 mensualidades.',
        nota: 'Materia en evolución tras la STJUE de 24/02/2022 y el RD-ley 16/2022; conviene verificar la doctrina vigente para el caso concreto.',
        calculo: 'dias',
        modulo: 12,
        topeMens: 6,
      },
      {
        id: 'improcedente',
        nombre: 'Despido improcedente',
        baseLegal: 'Art. 11.3 RD 1620/2011 (tras STJUE C-389/20 y reforma de 2022)',
        descripcion:
          'Cuando el despido se declara improcedente y no hay readmisión, la indemnización es de 20 días de salario por año, con el límite de 12 mensualidades.',
        nota: null,
        calculo: 'dias',
        modulo: 20,
        topeMens: 12,
      },
    ],
  },
  {
    id: 'deportistas',
    nombre: 'Deportistas profesionales',
    normativa: 'RD 1006/1985, de 26 de junio',
    descripcion:
      'Relación laboral especial del art. 2.1.d) ET. Deportistas por cuenta y dentro del ámbito de organización de un club o entidad.',
    causas: [
      {
        id: 'improcedente',
        nombre: 'Despido improcedente',
        baseLegal: 'Art. 15.1 RD 1006/1985',
        descripcion:
          'Despido improcedente del deportista. A falta de pacto, como mínimo 2 mensualidades de las retribuciones periódicas por año de servicio (prorrateando los periodos inferiores al año).',
        nota: 'Es un MÍNIMO legal sin tope fijo; el órgano judicial puede fijar una cuantía superior. Prevalece el pacto del contrato.',
        calculo: 'deportista',
      },
      {
        id: 'expiracion',
        nombre: 'Extinción por expiración del tiempo pactado',
        baseLegal: 'Art. 13.a) RD 1006/1985',
        descripcion:
          'La extinción por cumplimiento del término o del número de actuaciones pactadas no genera, por sí sola, indemnización (puede preverse en convenio).',
        nota: null,
        calculo: 'ninguna',
      },
    ],
  },
  {
    id: 'artistas',
    nombre: 'Artistas en espectáculos públicos',
    normativa: 'RD 1435/1985, de 1 de agosto',
    descripcion:
      'Relación laboral especial del art. 2.1.e) ET. Actividad artística por cuenta y dentro del ámbito de un organizador.',
    causas: [
      {
        id: 'finContrato',
        nombre: 'Fin de contrato de duración determinada',
        baseLegal: 'Art. 10.2 RD 1435/1985',
        descripcion:
          'A la extinción del contrato de duración determinada, el artista tiene derecho a la indemnización que se pacte en convenio o, en su defecto, a 7 días de salario por año de servicio.',
        nota: null,
        calculo: 'dias',
        modulo: 7,
        topeMens: null,
      },
      {
        id: 'improcedente',
        nombre: 'Despido improcedente',
        baseLegal: 'Art. 12 RD 1435/1985, en relación con el art. 56 y DT 11ª ET',
        descripcion:
          'El despido improcedente del artista se rige por las reglas del Estatuto de los Trabajadores: 33/45 días por año con los topes de la DT 11ª ET.',
        nota: null,
        calculo: 'improcedente',
      },
    ],
  },
  {
    id: 'representantes',
    nombre: 'Representantes de comercio',
    normativa: 'RD 1438/1985, de 1 de agosto',
    descripcion:
      'Relación laboral especial del art. 2.1.f) ET. Personas que intervienen en operaciones mercantiles por cuenta de uno o más empresarios sin asumir el riesgo de las operaciones.',
    causas: [
      {
        id: 'improcedente',
        nombre: 'Despido improcedente',
        baseLegal: 'Art. 11.2 RD 1438/1985, en relación con el art. 56 y DT 11ª ET',
        descripcion:
          'El despido improcedente se indemniza conforme al Estatuto de los Trabajadores: 33/45 días por año con los topes de la DT 11ª ET.',
        nota: 'Es compatible, en su caso, con la indemnización por clientela del art. 10 RD 1438/1985 (que se pacta o fija judicialmente y no se calcula aquí).',
        calculo: 'improcedente',
      },
      {
        id: 'clientela',
        nombre: 'Extinción por voluntad del empresario (solo clientela)',
        baseLegal: 'Art. 10 RD 1438/1985',
        descripcion:
          'La mera extinción por voluntad del empresario sin incumplimiento del representante puede dar lugar a la indemnización por clientela (no calculada aquí), pero no a la indemnización tasada del ET.',
        nota: 'La indemnización por clientela se pacta o la fija el juez, sin exceder de un año de comisiones (media de los últimos 3 años).',
        calculo: 'ninguna',
      },
    ],
  },
  {
    id: 'discapacidad',
    nombre: 'Personas con discapacidad en centros especiales de empleo',
    normativa: 'RD 1368/1985, de 17 de julio',
    descripcion:
      'Relación laboral especial del art. 2.1.g) ET. Se rige por el Estatuto de los Trabajadores con las especialidades del RD 1368/1985.',
    causas: [
      {
        id: 'improcedente',
        nombre: 'Despido improcedente',
        baseLegal: 'Arts. 56.1 y DT 11ª ET (con las especialidades del RD 1368/1985)',
        descripcion:
          'El despido improcedente sigue el régimen común: 33/45 días de salario por año con los topes de la DT 11ª ET.',
        nota: null,
        calculo: 'improcedente',
      },
      {
        id: 'objetivo',
        nombre: 'Despido objetivo / colectivo',
        baseLegal: 'Arts. 53.1.b) y 51 ET',
        descripcion: '20 días de salario por año, con un tope de 12 mensualidades.',
        nota: null,
        calculo: 'dias',
        modulo: 20,
        topeMens: 12,
      },
      {
        id: 'temporal',
        nombre: 'Fin de contrato temporal',
        baseLegal: 'Art. 49.1.c) ET',
        descripcion: '12 días de salario por año de servicio.',
        nota: null,
        calculo: 'dias',
        modulo: 12,
        topeMens: null,
      },
      {
        id: 'sinIndemnizacion',
        nombre: 'Sin derecho a indemnización',
        baseLegal: 'Arts. 54 y 49 ET',
        descripcion: 'Despido disciplinario procedente, baja voluntaria o no superación del periodo de prueba.',
        nota: null,
        calculo: 'ninguna',
      },
    ],
  },
  {
    id: 'estibadores',
    nombre: 'Estibadores portuarios',
    normativa: 'Art. 2.1.h) ET (régimen específico del sector portuario)',
    descripcion:
      'Relación laboral especial del art. 2.1.h) ET. La extinción se rige por el Estatuto de los Trabajadores con las especialidades del sector portuario.',
    causas: [
      {
        id: 'improcedente',
        nombre: 'Despido improcedente',
        baseLegal: 'Arts. 56.1 y DT 11ª ET',
        descripcion: '33/45 días de salario por año de servicio con los topes de la DT 11ª ET.',
        nota: null,
        calculo: 'improcedente',
      },
      {
        id: 'sinIndemnizacion',
        nombre: 'Sin derecho a indemnización',
        baseLegal: 'Arts. 54 y 49 ET',
        descripcion: 'Despido disciplinario procedente o baja voluntaria.',
        nota: null,
        calculo: 'ninguna',
      },
    ],
  },
  {
    id: 'abogados',
    nombre: 'Abogados en despachos de abogados',
    normativa: 'RD 1331/2006, de 17 de noviembre',
    descripcion:
      'Relación laboral especial del art. 2.1.j) ET. Abogados que prestan servicios retribuidos por cuenta ajena en despachos.',
    causas: [
      {
        id: 'improcedente',
        nombre: 'Despido improcedente',
        baseLegal: 'Art. 21 RD 1331/2006, en relación con el art. 56 y DT 11ª ET',
        descripcion:
          'El despido improcedente se rige por las reglas del Estatuto de los Trabajadores: 33/45 días por año con los topes de la DT 11ª ET.',
        nota: null,
        calculo: 'improcedente',
      },
    ],
  },
  {
    id: 'residentes',
    nombre: 'Residentes de formación sanitaria (MIR, EIR…)',
    normativa: 'RD 1146/2006, de 6 de octubre',
    descripcion:
      'Relación laboral especial del art. 2.1.i) ET, de carácter formativo y duración determinada, vinculada al programa de formación sanitaria especializada.',
    causas: [
      {
        id: 'finFormacion',
        nombre: 'Finalización del programa formativo',
        baseLegal: 'Art. 7 RD 1146/2006',
        descripcion:
          'La extinción por finalización del periodo de residencia o del programa formativo no genera indemnización.',
        nota: null,
        calculo: 'ninguna',
      },
      {
        id: 'improcedente',
        nombre: 'Despido improcedente durante la residencia',
        baseLegal: 'Art. 56 y DT 11ª ET',
        descripcion:
          'El despido improcedente durante la residencia se rige por el régimen común: 33/45 días con los topes de la DT 11ª ET.',
        nota: null,
        calculo: 'improcedente',
      },
    ],
  },
  {
    id: 'penados',
    nombre: 'Penados en instituciones penitenciarias',
    normativa: 'RD 782/2001, de 6 de julio',
    descripcion:
      'Relación laboral especial del art. 2.1.c) ET (trabajo de los internos en los talleres penitenciarios).',
    causas: [
      {
        id: 'extincion',
        nombre: 'Extinción de la relación laboral penitenciaria',
        baseLegal: 'Art. 10 RD 782/2001',
        descripcion:
          'Las causas de extinción propias de esta relación (excarcelación, traslado, razones de tratamiento o de orden y seguridad, etc.) no generan indemnización tasada.',
        nota: null,
        calculo: 'ninguna',
      },
    ],
  },
  {
    id: 'menores',
    nombre: 'Menores en centros de internamiento',
    normativa: 'RD 1774/2004, de 30 de julio',
    descripcion:
      'Relación laboral especial del art. 2.1.k) ET, para la actividad laboral de los menores internados en centros.',
    causas: [
      {
        id: 'extincion',
        nombre: 'Extinción conforme a su normativa específica',
        baseLegal: 'RD 1774/2004 y normativa de protección del menor',
        descripcion:
          'Relación especial regida por su normativa propia; su extinción no contempla una indemnización tasada equivalente a la del régimen común.',
        nota: null,
        calculo: 'ninguna',
      },
    ],
  },
]

export function getRelacion(id) {
  return RELACIONES.find((r) => r.id === id) || RELACIONES[0]
}

/**
 * Calcula la indemnización.
 * @param {object} datos { inicio, fin, salario, unidad, relacion, causa }
 */
export function calcularIndemnizacion(datos) {
  const inicio = new Date(datos.inicio)
  const fin = new Date(datos.fin)
  const errores = []
  if (Number.isNaN(inicio.getTime())) errores.push('La fecha de inicio no es válida.')
  if (Number.isNaN(fin.getTime())) errores.push('La fecha de la extinción no es válida.')
  if (!errores.length && fin <= inicio) errores.push('La fecha de la extinción debe ser posterior a la de inicio.')
  const salarioDiario = aDiario(datos.salario, datos.unidad)
  if (Number.isNaN(salarioDiario)) errores.push('Introduce un salario bruto válido.')
  if (errores.length) return { ok: false, errores }

  const relacion = getRelacion(datos.relacion)
  const causa = relacion.causas.find((c) => c.id === datos.causa) || relacion.causas[0]

  const salarioMensual = (salarioDiario * 365) / 12
  const salarioAnual = salarioDiario * 365
  const antiguedad = descomponerAntiguedad(inicio, fin)
  const añosServicio = diasEntre(inicio, fin) / 365

  const base = {
    ok: true,
    relacion,
    causa,
    salarioDiario,
    salarioMensual,
    salarioAnual,
    antiguedad,
  }

  if (causa.calculo === 'ninguna') {
    return { ...base, genera: false, diasIndemnizacion: 0, importe: 0, topeAplicado: null, desglose: [] }
  }

  if (causa.calculo === 'deportista') {
    const importe = 2 * salarioMensual * añosServicio
    const dias = importe / salarioDiario
    return {
      ...base,
      genera: true,
      diasIndemnizacion: dias,
      importe,
      topeAplicado: null,
      desglose: [{ etiqueta: '2 mensualidades/año (mínimo)', dias }],
    }
  }

  if (causa.calculo === 'dias') {
    let dias = causa.modulo * añosServicio
    let topeAplicado = null
    let importe = dias * salarioDiario
    if (causa.topeMens != null) {
      const topeImporte = causa.topeMens * salarioMensual
      if (importe > topeImporte) {
        importe = topeImporte
        dias = importe / salarioDiario
        topeAplicado = `${causa.topeMens} mensualidades`
      }
    }
    return {
      ...base,
      genera: true,
      diasIndemnizacion: dias,
      importe,
      topeAplicado,
      desglose: [{ etiqueta: `${causa.modulo} días/año`, dias }],
    }
  }

  // calculo === 'improcedente' — régimen transitorio 45/33 (DT 11ª ET).
  const desglose = []
  let diasAntes = 0
  let diasDespues = 0
  if (fin <= FECHA_REFORMA) {
    diasAntes = 45 * (diasEntre(inicio, fin) / 365)
  } else if (inicio >= FECHA_REFORMA) {
    diasDespues = 33 * (diasEntre(inicio, fin) / 365)
  } else {
    diasAntes = 45 * (diasEntre(inicio, FECHA_REFORMA) / 365)
    diasDespues = 33 * (diasEntre(FECHA_REFORMA, fin) / 365)
  }
  if (diasAntes > 0) desglose.push({ etiqueta: '45 días/año (hasta 12-02-2012)', dias: diasAntes })
  if (diasDespues > 0) desglose.push({ etiqueta: '33 días/año (desde 12-02-2012)', dias: diasDespues })

  let dias = diasAntes + diasDespues
  let topeAplicado = null
  if (diasAntes > 0) {
    if (dias > TOPE_720) {
      if (diasAntes > TOPE_720) {
        dias = Math.min(diasAntes, TOPE_1260)
        topeAplicado = dias >= TOPE_1260 ? '42 mensualidades (1.260 días)' : 'tramo anterior a 2012 (máx. 42 mensualidades)'
      } else {
        dias = TOPE_720
        topeAplicado = '24 mensualidades (720 días)'
      }
    }
  } else if (dias > TOPE_720) {
    dias = TOPE_720
    topeAplicado = '24 mensualidades (720 días)'
  }

  return {
    ...base,
    genera: true,
    diasIndemnizacion: dias,
    importe: dias * salarioDiario,
    topeAplicado,
    desglose,
  }
}
