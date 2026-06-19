// Datos normativos del cálculo de indemnizaciones por extinción del contrato.
//
// Cada "causa" describe el módulo indemnizatorio (días de salario por año de
// servicio), el tope (en mensualidades), si le aplica el régimen transitorio
// de la DT 11ª ET (45/33 días) y su base legal.
//
// ⚠️ Revisa estas referencias ante cualquier reforma. Los importes son
// orientativos: la cuantía definitiva depende del salario regulador, de la
// calificación judicial del despido y de los pactos individuales o de convenio.

/**
 * @typedef {Object} Causa
 * @property {string} id
 * @property {string} nombre
 * @property {boolean} genera  ¿genera derecho a indemnización?
 * @property {number} [modulo]  días de salario por año de servicio
 * @property {number|null} [topeMensualidades]  tope en mensualidades (null = sin tope legal fijo)
 * @property {boolean} [transitorio]  aplica DT 11ª ET (45 días hasta 11/02/2012)
 * @property {string} baseLegal
 * @property {string} descripcion
 * @property {string} [nota]  matiz o advertencia adicional
 */

export const REGIMENES = [
  {
    id: 'comun',
    nombre: 'Relación laboral común',
    norma: 'Estatuto de los Trabajadores (RDL 2/2015)',
    descripcion:
      'Régimen general aplicable a la mayoría de personas trabajadoras por cuenta ajena (art. 1 ET).',
    causas: [
      {
        id: 'improcedente',
        nombre: 'Despido improcedente',
        genera: true,
        modulo: 33,
        topeMensualidades: 24,
        transitorio: true,
        baseLegal: 'Art. 56.1 ET y Disposición transitoria 11ª ET',
        descripcion:
          'Despido (disciplinario u objetivo) calificado como improcedente cuando la empresa opta por la indemnización en lugar de la readmisión. 33 días de salario por año de servicio, con un tope de 24 mensualidades.',
        nota:
          'Para contratos anteriores al 12/02/2012 se aplica el cálculo doble (45 días hasta 11/02/2012 + 33 días desde el 12/02/2012) con los topes de la DT 11ª ET.',
      },
      {
        id: 'objetivo',
        nombre: 'Despido objetivo / colectivo (causas ETOP)',
        genera: true,
        modulo: 20,
        topeMensualidades: 12,
        transitorio: false,
        baseLegal: 'Arts. 53.1.b) y 51 ET (en relación con el art. 52 ET)',
        descripcion:
          'Despido por causas económicas, técnicas, organizativas o de producción, individual (objetivo) o colectivo (ERE). 20 días de salario por año de servicio, con un tope de 12 mensualidades.',
        nota:
          'Si el despido objetivo o colectivo se declara improcedente, la indemnización pasa a ser la del despido improcedente (33/45 días).',
      },
      {
        id: 'fuerzaMayor',
        nombre: 'Extinción por fuerza mayor',
        genera: true,
        modulo: 20,
        topeMensualidades: 12,
        transitorio: false,
        baseLegal: 'Art. 51.7 ET',
        descripcion:
          'Extinción por fuerza mayor constatada por la autoridad laboral. Misma indemnización que el despido objetivo: 20 días por año, tope 12 mensualidades.',
      },
      {
        id: 'temporal',
        nombre: 'Fin de contrato temporal',
        genera: true,
        modulo: 12,
        topeMensualidades: null,
        transitorio: false,
        baseLegal: 'Art. 49.1.c) ET',
        descripcion:
          'Finalización válida de un contrato de duración determinada (por circunstancias de la producción). 12 días de salario por año de servicio.',
        nota:
          'NO generan esta indemnización el contrato de sustitución (interinidad) ni los contratos formativos. El contrato fijo-discontinuo es indefinido: su extinción no es un “fin de temporal”.',
      },
      {
        id: 'msct',
        nombre: 'Extinción por modificación sustancial (art. 41 ET)',
        genera: true,
        modulo: 20,
        topeMensualidades: 9,
        transitorio: false,
        baseLegal: 'Art. 41.3 ET',
        descripcion:
          'Cuando la persona trabajadora resulta perjudicada por una modificación sustancial de jornada, horario, régimen de trabajo a turnos, sistema de remuneración o funciones y opta por extinguir su contrato. 20 días por año, tope 9 mensualidades.',
      },
      {
        id: 'movilidad',
        nombre: 'Extinción por movilidad geográfica (art. 40 ET)',
        genera: true,
        modulo: 20,
        topeMensualidades: 12,
        transitorio: false,
        baseLegal: 'Art. 40.1 ET',
        descripcion:
          'Cuando se ordena un traslado que exige cambio de residencia y la persona trabajadora opta por extinguir el contrato. 20 días por año, tope 12 mensualidades.',
      },
      {
        id: 'art50',
        nombre: 'Extinción a instancia del trabajador (art. 50 ET)',
        genera: true,
        modulo: 33,
        topeMensualidades: 24,
        transitorio: true,
        baseLegal: 'Art. 50.2 ET',
        descripcion:
          'Resolución del contrato por incumplimiento grave del empresario (impago o retraso continuado del salario, modificaciones sustanciales en perjuicio de la dignidad, etc.). La indemnización es la del despido improcedente (33/45 días).',
      },
      {
        id: 'sinIndemnizacion',
        nombre: 'Sin derecho a indemnización',
        genera: false,
        baseLegal: 'Arts. 54, 49.1.b) y 49.1.d) ET',
        descripcion:
          'Despido disciplinario procedente, dimisión o baja voluntaria, no superación del periodo de prueba, fin de contratos formativos o de sustitución, y abandono. No generan indemnización.',
      },
    ],
  },
  {
    id: 'altadireccion',
    nombre: 'Personal de alta dirección',
    norma: 'RD 1382/1985, de 1 de agosto',
    relacionEspecial: true,
    descripcion:
      'Relación laboral especial del art. 2.1.a) ET. Quienes ejercitan poderes inherentes a la titularidad jurídica de la empresa. Prima el pacto individual; los importes legales operan en su defecto.',
    causas: [
      {
        id: 'desistimiento',
        nombre: 'Desistimiento del empresario',
        genera: true,
        modulo: 7,
        topeMensualidades: 6,
        transitorio: false,
        baseLegal: 'Art. 11.1 RD 1382/1985',
        descripcion:
          'El empresario puede desistir libremente con preaviso. A falta de pacto, 7 días de salario en metálico por año de servicio, con el límite de 6 mensualidades.',
        nota: 'Salvo pacto en contrario en el contrato, que es habitual y puede mejorar esta cuantía.',
      },
      {
        id: 'improcedente',
        nombre: 'Despido declarado improcedente',
        genera: true,
        modulo: 20,
        topeMensualidades: 12,
        transitorio: false,
        baseLegal: 'Art. 11.2 RD 1382/1985',
        descripcion:
          'Despido del alto directivo que se declara improcedente. A falta de pacto, 20 días de salario por año de servicio, con el límite de 12 mensualidades.',
        nota: 'Salvo pacto que mejore la indemnización.',
      },
      {
        id: 'voluntadDirectivo',
        nombre: 'Extinción por voluntad del alto directivo (incumplimiento empresarial)',
        genera: true,
        modulo: 20,
        topeMensualidades: 12,
        transitorio: false,
        baseLegal: 'Art. 10.3 RD 1382/1985',
        descripcion:
          'Extinción por voluntad del directivo fundada en incumplimientos graves del empresario. Se aplican las cuantías del despido improcedente: 20 días por año, tope 12 mensualidades.',
      },
    ],
  },
  {
    id: 'deportistas',
    nombre: 'Deportistas profesionales',
    norma: 'RD 1006/1985, de 26 de junio',
    relacionEspecial: true,
    descripcion:
      'Relación laboral especial del art. 2.1.d) ET. Deportistas que se dedican voluntariamente a la práctica del deporte por cuenta y dentro del ámbito de organización de un club o entidad.',
    causas: [
      {
        id: 'improcedente',
        nombre: 'Despido improcedente',
        genera: true,
        modulo: 60, // 2 mensualidades/año ≈ 60 días/año
        topeMensualidades: null,
        transitorio: false,
        baseLegal: 'Art. 15.1 RD 1006/1985',
        descripcion:
          'Despido improcedente del deportista. A falta de pacto, como mínimo 2 mensualidades de las retribuciones periódicas por año de servicio (prorrateando los periodos inferiores al año).',
        nota:
          'Es un MÍNIMO legal sin tope fijo; el órgano judicial puede fijar una cuantía superior valorando las circunstancias. Prevalece el pacto del contrato.',
      },
      {
        id: 'sinIndemnizacion',
        nombre: 'Extinción por expiración del tiempo pactado',
        genera: false,
        baseLegal: 'Art. 13.a) RD 1006/1985',
        descripcion:
          'La extinción por cumplimiento del término o del número de actuaciones pactadas no genera, por sí sola, indemnización para el deportista (puede preverse en convenio).',
      },
    ],
  },
  {
    id: 'artistas',
    nombre: 'Artistas en espectáculos públicos',
    norma: 'RD 1435/1985, de 1 de agosto',
    relacionEspecial: true,
    descripcion:
      'Relación laboral especial del art. 2.1.e) ET. Quienes desarrollan una actividad artística en escenarios, audiovisuales, etc., por cuenta y dentro del ámbito de un organizador.',
    causas: [
      {
        id: 'finContrato',
        nombre: 'Fin de contrato de duración determinada',
        genera: true,
        modulo: 7,
        topeMensualidades: null,
        transitorio: false,
        baseLegal: 'Art. 10.2 RD 1435/1985',
        descripcion:
          'A la extinción del contrato de duración determinada, el artista tiene derecho a la indemnización que se pacte en convenio o, en su defecto, a 7 días de salario por año de servicio.',
      },
      {
        id: 'improcedente',
        nombre: 'Despido improcedente',
        genera: true,
        modulo: 33,
        topeMensualidades: 24,
        transitorio: true,
        baseLegal: 'Art. 12 RD 1435/1985, en relación con el art. 56 y DT 11ª ET',
        descripcion:
          'El despido improcedente del artista se rige por las reglas del Estatuto de los Trabajadores: 33/45 días por año con los topes de la DT 11ª ET.',
      },
    ],
  },
  {
    id: 'representantes',
    nombre: 'Representantes de comercio',
    norma: 'RD 1438/1985, de 1 de agosto',
    relacionEspecial: true,
    descripcion:
      'Relación laboral especial del art. 2.1.f) ET. Personas que intervienen en operaciones mercantiles por cuenta de uno o más empresarios sin asumir el riesgo de las operaciones.',
    causas: [
      {
        id: 'improcedente',
        nombre: 'Despido improcedente',
        genera: true,
        modulo: 33,
        topeMensualidades: 24,
        transitorio: true,
        baseLegal: 'Art. 11.2 RD 1438/1985, en relación con el art. 56 y DT 11ª ET',
        descripcion:
          'El despido improcedente se indemniza conforme al Estatuto de los Trabajadores: 33/45 días por año con los topes de la DT 11ª ET.',
        nota:
          'Es compatible, en su caso, con la indemnización por clientela del art. 10 RD 1438/1985 (que se pacta o fija judicialmente y no se calcula aquí).',
      },
      {
        id: 'sinIndemnizacion',
        nombre: 'Extinción sin derecho a indemnización del ET',
        genera: false,
        baseLegal: 'Art. 10 RD 1438/1985',
        descripcion:
          'La mera extinción por voluntad del empresario sin incumplimiento del representante puede dar lugar a la indemnización por clientela (no calculada aquí), pero no a la indemnización tasada del ET.',
      },
    ],
  },
  {
    id: 'hogar',
    nombre: 'Empleados del hogar familiar',
    norma: 'RD 1620/2011, de 14 de noviembre',
    relacionEspecial: true,
    descripcion:
      'Relación laboral especial del art. 2.1.b) ET. Servicios o actividades prestados en el ámbito del hogar familiar.',
    causas: [
      {
        id: 'desistimiento',
        nombre: 'Desistimiento del empleador',
        genera: true,
        modulo: 12,
        topeMensualidades: 6,
        transitorio: false,
        baseLegal: 'Art. 11.2 RD 1620/2011',
        descripcion:
          'El empleador puede desistir con preaviso y comunicación escrita. Indemnización de 12 días de salario por año de servicio, con el límite de 6 mensualidades.',
      },
      {
        id: 'improcedente',
        nombre: 'Despido improcedente',
        genera: true,
        modulo: 20,
        topeMensualidades: 12,
        transitorio: false,
        baseLegal: 'Art. 11.3 RD 1620/2011 (tras STJUE C-389/20 y reforma de 2022)',
        descripcion:
          'Cuando el despido se declara improcedente y no hay readmisión, la indemnización es de 20 días de salario por año de servicio, con el límite de 12 mensualidades.',
        nota:
          'Materia en evolución tras la STJUE de 24/02/2022 y el RDL 16/2022. Conviene verificar la doctrina vigente para el caso concreto.',
      },
    ],
  },
  {
    id: 'abogados',
    nombre: 'Abogados en despachos de abogados',
    norma: 'RD 1331/2006, de 17 de noviembre',
    relacionEspecial: true,
    descripcion:
      'Relación laboral especial del art. 2.1.j) ET. Abogados que prestan servicios retribuidos por cuenta ajena en despachos, individuales o colectivos.',
    causas: [
      {
        id: 'improcedente',
        nombre: 'Despido improcedente',
        genera: true,
        modulo: 33,
        topeMensualidades: 24,
        transitorio: true,
        baseLegal: 'Art. 21 RD 1331/2006, en relación con el art. 56 y DT 11ª ET',
        descripcion:
          'El despido improcedente se rige por las reglas del Estatuto de los Trabajadores: 33/45 días por año con los topes de la DT 11ª ET.',
      },
    ],
  },
]

