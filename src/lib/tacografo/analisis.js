// Motor de análisis de tiempos de conducción, trabajo y descanso a partir de
// los registros diarios de la tarjeta de conductor.
//
// Comprueba (de forma orientativa):
//  · Reglamento (CE) 561/2006: conducción diaria, semanal y bisemanal (art. 6),
//    pausas (art. 7), descanso diario y semanal (art. 8).
//  · RD 1561/1995: tiempo de presencia (art. 8.3) y trabajadores móviles
//    (art. 10 bis: 48 h de promedio en 4 meses, 60 h semanales, pausas cada
//    6 h y límite de 10 h con trabajo nocturno).
//  · Estatuto de los Trabajadores: jornada (art. 34), descanso entre jornadas
//    (art. 34.3) y horas extraordinarias (art. 35).
//
// Todas las duraciones internas están en milisegundos; los resultados en minutos.

import { ACT } from './ddd.js'
import { NORMAS, CONFIG_POR_DEFECTO } from '../../data/tacografo.js'
import {
  MIN, HORA, DIA,
  fechaLocal, horaLocal, fechaHoraLocal, inicioDia, sumarDias, lunesDe,
  diasEnAnio, diasEntre, hhmm, fechaES, MESES,
} from './tiempo.js'

const H = (h) => h * HORA
const aMin = (ms) => Math.round(ms / MIN)

// ─────────────────────────── Línea temporal ───────────────────────────

// Convierte los registros diarios (UTC) en tramos continuos de actividad.
export function construirTramos(dias) {
  const tramos = []
  let finAnterior = null
  for (const d of dias) {
    const cambios = []
    for (const c of d.cambios) {
      // Si hay varios cambios en el mismo minuto vale el último
      if (cambios.length && cambios[cambios.length - 1].minuto === c.minuto) cambios[cambios.length - 1] = c
      else if (!cambios.length || c.minuto > cambios[cambios.length - 1].minuto) cambios.push(c)
    }
    if (!cambios.length) continue
    if (finAnterior !== null && d.inicioMs > finAnterior) {
      tramos.push({ ini: finAnterior, fin: d.inicioMs, act: ACT.SIN_DATOS, manual: false })
    }
    // Un registro sin cambio a las 00:00: se arrastra la actividad anterior
    if (cambios[0].minuto > 0) {
      const previo = tramos.length && tramos[tramos.length - 1].fin === d.inicioMs ? tramos[tramos.length - 1] : null
      tramos.push({
        ini: d.inicioMs,
        fin: d.inicioMs + cambios[0].minuto * MIN,
        act: previo ? previo.act : ACT.DESCONOCIDO,
        manual: previo ? previo.manual : false,
      })
    }
    for (let i = 0; i < cambios.length; i++) {
      const ini = d.inicioMs + cambios[i].minuto * MIN
      const fin = i + 1 < cambios.length ? d.inicioMs + cambios[i + 1].minuto * MIN : d.inicioMs + DIA
      if (fin > ini) {
        tramos.push({
          ini,
          fin,
          act: cambios[i].actividad,
          manual: cambios[i].manual,
          equipo: cambios[i].tripulacion,
          copiloto: cambios[i].ranura === 'segundo conductor',
        })
      }
    }
    finAnterior = d.inicioMs + DIA
  }
  return fusionarTramos(tramos)
}

function fusionarTramos(tramos) {
  const r = []
  for (const t of tramos) {
    const u = r[r.length - 1]
    if (u && u.fin === t.ini && u.act === t.act && u.manual === t.manual && !!u.equipo === !!t.equipo && !!u.copiloto === !!t.copiloto) {
      u.fin = t.fin
    }
    else r.push({ ...t })
  }
  return r
}

function recortar(tramos, desde, hasta) {
  const r = []
  for (const t of tramos) {
    const ini = Math.max(t.ini, desde)
    const fin = Math.min(t.fin, hasta)
    if (fin > ini) r.push({ ...t, ini, fin })
  }
  return r
}

// Suma por actividad de los tramos dentro de [a, b)
function sumar(tramos, a, b) {
  const s = { CONDUCCION: 0, TRABAJO: 0, DISPONIBILIDAD: 0, DESCANSO: 0, DESCONOCIDO: 0, SIN_DATOS: 0, manual: 0 }
  for (let k = indiceDesde(tramos, a); k < tramos.length; k++) {
    const t = tramos[k]
    if (t.ini >= b) break
    const d = Math.min(t.fin, b) - Math.max(t.ini, a)
    s[t.act] += d
    if (t.manual) s.manual += d
  }
  return s
}

// Índice del primer tramo que termina después de 'ms' (búsqueda binaria)
function indiceDesde(tramos, ms) {
  let lo = 0
  let hi = tramos.length
  while (lo < hi) {
    const m = (lo + hi) >> 1
    if (tramos[m].fin <= ms) lo = m + 1
    else hi = m
  }
  return lo
}

function hayEquipo(tramos, a, b) {
  for (let k = indiceDesde(tramos, a); k < tramos.length && tramos[k].ini < b; k++) {
    if (tramos[k].equipo && tramos[k].act === ACT.CONDUCCION) return true
  }
  return false
}

