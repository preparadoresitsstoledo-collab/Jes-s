// Agrupa los archivos leídos por conductor (número de tarjeta) y fusiona sus
// días de actividad y vehículos, eliminando duplicados entre descargas.

import { fusionarDias } from './ddd.js'

export function agruparPorConductor(lecturas) {
  const mapa = new Map()
  for (const l of lecturas) {
    const clave = l.tarjeta.numero.slice(0, 14) || `${l.titular.apellidos} ${l.titular.nombre}`
    if (!mapa.has(clave)) {
      mapa.set(clave, { clave, titular: l.titular, tarjeta: l.tarjeta, generacion: l.generacion, lecturas: [] })
    }
    const c = mapa.get(clave)
    c.lecturas.push(l)
    if (l.generacion > c.generacion) {
      c.generacion = l.generacion
      c.tarjeta = l.tarjeta
    }
  }
  return [...mapa.values()]
    .map((c) => {
      const dias = fusionarDias(c.lecturas.map((l) => l.dias))
      const vistos = new Set()
      const vehiculos = []
      for (const l of c.lecturas) {
        for (const v of l.vehiculos) {
          const k = `${v.matricula}|${v.primerUso}`
          if (vistos.has(k)) continue
          vistos.add(k)
          vehiculos.push(v)
        }
      }
      vehiculos.sort((a, b) => a.primerUso - b.primerUso)
      const vistosL = new Set()
      const lugares = []
      for (const l of c.lecturas) {
        for (const x of l.lugares || []) {
          const k = `${x.ms}|${x.tipo}|${x.pais}`
          if (vistosL.has(k)) continue
          vistosL.add(k)
          lugares.push(x)
        }
      }
      lugares.sort((a, b) => a.ms - b.ms)
      return {
        ...c,
        nombreCompleto: `${c.titular.apellidos}, ${c.titular.nombre}`.replace(/^, |, $/g, ''),
        archivos: c.lecturas.map((l) => l.nombre),
        dias,
        vehiculos,
        lugares,
        primerDia: dias[0]?.fecha || '',
        ultimoDia: dias[dias.length - 1]?.fecha || '',
      }
    })
    .sort((a, b) => a.nombreCompleto.localeCompare(b.nombreCompleto))
}