// Otras relaciones laborales especiales del art. 2 ET para las que no existe un
// módulo indemnizatorio propio (rige el ET con especialidades) o cuya extinción
// no genera indemnización tasada. Solo informativo.
export const OTRAS_RELACIONES = [
  {
    nombre: 'Penados en instituciones penitenciarias',
    norma: 'RD 782/2001 — art. 2.1.c) ET',
    nota: 'Relación especial sin indemnización tasada por extinción equivalente a la del régimen común.',
  },
  {
    nombre: 'Personas con discapacidad en centros especiales de empleo',
    norma: 'RD 1368/1985 — art. 2.1.g) ET',
    nota: 'Se rige por el Estatuto de los Trabajadores con especialidades; la indemnización por despido improcedente sigue el régimen común (33/45 días).',
  },
  {
    nombre: 'Estibadores portuarios',
    norma: 'Art. 2.1.h) ET',
    nota: 'Se rige por el ET con especialidades del sector; sin módulo indemnizatorio propio distinto.',
  },
  {
    nombre: 'Residencia para la formación de especialistas en Ciencias de la Salud (MIR, etc.)',
    norma: 'RD 1146/2006 — art. 2.1.i) ET',
    nota: 'La extinción por finalización del programa formativo no genera indemnización específica.',
  },
  {
    nombre: 'Menores sometidos a medidas de internamiento',
    norma: 'RD 1774/2004 — art. 2.1.k) ET',
    nota: 'Relación especial sin indemnización tasada propia.',
  },
]

