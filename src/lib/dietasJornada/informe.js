// Redacción de los hechos comprobados a partir del cuadrante.
//
// Devuelve una lista de bloques ({ tipo: 'titulo' | 'p' | 'cita' | 'lista' | 'tabla' })
// que se convierte en texto plano (para copiar) o en HTML (Word / impresión).
// El texto es una propuesta: el actuante debe revisarlo y adaptarlo.

import { NORMAS, TIPOS_DIETA } from '../../data/dietasJornada.js'
import { normalizarConfig } from './calculo.js'
import { fechaES, MESES } from '../tacografo/tiempo.js'

// Número en formato español con separador de miles también en cifras de 4 dígitos
// (1.800). Los enteros se muestran sin decimales salvo en importes.
function num(x, dec = 0, fijo = false) {
  if (x === null || x === undefined || x === '') return '—'
  const n = Number(x)
  const decimales = fijo || !Number.isInteger(Math.round(n * 100) / 100) ? Math.max(dec, 2) : 0
  const [ent, frac] = Math.abs(n).toFixed(decimales).split('.')
  return `${n < 0 ? '-' : ''}${ent.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}${frac ? `,${frac}` : ''}`
}
const eur = (x) => `${num(x, 2, true)} €`
const nombreTipo = (id) => TIPOS_DIETA.find((t) => t.id === id)?.nombre.toLowerCase() || id
const mesLargo = (m) => `${MESES[+m.slice(5, 7) - 1]} de ${m.slice(0, 4)}`

function periodoTexto(desde, hasta) {
  if (!desde || !hasta) return ''
  return `desde ${mesLargo(desde.slice(0, 7))} hasta ${mesLargo(hasta.slice(0, 7))}`
}

/**
 * @param {object} p
 * @param {object} p.expediente datos de la empresa
 * @param {object} p.cfg configuración
 * @param {object} p.resumen resultado de resumenExpediente()
 * @param {Set<string>|string[]} p.comprobaciones ids marcados
 * @param {string} p.alegaciones escrito de la empresa (opcional, se cita)
 * @param {string} p.importesDeclarados importes declarados por la empresa (texto libre)
 */
