// Libro Excel de «Dietas y jornada anual»: cuadrante (con fórmulas editables),
// análisis de importes de las dietas, líneas de nómina y parámetros.

import ExcelJS from 'exceljs'
import { TIPOS_DIETA, DATOS_EXPEDIENTE, CRITERIOS_DIAS, PRORRATEOS, CONCEPTOS_COTIZACION, DIETAS_SALARIO } from '../../data/dietasJornada.js'
import { normalizarConfig, valoracion, tiposDelAnio, basesMensuales } from './calculo.js'
import { fechaES } from '../tacografo/tiempo.js'
import { AUTOR, TEXTO_LICENCIA, textoCopyright } from '../../data/autoria.js'

const AZUL = 'FF1F3A5F'
const GRIS = 'FFF2F4F7'
const ROJO_SUAVE = 'FFFDE8E8'
const FMT_EUR = '#,##0.00 "€"'
const FMT_DEC = '#,##0.##'

function cabecera(ws, fila, textos) {
  const r = ws.getRow(fila)
  textos.forEach((x, i) => {
    const c = r.getCell(i + 1)
    c.value = x
    c.font = { bold: true, color: { argb: 'FFFFFFFF' } }
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: AZUL } }
    c.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
  })
  r.height = 32
}

function totales(ws, fila, columnas, euros) {
  if (fila <= 2) return
  const r = ws.getRow(fila)
  r.getCell(1).value = 'TOTAL'
  for (const c of columnas) {
    const col = String.fromCharCode(64 + c)
    r.getCell(c).value = { formula: `SUM(${col}2:${col}${fila - 1})` }
    r.getCell(c).numFmt = euros.includes(c) ? FMT_EUR : FMT_DEC
  }
  r.font = { bold: true }
  r.eachCell((c) => (c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: GRIS } }))
}

const BORDE = { style: 'thin', color: { argb: 'FF9AA5B1' } }
const BORDES = { top: BORDE, left: BORDE, bottom: BORDE, right: BORDE }

