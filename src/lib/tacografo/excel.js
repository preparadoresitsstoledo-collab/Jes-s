// Generación del libro Excel con el análisis de un conductor:
// resumen, propuesta de liquidación, años, meses, semanas, detalle diario,
// jornadas, incidencias, actividades y vehículos.

import ExcelJS from 'exceljs'
import { METODOS_HE, DATOS_EXPEDIENTE } from '../../data/tacografo.js'
import { heSegunMetodo, resumenInfracciones } from './analisis.js'
import { fechaES, fechaHoraLocal, diaSemana, sumarDias, MESES } from './tiempo.js'

const AZUL = 'FF1F3A5F'
const GRIS = 'FFF2F4F7'
const ROJO_SUAVE = 'FFFDE8E8'
const AMARILLO = 'FFFFF6D6'
const FMT_HORAS = '[h]:mm'
const FMT_DEC = '#,##0.00'
const FMT_EUR = '#,##0.00 "€"'

const ACTIVIDADES = {
  CONDUCCION: 'Conducción',
  TRABAJO: 'Otros trabajos',
  DISPONIBILIDAD: 'Disponibilidad',
  DESCANSO: 'Descanso / pausa',
  DESCONOCIDO: 'Desconocida (tarjeta no insertada)',
  SIN_DATOS: 'Sin registro en tarjeta',
}

// Minutos → fracción de día (formato de hora de Excel)
const t = (min) => (min == null ? null : min / 1440)
const h = (min) => Math.round((min / 60) * 100) / 100

function fechaExcel(fecha) {
  const [a, m, d] = fecha.split('-').map(Number)
  return new Date(Date.UTC(a, m - 1, d))
}

function cabecera(ws, fila, textos) {
  const r = ws.getRow(fila)
  textos.forEach((x, i) => {
    const c = r.getCell(i + 1)
    c.value = x
    c.font = { bold: true, color: { argb: 'FFFFFFFF' } }
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: AZUL } }
    c.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    c.border = { bottom: { style: 'thin', color: { argb: 'FF999999' } } }
  })
  r.height = 32
}

function tabla(ws, filaCabecera, columnas, filas) {
  cabecera(ws, filaCabecera, columnas.map((c) => c.titulo))
  columnas.forEach((c, i) => {
    ws.getColumn(i + 1).width = c.ancho || 12
  })
  filas.forEach((f, k) => {
    const r = ws.getRow(filaCabecera + 1 + k)
    columnas.forEach((c, i) => {
      const cell = r.getCell(i + 1)
      cell.value = c.valor(f)
      if (c.formato) cell.numFmt = c.formato
      if (c.ajustar) cell.alignment = { wrapText: true, vertical: 'top' }
    })
  })
  ws.views = [{ state: 'frozen', ySplit: filaCabecera }]
  if (filas.length) {
    ws.autoFilter = { from: { row: filaCabecera, column: 1 }, to: { row: filaCabecera + filas.length, column: columnas.length } }
  }
  return filaCabecera + filas.length
}

function titulo(ws, texto, subtitulo) {
  ws.getCell('A1').value = texto
  ws.getCell('A1').font = { bold: true, size: 14, color: { argb: AZUL } }
  if (subtitulo) {
    ws.getCell('A2').value = subtitulo
    ws.getCell('A2').font = { italic: true, color: { argb: 'FF555555' } }
  }
}

function filaTotales(ws, fila, desde, hasta, columnasSuma, etiqueta = 'TOTAL') {
  const r = ws.getRow(fila)
  r.getCell(1).value = etiqueta
  r.font = { bold: true }
  for (const [col, fmt] of columnasSuma) {
    const letra = ws.getColumn(col).letter
    const c = r.getCell(col)
    c.value = { formula: `SUM(${letra}${desde}:${letra}${hasta})` }
    c.numFmt = fmt
  }
  r.eachCell((c) => {
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: GRIS } }
  })
}

/**
 * @returns {Promise<ArrayBuffer>} contenido del .xlsx
 */
