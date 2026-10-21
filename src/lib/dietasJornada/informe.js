// Informe de posibles incumplimientos a partir del cuadrante.
//
// Devuelve una lista de bloques ({ tipo: 'titulo' | 'p' | 'cita' | 'lista' | 'tabla' })
// que se convierte en texto plano (para copiar) o en HTML (Word / impresión).
// Está pensado para que la persona trabajadora (o quien la asesore) conozca sus
// derechos y lo que puede reclamar a la empresa. Es orientativo.

import { NORMAS, TIPOS_DIETA } from '../../data/dietasJornada.js'
import { normalizarConfig, valoracion, plazosReclamacion } from './calculo.js'
import { CONVENIOS } from '../../data/conveniosTransporte.js'
import { TEXTO_LICENCIA, textoCopyright } from '../../data/autoria.js'
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

const ESTADOS = {
  vigente: 'se puede reclamar',
  parcial: 'se puede reclamar en parte (los meses más antiguos ya habrían prescrito)',
  prescrito: 'habría prescrito',
}

/**
 * @param {object} p
 * @param {object} p.expediente datos de la empresa
 * @param {object} p.cfg configuración
 * @param {object} p.resumen resultado de resumenExpediente()
 * @param {Set<string>|string[]} p.comprobaciones ids marcados
 * @param {string} p.alegaciones explicación de la empresa (opcional, se cita)
 * @param {string} p.importesDeclarados importes de dieta que dice pagar la empresa (texto libre)
 * @param {string} p.hoy fecha de referencia para los plazos ('AAAA-MM-DD')
 */
