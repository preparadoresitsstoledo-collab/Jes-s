// Tablas salariales de convenios de transporte de mercancías por carretera.
//
// Toledo: Convenio colectivo provincial de transportes de mercancías por carretera
// y logística de Toledo 2024-2026 (código 45000325011981), BOP de Toledo núm. 64,
// de 4 de abril de 2024, Anexo I (tabla de transporte de mercancías por carretera).
// 2023: tabla definitiva; 2024-2026: tablas provisionales (+3 % anual, art. 34.1,
// con posible revisión adicional de hasta el 1 % si el IPC de diciembre supera el 3 %).

const SALARIOS_TOLEDO = {
  // [2023, 2024, 2025, 2026]
  // Grupo I. Personal superior y técnico (salario mensual)
  'Director/a de área o departamento': { tipo: 'mes', importes: [2032.91, 2093.9, 2156.71, 2221.42] },
  'Director/a o delegado/a de sucursal': { tipo: 'mes', importes: [1658.56, 1708.32, 1759.57, 1812.35] },
  'Jefe/a de servicio': { tipo: 'mes', importes: [1516.38, 1561.87, 1608.73, 1656.99] },
  'Titulado/a de grado superior': { tipo: 'mes', importes: [1414.43, 1456.86, 1500.57, 1545.59] },
  'Titulado/a de grado medio': { tipo: 'mes', importes: [1250.44, 1287.95, 1326.59, 1366.39] },
  'Jefe/a de sección': { tipo: 'mes', importes: [1244.98, 1282.33, 1320.8, 1360.42] },
  'Jefe/a de negociado': { tipo: 'mes', importes: [1216.81, 1253.31, 1290.91, 1329.64] },
  'Jefe/a de tráfico de primera': { tipo: 'mes', importes: [1202.07, 1238.13, 1275.28, 1313.53] },
  'Jefe/a de tráfico de segunda': { tipo: 'mes', importes: [1194.1, 1229.92, 1266.82, 1304.83] },
  'Encargado/a general': { tipo: 'mes', importes: [1194.1, 1229.92, 1266.82, 1304.83] },
  'Inspector/a - visitador/a': { tipo: 'mes', importes: [1157.14, 1191.85, 1227.61, 1264.44] },
  'Jefe/a de taller': { tipo: 'mes', importes: [1293.51, 1332.32, 1372.28, 1413.45] },
  'Contramaestre o encargado/a': { tipo: 'mes', importes: [1180.63, 1216.05, 1252.53, 1290.11] },
  // Grupo II. Personal de administración (salario mensual)
  'Oficial/a de primera': { tipo: 'mes', importes: [1150.9, 1185.43, 1220.99, 1257.62] },
  'Oficial/a de segunda': { tipo: 'mes', importes: [1120.29, 1153.9, 1188.52, 1224.17] },
  'Encargado/a de almacén': { tipo: 'mes', importes: [1145.06, 1179.41, 1214.79, 1251.24] },
  'Encargado/a de garaje': { tipo: 'mes', importes: [1145.06, 1179.41, 1214.79, 1251.24] },
  Auxiliar: { tipo: 'mes', importes: [1089.28, 1121.96, 1155.62, 1190.29] },
  Telefonista: { tipo: 'mes', importes: [1048.78, 1080.24, 1112.65, 1146.03] },
  // Grupo III. Personal de movimiento (salario diario)
  'Conductor/a mecánico/a': { tipo: 'dia', importes: [37.23, 38.35, 39.5, 40.68] },
  'Conductor/a': { tipo: 'dia', importes: [37.23, 38.35, 39.5, 40.68] },
  'Conductor/a repartidor/a de vehículos ligeros': { tipo: 'dia', importes: [37.23, 38.35, 39.5, 40.68] },
  Capataz: { tipo: 'dia', importes: [37.18, 38.3, 39.44, 40.63] },
  Capitonista: { tipo: 'dia', importes: [36.32, 37.41, 38.53, 39.69] },
  'Ayudante/a y/o mozo/a especializado/a': { tipo: 'dia', importes: [35.29, 36.35, 37.44, 38.56] },
  'Auxiliar de almacén-basculero/a': { tipo: 'dia', importes: [36.32, 37.41, 38.53, 39.69] },
  'Mozo/a ordinario/a': { tipo: 'dia', importes: [33.15, 34.14, 35.17, 36.22] },
  // Grupo IV. Personal de servicios auxiliares (salario diario)
  Ordenanza: { tipo: 'dia', importes: [34.95, 36.0, 37.08, 38.19] },
  Guarda: { tipo: 'dia', importes: [38.17, 39.32, 40.49, 41.71] },
  'Personal de mantenimiento y limpieza': { tipo: 'dia', importes: [35.96, 37.04, 38.15, 39.29] },
  'Capataz de taller o jefe/a de equipo': { tipo: 'dia', importes: [37.95, 39.09, 40.26, 41.47] },
  'Oficial de primera de oficios': { tipo: 'dia', importes: [37.23, 38.35, 39.5, 40.68] },
  'Oficial de segunda de oficios': { tipo: 'dia', importes: [37.02, 38.13, 39.27, 40.45] },
  'Mozo/a especializado/a de taller': { tipo: 'dia', importes: [34.91, 35.96, 37.04, 38.15] },
  'Peón/a ordinario/a': { tipo: 'dia', importes: [35.96, 37.04, 38.15, 39.29] },
}

