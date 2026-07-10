// Cálculo de indemnizaciones por extinción del contrato conforme al Estatuto de
// los Trabajadores y a las relaciones laborales de carácter especial (art. 2 ET).
//
// ⚠️ Estimación orientativa. No sustituye el asesoramiento jurídico. Hay
// supuestos (salarios variables, jornada reducida, topes por convenio,
// indemnizaciones pactadas o fijadas judicialmente, etc.) que pueden alterar el
// resultado.

// Reforma laboral que bajó la indemnización por despido improcedente de 45 a 33
// días/año (Ley 3/2012).
const FECHA_REFORMA = new Date('2012-02-12')

const TOPE_720 = 720 // 24 mensualidades (días)
const TOPE_1260 = 1260 // 42 mensualidades (días)
const TOPE_OBJETIVO = 360 // 12 mensualidades (días)

// Catálogo de relaciones laborales y sus modalidades de extinción indemnizables.
export const RELACIONES = {
  comun: {
    nombre: 'Común (Estatuto de los Trabajadores)',
    tipos: [
      { k: 'improcedente', label: 'Despido improcedente (33/45 días por año)' },
      { k: 'objetivo', label: 'Objetivo o colectivo (20 días por año)' },
      { k: 'procedente', label: 'Procedente / disciplinario (sin indemnización)' },
    ],
  },
  alta_direccion: {
    nombre: 'Alta dirección (RD 1382/1985)',
    tipos: [
      { k: 'ad_desistimiento', label: 'Desistimiento del empresario (7 días por año)' },
      { k: 'ad_improcedente', label: 'Despido improcedente (20 días por año)' },
    ],
  },
  hogar: {
    nombre: 'Servicio del hogar familiar (RD 1620/2011)',
    tipos: [
      { k: 'hogar_desistimiento', label: 'Desistimiento (12 días por año)' },
      { k: 'hogar_improcedente', label: 'Despido improcedente (20 días por año)' },
    ],
  },
  deportista: {
    nombre: 'Deportista profesional (RD 1006/1985)',
    tipos: [{ k: 'dep_improcedente', label: 'Despido improcedente (mínimo 2 mensualidades/año)' }],
  },
  artista: {
    nombre: 'Artista en espectáculos públicos (RD 1435/1985)',
    tipos: [{ k: 'art_fin', label: 'Fin de contrato (12 días; 20 si dura +18 meses)' }],
  },
  representante: {
    nombre: 'Representante de comercio (RD 1438/1985)',
    tipos: [{ k: 'rep_improcedente', label: 'Despido improcedente (común) + clientela' }],
  },
  otras_comun: {
    nombre: 'Otras especiales de régimen común (discapacidad CEE, penados, menores, MIR, abogados…)',
    tipos: [
      { k: 'improcedente', label: 'Despido improcedente (33/45 días por año)' },
      { k: 'objetivo', label: 'Objetivo o colectivo (20 días por año)' },
    ],
  },
}

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

// Régimen especial con fórmula "X días por año" y tope en mensualidades.
function especialDias(coefDias, topeMens, años, salarioMensual, salarioDiario, etiqueta, nota) {
  let dias = coefDias * años
  let importe = dias * salarioDiario
  let topeAplicado = null
  if (topeMens != null) {
    const topeImporte = topeMens * salarioMensual
    if (importe > topeImporte) {
      importe = topeImporte
      dias = importe / salarioDiario
      topeAplicado = `${topeMens} mensualidades`
    }
  }
  return { dias, importe, topeAplicado, desglose: [{ etiqueta, dias }], nota }
}

/**
 * Calcula la indemnización por extinción del contrato.
 * @param {object} datos { inicio, fin, salarioMensual, pagas, tipo }
 */
