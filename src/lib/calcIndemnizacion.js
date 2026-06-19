// Motor de cálculo de indemnizaciones por extinción del contrato de trabajo.
//
// ⚖️ Herramienta ORIENTATIVA. Los resultados no son vinculantes ni constituyen
// asesoramiento jurídico. El cálculo sigue la doctrina mayoritaria del Tribunal
// Supremo sobre el módulo indemnizatorio y el régimen transitorio de la
// Disposición transitoria 11ª del Estatuto de los Trabajadores (RDL 2/2015).

// Fecha de entrada en vigor del RDL 3/2012 (reforma laboral). Los servicios
// prestados HASTA el 11/02/2012 se indemnizan a 45 días/año; desde el
// 12/02/2012, a 33 días/año (DT 11ª ET).
export const FECHA_REFORMA = new Date(2012, 1, 12) // 12 de febrero de 2012

// Una "mensualidad" de salario equivale, a efectos de topes, a 30 días.
export const DIAS_POR_MENSUALIDAD = 30

const MS_DIA = 86400000

// Convierte una cadena 'YYYY-MM-DD' (input type=date) en Date local, evitando
// el desfase de zona horaria de new Date('YYYY-MM-DD').
export function parseFecha(str) {
  if (!str) return null
  const partes = String(str).split('-').map(Number)
  if (partes.length !== 3 || partes.some((n) => Number.isNaN(n))) return null
  const [y, m, d] = partes
  const fecha = new Date(y, m - 1, d)
  return Number.isNaN(fecha.getTime()) ? null : fecha
}

export function sumarDias(fecha, dias) {
  return new Date(fecha.getTime() + dias * MS_DIA)
}

// Salario regulador diario a partir del importe y su periodicidad.
// Por convenio, el salario mensual/diario introducido YA incluye el prorrateo
// de pagas extraordinarias (igual que en la herramienta del CGPJ).
export function aSalarioDiario(importe, tipo) {
  switch (tipo) {
    case 'diario':
      return importe
    case 'mensual':
      return (importe * 12) / 365
    case 'anual':
      return importe / 365
    default:
      return 0
  }
}

export function aSalarioMensual(importe, tipo) {
  switch (tipo) {
    case 'diario':
      return (importe * 365) / 12
    case 'mensual':
      return importe
    case 'anual':
      return importe / 12
    default:
      return 0
  }
}

// Desglosa un periodo "fecha a fecha" en años, meses y días, y calcula el
// factor de años usado para la indemnización. Doctrina del TS: los periodos
// inferiores al año se prorratean por meses y la fracción de mes se computa
// como mes completo (p. ej. STS 12/11/2007 y reiteradas).
export function desglosarPeriodo(inicio, fin) {
  if (!inicio || !fin || fin <= inicio) {
    return { años: 0, meses: 0, dias: 0, totalDias: 0, factor: 0 }
  }
  let años = fin.getFullYear() - inicio.getFullYear()
  let meses = fin.getMonth() - inicio.getMonth()
  let dias = fin.getDate() - inicio.getDate()

  if (dias < 0) {
    meses -= 1
    // días del mes anterior al de la fecha de fin
    const diasMesAnterior = new Date(fin.getFullYear(), fin.getMonth(), 0).getDate()
    dias += diasMesAnterior
  }
  if (meses < 0) {
    años -= 1
    meses += 12
  }

  const totalDias = Math.round((fin - inicio) / MS_DIA)

  // Fracción de mes => mes completo.
  let mesesProrrateados = meses + (dias > 0 ? 1 : 0)
  let añosFactor = años
  if (mesesProrrateados >= 12) {
    añosFactor += Math.floor(mesesProrrateados / 12)
    mesesProrrateados = mesesProrrateados % 12
  }
  const factor = añosFactor + mesesProrrateados / 12

  return { años, meses, dias, totalDias, factor }
}

function redondear2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100
}

/**
 * Calcula la indemnización.
 * @param {Object} p
 * @param {string} p.fechaInicio  'YYYY-MM-DD'
 * @param {string} p.fechaFin     'YYYY-MM-DD'
 * @param {number} p.salarioImporte
 * @param {'diario'|'mensual'|'anual'} p.salarioTipo
 * @param {Object} p.causa  configuración de la causa de extinción (ver datos)
 * @param {number} [p.diasNoComputables=0] días que NO computan a efectos de
 *        antigüedad indemnizable (excedencias, periodos de inactividad de fijos
 *        discontinuos, etc.). Se descuentan del inicio.
 * @returns {Object} desglose del cálculo.
 */