export function generarBloques({ expediente = {}, cfg: cfgEntrada, resumen, comprobaciones = [], alegaciones = '', importesDeclarados = '' }) {
  const cfg = normalizarConfig(cfgEntrada)
  const marcado = new Set(comprobaciones)
  const B = []
  const empresa = expediente.empresa?.trim() || 'la empresa'
  const actividad = expediente.actividad?.trim()
  const convenio = expediente.convenio?.trim() || 'el convenio colectivo de aplicación'
  const diasHabiles = cfg.jornadaAnual / cfg.jornadaDiaria
  const n = resumen.datos.length
  const plantilla = n === 1 ? 'el trabajador examinado' : `los ${n} trabajadores examinados`

  // ── Antecedentes ──
  B.push({ tipo: 'titulo', texto: 'Antecedentes' })
  const sujeto = empresa === 'la empresa' ? 'La empresa' : `La empresa ${empresa}`
  B.push({
    tipo: 'p',
    texto: actividad
      ? `${sujeto} desarrolla la actividad de ${actividad.replace(/\.$/, '')}. En lo referente a las dietas abonadas a los trabajadores exentas de cotización, se ha examinado la documentación aportada.`
      : `En lo referente a las dietas exentas de cotización abonadas a los trabajadores por ${empresa}, se ha examinado la documentación aportada.`,
  })
  if (alegaciones.trim()) {
    B.push({ tipo: 'p', texto: 'La empresa presenta escrito en el que se detalla lo siguiente:' })
    B.push({ tipo: 'cita', texto: alegaciones.trim() })
  }

  const fuentes = ['las nóminas']
  if (resumen.datos.some((d) => d.trabajador.tacografo || d.cuadrante.filas.some((f) => f.diasTacografo !== null))) fuentes.push('los tacógrafos')
  if (marcado.has('partesTrabajo')) fuentes.push('los partes de trabajo')
  if (resumen.datos.some((d) => d.cuadrante.filas.some((f) => f.vacaciones !== null))) fuentes.push('el cuadrante de vacaciones')
  B.push({
    tipo: 'p',
    texto: `Del examen de la documentación aportada, con especial relevancia de ${fuentes.join(', ').replace(/, ([^,]*)$/, ' y $1')}${marcado.has('sinHE') ? ', y de las comprobaciones efectuadas en la base de datos de la TGSS (eSIL)' : ''}, se han constatado los siguientes hechos:`,
  })

  // ── 1. Dietas ──
  B.push({ tipo: 'titulo', texto: '1.- Percepción reiterada de dietas exentas de cotización' })
  const lineasHabitual = []
  if (marcado.has('dietasMensuales')) {
    lineasHabitual.push('Los trabajadores perciben de forma habitual y continuada todos los meses dietas exentas de cotización.')
  }
  if (marcado.has('sinJustificantes')) {
    lineasHabitual.push(
      `No existen facturas ni tiques que justifiquen el gasto realizado${marcado.has('partesTrabajo') ? '; únicamente se aportan partes de trabajo con fechas y servicios, matrícula del vehículo y kilómetros recorridos, que acreditan el desplazamiento pero no el importe del gasto' : ''}.`,
    )
  }
  if (lineasHabitual.length) B.push({ tipo: 'p', texto: lineasHabitual.join(' ') })

  const conDietas = resumen.datos.filter((d) => d.dietas.porTipo.length)
  if (conDietas.length || marcado.has('variacionPrecios')) {
    const tabla = []
    for (const d of conDietas) {
      for (const x of d.dietas.porTipo) {
        tabla.push([
          d.trabajador.nombre || '—',
          x.nombre,
          num(x.dias),
          `${eur(x.min)} – ${eur(x.max)}`,
          num(x.precios.length),
          eur(x.media),
          eur(x.total),
        ])
      }
    }
    const intro = importesDeclarados.trim()
      ? `Según el escrito aportado por la empresa, los importes abonados son los siguientes: ${importesDeclarados.trim().replace(/\.$/, '')}. Ahora bien, examinadas las nóminas, se constata que no siempre están calculadas bajo tales cuantías`
      : 'Examinadas las nóminas, se constata que los importes de las dietas no responden a una cuantía homogénea'
    const variaciones = resumen.conVariacion.length
      ? `, encontrándose variaciones en el precio de la dieta incluso dentro de una misma nómina (${resumen.conVariacion
          .map((d) => `${d.trabajador.nombre || 'trabajador'}: ${d.dietas.mesesVariacion.length} ${d.dietas.mesesVariacion.length === 1 ? 'nómina' : 'nóminas'}`)
          .join('; ')})`
      : ''
    B.push({
      tipo: 'p',
      texto: `${intro}${variaciones}${marcado.has('variacionPrecios') ? ', sin que tales variaciones tengan un gasto justificado ni explicación objetiva' : ''}.`,
    })
    if (tabla.length) {
      B.push({
        tipo: 'tabla',
        cabecera: ['Trabajador', 'Tipo de dieta', 'Días', 'Rango de importes/día', 'Importes distintos', 'Media/día', 'Total abonado'],
        filas: tabla,
      })
    }
    const ejemplos = resumen.conVariacion
      .flatMap((d) => d.dietas.mesesVariacion.slice(0, 3).map((v) => `${d.trabajador.nombre || 'trabajador'}, nómina de ${mesLargo(v.mes)} (${nombreTipo(v.tipo)}): ${v.precios.map(eur).join(', ')}`))
      .slice(0, 8)
    if (ejemplos.length) {
      B.push({ tipo: 'p', texto: 'A título de ejemplo, se reflejan en una misma nómina distintos importes para un mismo tipo de dieta:' })
      B.push({ tipo: 'lista', items: ejemplos })
    }
    if (resumen.excesoNoExento > 0) {
      B.push({
        tipo: 'p',
        texto: `Además, parte de los importes supera los límites exentos del art. 9.A del Reglamento del IRPF, al que remite el art. 147.2.a) LGSS, lo que supone ${eur(resumen.excesoNoExento)} que, en todo caso, debieron integrarse en la base de cotización.`,
      })
    }
    B.push({
      tipo: 'p',
      texto:
        'Por ello, si bien los trabajadores realizan desplazamientos compatibles con la percepción de dietas que pudieran estar exentas de cotización, la variación de tales importes sin justificación objetiva (carencia de tiques de gastos) ni correlación clara con los servicios realizados en algunos supuestos, supone un claro indicio de utilización de este concepto de forma no vinculada exclusivamente a la compensación de gastos.',
    })
  }

  if (resumen.conExcesoDias.length) {
    B.push({
      tipo: 'p',
      texto: `Otra cuestión a tener en cuenta es que el número de días con percepción de dietas según se desprende de las nóminas aportadas${fuentes.includes('los tacógrafos') ? ', acreditadas con desplazamientos mediante los tacógrafos aportados,' : ''} alcanza cifras que, en cómputo anual, igualan o superan el número máximo de días laborables teóricos según lo establecido en ${convenio}.`,
    })
  }

  // Vacaciones
  if (resumen.sinVacaciones.length || resumen.conVacTrabajadas.length || marcado.has('dietasEnVacaciones')) {
    const partes = ['Las dietas se abonan en un número de días incompatible con el disfrute efectivo de descansos y vacaciones.']
    if (resumen.sinVacaciones.length) {
      partes.push(
        `En este sentido, se ha comprobado, además, la falta de disfrute efectivo de vacaciones: según el cuadrante de vacaciones aportado por la empresa, ${resumen.sinVacaciones.length === n ? 'los trabajadores' : `${resumen.sinVacaciones.length} de ${plantilla}`} no disfrutan del periodo mínimo de vacaciones anuales legalmente establecido (${num(cfg.vacacionesAnuales)} días naturales, art. 38 ET).`,
      )
    }
    B.push({ tipo: 'p', texto: partes.join(' ') })
    if (resumen.conVacTrabajadas.length || marcado.has('dietasEnVacaciones')) {
      const detalle = resumen.conVacTrabajadas.length
        ? ` (${resumen.conVacTrabajadas.map((d) => `${d.trabajador.nombre || 'trabajador'}: ${num(d.cuadrante.totales.diasEnVacaciones)} días`).join('; ')})`
        : ''
      B.push({
        tipo: 'p',
        texto: `Es más, se ha constatado que, durante periodos en los que deberían encontrarse en situación de vacaciones, continúan percibiendo dietas asociadas a actividad laboral realizada${detalle}. La falta de disfrute de vacaciones implica por tanto un aumento del número de días efectivamente trabajados y un incremento del cómputo anual de horas de trabajo, lo que contribuye a la superación de los límites legales y convencionales de jornada.`,
      })
    }
  }

  // ── 2. Jornada máxima anual ──
  B.push({ tipo: 'titulo', texto: '2.- Superación de la jornada máxima anual' })
  B.push({
    tipo: 'lista',
    items: [
      `${convenio.charAt(0).toUpperCase() + convenio.slice(1)} establece la jornada máxima en cómputo anual de ${num(cfg.jornadaAnual)} horas/año. Ello supone un total de ${num(diasHabiles, 2)} días hábiles de trabajo con una jornada diaria de ${num(cfg.jornadaDiaria)} horas.`,
      `El número de días efectivamente trabajados por los conductores, inferido a partir del abono de dietas${fuentes.includes('los tacógrafos') ? ', así como de las lecturas de los tacógrafos aportados' : ''}, resulta ${resumen.conExcesoDias.length ? 'superior' : 'no superior'} al número de días hábiles teóricos compatibles con dicha jornada máxima.`,
      resumen.conExcesoDias.length
        ? 'En conclusión, se ha podido constatar la realización de trabajo por encima de la jornada máxima anual establecida convencionalmente.'
        : 'En conclusión, no se aprecia superación de la jornada máxima anual con los datos introducidos.',
    ],
  })

  const parciales = [...new Set(resumen.datos.flatMap((d) => d.cuadrante.filas.filter((f) => !f.completo).map((f) => `${f.anio} (${num(f.diasTeoricos, cfg.redondeo === 'ninguno' ? 2 : 0)} días)`)))]
  B.push({
    tipo: 'p',
    texto: `Se detallan en el siguiente cuadrante, en cómputo anual (y proporcional, en los casos que corresponda), los excesos de jornada detectados, teniendo en cuenta como parámetros la comparativa entre la jornada máxima anual (${num(cfg.jornadaAnual)} horas distribuidas en ${num(diasHabiles, 2)} días de trabajo${parciales.length ? `, salvo en los periodos inferiores al año, en los que se aplican los días hábiles proporcionales ${cfg.prorrateo === 'meses' ? 'por meses' : 'por días naturales'}: ${parciales.join(', ')}` : ''}) y el número de días efectivamente trabajados por los conductores, inferido a partir del abono de dietas${fuentes.includes('los tacógrafos') ? ', así como de las lecturas de los tacógrafos aportados' : ''}.`,
  })
  B.push({ tipo: 'p', texto: `Período examinado: ${periodoTexto(cfg.desde, cfg.hasta)}.` })

  const filasCuadrante = []
  for (const d of resumen.datos) {
    for (const f of d.cuadrante.filas) {
      filasCuadrante.push([
        d.trabajador.nombre || '—',
        f.completo ? f.anio : `${f.anio} (${fechaES(f.desde).slice(0, 5)}–${fechaES(f.hasta).slice(0, 5)})`,
        num(f.diasTeoricos, cfg.redondeo === 'ninguno' ? 2 : 0),
        num(f.diasDieta),
        num(f.diasTacografo),
        num(f.diasTrabajados),
        num(f.excesoDias),
        num(f.excesoHoras),
        f.vacaciones === null ? '—' : `${num(f.vacaciones)} / ${num(f.vacacionesDebidas)}`,
      ])
    }
    if (d.cuadrante.filas.length > 1) {
      const t = d.cuadrante.totales
      filasCuadrante.push([`Total ${d.trabajador.nombre || ''}`.trim(), '', num(t.diasTeoricos), num(t.diasDieta), num(t.diasTacografo), num(t.diasTrabajados), num(t.excesoDias), num(t.excesoHoras), ''])
    }
  }
  B.push({
    tipo: 'tabla',
    cabecera: ['Trabajador', 'Año', 'Días hábiles teóricos', 'Días con dieta', 'Días tacógrafo', 'Días trabajados', 'Exceso días', 'Exceso horas', 'Vacaciones disfrutadas / debidas'],
    filas: filasCuadrante,
  })
  if (resumen.excesoHoras > 0) {
    B.push({
      tipo: 'p',
      texto: `En total, el exceso asciende a ${num(resumen.excesoDias)} días, equivalentes a ${num(resumen.excesoHoras)} horas de trabajo por encima de la jornada máxima anual${resumen.importeHE > 0 ? `, con una valoración de ${eur(resumen.importeHE)} según el precio de la hora extraordinaria aplicado` : ''}.`,
    })
    const superan = resumen.datos.filter((d) => d.cuadrante.filas.some((f) => f.superaLimiteHE))
    if (superan.length) {
      B.push({
        tipo: 'p',
        texto: `En ${superan.length === 1 ? 'un caso' : `${superan.length} casos`} se supera además el límite de ${num(cfg.limiteHEAnual)} horas extraordinarias al año del art. 35.2 ET.`,
      })
    }
  }

  // Método por horas (lecturas del tacógrafo)
  if (resumen.conHoras.length) {
    B.push({
      tipo: 'p',
      texto: `Asimismo, a partir de las horas registradas en los tacógrafos, se ha calculado la jornada máxima que podía realizar cada trabajador en su periodo de alta (${num(cfg.jornadaAnual)} horas × días en alta, descontados los días de incapacidad temporal u otras situaciones similares, / días del año). El tiempo de trabajo efectivo (conducción y otros trabajos) que excede de dicha jornada máxima constituye horas extraordinarias, a cotizar en la base de contingencias profesionales; el resto del tiempo que excede de la jornada máxima (tiempo de presencia) se integra en la base de contingencias comunes. Estos excesos son horas a cotizar en la medida en que no constan como cotizadas en las nóminas:`,
    })
    const filasHoras = []
    for (const d of resumen.conHoras) {
      for (const f of d.cuadrante.filas) {
        if (f.excesoHE === null) continue
        filasHoras.push([
          d.trabajador.nombre || '—',
          f.completo ? f.anio : `${f.anio} (${fechaES(f.desde).slice(0, 5)}–${fechaES(f.hasta).slice(0, 5)})`,
          num(f.diasAlta),
          num(f.diasIT),
          num(f.jornadaMaxima, 2),
          num(f.horasEfectivas, 2),
          num(f.horasPresencia, 2),
          num(f.excesoHE, 2),
          num(f.excesoCC, 2),
        ])
      }
    }
    B.push({
      tipo: 'tabla',
      cabecera: ['Trabajador', 'Año', 'Días en alta', 'Días IT', 'Jornada máxima (h)', 'Trabajo efectivo (h)', 'Presencia (h)', 'Exceso HE (B. CP)', 'Exceso jornada (B. CC)'],
      filas: filasHoras,
    })
    if (resumen.excesoHE > 0 || resumen.excesoCC > 0) {
      B.push({
        tipo: 'p',
        texto: `En total, ${num(resumen.excesoHE, 2)} horas extraordinarias y ${num(resumen.excesoCC, 2)} horas de exceso sobre la jornada máxima.`,
      })
    }
  }

  // ── 3. Horas extraordinarias ──
  B.push({ tipo: 'titulo', texto: '3.- Ausencia de abono de horas extraordinarias' })
  B.push({
    tipo: 'p',
    texto: marcado.has('sinHE')
      ? 'Del análisis de las nóminas y de la base de datos de la Seguridad Social con los CRA comunicados, se desprende que no consta en ningún caso el abono de horas extraordinarias, ni consta su compensación mediante descanso equivalente.'
      : '[Indicar si consta o no el abono de horas extraordinarias en nóminas y CRA comunicados, o su compensación con descanso.]',
  })
  if (resumen.conExceso.length) {
    B.push({
      tipo: 'p',
      texto:
        'En base a todo lo anterior, y a la vista de los hechos constatados, se puede concluir la existencia de horas extraordinarias no declaradas: el exceso de días trabajados y la superación de la jornada máxima anual determinan la existencia de horas extraordinarias realizadas de forma habitual y estructural, que no han sido declaradas ni retribuidas conforme a la normativa vigente.',
    })
  }
  if (conDietas.length || marcado.has('variacionPrecios')) {
    B.push({
      tipo: 'p',
      texto:
        'Al hilo de lo anterior, si bien no se pone en duda la existencia de los desplazamientos que motivan el pago de las dietas, la forma dispar de calcular el precio de estas, asignándoles distintos precios sin una motivación lógica y objetiva (tal como un gasto real), podría determinar que tales dietas están siendo utilizadas como un mecanismo para encubrir percepciones salariales, evitando su cotización a la Seguridad Social.',
    })
  }

  // ── Conclusión ──
  B.push({ tipo: 'titulo', texto: 'Conclusión' })
  const incumplimientos = []
  if (resumen.conExceso.length) incumplimientos.push('no declarar ni retribuir horas extraordinarias')
  if (resumen.sinVacaciones.length || resumen.conVacTrabajadas.length) incumplimientos.push('no garantizar el derecho al descanso anual (vacaciones)')
  const dietasTxt = conDietas.length || marcado.has('variacionPrecios') ? 'la posible utilización de conceptos extrasalariales justificados de forma indebida' : ''
  if (incumplimientos.length || dietasTxt) {
    B.push({
      tipo: 'p',
      texto: `De todo lo anterior, se puede concluir el incumplimiento sistemático de la normativa laboral, dado que los hechos descritos evidencian un comportamiento empresarial consistente en ${incumplimientos.join(', así como ') || 'lo expuesto'}${dietasTxt ? `${incumplimientos.length ? ', amén de ' : ' y '}${dietasTxt}` : ''}.`,
    })
  }
  if (resumen.conExceso.length) {
    B.push({
      tipo: 'p',
      texto: `En base a las actuaciones realizadas, se concluye que ${empresa === 'la empresa' ? 'la empresa' : `la mercantil ${empresa}`} ha incurrido en un exceso de jornada no declarado, mediante la realización de horas extraordinarias no abonadas${dietasTxt ? ', utilizando para ello, posiblemente de forma fraudulenta, el concepto de dietas' : ''}${incumplimientos.length > 1 ? ' y sin garantizar el derecho efectivo al disfrute de vacaciones' : ''}, todo ello en vulneración de la normativa laboral vigente.`,
    })
  }
  B.push({ tipo: 'titulo', texto: 'Normativa de referencia' })
  B.push({ tipo: 'lista', items: NORMAS })
  return B
}