export function calcularIndemnizacion(datos) {
  const inicio = new Date(datos.inicio)
  const fin = new Date(datos.fin)
  const errores = []

  if (Number.isNaN(inicio.getTime())) errores.push('La fecha de inicio no es válida.')
  if (Number.isNaN(fin.getTime())) errores.push('La fecha de la extinción no es válida.')
  if (!errores.length && fin <= inicio) errores.push('La fecha de la extinción debe ser posterior a la de inicio.')
  const salarioMensual = Number(datos.salarioMensual)
  const pagas = Number(datos.pagas) || 14
  if (!salarioMensual || salarioMensual <= 0) errores.push('Introduce un salario bruto mensual válido.')
  if (errores.length) return { ok: false, errores }

  const salarioAnual = salarioMensual * pagas
  const salarioDiario = salarioAnual / 365
  const antiguedad = descomponerAntiguedad(inicio, fin)
  const diasTotales = diasEntre(inicio, fin)
  const añosServicio = diasTotales / 365
  const tipo = datos.tipo || 'improcedente'

  const base = { ok: true, tipo, salarioDiario, salarioAnual, antiguedad }

  // ---- Régimen común: procedente / objetivo ----
  if (tipo === 'procedente') {
    return {
      ...base,
      diasIndemnizacion: 0,
      importe: 0,
      topeAplicado: null,
      desglose: [],
      nota: 'El despido disciplinario procedente no genera derecho a indemnización (art. 55 ET).',
    }
  }

  if (tipo === 'objetivo') {
    let dias = 20 * añosServicio
    let topeAplicado = null
    if (dias > TOPE_OBJETIVO) {
      dias = TOPE_OBJETIVO
      topeAplicado = '12 mensualidades (360 días)'
    }
    return {
      ...base,
      diasIndemnizacion: dias,
      importe: dias * salarioDiario,
      topeAplicado,
      desglose: [{ etiqueta: '20 días/año (despido objetivo, art. 53 ET)', dias }],
      nota: 'Despido objetivo o colectivo: 20 días de salario por año, con el tope de 12 mensualidades (art. 53.1.b ET).',
    }
  }

  // ---- Relaciones laborales de carácter especial ----
  if (tipo === 'ad_desistimiento') {
    const r = especialDias(7, 6, añosServicio, salarioMensual, salarioDiario,
      '7 días/año (desistimiento, art. 11.1 RD 1382/1985)',
      'Alta dirección — desistimiento del empresario: a falta de pacto, 7 días de salario por año, con el tope de 6 mensualidades (art. 11.1 RD 1382/1985). Es la cuantía mínima; puede pactarse otra superior.')
    return { ...base, diasIndemnizacion: r.dias, importe: r.importe, topeAplicado: r.topeAplicado, desglose: r.desglose, nota: r.nota }
  }
  if (tipo === 'ad_improcedente') {
    const r = especialDias(20, 12, añosServicio, salarioMensual, salarioDiario,
      '20 días/año (despido improcedente, art. 11.2 RD 1382/1985)',
      'Alta dirección — despido improcedente: a falta de pacto, 20 días de salario por año, con el tope de 12 mensualidades (art. 11.2 RD 1382/1985).')
    return { ...base, diasIndemnizacion: r.dias, importe: r.importe, topeAplicado: r.topeAplicado, desglose: r.desglose, nota: r.nota }
  }
  if (tipo === 'hogar_desistimiento') {
    const r = especialDias(12, 6, añosServicio, salarioMensual, salarioDiario,
      '12 días/año (desistimiento, art. 11.2 RD 1620/2011)',
      'Servicio del hogar — desistimiento: 12 días de salario por año, con el tope de 6 mensualidades. ⚠️ El RD-ley 16/2022 (desde el 9-9-2022) suprimió el desistimiento; comprueba la fecha y la causa de extinción.')
    return { ...base, diasIndemnizacion: r.dias, importe: r.importe, topeAplicado: r.topeAplicado, desglose: r.desglose, nota: r.nota }
  }
  if (tipo === 'hogar_improcedente') {
    const r = especialDias(20, 12, añosServicio, salarioMensual, salarioDiario,
      '20 días/año (despido improcedente, art. 11.3 RD 1620/2011)',
      'Servicio del hogar — despido improcedente: 20 días de salario por año, con el tope de 12 mensualidades (art. 11.3 RD 1620/2011).')
    return { ...base, diasIndemnizacion: r.dias, importe: r.importe, topeAplicado: r.topeAplicado, desglose: r.desglose, nota: r.nota }
  }
  if (tipo === 'dep_improcedente') {
    const importe = 2 * salarioMensual * añosServicio
    const dias = importe / salarioDiario
    return {
      ...base,
      diasIndemnizacion: dias,
      importe,
      topeAplicado: null,
      desglose: [{ etiqueta: '2 mensualidades/año (mínimo, art. 15.1 RD 1006/1985)', dias }],
      nota: 'Deportista profesional — despido improcedente sin readmisión: la cuantía la fija el juez, con un MÍNIMO de 2 mensualidades de las retribuciones periódicas por año de servicio (art. 15.1 RD 1006/1985). Aquí se muestra ese mínimo.',
    }
  }
  if (tipo === 'art_fin') {
    const coef = añosServicio > 1.5 ? 20 : 12
    const dias = coef * añosServicio
    return {
      ...base,
      diasIndemnizacion: dias,
      importe: dias * salarioDiario,
      topeAplicado: null,
      desglose: [{ etiqueta: `${coef} días/año (fin de contrato artístico, art. 10 RD 1435/1985)`, dias }],
      nota: 'Artista en espectáculos públicos — a la finalización del contrato: 12 días de salario por año; si el contrato duró más de 18 meses, el mínimo es de 20 días por año (art. 10 RD 1435/1985, redacción vigente). Verifica la modalidad y la duración.',
    }
  }
  if (tipo === 'rep_improcedente') {
    // Régimen común de despido improcedente + aviso de la indemnización por clientela.
    const comun = calcularIndemnizacion({ ...datos, tipo: 'improcedente' })
    return {
      ...comun,
      tipo,
      nota: 'Representante de comercio — despido improcedente: se aplica la indemnización común del ET (33/45 días, arts. 56 ET y DT 5ª Ley 3/2012). ADEMÁS, cabe una indemnización por clientela distinta, fijada a falta de pacto por el juzgado, sin exceder de un año de comisiones (media de los últimos 3 años) — art. 11 RD 1438/1985.',
    }
  }

  // ---- Régimen común: despido improcedente (art. 56 ET + DT 5ª Ley 3/2012) ----
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

  if (diasAntes > 0) {
    if (dias > TOPE_720) {
      if (diasAntes > TOPE_720) {
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
    ...base,
    tipo: 'improcedente',
    diasIndemnizacion: dias,
    importe: dias * salarioDiario,
    topeAplicado,
    desglose,
    nota: 'Despido improcedente: 33 días de salario por año (45 días para el tiempo trabajado antes del 12-02-2012), con los topes del art. 56 ET y la DT 5ª de la Ley 3/2012.',
  }
}
