// Libro Excel de «Dietas y jornada anual»: cuadrante (con fórmulas editables),
// análisis de importes de las dietas, líneas de nómina y parámetros.

import ExcelJS from 'exceljs'
import { TIPOS_DIETA, DATOS_EXPEDIENTE, CRITERIOS_DIAS, PRORRATEOS } from '../../data/dietasJornada.js'
import { normalizarConfig } from './calculo.js'
import { fechaES } from '../tacografo/tiempo.js'

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

const nombreTipo = (id) => TIPOS_DIETA.find((t) => t.id === id)?.nombre || id

export async function generarExcel({ resumen, cfg: cfgEntrada, expediente = {} }) {
  const cfg = normalizarConfig(cfgEntrada)
  const wb = new ExcelJS.Workbook()
  wb.creator = 'Dietas y jornada anual'
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
        f.diasIT,
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

  // ── Cálculo por horas (jornada máxima proporcional a los días de alta) ──
  const wh = wb.addWorksheet('Cálculo por horas', { views: [{ state: 'frozen', ySplit: 1 }] })
  wh.columns = [
    { width: 32 }, { width: 8 }, { width: 12 }, { width: 12 }, { width: 10 }, { width: 9 }, { width: 10 },
    { width: 13 }, { width: 14 }, { width: 13 }, { width: 13 }, { width: 15 }, { width: 15 },
  ]
  cabecera(wh, 1, [
    'Trabajador', 'Año', 'Desde', 'Hasta', 'Días en alta', 'Días IT', 'Días del año', 'Jornada máxima (h)',
    'Trabajo efectivo (conducción + otros trabajos)', 'Presencia (disponibilidad)', 'Total horas',
    'Exceso horas extraordinarias (B. CP)', 'Exceso sobre jornada máxima (B. CC)',
  ])
  const filaJornadaAnual = filaJornadaDiaria - 1
  fila = 2
  for (const d of resumen.datos) {
    for (const f of d.cuadrante.filas.filter((x) => x.excesoHE !== null)) {
      const r = wh.getRow(fila)
      r.values = [
        d.trabajador.nombre || '',
        +f.anio,
        new Date(f.desde + 'T00:00:00Z'),
        new Date(f.hasta + 'T00:00:00Z'),
        f.diasAlta,
        f.diasIT,
        (+f.anio % 4 === 0 && +f.anio % 100 !== 0) || +f.anio % 400 === 0 ? 366 : 365,
        null,
        f.horasEfectivas,
        f.horasPresencia,
        null,
        null,
        null,
      ]
      r.getCell(8).value = { formula: `'Parámetros'!B${filaJornadaAnual}*(E${fila}-F${fila})/G${fila}`, result: f.jornadaMaxima }
      r.getCell(11).value = { formula: `N(I${fila})+N(J${fila})`, result: (f.horasEfectivas || 0) + (f.horasPresencia || 0) }
      r.getCell(12).value = { formula: `MAX(0,N(I${fila})-H${fila})`, result: f.excesoHE ?? 0 }
      r.getCell(13).value = { formula: `MAX(0,K${fila}-L${fila}-H${fila})`, result: f.excesoCC ?? 0 }
      r.getCell(3).numFmt = 'dd/mm/yyyy'
      r.getCell(4).numFmt = 'dd/mm/yyyy'
      for (const c of [8, 9, 10, 11, 12, 13]) r.getCell(c).numFmt = FMT_DEC
      for (const c of [12, 13]) if ((c === 12 ? f.excesoHE : f.excesoCC) > 0) r.getCell(c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: ROJO_SUAVE } }
      fila++
    }
  }
  totales(wh, fila, [5, 6, 8, 9, 10, 11, 12, 13], [])
  const nota = wh.getRow(fila + 2).getCell(1)
  nota.value =
    'Los excesos serán horas a cotizar si no constan como cotizadas en nómina. Las horas extraordinarias cotizan en la base de contingencias profesionales; el resto del exceso (presencia), en la de contingencias comunes.'
  nota.font = { italic: true }

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

  return wb.xlsx.writeBuffer()
}