// ─────────────────────────── Salidas ───────────────────────────

export function bloquesATexto(bloques) {
  return bloques
    .map((b) => {
      if (b.tipo === 'titulo') return b.texto.toUpperCase()
      if (b.tipo === 'cita') return `“${b.texto}”`
      if (b.tipo === 'lista') return b.items.map((i) => `- ${i}`).join('\n')
      if (b.tipo === 'tabla') return [b.cabecera, ...b.filas].map((f) => f.join('\t')).join('\n')
      return b.texto
    })
    .join('\n\n')
}

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

export function bloquesAHtml(bloques, titulo = 'Hechos comprobados') {
  const cuerpo = bloques
    .map((b) => {
      if (b.tipo === 'titulo') return `<h2>${esc(b.texto)}</h2>`
      if (b.tipo === 'cita') return `<blockquote>${esc(b.texto).replace(/\n/g, '<br>')}</blockquote>`
      if (b.tipo === 'lista') return `<ul>${b.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`
      if (b.tipo === 'tabla')
        return `<table><thead><tr>${b.cabecera.map((c) => `<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${b.filas
          .map((f) => `<tr>${f.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`)
          .join('')}</tbody></table>`
      return `<p>${esc(b.texto)}</p>`
    })
    .join('\n')
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>${esc(titulo)}</title><style>
body{font-family:Calibri,Arial,sans-serif;font-size:11pt;line-height:1.45;max-width:780px;margin:24px auto;color:#111}
h1{font-size:15pt}h2{font-size:12pt;margin:18px 0 6px}p{text-align:justify;margin:0 0 10px}
blockquote{margin:8px 24px;font-style:italic;color:#333}
table{border-collapse:collapse;width:100%;margin:8px 0 14px;font-size:9.5pt}th,td{border:1px solid #888;padding:4px 6px;text-align:center}th{background:#e9eef5}
td:first-child{text-align:left}
</style></head><body><h1>${esc(titulo)}</h1>
${cuerpo}
</body></html>`
}