function hojaBases(wb, resumen, cfg, expediente) {
  const ws = wb.addWorksheet('Bases de cotización', { views: [{ state: 'frozen', ySplit: 4 }] })
  const anchos = [15, 16, 30, 7, 7, 6, 10, 10, 10, 8, 8, 8, 7, 12, 12, 10, 10, 12, 12, 10, 10, 12, 12, 10, 10]
  ws.columns = anchos.map((width) => ({ width }))
  const titulo = (rango, texto, color) => {
    ws.mergeCells(rango)
    const c = ws.getCell(rango.split(':')[0])
    c.value = texto
    c.font = { bold: true, color: color ? { argb: 'FFFFFFFF' } : undefined }
    c.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    if (color) c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: color } }
    c.border = BORDES
  }
  const valor = (rango, texto) => {
    ws.mergeCells(rango)
    const c = ws.getCell(rango.split(':')[0])
    c.value = texto || ''
    c.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true }
    c.border = BORDES
  }
  // Cabecera
  titulo('A1:B1', 'NOMBRE DE EMPRESA')
  valor('C1:I1', expediente.empresa)
  titulo('J1:M1', 'NÚMERO DE CCC')
  valor('N1:Y1', expediente.ccc)
  titulo('A2:B2', 'Nº DE REFERENCIA')
  valor('C2:D2', expediente.referencia)
  titulo('E2:G2', 'FECHA')
  valor('H2:M2', `${fechaES(cfg.desde)}-${fechaES(cfg.hasta)}`)
  titulo('N2:Q2', 'COTIZÓ', 'FF4B5563')
  titulo('R2:U2', 'DIFERENCIAS DE COTIZACIÓN', 'FFB45309')
  titulo('V2:Y2', 'BASES RESULTANTES', AZUL)
  ws.getRow(1).height = 18
  ws.getRow(2).height = 40
  ws.mergeCells('A3:Y3')
  cabecera(ws, 4, [
    'NAF', 'Número Identificativo', 'Trabajador', 'CTO', 'CTP', 'GR', 'EPI / CNAE', 'Ocupación', 'Periodo',
    'Días desde', 'Días hasta', 'Total Días', 'TRL',
    'C_COM', 'AT EP', 'HEFM', 'HER',
    'C_COM', 'AT EP', 'HEFM', 'HER',
    'C_COM', 'AT EP', 'HEFM', 'HER',
  ])
  ws.getRow(4).height = 36

  let fila = 5
  for (const l of basesMensuales(resumen, cfg)) {
    const r = ws.getRow(fila)
    const texto = [
      l.trabajador.naf || '', l.trabajador.dni || '', l.trabajador.nombre || '', l.cto, l.ctp, l.gr, l.cnae, l.ocupacion,
      `${l.mes.slice(5, 7)}/${l.mes.slice(0, 4)}`, String(l.desde).padStart(2, '0'), String(l.hasta).padStart(2, '0'), String(l.dias), l.trl,
    ]
    texto.forEach((v, i) => {
      const c = r.getCell(i + 1)
      c.value = v ?? ''
      c.numFmt = '@'
    })
    const cot = [l.ccom, l.atep, l.hefm, l.her]
    const dif = [l.dif.ccom, l.dif.atep, l.dif.hefm, l.dif.her]
    cot.forEach((v, i) => (r.getCell(14 + i).value = v))
    dif.forEach((v, i) => (r.getCell(18 + i).value = v))
    for (let i = 0; i < 4; i++) {
      const cc = String.fromCharCode(78 + i) // N..Q
      const cd = String.fromCharCode(82 + i) // R..U
      r.getCell(22 + i).value = { formula: `N(${cc}${fila})+N(${cd}${fila})`, result: Math.round(((cot[i] || 0) + dif[i]) * 100) / 100 }
    }
    for (let c = 14; c <= 25; c++) r.getCell(c).numFmt = '#,##0.00'
    for (let c = 1; c <= 25; c++) r.getCell(c).border = BORDES
    if (dif.some((x) => x > 0)) for (let c = 18; c <= 21; c++) r.getCell(c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: ROJO_SUAVE } }
    fila++
  }
  if (fila > 5) {
    const r = ws.getRow(fila)
    r.getCell(1).value = 'TOTAL'
    for (let c = 14; c <= 25; c++) {
      const col = String.fromCharCode(64 + c)
      r.getCell(c).value = { formula: `SUM(${col}5:${col}${fila - 1})` }
      r.getCell(c).numFmt = '#,##0.00'
    }
    r.font = { bold: true }
    r.eachCell((c) => {
      c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: GRIS } }
      c.border = BORDES
    })
  }
  const nota = ws.getCell(`A${fila + 2}`)
  nota.value =
    'COTIZÓ: bases declaradas (relación nominal de trabajadores), si se han cargado; en blanco, para completarlas. DIFERENCIAS: horas extraordinarias en AT EP y HER; exceso de presencia y dietas a cotizar en C_COM y AT EP. Reparto mensual en proporción a los días cotizados de cada mes. Orientativo: revise los importes antes de usarlos.'
  nota.font = { italic: true, size: 9, color: { argb: 'FF555555' } }
  ws.mergeCells(`A${fila + 2}:Y${fila + 3}`)
  nota.alignment = { wrapText: true, vertical: 'top' }
}

const nombreTipo = (id) => TIPOS_DIETA.find((t) => t.id === id)?.nombre || id