export function buscarRegimen(id) {
  return REGIMENES.find((r) => r.id === id) || null
}

export function buscarCausa(regimenId, causaId) {
  const reg = buscarRegimen(regimenId)
  if (!reg) return null
  return reg.causas.find((c) => c.id === causaId) || null
}

// Tipos de contrato/jornada que afectan a notas y al tiempo computable.
export const TIPOS_CONTRATO = [
  {
    id: 'completa',
    nombre: 'Jornada completa',
    nota: '',
  },
  {
    id: 'parcial',
    nombre: 'Tiempo parcial',
    nota:
      'En el contrato a tiempo parcial la antigüedad se computa por todo el tiempo de vigencia del contrato (de fecha a fecha), igual que a jornada completa. La reducción de jornada ya está reflejada en el salario, que es menor. Introduce el salario realmente percibido (a tiempo parcial).',
  },
  {
    id: 'fijodiscontinuo',
    nombre: 'Fijo-discontinuo',
    nota:
      'El contrato fijo-discontinuo es indefinido. Para la INDEMNIZACIÓN por despido, el Tribunal Supremo computa el tiempo de prestación efectiva de servicios (los periodos de actividad), no los periodos de inactividad. Indica en “tiempo no computable” los días de inactividad para descontarlos. Para antigüedad/trienios, en cambio, computa toda la relación (STJUE 22/02/2024, asunto C-715/20).',
  },
  {
    id: 'excedencia',
    nombre: 'Con periodos no computables (excedencias, etc.)',
    nota:
      'Indica en “tiempo no computable” los días de excedencia voluntaria u otros periodos que no computan a efectos de antigüedad indemnizable para descontarlos del cálculo.',
  },
]