// Minutos de trabajo (conducción + otros trabajos) en franja nocturna local
function trabajoNocturno(tramos, a, b, cfg) {
  const [hi, mi] = cfg.nocturnoInicio.split(':').map(Number)
  const [hf, mf] = cfg.nocturnoFin.split(':').map(Number)
  const ini = hi * 60 + mi
  const fin = hf * 60 + mf
  let total = 0
  let fecha = sumarDias(fechaLocal(a, cfg.zonaHoraria), -1)
  const ultima = fechaLocal(b, cfg.zonaHoraria)
  while (fecha <= ultima) {
    const d0 = inicioDia(fecha, cfg.zonaHoraria)
    const franjaIni = d0 + ini * MIN
    const franjaFin = fin > ini ? d0 + fin * MIN : inicioDia(sumarDias(fecha, 1), cfg.zonaHoraria) + fin * MIN
    const x = Math.max(a, franjaIni)
    const y = Math.min(b, franjaFin)
    if (y > x) {
      const s = sumar(tramos, x, y)
      total += s.CONDUCCION + s.TRABAJO
    }
    fecha = sumarDias(fecha, 1)
  }
  return total
}

const MESES_CORTOS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

// ─────────────────────────── Análisis ───────────────────────────

/**
 * @param {object} conductor resultado de agrupar los archivos de un conductor
 *        { dias, vehiculos }
 * @param {object} cfg configuración (ver CONFIG_POR_DEFECTO)
 * @param {{desde?: string, hasta?: string}} periodo fechas locales AAAA-MM-DD
 */