export function generarBloques({
  expediente = {},
  cfg: cfgEntrada,
  resumen,
  comprobaciones = [],
  alegaciones = '',
  importesDeclarados = '',
  hoy = new Date().toISOString().slice(0, 10),
}) {
  const cfg = normalizarConfig(cfgEntrada)
  const marcado = new Set(comprobaciones)
  const B = []
  const empresa = expediente.empresa?.trim() || 'la empresa'
  const conv = CONVENIOS[cfg.convenio]
  const convenio = expediente.convenio?.trim() || conv?.nombreTexto || 'el convenio colectivo de aplicación'
  const delConvenio = /^el /i.test(convenio) ? `del ${convenio.slice(3)}` : `de ${convenio}`
  const diasHabiles = cfg.jornadaAnual / cfg.jornadaDiaria
  const n = resumen.datos.length
  const hayTac = resumen.datos.some((d) => d.trabajador.tacografo || d.cuadrante.filas.some((f) => f.diasTacografo !== null))

  // ── Datos analizados ──
  B.push({ tipo: 'titulo', texto: '1. Datos analizados' })
  const fuentes = ['las nóminas']
  if (hayTac) fuentes.push('los registros del tacógrafo')
  if (marcado.has('partesTrabajo')) fuentes.push('los partes de trabajo')
  if (resumen.datos.some((d) => d.cuadrante.filas.some((f) => f.vacaciones !== null))) fuentes.push('el calendario de vacaciones')
  B.push({
    tipo: 'p',
    texto: `Este informe analiza ${n === 1 ? 'la situación de un trabajador' : `la situación de ${n} trabajadores`} de ${empresa}${expediente.actividad?.trim() ? `, dedicada a ${expediente.actividad.trim().replace(/\.$/, '')}` : ''}, ${periodoTexto(cfg.desde, cfg.hasta)}, a partir de ${fuentes.join(', ').replace(/, ([^,]*)$/, ' y $1')}. Se compara con lo que establecen ${convenio} y la normativa laboral y de Seguridad Social. Su objetivo es ayudar a conocer los derechos de las personas trabajadoras y los posibles incumplimientos que pueden reclamarse a la empresa.`,
  })
  if (alegaciones.trim()) {
    B.push({ tipo: 'p', texto: 'La empresa ha explicado lo siguiente:' })
    B.push({ tipo: 'cita', texto: alegaciones.trim() })
  }

  // ── Jornada y horas extraordinarias ──
  B.push({ tipo: 'titulo', texto: '2. Jornada anual y horas extraordinarias' })
  B.push({
    tipo: 'p',
    texto: `${convenio.charAt(0).toUpperCase() + convenio.slice(1)} fija una jornada máxima de ${num(cfg.jornadaAnual)} horas al año, que equivalen a ${num(diasHabiles, 2)} días de trabajo de ${num(cfg.jornadaDiaria)} horas. En los periodos inferiores al año se aplica la parte proporcional. El trabajo que supera esa jornada son horas extraordinarias: deben pagarse (o compensarse con descanso) y no pueden pasar de ${num(cfg.limiteHEAnual)} al año (art. 35 ET).`,
  })
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
      ])
    }
  }
  B.push({
    tipo: 'tabla',
    cabecera: ['Trabajador', 'Año', 'Días de trabajo máximos', 'Días con dieta', 'Días con tacógrafo', 'Días trabajados', 'Días de más', 'Horas de más'],
    filas: filasCuadrante,
  })
  if (resumen.conExcesoDias.length) {
    B.push({
      tipo: 'p',
      texto: `Según estos datos, se habrían trabajado ${num(resumen.excesoDias)} días por encima de la jornada máxima, equivalentes a ${num(resumen.excesoHoras)} horas. Los días trabajados se deducen de los días en que se cobró dieta${hayTac ? ' y de los días con actividad en el tacógrafo' : ''}: si había desplazamiento, había trabajo.`,
    })
  } else {
    B.push({ tipo: 'p', texto: 'Con los días introducidos no se aprecia que se haya superado la jornada máxima anual.' })
  }
  const superan = resumen.datos.filter((d) => d.cuadrante.filas.some((f) => f.superaLimiteHE))
  if (superan.length) {
    B.push({ tipo: 'p', texto: `En ${superan.length === 1 ? 'un caso' : `${superan.length} casos`} se superan además las ${num(cfg.limiteHEAnual)} horas extraordinarias al año que permite la ley.` })
  }

  if (resumen.conHoras.length) {
    B.push({
      tipo: 'p',
      texto: `Con las horas registradas en el tacógrafo se ha comparado el tiempo trabajado con la jornada que correspondía en cada periodo (proporcional a los días del año y sin contar los días de baja u otras suspensiones del contrato). El trabajo efectivo (conducción y otros trabajos) que la supera son horas extraordinarias; el resto es tiempo de presencia (esperas, disponibilidad) por encima de la jornada, que también debe pagarse como salario (art. 8.3 RD 1561/1995):`,
    })
    const filasHoras = []
    for (const d of resumen.conHoras) {
      for (const f of d.cuadrante.filas) {
        if (f.excesoHE === null) continue
        filasHoras.push([
          d.trabajador.nombre || '—',
          f.completo ? f.anio : `${f.anio} (${fechaES(f.desde).slice(0, 5)}–${fechaES(f.hasta).slice(0, 5)})`,
          num(f.jornadaProporcional, 2),
          num(f.horasEfectivas, 2),
          num(f.horasPresencia, 2),
          num(f.excesoHE, 2),
          num(f.excesoPresencia, 2),
        ])
      }
    }
    B.push({
      tipo: 'tabla',
      cabecera: ['Trabajador', 'Año', 'Jornada que correspondía (h)', 'Trabajo efectivo (h)', 'Presencia (h)', 'Horas extraordinarias', 'Presencia de más (h)'],
      filas: filasHoras,
    })
  }
  if (marcado.has('sinHE') && resumen.conExceso.length) {
    B.push({ tipo: 'p', texto: 'En las nóminas no aparecen horas extraordinarias pagadas ni compensadas con descanso, por lo que estas horas podrían no haberse cobrado ni cotizado.' })
  }

  // ── Vacaciones ──
  const conVac = resumen.datos.some((d) => d.cuadrante.filas.some((f) => f.vacaciones !== null))
  if (conVac || marcado.has('dietasEnVacaciones')) {
    B.push({ tipo: 'titulo', texto: '3. Vacaciones' })
    B.push({ tipo: 'p', texto: `Toda persona trabajadora tiene derecho a disfrutar al menos ${num(cfg.vacacionesAnuales)} días naturales de vacaciones al año, que no pueden sustituirse por dinero mientras dure el contrato (art. 38 ET).` })
    if (resumen.sinVacaciones.length) {
      B.push({
        tipo: 'lista',
        items: resumen.sinVacaciones.flatMap((d) =>
          d.cuadrante.filas
            .filter((f) => f.deficitVacaciones > 0)
            .map((f) => `${d.trabajador.nombre || 'Trabajador'}, ${f.anio}: ${num(f.vacaciones)} días disfrutados de ${num(f.vacacionesDebidas)}; faltan ${num(f.deficitVacaciones)}.`),
        ),
      })
    }
    if (resumen.conVacTrabajadas.length || marcado.has('dietasEnVacaciones')) {
      B.push({
        tipo: 'p',
        texto: `Además, se habría trabajado en días que debían ser de vacaciones${resumen.conVacTrabajadas.length ? ` (${resumen.conVacTrabajadas.map((d) => `${d.trabajador.nombre || 'trabajador'}: ${num(d.cuadrante.totales.diasEnVacaciones)} días`).join('; ')})` : ''}. Esos días cuentan como trabajo y aumentan las horas realizadas en el año.`,
      })
    }
  }

  // ── Dietas ──
  const conDietas = resumen.datos.filter((d) => d.dietas.porTipo.length)
  if (conDietas.length || marcado.has('variacionPrecios')) {
    B.push({ tipo: 'titulo', texto: '4. Dietas' })
    B.push({
      tipo: 'p',
      texto: 'Las dietas compensan los gastos de comida y alojamiento de los desplazamientos y, dentro de ciertos límites, no cotizan a la Seguridad Social. Si en realidad pagan trabajo, son salario: deben cotizar y cuentan para la baja, el paro y la jubilación.',
    })
    const tabla = []
    for (const d of conDietas) {
      for (const x of d.dietas.porTipo) {
        tabla.push([d.trabajador.nombre || '—', x.nombre, num(x.dias), `${eur(x.min)} – ${eur(x.max)}`, num(x.precios.length), eur(x.media), eur(x.total)])
      }
    }
    if (tabla.length) {
      B.push({ tipo: 'tabla', cabecera: ['Trabajador', 'Tipo de dieta', 'Días', 'Importe por día', 'Importes distintos', 'Media por día', 'Total cobrado'], filas: tabla })
    }
    const indicios = []
    if (importesDeclarados.trim()) indicios.push(`La empresa indica que paga ${importesDeclarados.trim().replace(/\.$/, '')}, pero las nóminas no siempre responden a esas cuantías.`)
    if (resumen.conVariacion.length || marcado.has('variacionPrecios')) {
      const ejemplos = resumen.conVariacion
        .flatMap((d) => d.dietas.mesesVariacion.slice(0, 2).map((v) => `${mesLargo(v.mes)} (${nombreTipo(v.tipo)}: ${v.precios.map(eur).join(', ')})`))
        .slice(0, 4)
      indicios.push(`El importe de la dieta cambia sin un motivo aparente, incluso dentro de la misma nómina${ejemplos.length ? `; por ejemplo, ${ejemplos.join('; ')}` : ''}.`)
    }
    if (marcado.has('sinJustificantes')) indicios.push('No se justifican los gastos con facturas o tiques.')
    if (marcado.has('dietasMensuales')) indicios.push('Se cobran todos los meses, de forma habitual.')
    if (resumen.excesoNoExento > 0) indicios.push(`Hay ${eur(resumen.excesoNoExento)} por encima de los límites exentos de la normativa fiscal, que en todo caso debían cotizar.`)
    if (conv) {
      const anios = [...new Set(resumen.datos.flatMap((d) => d.cuadrante.filas.map((f) => f.anio)))].filter((a) => conv.dietas.nacional[a])
      if (anios.length) {
        indicios.push(`Como referencia, el convenio fija la dieta completa (desayuno, comida, cena y pernocta) en ${anios.map((a) => `${eur(conv.dietas.nacional[a][4])} en España y ${eur(conv.dietas.portugal[a][4])} en Portugal en ${a}`).join('; ')}.`)
      }
    }
    if (indicios.length) {
      B.push({ tipo: 'p', texto: 'Hay indicios de que parte de las dietas podría estar pagando trabajo en lugar de gastos:' })
      B.push({ tipo: 'lista', items: indicios })
    }
  }

  // ── Trabajo en el extranjero (según el tacógrafo) ──
  const filasExt = resumen.datos.flatMap((d) => d.cuadrante.filas.filter((f) => f.diasExtranjero > 0).map((f) => ({ d, f })))
  if (filasExt.length) {
    B.push({ tipo: 'titulo', texto: 'Trabajo en el extranjero' })
    B.push({
      tipo: 'p',
      texto: 'Según los países registrados en la tarjeta del conductor al empezar o terminar la jornada, hubo días de trabajo fuera de España. En esos días la dieta debería ser la del extranjero (con sus propios límites exentos) y, según el tipo de transporte, puede aplicarse la normativa sobre desplazamiento de conductores (Directiva (UE) 2020/1057): el cabotaje y los transportes entre terceros países se consideran desplazamiento; los transportes bilaterales y el tránsito, no.',
    })
    B.push({
      tipo: 'tabla',
      cabecera: ['Trabajador', 'Año', 'Días en el extranjero (tacógrafo)', 'Países', 'Días con dieta del extranjero (nóminas)'],
      filas: filasExt.map(({ d, f }) => [d.trabajador.nombre || '—', f.anio, num(f.diasExtranjero), f.paisesExtranjero.join(', '), f.diasDietaExtranjero === null ? '—' : num(f.diasDietaExtranjero)]),
    })
    const menos = filasExt.filter(({ f }) => f.diasDietaExtranjero !== null && f.diasDietaExtranjero < f.diasExtranjero)
    if (menos.length) {
      B.push({ tipo: 'p', texto: `En ${menos.length === 1 ? 'un caso' : `${menos.length} casos`} las nóminas recogen menos días de dieta del extranjero que días trabajados fuera de España: conviene revisar el tipo de dieta abonada.` })
    }
  }

  // ── Diferencias salariales y de cotización ──
  const v = valoracion(resumen, cfg)
  if (v.totales.totalSalarial > 0) {
    B.push({ tipo: 'titulo', texto: '5. Cantidades que podrían deberse' })
    const partes = []
    if (v.totales.importeHE > 0) partes.push(`${eur(v.totales.importeHE)} por horas extraordinarias`)
    if (v.totales.importeOrd > 0) partes.push(`${eur(v.totales.importeOrd)} por tiempo de presencia de más`)
    if (v.totales.dietas > 0) partes.push(`${eur(v.totales.dietas)} de dietas que deberían cotizar`)
    B.push({
      tipo: 'p',
      texto: `${conv ? 'El precio de la hora se calcula con el art. 31 del convenio ((salario base + complementos + antigüedad) × 15 / 1.800) y la hora extraordinaria con el recargo del 25 % de su art. 35.b. ' : ''}Con las tablas salariales ${delConvenio}, las diferencias salariales serían de ${eur(v.totales.totalSalarial)} (${partes.join('; ')}). Las cotizaciones a la Seguridad Social que corresponderían ascienden a ${eur(v.totales.cuotaTotal)}, de los que ${eur(v.totales.cuotaEmpresa)} corresponden a la empresa y ${eur(v.totales.cuotaTrabajador)} a la parte del trabajador.`,
    })
    B.push({
      tipo: 'tabla',
      cabecera: ['Trabajador', 'Año', 'Horas extra', 'Importe horas extra', 'Presencia de más (h)', 'Importe presencia', 'Dietas que deberían cotizar', 'Diferencia salarial', 'Cotización'],
      filas: v.filas
        .filter((x) => x.totalSalarial > 0)
        .map((x) => [x.trabajador.nombre || '—', x.anio, num(x.horasHE, 2), eur(x.importeHE), num(x.horasOrd, 2), eur(x.importeOrd), eur(x.dietas), eur(x.totalSalarial), eur(x.cuotaTotal)]),
    })
  }

  // ── Plazos ──
  const anios = [...new Map(resumen.datos.flatMap((d) => d.cuadrante.filas).map((f) => [f.anio, f])).values()]
  const minDesde = (anio) => resumen.datos.flatMap((d) => d.cuadrante.filas).filter((f) => f.anio === anio).reduce((m, f) => (f.desde < m ? f.desde : m), '9999')
  const maxHasta = (anio) => resumen.datos.flatMap((d) => d.cuadrante.filas).filter((f) => f.anio === anio).reduce((m, f) => (f.hasta > m ? f.hasta : m), '0000')
  const plazos = plazosReclamacion(anios.map((f) => ({ anio: f.anio, desde: minDesde(f.anio), hasta: maxHasta(f.anio) })), hoy)
  B.push({ tipo: 'titulo', texto: '6. Plazos para reclamar' })
  B.push({
    tipo: 'lista',
    items: [
      'Salarios (horas extraordinarias, presencia y demás diferencias): 1 año desde que debieron pagarse (art. 59.2 ET). Cada mes cuenta por separado.',
      'Cotizaciones a la Seguridad Social: 4 años desde que terminó el plazo para ingresarlas, que es el último día del mes siguiente al del salario (art. 24 LGSS). Por ejemplo, las del salario de enero de 2022 debían ingresarse hasta el 28 de febrero de 2022 y no prescriben hasta el 28 de febrero de 2026.',
    ],
  })
  B.push({
    tipo: 'tabla',
    cabecera: ['Año', 'Salarios: se pueden reclamar hasta', 'Situación', 'Cotizaciones: prescriben entre', 'Situación'],
    filas: plazos.map((p) => [p.anio, `${fechaES(p.salario.primero)} – ${fechaES(p.salario.ultimo)}`, ESTADOS[p.salario.estado], `${fechaES(p.cotizacion.primero)} – ${fechaES(p.cotizacion.ultimo)}`, ESTADOS[p.cotizacion.estado]]),
  })
  B.push({
    tipo: 'p',
    texto: `Situación calculada a ${fechaES(hoy)}. Los plazos se interrumpen, entre otras causas, con una reclamación a la empresa, la papeleta de conciliación o una denuncia; confírmalos con quien te asesore.`,
  })

  // ── Qué hacer ──
  B.push({ tipo: 'titulo', texto: '7. Qué se puede hacer' })
  B.push({
    tipo: 'lista',
    items: [
      'Pedir asesoramiento a la representación de los trabajadores, a un sindicato o a un profesional antes de actuar.',
      'Reclamar a la empresa por escrito, conservando copia con fecha de entrega, el pago de las horas extraordinarias, el tiempo de presencia, las vacaciones no disfrutadas y la cotización de las cantidades que corresponda.',
      'Si la empresa no paga, presentar la papeleta de conciliación (paso previo a la demanda ante el Juzgado de lo Social) dentro del plazo.',
      'Las cotizaciones no se reclaman directamente a la empresa: las regulariza la Seguridad Social. Se puede presentar una denuncia ante la Inspección de Trabajo y Seguridad Social.',
      'Guardar las nóminas, los partes de trabajo, el calendario de vacaciones y las descargas del tacógrafo: son la prueba.',
    ],
  })

  B.push({ tipo: 'titulo', texto: 'Normativa de referencia' })
  B.push({ tipo: 'lista', items: NORMAS })
  B.push({
    tipo: 'p',
    texto: 'Informe orientativo elaborado con una herramienta gratuita. Puede contener errores: revisa los datos y los resultados con la documentación y con quien te asesore antes de presentar cualquier reclamación.',
  })
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

export function bloquesAHtml(bloques, titulo = 'Informe de posibles incumplimientos') {
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
<hr><p style="font-size:8.5pt;color:#666">Informe generado con la herramienta gratuita «Dietas y jornada anual». ${esc(textoCopyright())} ${esc(TEXTO_LICENCIA)}</p>
</body></html>`
}