export function calcular({
  fechaInicio,
  fechaFin,
  salarioImporte,
  salarioTipo,
  causa,
  diasNoComputables = 0,
}) {
  const inicio = parseFecha(fechaInicio)
  const fin = parseFecha(fechaFin)

  if (!inicio || !fin) {
    return { ok: false, error: 'Introduce fechas de inicio y de finalización válidas.' }
  }
  if (fin <= inicio) {
    return { ok: false, error: 'La fecha de finalización debe ser posterior a la de inicio.' }
  }
  const importe = Number(salarioImporte)
  if (!(importe > 0)) {
    return { ok: false, error: 'Introduce un importe de salario mayor que cero.' }
  }
  if (!causa) {
    return { ok: false, error: 'Selecciona una causa de extinción.' }
  }

  const salarioDiario = aSalarioDiario(importe, salarioTipo)
  const salarioMensual = aSalarioMensual(importe, salarioTipo)

  // Antigüedad real (para mostrar) y antigüedad computable (descontando el
  // tiempo no computable, que se resta del inicio).
  const antiguedadReal = desglosarPeriodo(inicio, fin)
  const dnc = Math.max(0, Number(diasNoComputables) || 0)
  const inicioComputable = dnc > 0 ? sumarDias(inicio, dnc) : inicio
  const hayAntiguedad = inicioComputable < fin

  // Causa que no genera indemnización (despido procedente, baja voluntaria…).
  if (!causa.genera) {
    return {
      ok: true,
      genera: false,
      causa,
      salarioDiario: redondear2(salarioDiario),
      salarioMensual: redondear2(salarioMensual),
      antiguedad: antiguedadReal,
      importe: 0,
      dias: 0,
      mensualidades: 0,
    }
  }

  const topeDias = causa.topeMensualidades
    ? causa.topeMensualidades * DIAS_POR_MENSUALIDAD
    : Infinity

  // ── Régimen transitorio (DT 11ª ET): despido/extinción improcedente con
  //    antigüedad anterior al 12/02/2012 ──────────────────────────────────────
  if (causa.transitorio && hayAntiguedad && inicioComputable < FECHA_REFORMA) {
    const finTramo1 = fin < FECHA_REFORMA ? fin : FECHA_REFORMA
    const p1 = desglosarPeriodo(inicioComputable, finTramo1)
    const dias1 = 45 * p1.factor

    let p2 = null
    let dias2 = 0
    if (fin > FECHA_REFORMA) {
      p2 = desglosarPeriodo(FECHA_REFORMA, fin)
      dias2 = 33 * p2.factor
    }

    const diasBrutos = dias1 + dias2

    // Tope DT 11ª: 720 días, salvo que el tramo anterior a 12/02/2012 ya supere
    // los 720 días, en cuyo caso ese importe actúa de tope máximo, con el límite
    // absoluto de 42 mensualidades (1.260 días).
    let topeAplicado
    let motivoTope
    if (dias1 > 720) {
      topeAplicado = Math.min(dias1, 42 * DIAS_POR_MENSUALIDAD)
      motivoTope =
        'El periodo anterior al 12/02/2012 ya supera 720 días, por lo que actúa como tope (máximo absoluto de 42 mensualidades).'
    } else {
      topeAplicado = 720
      motivoTope = 'Tope general de 720 días (24 mensualidades).'
    }

    const diasFinal = Math.min(diasBrutos, topeAplicado)
    const hayTope = diasBrutos > topeAplicado

    return {
      ok: true,
      genera: true,
      causa,
      regimen: 'transitorio',
      salarioDiario: redondear2(salarioDiario),
      salarioMensual: redondear2(salarioMensual),
      antiguedad: antiguedadReal,
      diasNoComputables: dnc,
      tramos: [
        { etiqueta: 'Hasta 11/02/2012 (45 días/año)', modulo: 45, periodo: p1, dias: redondear2(dias1) },
        ...(p2
          ? [{ etiqueta: 'Desde 12/02/2012 (33 días/año)', modulo: 33, periodo: p2, dias: redondear2(dias2) }]
          : []),
      ],
      diasBrutos: redondear2(diasBrutos),
      hayTope,
      topeDias: topeAplicado,
      motivoTope,
      dias: redondear2(diasFinal),
      importe: redondear2(diasFinal * salarioDiario),
      mensualidades: redondear2((diasFinal * salarioDiario) / salarioMensual),
    }
  }

  // ── Régimen ordinario (módulo único de días/año) ───────────────────────────
  const factor = hayAntiguedad ? desglosarPeriodo(inicioComputable, fin).factor : 0
  const periodoComputable = hayAntiguedad
    ? desglosarPeriodo(inicioComputable, fin)
    : { años: 0, meses: 0, dias: 0, totalDias: 0, factor: 0 }
  const diasBrutos = causa.modulo * factor
  const diasFinal = Math.min(diasBrutos, topeDias)
  const hayTope = diasBrutos > topeDias

  return {
    ok: true,
    genera: true,
    causa,
    regimen: 'ordinario',
    salarioDiario: redondear2(salarioDiario),
    salarioMensual: redondear2(salarioMensual),
    antiguedad: antiguedadReal,
    periodoComputable,
    diasNoComputables: dnc,
    modulo: causa.modulo,
    diasBrutos: redondear2(diasBrutos),
    hayTope,
    topeDias: Number.isFinite(topeDias) ? topeDias : null,
    topeMensualidades: causa.topeMensualidades || null,
    dias: redondear2(diasFinal),
    importe: redondear2(diasFinal * salarioDiario),
    mensualidades: redondear2((diasFinal * salarioDiario) / salarioMensual),
  }
}

export function formatoEuros(n) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n || 0)
}

export function formatoNumero(n, decimales = 2) {
  return new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimales,
  }).format(n || 0)
}