export function analizar(conductor, cfgEntrada, periodo = {}) {
  const cfg = normalizarConfig(cfgEntrada)
  const tz = cfg.zonaHoraria
  const todos = construirTramos(conductor.dias)
  if (!todos.length) throw new Error('No hay actividades registradas')

  const primeraFecha = conductor.dias[0].fecha
  const ultimaFecha = conductor.dias[conductor.dias.length - 1].fecha
  const desde = periodo.desde && periodo.desde > primeraFecha ? periodo.desde : primeraFecha
  const hasta = periodo.hasta && periodo.hasta < ultimaFecha ? periodo.hasta : ultimaFecha
  if (desde > hasta) throw new Error('El periodo seleccionado no contiene datos')
  const t0 = inicioDia(desde, tz)
  const t1 = inicioDia(sumarDias(hasta, 1), tz)
  const tramos = recortar(todos, t0, t1)

  const esDescanso = (act) =>
    act === ACT.DESCANSO ||
    (act === ACT.DESCONOCIDO && cfg.desconocidoComoDescanso) ||
    (act === ACT.SIN_DATOS && cfg.sinDatosComoDescanso)
  const esTrabajo = (act) => act === ACT.CONDUCCION || act === ACT.TRABAJO

  const infracciones = []
  function infraccion(ms, norma, articulo, descripcion, valor, limite, extra = {}) {
    infracciones.push({
      ms,
      fecha: fechaLocal(ms, tz),
      norma,
      articulo,
      descripcion,
      valor: valor == null ? null : aMin(valor),
      limite: limite == null ? null : aMin(limite),
      exceso: valor == null || limite == null ? null : aMin(Math.abs(valor - limite)),
      ...extra,
    })
  }

  // Bloques de descanso (tramos de descanso consecutivos)
  const bloques = []
  for (const t of tramos) {
    if (!esDescanso(t.act)) continue
    const u = bloques[bloques.length - 1]
    if (u && u.fin === t.ini) u.fin = t.fin
    else bloques.push({ ini: t.ini, fin: t.fin })
  }
  for (const b of bloques) b.dur = b.fin - b.ini

  // ── Descansos diarios y jornadas (art. 8 R. 561/2006) ──
  const jornadas = []
  const primerTrabajo = tramos.find((t) => !esDescanso(t.act))
  let S = primerTrabajo ? primerTrabajo.ini : t1
  let bi = 0
  while (S < t1) {
    while (bi < bloques.length && bloques[bi].ini < S) bi++
    if (bi >= bloques.length) {
      // Último periodo sin descanso posterior dentro del periodo analizado
      jornadas.push({ ini: S, fin: t1, descanso: null })
      break
    }
    // Conducción en equipo (art. 8.5): 9 h de descanso en cada periodo de 30 h
    const enEquipo = hayEquipo(tramos, S, S + DIA)
    const W = S + (enEquipo ? H(30) : DIA)
    let elegido = null
    let tipo = null
    let enVentana = 0
    let fraccion = false
    for (let k = bi; k < bloques.length && bloques[k].ini < W; k++) {
      const recorte = Math.min(bloques[k].fin, W) - bloques[k].ini
      if (recorte >= H(9)) {
        elegido = k
        enVentana = recorte
        // ¿Hubo una primera fracción de al menos 3 h entre S y este bloque?
        for (let j = bi; j < k; j++) if (bloques[j].dur >= H(3)) fraccion = true
        break
      }
    }
    if (elegido !== null) {
      tipo = enEquipo
        ? 'diario en equipo (9 h en 30 h)'
        : enVentana >= H(11)
          ? 'diario normal'
          : fraccion
            ? 'diario fraccionado (3 h + 9 h)'
            : 'diario reducido'
    } else if (W > t1) {
      // Las 24 h exceden el final de los datos: no se puede valorar el descanso
      jornadas.push({ ini: S, fin: bloques[bi].ini, descanso: null })
      break
    } else {
      // Descanso insuficiente: se toma el primer descanso de al menos 7 h para
      // continuar el análisis.
      for (let k = bi; k < bloques.length; k++) {
        if (bloques[k].dur >= H(7)) {
          elegido = k
          break
        }
      }
      if (elegido === null) {
        jornadas.push({ ini: S, fin: t1, descanso: null })
        break
      }
      const b = bloques[elegido]
      enVentana = Math.max(0, Math.min(b.fin, W) - b.ini)
      tipo = 'insuficiente'
    }
    const b = bloques[elegido]
    if (b.dur >= H(45)) tipo = 'semanal normal'
    else if (b.dur >= H(24)) tipo = 'semanal reducido'
    if (tipo === 'insuficiente') {
      infraccion(
        b.ini, NORMAS.R561, enEquipo ? 'Art. 8.5' : 'Art. 8.2',
        `Descanso diario insuficiente en las ${enEquipo ? 30 : 24} h siguientes al fin del descanso anterior (${fechaHoraLocal(S, tz)}): ${hhmm(aMin(enVentana))} h disfrutadas`,
        enVentana, H(9),
      )
    }
    jornadas.push({ ini: S, fin: b.ini, enEquipo, descanso: { ini: b.ini, fin: b.fin, dur: b.dur, tipo, enVentana } })
    S = b.fin
    bi = elegido + 1
  }

  // Estadísticas de cada jornada
  let reducidosDesdeSemanal = 0
  for (const j of jornadas) {
    const desdeIdx = indiceDesde(tramos, j.ini)
    const s = sumar(tramos, j.ini, j.fin)
    j.conduccion = s.CONDUCCION
    j.trabajo = s.TRABAJO
    j.disponibilidad = s.DISPONIBILIDAD
    j.pausas = s.DESCANSO + (cfg.desconocidoComoDescanso ? s.DESCONOCIDO : 0) + (cfg.sinDatosComoDescanso ? s.SIN_DATOS : 0)
    j.trabajoTotal = s.CONDUCCION + s.TRABAJO
    j.amplitud = j.fin - j.ini
    j.fecha = fechaLocal(j.ini, tz)
    j.semana = lunesDe(j.fecha)
    j.nocturno = trabajoNocturno(tramos, j.ini, j.fin, cfg)
    j.incidencias = []

    // Pausas en la conducción (art. 7) y en el trabajo (art. 10 bis.4 RD 1561/1995)
    let conduccionContinua = 0
    let primeraFraccion = false
    let maxConduccionContinua = 0
    let avisadaConduccion = false
    let trabajoContinuo = 0
    let maxTrabajoContinuo = 0
    let avisadoTrabajo = false
    let pausasComputables = 0
    for (let k = desdeIdx; k < tramos.length && tramos[k].ini < j.fin; k++) {
      const t = tramos[k]
      const d = Math.min(t.fin, j.fin) - Math.max(t.ini, j.ini)
      if (d <= 0) continue
      // En conducción en equipo, la disponibilidad como segundo conductor
      // puede computarse como pausa de conducción (art. 7, párrafo tercero)
      const pausaEquipo = t.act === ACT.DISPONIBILIDAD && t.equipo && t.copiloto
      if (pausaEquipo) {
        if (d >= 45 * MIN || (primeraFraccion && d >= 30 * MIN)) {
          conduccionContinua = 0
          primeraFraccion = false
          avisadaConduccion = false
        } else if (d >= 15 * MIN) primeraFraccion = true
      }
      if (esDescanso(t.act)) {
        if (d >= 45 * MIN || (primeraFraccion && d >= 30 * MIN)) {
          conduccionContinua = 0
          primeraFraccion = false
          avisadaConduccion = false
        } else if (d >= 15 * MIN) primeraFraccion = true
        if (d >= 15 * MIN) {
          trabajoContinuo = 0
          avisadoTrabajo = false
          pausasComputables += d
        }
      } else if (t.act === ACT.DISPONIBILIDAD && cfg.disponibilidadEsPausa && d >= 15 * MIN) {
        // Criterio opcional: la disponibilidad de al menos 15 min interrumpe el trabajo
        trabajoContinuo = 0
        avisadoTrabajo = false
      } else if (esTrabajo(t.act)) {
        if (t.act === ACT.CONDUCCION) {
          conduccionContinua += d
          maxConduccionContinua = Math.max(maxConduccionContinua, conduccionContinua)
          if (conduccionContinua > H(4.5) && !avisadaConduccion) {
            avisadaConduccion = true
            const ms = Math.max(t.ini, j.ini) + (d - (conduccionContinua - H(4.5)))
            j.incidencias.push('Conducción continuada > 4 h 30 min sin pausa')
            infraccion(ms, NORMAS.R561, 'Art. 7', 'Conducción ininterrumpida superior a 4 h 30 min sin pausa de 45 min (o 15 + 30 min)', null, H(4.5), { jornada: j })
          }
        }
        trabajoContinuo += d
        maxTrabajoContinuo = Math.max(maxTrabajoContinuo, trabajoContinuo)
        if (trabajoContinuo > H(6) && !avisadoTrabajo) {
          avisadoTrabajo = true
          j.incidencias.push('Más de 6 h de trabajo seguidas sin pausa')
          infraccion(Math.max(t.ini, j.ini), NORMAS.RD1561, 'Art. 10 bis.4', 'Más de 6 horas consecutivas de trabajo sin pausa (fracciones de al menos 15 min)', null, H(6), { jornada: j })
        }
      }
    }
    j.maxConduccionContinua = maxConduccionContinua
    j.maxTrabajoContinuo = maxTrabajoContinuo
    if (j.incidencias.length) {
      // Completa el valor de las incidencias de pausas con el máximo observado
      for (const inf of infracciones) {
        if (inf.jornada !== j) continue
        const valor = inf.articulo === 'Art. 7' ? maxConduccionContinua : maxTrabajoContinuo
        inf.valor = aMin(valor)
        inf.exceso = aMin(valor - (inf.articulo === 'Art. 7' ? H(4.5) : H(6)))
      }
    }

    // Pausa total exigida (art. 10 bis.4 RD 1561/1995): 30 min si el trabajo supera 6 h; 45 min si supera 9 h
    const exigida = j.trabajoTotal > H(9) ? 45 * MIN : j.trabajoTotal > H(6) ? 30 * MIN : 0
    if (exigida && pausasComputables < exigida && j.descanso) {
      j.incidencias.push(`Pausas insuficientes (${hhmm(aMin(pausasComputables))} de ${hhmm(aMin(exigida))})`)
      infraccion(j.ini, NORMAS.RD1561, 'Art. 10 bis.4', `Pausas insuficientes para ${hhmm(aMin(j.trabajoTotal))} h de trabajo`, pausasComputables, exigida)
    }

    // Conducción diaria (art. 6.1)
    if (j.conduccion > H(10)) {
      j.incidencias.push('Conducción diaria > 10 h')
      infraccion(j.ini, NORMAS.R561, 'Art. 6.1', 'Tiempo de conducción diario superior a 10 h', j.conduccion, H(10))
    }

    // Jornada diaria total: no más de 12 h de trabajo efectivo, incluidas las horas extraordinarias (art. 8.2 RD 1561/1995)
    if (j.trabajoTotal > H(12)) {
      j.incidencias.push('Trabajo efectivo en la jornada > 12 h')
      infraccion(j.ini, NORMAS.RD1561, 'Art. 8.2', 'Jornada diaria total superior a 12 horas de trabajo efectivo (incluidas horas extraordinarias)', j.trabajoTotal, H(12))
    }

    // Trabajo nocturno (art. 10 bis.3 RD 1561/1995)
    if (j.nocturno > 0 && j.trabajoTotal > H(10)) {
      j.incidencias.push('Jornada con trabajo nocturno > 10 h')
      infraccion(j.ini, NORMAS.RD1561, 'Art. 10 bis.3', 'Jornada con trabajo nocturno superior a 10 horas por cada periodo de 24 h', j.trabajoTotal, H(10))
    }

    // Descanso posterior
    if (j.descanso) {
      const tipo = j.descanso.tipo
      if (tipo.startsWith('semanal')) reducidosDesdeSemanal = 0
      else if (tipo === 'diario reducido') {
        reducidosDesdeSemanal++
        if (reducidosDesdeSemanal > 3) {
          j.incidencias.push('Más de 3 descansos diarios reducidos entre descansos semanales')
          infraccion(j.descanso.ini, NORMAS.R561, 'Art. 8.4', `Descanso diario reducido nº ${reducidosDesdeSemanal} entre dos descansos semanales (máximo 3)`, null, null)
        }
      }
      if (tipo === 'insuficiente') j.incidencias.push('Descanso diario insuficiente')
      // Descanso mínimo entre jornadas de 10 h (art. 9 RD 1561/1995). Informativo: para los
      // conductores sujetos al R. 561/2006 rigen los descansos de ese Reglamento.
      if (!tipo.startsWith('semanal') && tipo !== 'insuficiente' && j.descanso.dur < H(10)) {
        infraccion(j.descanso.ini, NORMAS.RD1561, 'Art. 9', 'Descanso entre jornadas inferior a 10 h (compruebe si rigen los descansos del R. 561/2006)', j.descanso.dur, H(10), { informativa: true })
      }
      if (j.descanso.dur < H(cfg.descansoEntreJornadas)) {
        j.incidencias.push(`Descanso entre jornadas < ${cfg.descansoEntreJornadas} h`)
        infraccion(j.descanso.ini, NORMAS.ET, 'Art. 34.3', `Descanso entre jornadas inferior a ${cfg.descansoEntreJornadas} h`, j.descanso.dur, H(cfg.descansoEntreJornadas), { informativa: true })
      }
    }
  }

  // Ampliaciones de conducción a 10 h: máximo dos por semana
  const ampliaciones = {}
  for (const j of jornadas) {
    if (j.conduccion > H(9) && j.conduccion <= H(10)) {
      ampliaciones[j.semana] = (ampliaciones[j.semana] || 0) + 1
      if (ampliaciones[j.semana] > 2) {
        j.incidencias.push('Tercera o posterior ampliación semanal de conducción a 10 h')
        infraccion(j.ini, NORMAS.R561, 'Art. 6.1', `Conducción diaria superior a 9 h por ${ampliaciones[j.semana]}.ª vez en la semana (máximo 2 ampliaciones)`, j.conduccion, H(9))
      }
    }
  }

  // ── Descansos semanales (art. 8.6 y 8.6 bis) ──
  const semanales = jornadas.filter((j) => j.descanso && j.descanso.tipo.startsWith('semanal')).map((j) => j.descanso)
  for (let k = 0; k < semanales.length; k++) {
    const w = semanales[k]
    w.reducido = w.dur < H(45)
    if (k > 0) {
      const anterior = semanales[k - 1]
      const separacion = w.ini - anterior.fin
      if (separacion > 6 * DIA) {
        infraccion(w.ini, NORMAS.R561, 'Art. 8.6', `Descanso semanal iniciado después de seis periodos de 24 h desde el anterior (${fechaHoraLocal(anterior.fin, tz)})`, separacion, 6 * DIA)
      }
      if (w.reducido && anterior.reducido) {
        infraccion(w.ini, NORMAS.R561, 'Art. 8.6', 'Dos descansos semanales reducidos consecutivos (revise si concurre la excepción del transporte internacional)', w.dur, H(45))
      }
    }
    if (w.reducido) {
      // Compensación en bloque antes del final de la tercera semana siguiente
      const deficit = H(45) - w.dur
      const limite = inicioDia(sumarDias(lunesDe(fechaLocal(w.ini, tz)), 28), tz)
      const compensa = bloques.some((b) => {
        if (b.ini <= w.ini || b.ini >= limite) return false
        const base = b.dur >= H(45) ? H(45) : b.dur >= H(24) ? H(24) : H(9)
        return b.dur - base >= deficit
      })
      w.compensacion = { horas: aMin(deficit), limite: fechaLocal(limite - 1, tz), acreditada: compensa }
      if (!compensa && limite <= t1) {
        infraccion(w.ini, NORMAS.R561, 'Art. 8.6', `Reducción del descanso semanal (${hhmm(aMin(deficit))} h) sin compensación acreditada antes del ${fechaES(fechaLocal(limite - 1, tz))}`, w.dur, H(45))
      }
    }
  }

  // ── Días naturales (hora local) ──
  const vehiculos = conductor.vehiculos || []
  const kmPorFecha = new Map(conductor.dias.map((d) => [d.fecha, d.distancia]))
  const dias = []
  for (let f = desde; f <= hasta; f = sumarDias(f, 1)) {
    const a = inicioDia(f, tz)
    const b = inicioDia(sumarDias(f, 1), tz)
    const idx = indiceDesde(tramos, a)
    const s = sumar(tramos, a, b)
    let primera = null
    let ultima = null
    for (let k = idx; k < tramos.length && tramos[k].ini < b; k++) {
      const t = tramos[k]
      if (t.act === ACT.CONDUCCION || t.act === ACT.TRABAJO || t.act === ACT.DISPONIBILIDAD) {
        if (primera === null) primera = Math.max(t.ini, a)
        ultima = Math.min(t.fin, b)
      }
    }
    const trabajoEfectivo = s.CONDUCCION + s.TRABAJO
    const presencia = s.DISPONIBILIDAD
    dias.push({
      fecha: f,
      conduccion: aMin(s.CONDUCCION),
      trabajo: aMin(s.TRABAJO),
      disponibilidad: aMin(s.DISPONIBILIDAD),
      descanso: aMin(s.DESCANSO),
      desconocido: aMin(s.DESCONOCIDO),
      sinDatos: aMin(s.SIN_DATOS),
      manual: aMin(s.manual),
      trabajoEfectivo: aMin(trabajoEfectivo),
      presencia: aMin(presencia),
      nocturno: aMin(trabajoNocturno(tramos, a, b, cfg)),
      inicio: primera !== null ? horaLocal(primera, tz) : '',
      fin: ultima !== null ? (ultima === b ? '24:00' : horaLocal(ultima, tz)) : '',
      amplitud: primera !== null ? aMin(ultima - primera) : 0,
      heDiaria: Math.max(0, aMin(trabajoEfectivo - H(cfg.jornadaDiariaMax))),
      km: kmPorFecha.get(f) || 0,
      vehiculos: [...new Set(vehiculos.filter((v) => v.primerUso < b && v.ultimoUso >= a).map((v) => v.matricula))].join(', '),
      conActividad: primera !== null,
      incidencias: [],
    })
  }
  const diaPorFecha = new Map(dias.map((d) => [d.fecha, d]))
  for (const inf of infracciones) {
    const d = diaPorFecha.get(inf.fecha)
    if (d) d.incidencias.push(`${inf.informativa ? 'ⓘ ' : ''}${inf.articulo} ${inf.norma === NORMAS.R561 ? 'R. 561' : inf.norma === NORMAS.RD1561 ? 'RD 1561' : 'ET'}: ${inf.descripcion}`)
  }

  // ── Semanas naturales (lunes a domingo) ──
  const semanas = []
  const porSemana = new Map()
  for (const d of dias) {
    const l = lunesDe(d.fecha)
    if (!porSemana.has(l)) {
      const w = { lunes: l, dias: 0, conduccion: 0, trabajo: 0, disponibilidad: 0, trabajoEfectivo: 0, presencia: 0, diasActividad: 0, descansoSemanal: '' }
      porSemana.set(l, w)
      semanas.push(w)
    }
    const w = porSemana.get(l)
    w.dias++
    w.conduccion += d.conduccion
    w.trabajo += d.trabajo
    w.disponibilidad += d.disponibilidad
    w.trabajoEfectivo += d.trabajoEfectivo
    w.presencia += d.presencia
    if (d.conActividad) w.diasActividad++
  }
  for (const w of semanas) {
    const limite = cfg.jornadaSemanal * 60 * (w.dias / 7)
    w.jornadaOrdinaria = Math.round(limite)
    w.heSemanal = Math.max(0, w.trabajoEfectivo - Math.round(limite))
    const finSemana = sumarDias(w.lunes, 6)
    const ds = semanales.filter((x) => fechaLocal(x.ini, tz) >= w.lunes && fechaLocal(x.ini, tz) <= finSemana)
    w.descansoSemanal = ds.map((x) => `${hhmm(aMin(x.dur))} h (${x.reducido ? 'reducido' : 'normal'})`).join(' · ')
    const ms = inicioDia(w.lunes, tz)
    if (w.conduccion > 56 * 60) {
      infraccion(ms, NORMAS.R561, 'Art. 6.2', `Conducción semanal superior a 56 h (semana del ${fechaES(w.lunes)})`, w.conduccion * MIN, H(56))
    }
    if (w.trabajoEfectivo > 60 * 60) {
      infraccion(ms, NORMAS.RD1561, 'Art. 10 bis.1', `Tiempo de trabajo semanal superior a 60 h (semana del ${fechaES(w.lunes)})`, w.trabajoEfectivo * MIN, H(60))
    }
  }
  for (let k = 1; k < semanas.length; k++) {
    const a = semanas[k - 1]
    const b = semanas[k]
    if (sumarDias(a.lunes, 7) === b.lunes && a.conduccion + b.conduccion > 90 * 60) {
      b.excesoBisemanal = true
      infraccion(inicioDia(b.lunes, tz), NORMAS.R561, 'Art. 6.3', `Conducción en dos semanas consecutivas superior a 90 h (semanas del ${fechaES(a.lunes)} y ${fechaES(b.lunes)})`, (a.conduccion + b.conduccion) * MIN, H(90))
    }
  }

  // ── Meses ──
  const meses = []
  const porMes = new Map()
  for (const d of dias) {
    const m = d.fecha.slice(0, 7)
    if (!porMes.has(m)) {
      const x = { mes: m, dias: 0, diasActividad: 0, conduccion: 0, trabajo: 0, disponibilidad: 0, trabajoEfectivo: 0, presencia: 0, heDiaria: 0, nocturno: 0, km: 0 }
      porMes.set(m, x)
      meses.push(x)
    }
    const x = porMes.get(m)
    x.dias++
    if (d.conActividad) x.diasActividad++
    for (const k of ['conduccion', 'trabajo', 'disponibilidad', 'trabajoEfectivo', 'presencia', 'heDiaria', 'nocturno', 'km']) x[k] += d[k]
  }
  for (const x of meses) {
    const anio = +x.mes.slice(0, 4)
    x.jornadaOrdinaria = Math.round((cfg.jornadaAnual * 60 * x.dias) / diasEnAnio(anio))
    x.heMensual = Math.max(0, x.trabajoEfectivo - x.jornadaOrdinaria)
    // HE semanales imputadas al mes en proporción a los días de cada semana
    x.heSemanal = 0
    const limitePresencia = cfg.presenciaMaxSemanal * 60 * (x.dias / 7)
    x.presenciaMaxima = Math.round(limitePresencia)
    x.excesoPresencia = Math.max(0, x.presencia - Math.round(limitePresencia))
    if (x.excesoPresencia > 0) {
      infraccion(inicioDia(x.mes + '-01', tz), NORMAS.RD1561, 'Art. 8.3', `Tiempo de presencia superior a ${cfg.presenciaMaxSemanal} h semanales de promedio en ${MESES[+x.mes.slice(5, 7) - 1]} de ${x.mes.slice(0, 4)}`, x.presencia * MIN, limitePresencia * MIN)
    }
  }
  for (const w of semanas) {
    if (!w.heSemanal) continue
    // Reparto de las HE de la semana entre sus días con trabajo, mes a mes
    const diasSemana = dias.filter((d) => lunesDe(d.fecha) === w.lunes)
    const total = diasSemana.reduce((s, d) => s + d.trabajoEfectivo, 0) || 1
    for (const d of diasSemana) porMes.get(d.fecha.slice(0, 7)).heSemanal += (w.heSemanal * d.trabajoEfectivo) / total
  }
  for (const x of meses) x.heSemanal = Math.round(x.heSemanal)

  // ── Años ──
  const anios = []
  const porAnio = new Map()
  for (const x of meses) {
    const a = x.mes.slice(0, 4)
    if (!porAnio.has(a)) {
      const y = { anio: a, dias: 0, diasActividad: 0, conduccion: 0, trabajo: 0, disponibilidad: 0, trabajoEfectivo: 0, presencia: 0, heDiaria: 0, heSemanal: 0, heMensual: 0, excesoPresencia: 0, nocturno: 0, km: 0 }
      porAnio.set(a, y)
      anios.push(y)
    }
    const y = porAnio.get(a)
    for (const k of ['dias', 'diasActividad', 'conduccion', 'trabajo', 'disponibilidad', 'trabajoEfectivo', 'presencia', 'heDiaria', 'heSemanal', 'heMensual', 'excesoPresencia', 'nocturno', 'km']) y[k] += x[k]
  }
  for (const y of anios) {
    y.jornadaOrdinaria = Math.round((cfg.jornadaAnual * 60 * y.dias) / diasEnAnio(+y.anio))
    y.heAnual = Math.max(0, y.trabajoEfectivo - y.jornadaOrdinaria)
    // Reparto de las HE anuales entre meses en proporción a su exceso mensual
    const mesesAnio = meses.filter((x) => x.mes.startsWith(y.anio))
    const sumaExceso = mesesAnio.reduce((s, x) => s + x.heMensual, 0)
    for (const x of mesesAnio) x.heAnual = sumaExceso ? Math.round((y.heAnual * x.heMensual) / sumaExceso) : 0
    // Ajuste de redondeo
    const dif = y.heAnual - mesesAnio.reduce((s, x) => s + x.heAnual, 0)
    if (dif && mesesAnio.length) {
      const mayor = mesesAnio.reduce((a, b) => (b.heMensual > a.heMensual ? b : a))
      mayor.heAnual += dif
    }
    const heRef = heSegunMetodo(y, cfg.metodoHE)
    const limiteHE = (cfg.limiteHEAnual * 60 * y.dias) / diasEnAnio(+y.anio)
    if (heRef > limiteHE) {
      infraccion(inicioDia(y.anio + '-01-01', tz) > t0 ? inicioDia(y.anio + '-01-01', tz) : t0, NORMAS.ET, 'Art. 35.2', `Horas extraordinarias en ${y.anio} superiores al máximo de ${cfg.limiteHEAnual} h/año${y.dias < diasEnAnio(+y.anio) ? ' (prorrateado)' : ''}`, heRef * MIN, limiteHE * MIN)
    }
  }

  // ── Promedio de 48 h semanales (art. 10 bis.1 RD 1561/1995) ──
  // Periodo de referencia de 4 meses naturales consecutivos (ampliable a 6 por convenio
  // sectorial estatal). Se evalúan todos los periodos completos dentro de lo analizado,
  // cada uno terminado en un mes distinto.
  const cuatrimestres = []
  const nRef = cfg.mesesReferencia === 6 ? 6 : 4
  for (let k = 0; k + nRef <= meses.length; k++) {
    const ms = meses.slice(k, k + nRef)
    const diasC = ms.reduce((s, x) => s + x.dias, 0)
    const trabajo = ms.reduce((s, x) => s + x.trabajoEfectivo, 0)
    const promedio = trabajo / (diasC / 7)
    const nombreMes = (m) => `${MESES_CORTOS[+m.slice(5, 7) - 1]} ${m.slice(0, 4)}`
    const q = {
      periodo: `${nombreMes(ms[0].mes)} – ${nombreMes(ms[ms.length - 1].mes)}`,
      dias: diasC,
      trabajoEfectivo: trabajo,
      promedioSemanal: Math.round(promedio),
    }
    cuatrimestres.push(q)
    if (promedio > 48 * 60 && diasC >= 28 * nRef) {
      const ini = inicioDia(ms[0].mes + '-01', tz)
      infraccion(ini > t0 ? ini : t0, NORMAS.RD1561, 'Art. 10 bis.1', `Promedio de trabajo superior a 48 h semanales en el periodo de ${nRef} meses ${q.periodo}`, promedio * MIN, H(48))
    }
  }

  // ── Esperas largas (disponibilidad): aviso informativo para revisar el marcado ──
  // Las esperas de carga y descarga son tiempo de presencia (art. 3 RD 1561/1995). El tacógrafo no
  // las distingue de otra disponibilidad: un día con mucha disponibilidad merece revisión.
  for (const d of dias) {
    const umbral = Number(cfg.umbralEsperaH) * 60
    if (umbral > 0 && d.presencia >= umbral) {
      const ms = inicioDia(d.fecha, tz)
      infraccion(ms, NORMAS.RD1561, 'Art. 3', `Disponibilidad de ${hhmm(d.presencia)} h en el día: compruebe si son esperas de carga o descarga (presencia) y si el conductor las marcó correctamente`, d.presencia * MIN, umbral * MIN, { informativa: true })
    }
  }

  // ── Descanso semanal de día y medio computable en periodos de 4 semanas (art. 9 RD 1561/1995) ──
  // Informativo: en cada periodo de 4 semanas debe haber al menos 4 descansos de 36 h.
  {
    const lunesSemanas = [...new Set(jornadas.map((j) => j.semana))].sort()
    for (let k = 3; k < lunesSemanas.length; k++) {
      const desdeL = lunesSemanas[k - 3]
      if (lunesSemanas[k] !== sumarDias(desdeL, 21)) continue // solo 4 semanas consecutivas
      const a = inicioDia(desdeL, tz)
      const b = inicioDia(sumarDias(lunesSemanas[k], 7), tz)
      if (a < t0 || b > t1) continue
      const largos = bloques.filter((x) => x.ini >= a && x.ini < b && x.dur >= H(36)).length
      if (largos < 4) {
        infraccion(a, NORMAS.RD1561, 'Art. 9', `Menos de 4 descansos de 36 h en las cuatro semanas del ${fechaES(desdeL)} al ${fechaES(sumarDias(lunesSemanas[k], 6))} (${largos} de al menos 36 h; compruebe si rigen los descansos del R. 561/2006)`, null, null, { informativa: true })
      }
    }
  }

  infracciones.sort((a, b) => a.ms - b.ms)
  for (const inf of infracciones) delete inf.jornada

  // Tramos para la hoja de actividades
  const actividades = tramos.map((t) => ({
    inicio: fechaHoraLocal(t.ini, tz),
    fin: fechaHoraLocal(t.fin, tz),
    duracion: aMin(t.fin - t.ini),
    actividad: t.act,
    manual: t.manual,
  }))

  const jornadasSalida = jornadas.map((j) => ({
    inicio: fechaHoraLocal(j.ini, tz),
    fin: fechaHoraLocal(j.fin, tz),
    fecha: j.fecha,
    amplitud: aMin(j.amplitud),
    conduccion: aMin(j.conduccion),
    trabajo: aMin(j.trabajo),
    disponibilidad: aMin(j.disponibilidad),
    pausas: aMin(j.pausas),
    trabajoTotal: aMin(j.trabajoTotal),
    nocturno: aMin(j.nocturno),
    maxConduccionContinua: aMin(j.maxConduccionContinua),
    descansoInicio: j.descanso ? fechaHoraLocal(j.descanso.ini, tz) : '',
    descansoDuracion: j.descanso ? aMin(j.descanso.dur) : null,
    descansoTipo: j.descanso ? j.descanso.tipo : 'sin descanso posterior en el periodo',
    enEquipo: !!j.enEquipo,
    compensacion: j.descanso?.compensacion || null,
    incidencias: j.incidencias,
  }))

  const totales = anios.reduce(
    (t, y) => {
      for (const k of ['dias', 'diasActividad', 'conduccion', 'trabajo', 'disponibilidad', 'trabajoEfectivo', 'presencia', 'heDiaria', 'heSemanal', 'heMensual', 'heAnual', 'excesoPresencia', 'km']) t[k] += y[k]
      return t
    },
    { dias: 0, diasActividad: 0, conduccion: 0, trabajo: 0, disponibilidad: 0, trabajoEfectivo: 0, presencia: 0, heDiaria: 0, heSemanal: 0, heMensual: 0, heAnual: 0, excesoPresencia: 0, km: 0 },
  )

  return {
    cfg,
    tramos,
    desde,
    hasta,
    primeraFecha,
    ultimaFecha,
    diasPeriodo: diasEntre(desde, hasta),
    dias,
    jornadas: jornadasSalida,
    semanas,
    meses,
    anios,
    cuatrimestres,
    infracciones,
    actividades,
    totales,
  }
}

