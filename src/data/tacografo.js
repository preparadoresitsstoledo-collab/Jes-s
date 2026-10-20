// Parámetros por defecto del analizador de tacógrafo.
//
// ⚠️ Los valores del CONVENIO son orientativos: compruébalos en el texto
// vigente del Convenio Colectivo provincial de Transporte de Mercancías por
// Carretera y Logística de Toledo (BOP de Toledo núm. 64, de 4 de abril de 2024,
// y sus revisiones salariales) antes de usarlos en una reclamación.

export const CONFIG_POR_DEFECTO = {
  zonaHoraria: 'Europe/Madrid',

  // Tratamiento de los periodos sin actividad acreditada
  desconocidoComoDescanso: true, // tarjeta extraída sin actividad introducida
  sinDatosComoDescanso: true, // días sin registro en la tarjeta
  disponibilidadEsPausa: false, // ¿la disponibilidad ≥ 15 min interrumpe las 6 h de trabajo?

  // Convenio colectivo / Estatuto de los Trabajadores
  jornadaAnual: 1800, // horas de trabajo efectivo/año (VERIFICAR en el convenio)
  jornadaSemanal: 40, // art. 34.1 ET
  jornadaDiariaMax: 9, // art. 34.3 ET (salvo distribución distinta por convenio)
  descansoEntreJornadas: 12, // art. 34.3 ET (horas)
  limiteHEAnual: 80, // art. 35.2 ET
  presenciaMaxSemanal: 20, // RD 1561/1995, art. 8.3 (promedio mensual)
  nocturnoInicio: '22:00', // art. 36.1 ET
  nocturnoFin: '06:00',

  // Valoración de las horas extraordinarias
  metodoHE: 'mensual', // 'mensual' | 'semanal' | 'diario' | 'anual'
  preciosHE: {}, // { '2023': 14.5, ... } €/hora según tablas del convenio
  tipoCotizacion: 0, // % sobre el importe de HE (0 = no calcular cuota)
}

export const METODOS_HE = [
  {
    id: 'mensual',
    nombre: 'Mensual prorrateado',
    detalle:
      'Trabajo efectivo del mes que excede la jornada anual del convenio prorrateada por días naturales. Útil para imputar las diferencias de bases mes a mes.',
  },
  {
    id: 'semanal',
    nombre: 'Semanal (40 h)',
    detalle: 'Exceso sobre la jornada semanal ordinaria en cada semana natural (lunes a domingo).',
  },
  {
    id: 'diario',
    nombre: 'Diario (9 h)',
    detalle: 'Exceso diario sobre el máximo de horas ordinarias de trabajo efectivo (art. 34.3 ET).',
  },
  {
    id: 'anual',
    nombre: 'Anual (cómputo anual)',
    detalle:
      'Exceso del trabajo efectivo anual sobre la jornada anual del convenio (art. 34.1 ET). Se reparte entre los meses en proporción a su exceso mensual.',
  },
]

export const DATOS_EXPEDIENTE = [
  { id: 'empresa', label: 'Empresa' },
  { id: 'nifEmpresa', label: 'NIF empresa' },
  { id: 'ccc', label: 'Código de cuenta de cotización' },
  { id: 'trabajadorNif', label: 'DNI/NIE del trabajador' },
  { id: 'naf', label: 'Nº afiliación Seguridad Social' },
  { id: 'categoria', label: 'Categoría profesional' },
  { id: 'convenio', label: 'Convenio aplicable', placeholder: 'Transporte de mercancías por carretera de Toledo' },
]

// Referencias normativas utilizadas en las incidencias
export const NORMAS = {
  R561: 'Reglamento (CE) 561/2006',
  RD1561: 'RD 1561/1995',
  ET: 'Estatuto de los Trabajadores',
}
