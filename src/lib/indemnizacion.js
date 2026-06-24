// Cálculo de indemnizaciones por despido conforme al Estatuto de los Trabajadores.
//
// ⚠️ Estimación orientativa. No sustituye el asesoramiento jurídico. Hay
// supuestos especiales (contratos temporales, fijos discontinuos, salarios con
// variables, reducciones de jornada, topes por convenio, etc.) que pueden alterar
// el resultado.

// Fecha de la reforma laboral que cambió la indemnización por despido
// improcedente de 45 a 33 días/año (Ley 3/2012).
const FECHA_REFORMA = new Date('2012-02-12')

const TOPE_720 = 720 // 24 mensualidades (días)
const TOPE_1260 = 1260 // 42 mensualidades (días)
const TOPE_OBJETIVO = 360 // 12 mensualidades (días)

// Días entre dos fechas (incluyendo el último día de servicio).
function diasEntre(desde, hasta) {
  const ms = hasta.getTime() - desde.getTime()
  return Math.max(0, Math.round(ms / 86400000))
}

// Antigüedad en años/meses/días (para mostrar).
function descomponerAntiguedad(inicio, fin) {
  let años = fin.getFullYear() - inicio.getFullYear()
  let meses = fin.getMonth() - inicio.getMonth()
  let dias = fin.getDate() - inicio.getDate()
  if (dias < 0) {
    meses -= 1
    const prevMes = new Date(fin.getFullYear(), fin.getMonth(), 0).getDate()
    dias += prevMes
  }
  if (meses < 0) {
    años -= 1
    meses += 12
  }
  return { años, meses, dias }
}

/**
 * Calcula la indemnización por despido.
 * @param {object} datos
 *   - inicio: string fecha de alta (YYYY-MM-DD)
 *   - fin: string fecha de efectos del despido (YYYY-MM-DD)
 *   - salarioMensual: number (bruto)
 *   - pagas: number (nº de pagas al año, normalmente 12 o 14)
 *   - tipo: 'improcedente' | 'objetivo' | 'procedente'
 * @returns {object} resultado del cálculo
 */
export function calcularIndemnizacion(datos) {
  const inicio = new Date(datos.inicio)
  const fin = new Date(datos.fin)
  const errores = []

  if (Number.isNaN(inicio.getTime())) errores.push('La fecha de inicio no es válida.')
  if (Number.isNaN(fin.getTime())) errores.push('La fecha del despido no es válida.')
  if (!errores.length && fin <= inicio) errores.push('La fecha del despido debe ser posterior a la de inicio.')
  const salarioMensual = Number(datos.salarioMensual)
  const pagas = Number(datos.pagas) || 14
  if (!salarioMensual || salarioMensual <= 0) errores.push('Introduce un salario bruto mensual válido.')
  if (errores.length) return { ok: false, errores }

  const salarioAnual = salarioMensual * pagas
  const salarioDiario = salarioAnual / 365

  const antiguedad = descomponerAntiguedad(inicio, fin)
  const diasTotales = diasEntre(inicio, fin)
  const añosServicio = diasTotales / 365

  if (datos.tipo === 'procedente') {
    return {
      ok: true,
      tipo: 'procedente',
      salarioDiario,
      salarioAnual,
      antiguedad,
      diasIndemnizacion: 0,
      importe: 0,
      topeAplicado: null,
      desglose: [],
      nota: 'El despido disciplinario procedente no genera derecho a indemnización (art. 55 ET).',
    }
  }

  if (datos.tipo === 'objetivo') {
    let dias = 20 * añosServicio
    let topeAplicado = null
    if (dias > TOPE_OBJETIVO) {
      dias = TOPE_OBJETIVO
      topeAplicado = '12 mensualidades (360 días)'
    }
    return {
      ok: true,
      tipo: 'objetivo',
      salarioDiario,
      salarioAnual,
      antiguedad,
      diasIndemnizacion: dias,
      importe: dias * salarioDiario,
      topeAplicado,
      desglose: [{ etiqueta: '20 días/año (despido objetivo, art. 53 ET)', dias }],
      nota: 'Despido objetivo o colectivo: 20 días de salario por año de servicio, con el tope de 12 mensualidades (art. 53.1.b ET).',
    }
  }

  // Despido improcedente (art. 56 ET) con régimen transitorio (DT 5ª Ley 3/2012).
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

  if (diasAntes > 0) desglose.push({ etiqueta: '45 días/año (servicio hasta 12-02-2012)', dias: diasAntes })
  if (diasDespues > 0) desglose.push({ etiqueta: '33 días/año (servicio desde 12-02-2012)', dias: diasDespues })

  let dias = diasAntes + diasDespues
  let topeAplicado = null

  // Topes del régimen transitorio.
  if (diasAntes > 0) {
    if (dias > TOPE_720) {
      if (diasAntes > TOPE_720) {
        // El tramo anterior ya supera 720 días: tope de 42 mensualidades.
        dias = Math.min(diasAntes, TOPE_1260)
        topeAplicado = dias >= TOPE_1260 ? '42 mensualidades (1.260 días)' : '24 mensualidades superadas por el tramo anterior a 2012'
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
    ok: true,
    tipo: 'improcedente',
    salarioDiario,
    salarioAnual,
    antiguedad,
    diasIndemnizacion: dias,
    importe: dias * salarioDiario,
    topeAplicado,
    desglose,
    nota: 'Despido improcedente: 33 días de salario por año (45 días para el tiempo trabajado antes del 12-02-2012), con los topes del art. 56 ET y la DT 5ª de la Ley 3/2012.',
  }
}