// Completa la configuración con los valores por defecto y convierte a número
// los parámetros numéricos (los campos vacíos o no válidos toman el valor por defecto).
export function normalizarConfig(cfg = {}) {
  const r = { ...CONFIG_POR_DEFECTO, ...cfg }
  for (const k of Object.keys(CONFIG_POR_DEFECTO)) {
    if (typeof CONFIG_POR_DEFECTO[k] !== 'number') continue
    const v = Number(r[k])
    r[k] = r[k] === '' || r[k] == null || !Number.isFinite(v) || v < 0 ? CONFIG_POR_DEFECTO[k] : v
  }
  for (const k of ['nocturnoInicio', 'nocturnoFin']) {
    if (!/^\d{1,2}:\d{2}$/.test(r[k] || '')) r[k] = CONFIG_POR_DEFECTO[k]
  }
  if (!['UTC', 'Europe/Madrid', 'Atlantic/Canary'].includes(r.zonaHoraria)) {
    try {
      new Intl.DateTimeFormat('es-ES', { timeZone: r.zonaHoraria })
    } catch {
      r.zonaHoraria = CONFIG_POR_DEFECTO.zonaHoraria
    }
  }
  return r
}

// Horas extraordinarias (minutos) de un mes o un año según el método elegido
export function heSegunMetodo(x, metodo) {
  if (metodo === 'semanal') return x.heSemanal
  if (metodo === 'diario') return x.heDiaria
  if (metodo === 'anual') return x.heAnual
  return x.heMensual
}

// Resumen de incidencias por norma y artículo
export function resumenInfracciones(infracciones) {
  const mapa = new Map()
  for (const i of infracciones) {
    const k = `${i.norma}|${i.articulo}|${i.informativa ? 1 : 0}`
    if (!mapa.has(k)) mapa.set(k, { norma: i.norma, articulo: i.articulo, informativa: !!i.informativa, numero: 0, ejemplo: i.descripcion })
    mapa.get(k).numero++
  }
  const orden = [NORMAS.R561, NORMAS.RD1561, NORMAS.ET]
  return [...mapa.values()].sort(
    (a, b) =>
      orden.indexOf(a.norma) - orden.indexOf(b.norma) ||
      a.informativa - b.informativa ||
      a.articulo.localeCompare(b.articulo, 'es', { numeric: true }),
  )
}