const ANIOS_TOLEDO = ['2023', '2024', '2025', '2026']
const porAnio = (arr) => Object.fromEntries(ANIOS_TOLEDO.map((a, i) => [a, arr[i]]))

export const CONVENIOS = {
  toledo: {
    id: 'toledo',
    nombre: 'Transporte de mercancías por carretera de Toledo 2024-2026',
    nombreTexto: 'el convenio colectivo provincial de transportes de mercancías por carretera y logística de Toledo',
    fuente: 'BOP de Toledo núm. 64, de 4 de abril de 2024 (Anexo I). 2023 definitiva; 2024-2026 provisionales.',
    jornadaAnual: 1800, // art. 23
    anios: ANIOS_TOLEDO,
    categorias: Object.fromEntries(Object.entries(SALARIOS_TOLEDO).map(([k, v]) => [k, { tipo: v.tipo, salario: porAnio(v.importes) }])),
    categoriaPorDefecto: 'Conductor/a',
    // Otros conceptos (devengo mensual)
    antiguedad: porAnio([45.65, 47.02, 48.43, 49.88]), // valor de un bienio; quinquenio = 2 bienios (art. 32.a)
    plusTransporte: porAnio([66.94, 68.95, 71.02, 73.15]), // art. 32.b (por día efectivo de trabajo)
    // Dietas (Anexo I): [desayuno, comida, cena, pernocta, total]
    dietas: {
      nacional: porAnio([
        [4.96, 14.32, 10.86, 9.06, 39.2],
        [5.11, 14.75, 11.19, 9.33, 40.38],
        [5.26, 15.19, 11.52, 9.61, 41.59],
        [5.42, 15.65, 11.87, 9.9, 42.83],
      ]),
      portugal: porAnio([
        [5.42, 15.62, 11.85, 9.87, 42.76],
        [5.58, 16.09, 12.21, 10.17, 44.04],
        [5.75, 16.57, 12.57, 10.47, 45.36],
        [5.92, 17.07, 12.95, 10.79, 46.73],
      ]),
    },
    // Art. 31: hora ordinaria = (salario base + complementos personales y de puesto + antigüedad) × 15 / 1.800
    // (12 mensualidades + gratificaciones de julio y Navidad + paga de beneficios, art. 35).
    // Art. 35.b: hora extraordinaria = hora ordinaria + 25 %.
    pagas: 15,
    recargoHE: 0.25,
    diasMes: 30, // salario diario × 30 para obtener el mensual
  },
}

/**
 * Precio de la hora ordinaria y extraordinaria según el convenio (art. 31 y 35.b del de Toledo).
 * @param {string} anio
 * @param {{ categoria?: string, bienios?: number, quinquenios?: number, plusTransporte?: boolean }} op
 * @returns {{ ordinaria: number, extra: number, mensual: number, detalle: string } | null}
 */
export function precioHoraConvenio(idConvenio, anio, op = {}) {
  const c = CONVENIOS[idConvenio]
  if (!c) return null
  const cat = c.categorias[op.categoria] || c.categorias[c.categoriaPorDefecto]
  const salario = cat?.salario[anio]
  if (!salario) return null
  const base = cat.tipo === 'dia' ? salario * c.diasMes : salario
  const unidades = (Number(op.bienios) || 0) + 2 * (Number(op.quinquenios) || 0)
  const antig = unidades * (c.antiguedad[anio] || 0)
  const transporte = op.plusTransporte ? c.plusTransporte[anio] || 0 : 0
  const mensual = base + antig + transporte
  const ordinaria = (mensual * c.pagas) / c.jornadaAnual
  const r = (x) => Math.round(x * 100) / 100
  return {
    ordinaria: r(ordinaria),
    extra: r(ordinaria * (1 + c.recargoHE)),
    mensual: r(mensual),
    detalle: `(${cat.tipo === 'dia' ? `${salario.toFixed(2)} € × ${c.diasMes}` : `${salario.toFixed(2)} €`}${antig ? ` + antigüedad ${antig.toFixed(2)} €` : ''}${transporte ? ` + plus transporte ${transporte.toFixed(2)} €` : ''}) × ${c.pagas} / ${c.jornadaAnual}`,
  }
}