export async function generarExcel({ conductor, resultado: r, cfg: cfgEntrada, expediente = {}, periodoSolicitado = {} }) {
  const cfg = r.cfg || cfgEntrada
  const wb = new ExcelJS.Workbook()
  wb.creator = 'Analizador de tacógrafo'
  wb.created = new Date()
  const metodo = METODOS_HE.find((x) => x.id === cfg.metodoHE) || METODOS_HE[0]
  const periodo = `${fechaES(r.desde)} – ${fechaES(r.hasta)}`

  // ───────── Resumen ─────────
  const res = wb.addWorksheet('Resumen', { properties: { tabColor: { argb: AZUL } } })
  titulo(res, 'Análisis de tiempos de trabajo y descanso — tarjeta de conductor', 'Documento de trabajo orientativo. Debe contrastarse con el resto de pruebas del expediente.')
  res.getColumn(1).width = 44
  for (let c = 2; c <= 10; c++) res.getColumn(c).width = 16
  let f = 4
  const par = (etiqueta, valor, fmt) => {
    res.getCell(f, 1).value = etiqueta
    res.getCell(f, 1).font = { bold: true }
    const c = res.getCell(f, 2)
    c.value = valor
    if (fmt) c.numFmt = fmt
    f++
  }
  const seccion = (texto) => {
    f++
    res.getCell(f, 1).value = texto
    res.getCell(f, 1).font = { bold: true, size: 12, color: { argb: AZUL } }
    f++
  }
  seccion('Conductor')
  par('Apellidos y nombre', conductor.nombreCompleto)
  par('Fecha de nacimiento', fechaES(conductor.titular.fechaNacimiento))
  par('Nº de tarjeta de conductor', `${conductor.tarjeta.numero} (${conductor.tarjeta.pais})`)
  par('Autoridad expedidora', conductor.tarjeta.autoridad)
  par('Caducidad de la tarjeta', conductor.tarjeta.caducidad ? new Date(conductor.tarjeta.caducidad).toISOString().slice(0, 10).split('-').reverse().join('/') : '')
  par('Generación de la tarjeta', conductor.generacion === 2 ? '2.ª (tacógrafo inteligente)' : '1.ª')

  const exp = DATOS_EXPEDIENTE.filter((d) => expediente[d.id])
  if (exp.length) {
    seccion('Expediente')
    for (const d of exp) par(d.label, expediente[d.id])
  }

  seccion('Periodo y fuentes')
  par('Periodo analizado', periodo)
  par('Datos disponibles en las tarjetas', `${fechaES(r.primeraFecha)} – ${fechaES(r.ultimaFecha)}`)
  if (periodoSolicitado.desde || periodoSolicitado.hasta) {
    par('Periodo solicitado', `${fechaES(periodoSolicitado.desde) || '…'} – ${fechaES(periodoSolicitado.hasta) || '…'}`)
  }
  par('Días naturales del periodo', r.diasPeriodo)
  par('Días con actividad registrada', r.totales.diasActividad)
  par('Archivos analizados', conductor.archivos.length)
  par('Zona horaria del análisis', cfg.zonaHoraria)

  seccion('Totales por año (horas)')
  const colsAnio = [
    ['Año', (y) => +y.anio],
    ['Días', (y) => y.dias],
    ['Conducción', (y) => t(y.conduccion), FMT_HORAS],
    ['Otros trabajos', (y) => t(y.trabajo), FMT_HORAS],
    ['Trabajo efectivo', (y) => t(y.trabajoEfectivo), FMT_HORAS],
    ['Disponibilidad (presencia)', (y) => t(y.presencia), FMT_HORAS],
    ['Jornada ordinaria convenio', (y) => t(y.jornadaOrdinaria), FMT_HORAS],
    [`HE método ${metodo.nombre.toLowerCase()}`, (y) => t(heSegunMetodo(y, cfg.metodoHE)), FMT_HORAS],
    ['Exceso presencia (> 20 h/sem)', (y) => t(y.excesoPresencia), FMT_HORAS],
  ]
  cabecera(res, f, colsAnio.map((c) => c[0]))
  f++
  const fIniAnios = f
  for (const y of r.anios) {
    colsAnio.forEach(([, v, fmt], i) => {
      const c = res.getCell(f, i + 1)
      c.value = v(y)
      if (fmt) c.numFmt = fmt
    })
    f++
  }
  filaTotales(res, f, fIniAnios, f - 1, colsAnio.map((c, i) => [i + 1, c[2]]).filter(([i, fmt]) => i > 1 && fmt))
  res.getCell(f, 2).value = { formula: `SUM(B${fIniAnios}:B${f - 1})` }
  f++

  seccion('Horas extraordinarias según cada método de cómputo (h:mm)')
  cabecera(res, f, ['Método', ...r.anios.map((y) => y.anio), 'Total'])
  f++
  for (const mt of METODOS_HE) {
    res.getCell(f, 1).value = `${mt.nombre}${mt.id === cfg.metodoHE ? '  ◄ usado en el acta' : ''}`
    if (mt.id === cfg.metodoHE) res.getRow(f).font = { bold: true }
    r.anios.forEach((y, i) => {
      res.getCell(f, i + 2).value = t(heSegunMetodo(y, mt.id))
      res.getCell(f, i + 2).numFmt = FMT_HORAS
    })
    const tot = res.getCell(f, r.anios.length + 2)
    tot.value = t(heSegunMetodo(r.totales, mt.id))
    tot.numFmt = FMT_HORAS
    f++
  }

  seccion('Incidencias detectadas')
  const resumen = resumenInfracciones(r.infracciones)
  cabecera(res, f, ['Norma', 'Artículo', 'Nº', 'Carácter', 'Ejemplo'])
  f++
  if (!resumen.length) {
    res.getCell(f, 1).value = 'No se han detectado incidencias con los parámetros utilizados.'
    f++
  }
  for (const x of resumen) {
    res.getCell(f, 1).value = x.norma
    res.getCell(f, 2).value = x.articulo
    res.getCell(f, 3).value = x.numero
    res.getCell(f, 4).value = x.informativa ? 'Informativa' : 'Posible incumplimiento'
    res.getCell(f, 5).value = x.ejemplo
    f++
  }

  seccion('Criterios aplicados')
  const criterios = [
    `Trabajo efectivo = conducción + otros trabajos. La disponibilidad se computa como tiempo de presencia (RD 1561/1995, art. 8) y no como hora extraordinaria.`,
    `Jornada anual del convenio: ${cfg.jornadaAnual} h, prorrateada por días naturales. Jornada semanal: ${cfg.jornadaSemanal} h. Máximo diario ordinario: ${cfg.jornadaDiariaMax} h.`,
    `Método de horas extraordinarias para el acta: ${metodo.nombre}. ${metodo.detalle}`,
    `Periodos con la tarjeta no insertada sin actividad introducida: ${cfg.desconocidoComoDescanso ? 'se consideran descanso' : 'no se consideran descanso'}. Días sin registro: ${cfg.sinDatosComoDescanso ? 'se consideran descanso' : 'no se consideran descanso'}.`,
    `Trabajo nocturno: de ${cfg.nocturnoInicio} a ${cfg.nocturnoFin} (hora local). Las horas del tacógrafo (UTC) se convierten a la hora oficial de ${cfg.zonaHoraria}.`,
    'Descanso diario: periodos de 24 h desde el final del descanso anterior (art. 8.2 R. 561/2006). Se admite la fracción 3 h + 9 h. Los descansos de 24 h o más se tratan como semanales.',
    'Las infracciones del Reglamento (CE) 561/2006 corresponden a la Inspección de Transporte (arts. 140 a 142 LOTT). Las de jornada, descansos y horas extraordinarias del ET y del RD 1561/1995 pueden tipificarse en el art. 7.5 LISOS.',
    'Los resultados dependen de la integridad de las descargas aportadas. Los periodos sin datos y las entradas manuales deben verificarse con otras pruebas (discos, registros de jornada, nóminas, albaranes, etc.).',
  ]
  for (const c of criterios) {
    res.mergeCells(f, 1, f, 9)
    const cell = res.getCell(f, 1)
    cell.value = `• ${c}`
    cell.alignment = { wrapText: true, vertical: 'top' }
    res.getRow(f).height = 30
    f++
  }

  // ───────── Acta de liquidación ─────────
  const acta = wb.addWorksheet('Liquidación HE', { properties: { tabColor: { argb: 'FFB45309' } } })
  titulo(acta, 'Horas extraordinarias acreditadas por el tacógrafo — base para el acta de liquidación', `Trabajador: ${conductor.nombreCompleto}${expediente.trabajadorNif ? ' · ' + expediente.trabajadorNif : ''}${expediente.empresa ? ' · Empresa: ' + expediente.empresa : ''}${expediente.ccc ? ' · CCC ' + expediente.ccc : ''}`)
  acta.getCell('A3').value = `Periodo: ${periodo} · Método: ${metodo.nombre}. Los precios y el tipo de cotización son editables: los importes se recalculan solos.`
  acta.getCell('A3').font = { color: { argb: 'FF555555' } }
  acta.getCell('A5').value = 'Tipo de cotización aplicable (%)'
  acta.getCell('A5').font = { bold: true }
  acta.getCell('C5').value = cfg.tipoCotizacion || 0
  acta.getCell('C5').numFmt = '0.00'
  acta.getCell('C5').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: AMARILLO } }
  acta.getCell('D5').value = 'Introduzca el tipo vigente en cada periodo (horas extraordinarias / MEI) si desea calcular la cuota.'
  acta.getCell('D5').font = { italic: true, color: { argb: 'FF777777' } }

  const filaCab = 7
  const columnasActa = [
    { titulo: 'Mes', ancho: 16, valor: (x) => `${MESES[+x.mes.slice(5, 7) - 1]} ${x.mes.slice(0, 4)}` },
    { titulo: 'Año', ancho: 8, valor: (x) => +x.mes.slice(0, 4) },
    { titulo: 'Días del periodo', ancho: 10, valor: (x) => x.dias },
    { titulo: 'Días con actividad', ancho: 10, valor: (x) => x.diasActividad },
    { titulo: 'Trabajo efectivo (h)', ancho: 13, valor: (x) => h(x.trabajoEfectivo), formato: FMT_DEC },
    { titulo: 'Jornada ordinaria (h)', ancho: 13, valor: (x) => h(x.jornadaOrdinaria), formato: FMT_DEC },
    { titulo: 'Horas extraordinarias (h)', ancho: 14, valor: (x) => h(heSegunMetodo(x, cfg.metodoHE)), formato: FMT_DEC },
    { titulo: 'Precio hora extra (€/h)', ancho: 13, valor: (x) => Number(cfg.preciosHE?.[x.mes.slice(0, 4)]) || 0, formato: FMT_EUR },
    { titulo: 'Importe HE (€)', ancho: 14, valor: () => null, formato: FMT_EUR },
    { titulo: 'Cuota (€)', ancho: 13, valor: () => null, formato: FMT_EUR },
    { titulo: 'Exceso presencia (h)', ancho: 12, valor: (x) => h(x.excesoPresencia), formato: FMT_DEC },
  ]
  const ultimaFila = tabla(acta, filaCab, columnasActa, r.meses)
  for (let k = filaCab + 1; k <= ultimaFila; k++) {
    acta.getCell(k, 9).value = { formula: `ROUND(G${k}*H${k},2)` }
    acta.getCell(k, 10).value = { formula: `ROUND(I${k}*$C$5/100,2)` }
    acta.getCell(k, 8).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: AMARILLO } }
  }
  acta.views = [{ state: 'frozen', ySplit: filaCab }]
  filaTotales(acta, ultimaFila + 1, filaCab + 1, ultimaFila, [[5, FMT_DEC], [6, FMT_DEC], [7, FMT_DEC], [9, FMT_EUR], [10, FMT_EUR], [11, FMT_DEC]])
  let fa = ultimaFila + 3
  acta.getCell(fa, 1).value = 'Resumen por año'
  acta.getCell(fa, 1).font = { bold: true, color: { argb: AZUL } }
  fa++
  cabecera(acta, fa, ['Año', '', '', '', 'Trabajo efectivo (h)', 'Jornada ordinaria (h)', 'Horas extraordinarias (h)', '', 'Importe HE (€)', 'Cuota (€)', 'Exceso presencia (h)'])
  fa++
  const rango = (col) => `${col}$${filaCab + 1}:${col}$${ultimaFila}`
  for (const y of r.anios) {
    acta.getCell(fa, 1).value = +y.anio
    for (const [col, fmt] of [['E', FMT_DEC], ['F', FMT_DEC], ['G', FMT_DEC], ['I', FMT_EUR], ['J', FMT_EUR], ['K', FMT_DEC]]) {
      const c = acta.getCell(`${col}${fa}`)
      c.value = { formula: `SUMIF(${rango('B')},A${fa},${rango(col)})` }
      c.numFmt = fmt
    }
    if (h(heSegunMetodo(y, cfg.metodoHE)) > (cfg.limiteHEAnual * y.dias) / 365) {
      acta.getCell(`L${fa}`).value = `Supera el límite de ${cfg.limiteHEAnual} h/año (art. 35.2 ET)`
      acta.getCell(`L${fa}`).font = { color: { argb: 'FFB91C1C' }, bold: true }
    }
    fa++
  }
  acta.getColumn(12).width = 40
  if (!Object.values(cfg.preciosHE || {}).some((v) => Number(v) > 0)) {
    fa++
    acta.getCell(fa, 1).value = '⚠ No se han indicado precios de la hora extraordinaria: complete la columna H con los importes del convenio de cada año.'
    acta.getCell(fa, 1).font = { bold: true, color: { argb: 'FFB45309' } }
  }

  // ───────── Años ─────────
  const wa = wb.addWorksheet('Años')
  const colsTiempo = (extra = []) => [
    { titulo: 'Conducción', valor: (x) => t(x.conduccion), formato: FMT_HORAS },
    { titulo: 'Otros trabajos', valor: (x) => t(x.trabajo), formato: FMT_HORAS },
    { titulo: 'Disponibilidad', valor: (x) => t(x.disponibilidad), formato: FMT_HORAS },
    { titulo: 'Trabajo efectivo', valor: (x) => t(x.trabajoEfectivo), formato: FMT_HORAS },
    ...extra,
  ]
  tabla(wa, 1, [
    { titulo: 'Año', ancho: 8, valor: (x) => +x.anio },
    { titulo: 'Días', ancho: 7, valor: (x) => x.dias },
    { titulo: 'Días con actividad', ancho: 10, valor: (x) => x.diasActividad },
    ...colsTiempo(),
    { titulo: 'Jornada ordinaria', valor: (x) => t(x.jornadaOrdinaria), formato: FMT_HORAS },
    { titulo: 'HE anual', valor: (x) => t(x.heAnual), formato: FMT_HORAS },
    { titulo: 'HE mensual', valor: (x) => t(x.heMensual), formato: FMT_HORAS },
    { titulo: 'HE semanal', valor: (x) => t(x.heSemanal), formato: FMT_HORAS },
    { titulo: 'HE diaria', valor: (x) => t(x.heDiaria), formato: FMT_HORAS },
    { titulo: 'Exceso presencia', valor: (x) => t(x.excesoPresencia), formato: FMT_HORAS },
    { titulo: 'Trabajo nocturno', valor: (x) => t(x.nocturno), formato: FMT_HORAS },
    { titulo: 'Km', valor: (x) => x.km },
  ], r.anios)

  // ───────── Meses ─────────
  const wm = wb.addWorksheet('Meses')
  tabla(wm, 1, [
    { titulo: 'Mes', ancho: 9, valor: (x) => x.mes },
    { titulo: 'Días', ancho: 7, valor: (x) => x.dias },
    { titulo: 'Días con actividad', ancho: 10, valor: (x) => x.diasActividad },
    ...colsTiempo(),
    { titulo: 'Jornada ordinaria', valor: (x) => t(x.jornadaOrdinaria), formato: FMT_HORAS },
    { titulo: 'HE mensual', valor: (x) => t(x.heMensual), formato: FMT_HORAS },
    { titulo: 'HE anual (reparto)', valor: (x) => t(x.heAnual), formato: FMT_HORAS },
    { titulo: 'HE semanal', valor: (x) => t(x.heSemanal), formato: FMT_HORAS },
    { titulo: 'HE diaria', valor: (x) => t(x.heDiaria), formato: FMT_HORAS },
    { titulo: 'Presencia máx. (20 h/sem)', valor: (x) => t(x.presenciaMaxima), formato: FMT_HORAS },
    { titulo: 'Exceso presencia', valor: (x) => t(x.excesoPresencia), formato: FMT_HORAS },
    { titulo: 'Trabajo nocturno', valor: (x) => t(x.nocturno), formato: FMT_HORAS },
    { titulo: 'Km', valor: (x) => x.km },
  ], r.meses)

  // ───────── Cuatrimestres ─────────
  const wc = wb.addWorksheet('Cuatrimestres')
  tabla(wc, 1, [
    { titulo: 'Periodo', ancho: 18, valor: (x) => x.periodo },
    { titulo: 'Días', valor: (x) => x.dias },
    { titulo: 'Trabajo efectivo', valor: (x) => t(x.trabajoEfectivo), formato: FMT_HORAS },
    { titulo: 'Promedio semanal', valor: (x) => t(x.promedioSemanal), formato: FMT_HORAS },
    { titulo: '¿Supera 48 h? (art. 10 bis.1 RD 1561/1995)', ancho: 22, valor: (x) => (x.promedioSemanal > 48 * 60 ? 'SÍ' : 'No') },
  ], r.cuatrimestres)

  // ───────── Semanas ─────────
  const ws = wb.addWorksheet('Semanas')
  tabla(ws, 1, [
    { titulo: 'Semana (lunes)', ancho: 12, valor: (x) => fechaExcel(x.lunes), formato: 'dd/mm/yyyy' },
    { titulo: 'Domingo', ancho: 12, valor: (x) => fechaExcel(sumarDias(x.lunes, 6)), formato: 'dd/mm/yyyy' },
    { titulo: 'Días en periodo', ancho: 9, valor: (x) => x.dias },
    { titulo: 'Días con actividad', ancho: 9, valor: (x) => x.diasActividad },
    ...colsTiempo(),
    { titulo: 'Jornada ordinaria', valor: (x) => t(x.jornadaOrdinaria), formato: FMT_HORAS },
    { titulo: 'HE semanal', valor: (x) => t(x.heSemanal), formato: FMT_HORAS },
    { titulo: 'Conducción > 56 h', valor: (x) => (x.conduccion > 56 * 60 ? 'SÍ' : '') },
    { titulo: 'Bisemanal > 90 h', valor: (x) => (x.excesoBisemanal ? 'SÍ' : '') },
    { titulo: 'Trabajo > 60 h', valor: (x) => (x.trabajoEfectivo > 60 * 60 ? 'SÍ' : '') },
    { titulo: 'Descanso semanal iniciado', ancho: 30, valor: (x) => x.descansoSemanal },
  ], r.semanas)

  // ───────── Detalle diario ─────────
  const wd = wb.addWorksheet('Detalle diario')
  tabla(wd, 1, [
    { titulo: 'Fecha', ancho: 11, valor: (x) => fechaExcel(x.fecha), formato: 'dd/mm/yyyy' },
    { titulo: 'Día', ancho: 10, valor: (x) => diaSemana(x.fecha) },
    { titulo: 'Inicio', ancho: 7, valor: (x) => x.inicio },
    { titulo: 'Fin', ancho: 7, valor: (x) => x.fin },
    { titulo: 'Amplitud', ancho: 9, valor: (x) => t(x.amplitud), formato: FMT_HORAS },
    { titulo: 'Conducción', ancho: 10, valor: (x) => t(x.conduccion), formato: FMT_HORAS },
    { titulo: 'Otros trabajos', ancho: 10, valor: (x) => t(x.trabajo), formato: FMT_HORAS },
    { titulo: 'Disponibilidad', ancho: 11, valor: (x) => t(x.disponibilidad), formato: FMT_HORAS },
    { titulo: 'Descanso', ancho: 10, valor: (x) => t(x.descanso), formato: FMT_HORAS },
    { titulo: 'Desconocido', ancho: 10, valor: (x) => t(x.desconocido), formato: FMT_HORAS },
    { titulo: 'Sin registro', ancho: 10, valor: (x) => t(x.sinDatos), formato: FMT_HORAS },
    { titulo: 'Trabajo efectivo', ancho: 10, valor: (x) => t(x.trabajoEfectivo), formato: FMT_HORAS },
    { titulo: 'Exceso s/ máx. diario', ancho: 10, valor: (x) => t(x.heDiaria), formato: FMT_HORAS },
    { titulo: 'Trabajo nocturno', ancho: 10, valor: (x) => t(x.nocturno), formato: FMT_HORAS },
    { titulo: 'Entradas manuales', ancho: 10, valor: (x) => t(x.manual), formato: FMT_HORAS },
    { titulo: 'Km', ancho: 7, valor: (x) => x.km || null },
    { titulo: 'Vehículos', ancho: 16, valor: (x) => x.vehiculos },
    { titulo: 'Incidencias', ancho: 80, valor: (x) => x.incidencias.join('\n'), ajustar: true },
  ], r.dias)
  r.dias.forEach((d, k) => {
    const fila = wd.getRow(k + 2)
    if (d.incidencias.length) fila.getCell(18).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: ROJO_SUAVE } }
    if (!d.conActividad) fila.font = { color: { argb: 'FF999999' } }
    if (d.heDiaria > 0) fila.getCell(13).font = { bold: true, color: { argb: 'FFB91C1C' } }
  })
  filaTotales(wd, r.dias.length + 2, 2, r.dias.length + 1, [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((c) => [c, FMT_HORAS]).concat([[16, '0']]))

  // ───────── Jornadas (R. 561/2006) ─────────
  const wj = wb.addWorksheet('Jornadas')
  tabla(wj, 1, [
    { titulo: 'Inicio jornada', ancho: 16, valor: (x) => x.inicio },
    { titulo: 'Fin jornada', ancho: 16, valor: (x) => x.fin },
    { titulo: 'Amplitud', ancho: 9, valor: (x) => t(x.amplitud), formato: FMT_HORAS },
    { titulo: 'Conducción', ancho: 10, valor: (x) => t(x.conduccion), formato: FMT_HORAS },
    { titulo: 'Otros trabajos', ancho: 10, valor: (x) => t(x.trabajo), formato: FMT_HORAS },
    { titulo: 'Disponibilidad', ancho: 11, valor: (x) => t(x.disponibilidad), formato: FMT_HORAS },
    { titulo: 'Pausas', ancho: 9, valor: (x) => t(x.pausas), formato: FMT_HORAS },
    { titulo: 'Trabajo total', ancho: 10, valor: (x) => t(x.trabajoTotal), formato: FMT_HORAS },
    { titulo: 'Máx. conducción continuada', ancho: 12, valor: (x) => t(x.maxConduccionContinua), formato: FMT_HORAS },
    { titulo: 'Trabajo nocturno', ancho: 10, valor: (x) => t(x.nocturno), formato: FMT_HORAS },
    { titulo: 'Inicio descanso', ancho: 16, valor: (x) => x.descansoInicio },
    { titulo: 'Duración descanso', ancho: 10, valor: (x) => t(x.descansoDuracion), formato: FMT_HORAS },
    { titulo: 'Tipo de descanso', ancho: 22, valor: (x) => x.descansoTipo },
    { titulo: 'Compensación (desc. semanal reducido)', ancho: 26, valor: (x) => (x.compensacion ? `${Math.round(x.compensacion.horas / 6) / 10} h antes del ${fechaES(x.compensacion.limite)}: ${x.compensacion.acreditada ? 'acreditada' : 'NO acreditada'}` : '') },
    { titulo: 'Incidencias', ancho: 60, valor: (x) => x.incidencias.join('\n'), ajustar: true },
  ], r.jornadas)
  r.jornadas.forEach((j, k) => {
    if (j.incidencias.length) wj.getRow(k + 2).getCell(15).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: ROJO_SUAVE } }
  })

  // ───────── Incidencias ─────────
  const wi = wb.addWorksheet('Incidencias', { properties: { tabColor: { argb: 'FFB91C1C' } } })
  tabla(wi, 1, [
    { titulo: 'Fecha', ancho: 11, valor: (x) => fechaExcel(x.fecha), formato: 'dd/mm/yyyy' },
    { titulo: 'Norma', ancho: 26, valor: (x) => x.norma },
    { titulo: 'Artículo', ancho: 13, valor: (x) => x.articulo },
    { titulo: 'Descripción', ancho: 80, valor: (x) => x.descripcion, ajustar: true },
    { titulo: 'Valor', ancho: 10, valor: (x) => t(x.valor), formato: FMT_HORAS },
    { titulo: 'Límite', ancho: 10, valor: (x) => t(x.limite), formato: FMT_HORAS },
    { titulo: 'Diferencia', ancho: 10, valor: (x) => t(x.exceso), formato: FMT_HORAS },
    { titulo: 'Carácter', ancho: 14, valor: (x) => (x.informativa ? 'Informativa' : 'Posible incumplimiento') },
  ], r.infracciones)

  // ───────── Actividades ─────────
  const wt = wb.addWorksheet('Actividades')
  tabla(wt, 1, [
    { titulo: 'Inicio', ancho: 17, valor: (x) => x.inicio },
    { titulo: 'Fin', ancho: 17, valor: (x) => x.fin },
    { titulo: 'Duración', ancho: 10, valor: (x) => t(x.duracion), formato: FMT_HORAS },
    { titulo: 'Actividad', ancho: 32, valor: (x) => ACTIVIDADES[x.actividad] || x.actividad },
    { titulo: 'Entrada manual', ancho: 10, valor: (x) => (x.manual ? 'Sí' : '') },
  ], r.actividades)

  // ───────── Vehículos y archivos ─────────
  const wv = wb.addWorksheet('Vehículos y archivos')
  const fmtFH = (ms) => (ms ? fechaHoraLocal(ms, cfg.zonaHoraria) : '')
  let fv = tabla(wv, 1, [
    { titulo: 'Matrícula', ancho: 14, valor: (x) => x.matricula },
    { titulo: 'País', ancho: 6, valor: (x) => x.pais },
    { titulo: 'Primer uso', ancho: 20, valor: (x) => fmtFH(x.primerUso) },
    { titulo: 'Último uso', ancho: 20, valor: (x) => fmtFH(x.ultimoUso) },
    { titulo: 'Km inicio', ancho: 10, valor: (x) => x.kmInicio },
    { titulo: 'Km fin', ancho: 10, valor: (x) => x.kmFin },
    { titulo: 'Km recorridos', ancho: 10, valor: (x) => (x.kmFin >= x.kmInicio ? x.kmFin - x.kmInicio : null) },
    { titulo: 'VIN', ancho: 20, valor: (x) => x.vin },
  ], conductor.vehiculos)
  fv += 2
  wv.getCell(fv, 1).value = 'Archivos analizados'
  wv.getCell(fv, 1).font = { bold: true, color: { argb: AZUL } }
  fv++
  cabecera(wv, fv, ['Archivo', 'Generación', 'Primer día', 'Último día', 'Días', 'Avisos'])
  for (const l of conductor.lecturas) {
    fv++
    const fila = [l.nombre, l.generacion, fechaES(l.dias[0]?.fecha), fechaES(l.dias[l.dias.length - 1]?.fecha), l.dias.length, l.avisos.join('; ')]
    fila.forEach((v, i) => (wv.getCell(fv, i + 1).value = v))
  }

  return wb.xlsx.writeBuffer()
}