export async function generarExcel({ resumen, cfg: cfgEntrada, expediente = {}, incluirBases = false }) {
  const cfg = normalizarConfig(cfgEntrada)
  const wb = new ExcelJS.Workbook()
  wb.creator = AUTOR
  wb.lastModifiedBy = AUTOR
  wb.company = AUTOR
  wb.title = 'Dietas y jornada anual'
  wb.description = `Dietas y jornada anual. ${textoCopyright()} ${TEXTO_LICENCIA}`
  wb.created = new Date()

  // ── Parámetros ──
  const wp = wb.addWorksheet('Parámetros')
  wp.columns = [{ width: 42 }, { width: 60 }]
  const param = [
    ...DATOS_EXPEDIENTE.map((d) => [d.label, expediente[d.id] || '']),
    ['Periodo examinado', `${fechaES(cfg.desde)} – ${fechaES(cfg.hasta)}`],
    ['Jornada máxima anual (horas)', cfg.jornadaAnual],
    ['Jornada diaria (horas)', cfg.jornadaDiaria],
    ['Días hábiles teóricos por año', cfg.jornadaAnual / cfg.jornadaDiaria],
    ['Vacaciones anuales (días naturales)', cfg.vacacionesAnuales],
    ['Límite anual de horas extraordinarias', cfg.limiteHEAnual],
    ['Prorrateo de periodos inferiores al año', PRORRATEOS.find((p) => p.id === cfg.prorrateo)?.nombre],
    ['Criterio de días trabajados', CRITERIOS_DIAS.find((p) => p.id === cfg.criterioDias)?.nombre],
  ]
  param.forEach(([a, b], i) => {
    const r = wp.getRow(i + 1)
    r.getCell(1).value = a
    r.getCell(1).font = { bold: true }
    r.getCell(2).value = b
  })
  const filaJornadaDiaria = DATOS_EXPEDIENTE.length + 3 // celda B con la jornada diaria

  // ── Cuadrante por días (dietas / tacógrafo) ──
  const wc = wb.addWorksheet('Cuadrante por días', { views: [{ state: 'frozen', ySplit: 1 }] })
  wc.columns = [
    { width: 32 }, { width: 8 }, { width: 12 }, { width: 12 }, { width: 9 }, { width: 12 }, { width: 11 }, { width: 11 },
    { width: 12 }, { width: 11 }, { width: 11 }, { width: 12 }, { width: 12 }, { width: 13 }, { width: 13 },
  ]
  cabecera(wc, 1, [
    'Trabajador', 'Año', 'Desde', 'Hasta', 'Días IT', 'Días hábiles teóricos', 'Días con dieta', 'Días tacógrafo',
    'Días trabajados', 'Exceso días', 'Exceso horas', 'Vacaciones disfrutadas', 'Vacaciones debidas',
    'Días con actividad en vacaciones', 'Importe HE',
  ])
  let fila = 2
  for (const d of resumen.datos) {
    for (const f of d.cuadrante.filas) {
      const r = wc.getRow(fila)
      r.values = [
        d.trabajador.nombre || '',
        +f.anio,
        new Date(f.desde + 'T00:00:00Z'),
        new Date(f.hasta + 'T00:00:00Z'),
        f.diasSuspension,
        f.diasTeoricos,
        f.diasDieta,
        f.diasTacografo,
        f.diasTrabajados,
        null,
        null,
        f.vacaciones,
        f.vacacionesDebidas,
        f.diasEnVacaciones,
        null,
      ]
      r.getCell(10).value = { formula: `IF(I${fila}="","",MAX(0,I${fila}-F${fila}))`, result: f.excesoDias ?? '' }
      r.getCell(11).value = { formula: `IF(J${fila}="","",J${fila}*'Parámetros'!B${filaJornadaDiaria})`, result: f.excesoHoras ?? '' }
      r.getCell(15).value = f.precioHE ? { formula: `IF(K${fila}="","",K${fila}*${f.precioHE})`, result: f.importeHE ?? 0 } : null
      r.getCell(3).numFmt = 'dd/mm/yyyy'
      r.getCell(4).numFmt = 'dd/mm/yyyy'
      for (const c of [6, 10, 11]) r.getCell(c).numFmt = FMT_DEC
      r.getCell(15).numFmt = FMT_EUR
      if (f.excesoDias > 0) for (const c of [10, 11]) r.getCell(c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: ROJO_SUAVE } }
      if (f.deficitVacaciones > 0) r.getCell(12).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: ROJO_SUAVE } }
      fila++
    }
  }
  totales(wc, fila, [5, 6, 7, 8, 9, 10, 11, 14, 15], [15])

  // ── Cómputo horario (tiempo registrado frente a la jornada exigible del tramo) ──
  const wh = wb.addWorksheet('Cómputo horario', { views: [{ state: 'frozen', ySplit: 1 }] })
  wh.columns = [
    { width: 32 }, { width: 8 }, { width: 22 }, { width: 11 }, { width: 12 }, { width: 13 },
    { width: 14 }, { width: 13 }, { width: 13 }, { width: 14 }, { width: 14 },
  ]
  cabecera(wh, 1, [
    'Trabajador', 'Año', 'Tramo', 'Días de suspensión', 'Días computables', 'Jornada exigible (h)',
    'Trabajo efectivo registrado (h)', 'Presencia registrada (h)', 'Exceso total (h)',
    'de ello: horas extraordinarias', 'de ello: exceso de presencia',
  ])
  const filaJornadaAnual = filaJornadaDiaria - 1
  fila = 2
  for (const d of resumen.datos) {
    for (const f of d.cuadrante.filas.filter((x) => x.excesoHE !== null)) {
      const r = wh.getRow(fila)
      r.values = [
        d.trabajador.nombre || '',
        +f.anio,
        `${fechaES(f.desde)} – ${fechaES(f.hasta)}`,
        f.diasSuspension,
        f.diasComputables,
        null,
        f.horasEfectivas,
        f.horasPresencia,
        null,
        null,
        null,
      ]
      // Jornada exigible = jornada anual × días computables / días naturales del año
      r.getCell(6).value = {
        formula: `'Parámetros'!B${filaJornadaAnual}*E${fila}/(DATE(B${fila}+1,1,1)-DATE(B${fila},1,1))`,
        result: f.jornadaProporcional,
      }
      r.getCell(9).value = { formula: `MAX(0,N(G${fila})+N(H${fila})-F${fila})`, result: f.excesoTotal ?? 0 }
      r.getCell(10).value = { formula: `MAX(0,N(G${fila})-F${fila})`, result: f.excesoHE ?? 0 }
      r.getCell(11).value = { formula: `I${fila}-J${fila}`, result: f.excesoPresencia ?? 0 }
      for (const c of [6, 7, 8, 9, 10, 11]) r.getCell(c).numFmt = FMT_DEC
      for (const [c, v] of [[10, f.excesoHE], [11, f.excesoPresencia]]) {
        if (v > 0) r.getCell(c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: ROJO_SUAVE } }
      }
      fila++
    }
  }
  totales(wh, fila, [4, 5, 6, 7, 8, 9, 10, 11], [])
  const nota = wh.getRow(fila + 2).getCell(1)
  nota.value =
    'Exceso total = tiempo registrado (trabajo efectivo + presencia) por encima de la jornada exigible. Las horas extraordinarias son la parte de trabajo efectivo que rebasa esa jornada (arts. 35 ET, 147.2 y 149 LGSS); el resto es exceso de tiempo de presencia (art. 8.3 RD 1561/1995). Debe comprobarse qué parte figura ya retribuida y cotizada en las nóminas.'
  nota.font = { italic: true }

  // ── Liquidación: diferencias salariales y cuotas ──
  const v = valoracion(resumen, cfg)
  const wv = wb.addWorksheet('Liquidación', { views: [{ state: 'frozen', ySplit: 1 }] })
  const cab = ['Trabajador', 'Año', 'Método', 'Horas extra', '€/hora extra', 'Importe HE', 'Horas presencia', '€/hora ordinaria', 'Importe presencia', 'Dietas a cotizar', 'Diferencia salarial', 'Base CC', 'Base CP']
  for (const c of CONCEPTOS_COTIZACION) cab.push(`${c.nombre} empresa %`, `${c.nombre} trabajador %`)
  cab.push('Cuota empresa', 'Cuota trabajador', 'Cuota total')
  cabecera(wv, 1, cab)
  wv.columns = cab.map((_, i) => ({ width: i === 0 ? 30 : 12 }))
  const L = (n) => (n <= 26 ? String.fromCharCode(64 + n) : String.fromCharCode(64 + Math.floor((n - 1) / 26)) + String.fromCharCode(65 + ((n - 1) % 26)))
  fila = 2
  for (const x of v.filas) {
    const r = wv.getRow(fila)
    r.values = [x.trabajador.nombre, +x.anio, x.metodo === 'horas' ? 'Cómputo horario' : 'Por días', x.horasHE, x.precioHE, null, x.horasOrd, x.precioOrd, null, x.dietas]
    r.getCell(6).value = { formula: `D${fila}*N(E${fila})`, result: x.importeHE }
    r.getCell(9).value = { formula: `G${fila}*N(H${fila})`, result: x.importeOrd }
    r.getCell(11).value = { formula: `F${fila}+I${fila}+J${fila}`, result: x.totalSalarial }
    r.getCell(12).value = { formula: `I${fila}+J${fila}`, result: x.baseCC }
    r.getCell(13).value = { formula: `F${fila}+I${fila}+J${fila}`, result: x.baseCP }
    const emp = []
    const tra = []
    let col = 14
    const tiposAnio = tiposDelAnio(+x.anio, cfg)
    for (const c of CONCEPTOS_COTIZACION) {
      const base = c.id === 'cc' || c.id === 'mei' ? `L${fila}` : c.id === 'he' ? `F${fila}` : `M${fila}`
      r.getCell(col).value = tiposAnio[c.id][0]
      r.getCell(col + 1).value = tiposAnio[c.id][1]
      emp.push(`${base}*${L(col)}${fila}/100`)
      tra.push(`${base}*${L(col + 1)}${fila}/100`)
      col += 2
    }
    r.getCell(col).value = { formula: emp.join('+'), result: x.cuotaEmpresa }
    r.getCell(col + 1).value = { formula: tra.join('+'), result: x.cuotaTrabajador }
    r.getCell(col + 2).value = { formula: `${L(col)}${fila}+${L(col + 1)}${fila}`, result: x.cuotaTotal }
    for (const c of [5, 6, 8, 9, 10, 11, 12, 13, col, col + 1, col + 2]) r.getCell(c).numFmt = FMT_EUR
    for (const c of [4, 7]) r.getCell(c).numFmt = FMT_DEC
    fila++
  }
  const nCols = cab.length
  totales(wv, fila, [4, 6, 7, 9, 10, 11, 12, 13, nCols - 2, nCols - 1, nCols], [6, 9, 10, 11, 12, 13, nCols - 2, nCols - 1, nCols])
  const notaV = wv.getRow(fila + 2).getCell(1)
  notaV.value = `Dietas integradas: ${DIETAS_SALARIO.find((d) => d.id === cfg.dietasSalario)?.nombre}. Las horas extraordinarias cotizan en la base de contingencias profesionales (AT/EP, desempleo, FOGASA, FP) y por la cotización adicional; el exceso de presencia y las dietas, en ambas bases. No se aplican topes de bases ni cotización de solidaridad. Verifica precios y tipos de cada ejercicio.`
  notaV.font = { italic: true }

  // ── Bases de cotización por trabajador y mes (cotizado y diferencias) ──
  if (incluirBases) hojaBases(wb, resumen, cfg, expediente)

  // ── Análisis de dietas ──
  const wa = wb.addWorksheet('Análisis dietas')
  wa.columns = [{ width: 32 }, { width: 26 }, { width: 10 }, { width: 12 }, { width: 12 }, { width: 12 }, { width: 14 }, { width: 14 }, { width: 14 }, { width: 14 }]
  cabecera(wa, 1, ['Trabajador', 'Tipo de dieta', 'Días', 'Mínimo/día', 'Máximo/día', 'Media/día', 'Importes distintos', 'Total abonado', 'Límite exento/día', 'Exceso no exento'])
  fila = 2
  for (const d of resumen.datos) {
    for (const x of d.dietas.porTipo) {
      const r = wa.getRow(fila++)
      r.values = [d.trabajador.nombre, x.nombre, x.dias, x.min, x.max, x.media, x.precios.length, x.total, x.limite, x.excesoNoExento]
      for (const c of [4, 5, 6, 8, 9, 10]) r.getCell(c).numFmt = FMT_EUR
    }
  }
  fila += 1
  cabecera(wa, fila++, ['Trabajador', 'Nómina (mes)', 'Tipo de dieta', 'Importes distintos en la misma nómina'])
  for (const d of resumen.datos) {
    for (const v of d.dietas.mesesVariacion) {
      wa.getRow(fila++).values = [d.trabajador.nombre, v.mes, nombreTipo(v.tipo), v.precios.map((p) => p.toFixed(2).replace('.', ',')).join(' · ')]
    }
  }

  // ── Líneas de nómina ──
  const wl = wb.addWorksheet('Líneas de nómina', { views: [{ state: 'frozen', ySplit: 1 }] })
  wl.columns = [{ width: 32 }, { width: 10 }, { width: 26 }, { width: 8 }, { width: 12 }, { width: 14 }]
  cabecera(wl, 1, ['Trabajador', 'Mes', 'Tipo de dieta', 'Días', 'Importe/día', 'Total'])
  fila = 2
  for (const d of resumen.datos) {
    for (const l of [...d.trabajador.dietas].sort((a, b) => (a.mes < b.mes ? -1 : 1))) {
      const r = wl.getRow(fila)
      r.values = [d.trabajador.nombre, l.mes, nombreTipo(l.tipo), Number(l.dias) || 0, Number(l.importe) || 0]
      r.getCell(6).value = { formula: `D${fila}*E${fila}` }
      r.getCell(5).numFmt = FMT_EUR
      r.getCell(6).numFmt = FMT_EUR
      fila++
    }
  }

  // Autoría y derechos
  {
    const f0 = wp.rowCount + 2
    wp.getCell(f0, 1).value = `Dietas y jornada anual · ${textoCopyright()}`
    wp.getCell(f0, 1).font = { bold: true, color: { argb: 'FF555555' } }
    wp.getCell(f0 + 1, 1).value = TEXTO_LICENCIA
    wp.getCell(f0 + 1, 1).font = { italic: true, size: 9, color: { argb: 'FF777777' } }
  }

  return wb.xlsx.writeBuffer()
}
