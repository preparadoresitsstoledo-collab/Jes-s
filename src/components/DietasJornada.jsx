import { useMemo, useRef, useState } from 'react'
import {
  CONFIG_POR_DEFECTO,
  CRITERIOS_DIAS,
  PRORRATEOS,
  REDONDEOS,
  TIPOS_DIETA,
  DATOS_EXPEDIENTE,
  COMPROBACIONES,
  DIETAS_SALARIO,
  CONCEPTOS_COTIZACION,
} from '../data/dietasJornada.js'
import {
  nuevoTrabajador,
  cuadranteTrabajador,
  resumenExpediente,
  resumenTacografo,
  leerLineasDietas,
  buscarTrabajador,
  aniosDelPeriodo,
  normalizarConfig,
  valoracion,
  tiposDelAnio,
} from '../lib/dietasJornada/calculo.js'
import { generarBloques, bloquesATexto, bloquesAHtml } from '../lib/dietasJornada/informe.js'
import { fechaES } from '../lib/tacografo/tiempo.js'

const EXTENSIONES_TAC = /\.(ddd|tgd|c1b|esm|dtc|bin)$/i

const fmt = (x, dec = 0) =>
  x === null || x === undefined || x === ''
    ? '—'
    : Number(x).toLocaleString('es-ES', { minimumFractionDigits: dec, maximumFractionDigits: Math.max(dec, 2), useGrouping: true })

const CAMPOS_ANIO = [
  { id: 'diasIT', label: 'Días IT', ayuda: 'Días de incapacidad temporal u otras situaciones que no computan' },
  { id: 'diasDieta', label: 'Días con dieta', calc: 'diasDieta' },
  { id: 'diasTacografo', label: 'Días tacógrafo', calc: 'diasTacografo' },
  { id: 'horasEfectivas', label: 'Horas trabajo efectivo', calc: 'horasEfectivas', ayuda: 'Conducción + otros trabajos' },
  { id: 'horasPresencia', label: 'Horas presencia', calc: 'horasPresencia', ayuda: 'Disponibilidad' },
  { id: 'vacaciones', label: 'Vacaciones disfrutadas', calc: 'vacaciones' },
  { id: 'diasEnVacaciones', label: 'Días con dieta o actividad en vacaciones', calc: 'diasEnVacaciones' },
]

// Expediente de ejemplo con datos ficticios para ver el funcionamiento
function expedienteEjemplo() {
  const lineas = []
  const precios = [50, 52, 53, 51.5]
  for (let y = 2022; y <= 2025; y++) {
    for (let m = 1; m <= (y === 2025 ? 10 : 12); m++) {
      const mes = `${y}-${String(m).padStart(2, '0')}`
      lineas.push({ mes, tipo: 'nacional_con', dias: 16, importe: precios[(m + y) % 4] })
      lineas.push({ mes, tipo: 'nacional_sin', dias: 5, importe: m % 3 ? 15 : 30 })
      if (m % 4 === 0) lineas.push({ mes, tipo: 'nacional_con', dias: 2, importe: 50 })
    }
  }
  return {
    expediente: {
      empresa: 'Transportes Ejemplo, S.L.',
      actividad: 'transporte de mercancías por carretera a nivel nacional e internacional, actuando al mismo tiempo como operadora de transportes',
      convenio: 'el convenio colectivo de transporte de mercancías por carretera de aplicación',
    },
    cfg: { ...CONFIG_POR_DEFECTO, desde: '2022-01-01', hasta: '2025-10-31' },
    comprobaciones: ['sinJustificantes', 'partesTrabajo', 'dietasMensuales', 'variacionPrecios', 'dietasEnVacaciones', 'sinHE'],
    importesDeclarados:
      'entre 15 y 30 euros/día en el caso de dietas sin pernocta y entre 50 y 53 euros/día en el caso de dietas con pernocta en territorio nacional',
    alegaciones: '',
    trabajadores: [
      nuevoTrabajador({
        nombre: 'Conductor A (ficticio)',
        dietas: lineas,
        anios: { 2022: { vacaciones: 14, diasEnVacaciones: 3 }, 2023: { vacaciones: 10 }, 2024: { vacaciones: 12, horasEfectivas: 1950, horasPresencia: 310 }, 2025: { vacaciones: 7 } },
      }),
      nuevoTrabajador({
        nombre: 'Conductor B (ficticio)',
        alta: '2023-05-02',
        anios: { 2023: { diasDieta: 185, vacaciones: 8 }, 2024: { diasDieta: 262, vacaciones: 15, diasIT: 10 }, 2025: { diasDieta: 214, vacaciones: 6 } },
      }),
    ],
  }
}

function descargar(contenido, nombre, tipo) {
  const blob = contenido instanceof Blob ? contenido : new Blob([contenido], { type: tipo })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = nombre
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

const nombreArchivo = (txt) =>
  (txt || 'expediente')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^A-Za-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 40) || 'expediente'

export default function DietasJornada() {
  const [cfg, setCfgEstado] = useState({ ...CONFIG_POR_DEFECTO })
  const [expediente, setExpediente] = useState({})
  const [trabajadores, setTrabajadores] = useState([nuevoTrabajador({ nombre: 'Trabajador 1' })])
  const [abierto, setAbierto] = useState(null)
  const [comprobaciones, setComprobaciones] = useState([])
  const [alegaciones, setAlegaciones] = useState('')
  const [importesDeclarados, setImportesDeclarados] = useState('')
  const [textoDietas, setTextoDietas] = useState('')
  const [mensajes, setMensajes] = useState([])
  const [leyendo, setLeyendo] = useState(false)
  const [generando, setGenerando] = useState(false)
  const [copiado, setCopiado] = useState(false)
  const inputTac = useRef(null)
  const inputJson = useRef(null)

  const setCfg = (c) => setCfgEstado((p) => ({ ...p, ...c }))
  const cfgN = normalizarConfig(cfg)
  const periodoValido = cfg.desde && cfg.hasta && cfg.desde <= cfg.hasta

  const resumen = useMemo(() => (periodoValido ? resumenExpediente(trabajadores, cfg) : null), [trabajadores, cfg, periodoValido])
  const valor = useMemo(() => (resumen ? valoracion(resumen, cfg) : null), [resumen, cfg])
  const bloques = useMemo(
    () => (resumen ? generarBloques({ expediente, cfg, resumen, comprobaciones, alegaciones, importesDeclarados }) : []),
    [resumen, expediente, cfg, comprobaciones, alegaciones, importesDeclarados],
  )

  function actualizar(id, cambios) {
    setTrabajadores((ts) => ts.map((t) => (t.id === id ? { ...t, ...(typeof cambios === 'function' ? cambios(t) : cambios) } : t)))
  }
  function setAnio(id, anio, campo, valor) {
    actualizar(id, (t) => ({ anios: { ...t.anios, [anio]: { ...(t.anios[anio] || {}), [campo]: valor } } }))
  }
  function anadirTrabajador() {
    const t = nuevoTrabajador({ nombre: `Trabajador ${trabajadores.length + 1}` })
    setTrabajadores((ts) => [...ts, t])
    setAbierto(t.id)
  }
  function quitarTrabajador(id) {
    if (!window.confirm('¿Eliminar este trabajador y todos sus datos?')) return
    setTrabajadores((ts) => ts.filter((t) => t.id !== id))
  }

  // ── Tacógrafo ──
  async function leerTacografos(lista) {
    const ficheros = [...lista].filter((f) => EXTENSIONES_TAC.test(f.name) || /^C_/i.test(f.name))
    if (!ficheros.length) return
    setLeyendo(true)
    const msgs = []
    try {
      const [{ leerArchivoTarjeta }, { agruparPorConductor }, { analizar }, { CONFIG_POR_DEFECTO: CFG_TAC }] = await Promise.all([
        import('../lib/tacografo/ddd.js'),
        import('../lib/tacografo/conductores.js'),
        import('../lib/tacografo/analisis.js'),
        import('../data/tacografo.js'),
      ])
      const lecturas = []
      for (const f of ficheros) {
        try {
          lecturas.push(leerArchivoTarjeta(await f.arrayBuffer(), f.name))
        } catch (e) {
          msgs.push(`⚠️ ${f.name}: ${e.message}`)
        }
      }
      const conductores = agruparPorConductor(lecturas)
      setTrabajadores((previos) => {
        let ts = [...previos]
        for (const c of conductores) {
          let r
          try {
            r = analizar(c, CFG_TAC)
          } catch (e) {
            msgs.push(`⚠️ ${c.nombreCompleto}: ${e.message}`)
            continue
          }
          const tac = resumenTacografo(r, c.archivos)
          const existente = buscarTrabajador(ts, c.nombreCompleto)
          const vacio = ts.length === 1 && !ts[0].tacografo && !ts[0].dietas.length && /^Trabajador \d+$/.test(ts[0].nombre)
          if (existente) {
            ts = ts.map((t) => (t.id === existente.id ? { ...t, tacografo: tac } : t))
          } else if (vacio) {
            ts = [{ ...ts[0], nombre: c.nombreCompleto, tacografo: tac }]
          } else {
            ts.push(nuevoTrabajador({ nombre: c.nombreCompleto, tacografo: tac }))
          }
          msgs.push(`✅ ${c.nombreCompleto}: ${tac.fechas.length} días con actividad (${fechaES(tac.desde)} – ${fechaES(tac.hasta)}), ${c.archivos.length} archivo(s).`)
        }
        return ts
      })
      if (!cfg.desde && conductores.length) {
        const fechas = conductores.flatMap((c) => [c.primerDia, c.ultimoDia]).filter(Boolean).sort()
        if (fechas.length) setCfg({ desde: fechas[0], hasta: fechas[fechas.length - 1] })
      }
    } finally {
      setMensajes(msgs)
      setLeyendo(false)
    }
  }

  // ── Dietas pegadas ──
  function importarDietas() {
    const { lineas, errores } = leerLineasDietas(textoDietas)
    const msgs = errores.map((e) => `⚠️ Fila ${e.fila}: ${e.error}`)
    if (!lineas.length) {
      setMensajes([...msgs, '⚠️ No se ha reconocido ninguna línea de dietas.'])
      return
    }
    setTrabajadores((previos) => {
      let ts = [...previos]
      const porTrab = new Map()
      for (const l of lineas) {
        const k = l.trabajador || 'Sin nombre'
        if (!porTrab.has(k)) porTrab.set(k, [])
        porTrab.get(k).push({ mes: l.mes, tipo: l.tipo, dias: l.dias, importe: l.importe })
      }
      for (const [nombre, ls] of porTrab) {
        const existente = buscarTrabajador(ts, nombre)
        const vacio = ts.length === 1 && !ts[0].tacografo && !ts[0].dietas.length && /^Trabajador \d+$/.test(ts[0].nombre)
        if (existente) ts = ts.map((t) => (t.id === existente.id ? { ...t, dietas: [...t.dietas, ...ls] } : t))
        else if (vacio) ts = [{ ...ts[0], nombre, dietas: ls }]
        else ts.push(nuevoTrabajador({ nombre, dietas: ls }))
        msgs.push(`✅ ${nombre}: ${ls.length} líneas de dietas importadas.`)
      }
      return ts
    })
    setMensajes(msgs)
    setTextoDietas('')
  }

  // ── Guardar / abrir expediente ──
  function guardarExpediente() {
    const datos = { version: 1, cfg, expediente, trabajadores, comprobaciones, alegaciones, importesDeclarados }
    descargar(JSON.stringify(datos, null, 2), `dietas-jornada_${nombreArchivo(expediente.empresa)}.json`, 'application/json')
  }
  async function abrirExpediente(f) {
    if (!f) return
    try {
      const d = JSON.parse(await f.text())
      if (!Array.isArray(d.trabajadores)) throw new Error('No es un expediente de esta herramienta')
      cargar(d)
      setMensajes([`✅ Expediente «${f.name}» abierto.`])
    } catch (e) {
      setMensajes([`⚠️ ${e.message}`])
    }
  }
  function cargar(d) {
    setCfgEstado({ ...CONFIG_POR_DEFECTO, ...(d.cfg || {}) })
    setExpediente(d.expediente || {})
    setTrabajadores(d.trabajadores.map((t) => nuevoTrabajador(t)))
    setComprobaciones(d.comprobaciones || [])
    setAlegaciones(d.alegaciones || '')
    setImportesDeclarados(d.importesDeclarados || '')
    setAbierto(null)
  }
  function nuevoExpediente() {
    if (!window.confirm('¿Empezar un expediente nuevo? Se borrarán los datos no guardados.')) return
    cargar({ trabajadores: [nuevoTrabajador({ nombre: 'Trabajador 1' })] })
    setMensajes([])
  }

  // ── Salidas ──
  async function copiarTexto() {
    try {
      await navigator.clipboard.writeText(bloquesATexto(bloques))
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch {
      setMensajes(['⚠️ El navegador no permite copiar; usa «Descargar Word».'])
    }
  }
  function descargarWord() {
    const html = bloquesAHtml(bloques, `Hechos comprobados${expediente.empresa ? ` — ${expediente.empresa}` : ''}`)
    descargar('﻿' + html, `hechos_${nombreArchivo(expediente.empresa)}.doc`, 'application/msword')
  }
  function imprimir() {
    const w = window.open('', '_blank')
    if (!w) return
    w.document.write(bloquesAHtml(bloques, 'Hechos comprobados'))
    w.document.close()
    w.focus()
    w.print()
  }
  async function descargarExcel() {
    setGenerando(true)
    try {
      const { generarExcel } = await import('../lib/dietasJornada/excel.js')
      const buf = await generarExcel({ resumen, cfg, expediente })
      descargar(new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), `dietas-jornada_${nombreArchivo(expediente.empresa)}.xlsx`)
    } catch (e) {
      setMensajes([`⚠️ No se pudo generar el Excel: ${e.message}`])
    } finally {
      setGenerando(false)
    }
  }

  return (
    <div className="analizador tacografo dietas">
      <header className="analizador__hero">
        <div className="contenedor">
          <a className="analizador__volver" href="#/herramientas">
            ← Volver a herramientas
          </a>
          <h1>Dietas y jornada anual</h1>
          <p className="analizador__lema">
            Cruza los <strong>días con dieta de las nóminas</strong>, la <strong>actividad del tacógrafo</strong> y el{' '}
            <strong>cuadrante de vacaciones</strong> con la <strong>jornada máxima anual del convenio</strong>. Calcula
            el cuadrante de excesos de jornada por años, las horas extraordinarias a cotizar, detecta importes de dietas
            irregulares y redacta los hechos comprobados listos para el informe o el acta.
          </p>
          <p className="analizador__aviso-legal">
            🔒 Todo se procesa <strong>solo en tu navegador</strong>: no se envía nada a ningún servidor ni se guarda en
            la web. Usa «Guardar expediente» para conservarlo en tu equipo. ⚖️ Resultado <strong>orientativo</strong>:
            revisa los parámetros del convenio y el texto antes de usarlo.
          </p>
        </div>
      </header>

      <div className="contenedor tacografo__cuerpo">
        {/* Barra de expediente */}
        <section className="analizador__panel">
          <div className="analizador__acciones dietas__barra">
            <button className="btn--secundario" onClick={nuevoExpediente}>
              Nuevo expediente
            </button>
            <button className="btn--secundario" onClick={() => inputJson.current?.click()}>
              Abrir expediente…
            </button>
            <button className="btn--secundario" onClick={guardarExpediente}>
              Guardar expediente
            </button>
            <button
              className="btn--texto"
              onClick={() => {
                cargar(expedienteEjemplo())
                setMensajes(['Cargado un ejemplo con datos ficticios.'])
              }}
            >
              Ver un ejemplo
            </button>
            <input ref={inputJson} type="file" accept=".json,application/json" hidden onChange={(e) => (abrirExpediente(e.target.files[0]), (e.target.value = ''))} />
          </div>
          {mensajes.length > 0 && (
            <ul className="analizador__avisos">
              {mensajes.map((m, i) => (
                <li key={i} className={`aviso ${m.startsWith('⚠️') ? 'aviso--alerta' : 'aviso--info'}`}>
                  {m}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* 1. Expediente y parámetros */}
        <section className="analizador__panel">
          <h2>1. Empresa, periodo y parámetros del convenio</h2>
          <div className="tacografo__parametros">
            {DATOS_EXPEDIENTE.map((d) => (
              <div className="campo" key={d.id}>
                <label htmlFor={`exp-${d.id}`}>{d.label}</label>
                <input
                  id={`exp-${d.id}`}
                  value={expediente[d.id] || ''}
                  placeholder={d.placeholder || ''}
                  onChange={(e) => setExpediente((x) => ({ ...x, [d.id]: e.target.value }))}
                />
              </div>
            ))}
          </div>

          <h3 className="tacografo__subtitulo">Periodo examinado</h3>
          <div className="campo-fila">
            <div className="campo">
              <label htmlFor="desde">Desde</label>
              <input id="desde" type="date" value={cfg.desde} onChange={(e) => setCfg({ desde: e.target.value })} />
            </div>
            <div className="campo">
              <label htmlFor="hasta">Hasta</label>
              <input id="hasta" type="date" value={cfg.hasta} onChange={(e) => setCfg({ hasta: e.target.value })} />
            </div>
          </div>
          {!periodoValido && <p className="aviso aviso--alerta">Indica el periodo examinado (por ejemplo, 01/01/2022 – 31/10/2025).</p>}

          <h3 className="tacografo__subtitulo">Jornada y vacaciones</h3>
          <div className="tacografo__parametros">
            <div className="campo">
              <label htmlFor="ja">Jornada máxima anual (horas)</label>
              <input id="ja" inputMode="decimal" value={cfg.jornadaAnual} onChange={(e) => setCfg({ jornadaAnual: e.target.value })} />
            </div>
            <div className="campo">
              <label htmlFor="jd">Jornada diaria (horas)</label>
              <input id="jd" inputMode="decimal" value={cfg.jornadaDiaria} onChange={(e) => setCfg({ jornadaDiaria: e.target.value })} />
              <p className="campo__ayuda">= {fmt(cfgN.jornadaAnual / cfgN.jornadaDiaria, 0)} días hábiles al año</p>
            </div>
            <div className="campo">
              <label htmlFor="va">Vacaciones anuales (días naturales)</label>
              <input id="va" inputMode="numeric" value={cfg.vacacionesAnuales} onChange={(e) => setCfg({ vacacionesAnuales: e.target.value })} />
            </div>
            <div className="campo">
              <label htmlFor="he">Límite anual de horas extra</label>
              <input id="he" inputMode="numeric" value={cfg.limiteHEAnual} onChange={(e) => setCfg({ limiteHEAnual: e.target.value })} />
            </div>
            <div className="campo">
              <label htmlFor="pr">Periodos inferiores al año</label>
              <select id="pr" className="tacografo__select" value={cfg.prorrateo} onChange={(e) => setCfg({ prorrateo: e.target.value })}>
                {PRORRATEOS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} — {p.detalle}
                  </option>
                ))}
              </select>
            </div>
            <div className="campo">
              <label htmlFor="re">Redondeo de días hábiles</label>
              <select id="re" className="tacografo__select" value={cfg.redondeo} onChange={(e) => setCfg({ redondeo: e.target.value })}>
                {REDONDEOS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <h3 className="tacografo__subtitulo">Días efectivamente trabajados</h3>
          <div className="tacografo__metodos">
            {CRITERIOS_DIAS.map((c) => (
              <label key={c.id} className={`tacografo__metodo ${cfg.criterioDias === c.id ? 'tacografo__metodo--activo' : ''}`}>
                <input type="radio" name="criterio" checked={cfg.criterioDias === c.id} onChange={() => setCfg({ criterioDias: c.id })} />
                <span>
                  <strong>{c.nombre}</strong>
                  <small>{c.detalle}</small>
                </span>
              </label>
            ))}
          </div>

          {periodoValido && (
            <>
              <h3 className="tacografo__subtitulo">Tablas salariales del convenio (para valorar las diferencias)</h3>
              <p className="campo__ayuda">
                Introduce, para cada año, el precio de la hora extraordinaria y el de la hora ordinaria de la categoría
                del trabajador según las tablas del convenio aplicable (BOP). La hora ordinaria valora el exceso de
                tiempo de presencia.
              </p>
              <div className="tacografo__tabla-scroll">
                <table className="calc__tabla dietas__tabla-anios">
                  <thead>
                    <tr>
                      <th>Año</th>
                      <th>€ / hora extraordinaria</th>
                      <th>€ / hora ordinaria</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aniosDelPeriodo(cfg.desde, cfg.hasta).map((a) => (
                      <tr key={a}>
                        <td>{a}</td>
                        <td>
                          <input
                            inputMode="decimal"
                            aria-label={`Precio hora extraordinaria ${a}`}
                            value={cfg.preciosHE?.[a] ?? ''}
                            onChange={(e) => setCfg({ preciosHE: { ...cfg.preciosHE, [a]: e.target.value } })}
                          />
                        </td>
                        <td>
                          <input
                            inputMode="decimal"
                            aria-label={`Precio hora ordinaria ${a}`}
                            value={cfg.preciosOrdinaria?.[a] ?? ''}
                            onChange={(e) => setCfg({ preciosOrdinaria: { ...cfg.preciosOrdinaria, [a]: e.target.value } })}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3 className="tacografo__subtitulo">Dietas que se integran en la base de cotización</h3>
              <div className="tacografo__metodos">
                {DIETAS_SALARIO.map((c) => (
                  <label key={c.id} className={`tacografo__metodo ${cfg.dietasSalario === c.id ? 'tacografo__metodo--activo' : ''}`}>
                    <input type="radio" name="dietasSalario" checked={cfg.dietasSalario === c.id} onChange={() => setCfg({ dietasSalario: c.id })} />
                    <span>
                      <strong>{c.nombre}</strong>
                      <small>{c.detalle}</small>
                    </span>
                  </label>
                ))}
              </div>

              <details className="dietas__tipos">
                <summary>Tipos de cotización (%) — revisar para cada ejercicio</summary>
                <p className="campo__ayuda">
                  Valores orientativos: contingencias comunes, MEI, desempleo (contrato indefinido), FOGASA, FP, AT/EP
                  (CNAE 4941) y cotización adicional por horas extraordinarias no motivadas por fuerza mayor.
                  Compruébalos en la Orden de cotización de cada año y en la tarifa de AT/EP del CNAE de la empresa.
                </p>
                <div className="tacografo__tabla-scroll">
                  <table className="calc__tabla dietas__tabla-anios">
                    <thead>
                      <tr>
                        <th>Concepto</th>
                        {aniosDelPeriodo(cfg.desde, cfg.hasta).map((a) => (
                          <th key={a} colSpan={2}>
                            {a} (empresa / trabajador)
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {CONCEPTOS_COTIZACION.map((c) => (
                        <tr key={c.id}>
                          <td>{c.nombre}</td>
                          {aniosDelPeriodo(cfg.desde, cfg.hasta).flatMap((a) => {
                            const tp = tiposDelAnio(+a, cfg)
                            return [0, 1].map((k) => (
                              <td key={a + k}>
                                <input
                                  inputMode="decimal"
                                  aria-label={`${c.nombre} ${a} ${k ? 'trabajador' : 'empresa'}`}
                                  value={cfg.tiposCotizacion?.[a]?.[c.id]?.[k] ?? String(tp[c.id][k]).replace('.', ',')}
                                  onChange={(e) => {
                                    const actual = cfg.tiposCotizacion?.[a] || {}
                                    const par = [...(actual[c.id] || tp[c.id])]
                                    par[k] = e.target.value
                                    setCfg({ tiposCotizacion: { ...cfg.tiposCotizacion, [a]: { ...actual, [c.id]: par } } })
                                  }}
                                />
                              </td>
                            ))
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            </>
          )}
        </section>

        {/* 2. Importar datos */}
        <section className="analizador__panel">
          <h2>2. Importar datos</h2>
          <div className="dietas__importar">
            <div>
              <h3 className="tacografo__subtitulo">Tacógrafo (tarjeta del conductor)</h3>
              <p className="campo__ayuda">
                Archivos .DDD / .TGD de la tarjeta de cada conductor. Se calculan los días con actividad y las horas de
                trabajo efectivo y de presencia, y se asignan al trabajador con el mismo nombre (o se crea uno nuevo).
              </p>
              <button className="btn btn--primario" disabled={leyendo} onClick={() => inputTac.current?.click()}>
                {leyendo ? 'Leyendo…' : 'Cargar archivos de tacógrafo'}
              </button>
              <input ref={inputTac} type="file" multiple hidden onChange={(e) => (leerTacografos(e.target.files), (e.target.value = ''))} />
            </div>
            <div>
              <h3 className="tacografo__subtitulo">Dietas de las nóminas</h3>
              <p className="campo__ayuda">
                Pega desde Excel (o CSV con «;») una fila por línea de nómina con las columnas:{' '}
                <code>trabajador · mes · tipo de dieta · días · importe por día</code>. Ej.:{' '}
                <code>Pérez Gómez, Juan · 01/2023 · con pernocta · 20 · 52,50</code>
              </p>
              <textarea className="analizador__texto" rows={4} value={textoDietas} onChange={(e) => setTextoDietas(e.target.value)} placeholder="Pega aquí las líneas de dietas…" />
              <div className="analizador__acciones">
                <button className="btn--secundario" disabled={!textoDietas.trim()} onClick={importarDietas}>
                  Importar dietas
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Trabajadores */}
        <section className="analizador__panel">
          <h2>3. Trabajadores</h2>
          <p className="campo__ayuda">
            Los datos que escribas en la tabla de cada año prevalecen sobre los calculados (que aparecen en gris como
            sugerencia). Puedes trabajar solo con cifras anuales, sin cargar tacógrafos ni líneas de nómina.
          </p>
          {trabajadores.map((t) => (
            <Trabajador
              key={t.id}
              t={t}
              cfg={cfg}
              periodoValido={periodoValido}
              abierto={abierto === t.id || trabajadores.length === 1}
              onToggle={() => setAbierto(abierto === t.id ? null : t.id)}
              onCambio={(c) => actualizar(t.id, c)}
              onAnio={(anio, campo, v) => setAnio(t.id, anio, campo, v)}
              onQuitar={() => quitarTrabajador(t.id)}
            />
          ))}
          <div className="analizador__acciones">
            <button className="btn--secundario" onClick={anadirTrabajador}>
              + Añadir trabajador
            </button>
          </div>
        </section>

        {/* 4. Comprobaciones */}
        <section className="analizador__panel">
          <h2>4. Comprobaciones y alegaciones</h2>
          {COMPROBACIONES.map((c) => (
            <label key={c.id} className="tacografo__casilla">
              <input
                type="checkbox"
                checked={comprobaciones.includes(c.id)}
                onChange={(e) => setComprobaciones((x) => (e.target.checked ? [...x, c.id] : x.filter((y) => y !== c.id)))}
              />
              <span>{c.texto}</span>
            </label>
          ))}
          <div className="campo">
            <label htmlFor="imp">Importes de las dietas declarados por la empresa (opcional)</label>
            <input
              id="imp"
              value={importesDeclarados}
              onChange={(e) => setImportesDeclarados(e.target.value)}
              placeholder="entre 15 y 30 €/día sin pernocta y entre 50 y 53 €/día con pernocta"
            />
          </div>
          <div className="campo">
            <label htmlFor="ale">Escrito de la empresa (opcional, se cita literalmente)</label>
            <textarea id="ale" className="analizador__texto" rows={4} value={alegaciones} onChange={(e) => setAlegaciones(e.target.value)} />
          </div>
        </section>

        {/* 5. Resultados */}
        {resumen && (
          <section className="analizador__panel">
            <h2>5. Resultados</h2>
            <div className="tacografo__kpis">
              <Kpi titulo="Trabajadores" valor={fmt(resumen.datos.length)} />
              <Kpi titulo="Con exceso de jornada" valor={fmt(resumen.conExceso.length)} alerta={resumen.conExceso.length > 0} />
              <Kpi titulo="Exceso (días)" valor={fmt(resumen.excesoDias)} alerta={resumen.excesoDias > 0} />
              <Kpi titulo="Exceso (horas, por días)" valor={fmt(resumen.excesoHoras)} alerta={resumen.excesoHoras > 0} />
              {resumen.conHoras.length > 0 && <Kpi titulo="Horas extra (B. CP)" valor={fmt(resumen.excesoHE, 2)} alerta={resumen.excesoHE > 0} />}
              {resumen.conHoras.length > 0 && <Kpi titulo="Exceso jornada (B. CC)" valor={fmt(resumen.excesoCC, 2)} alerta={resumen.excesoCC > 0} />}
              <Kpi titulo="Sin vacaciones completas" valor={fmt(resumen.sinVacaciones.length)} alerta={resumen.sinVacaciones.length > 0} />
              <Kpi titulo="Con precios de dieta variables" valor={fmt(resumen.conVariacion.length)} alerta={resumen.conVariacion.length > 0} />
              {valor?.totales.totalSalarial > 0 && <Kpi titulo="Diferencias salariales" valor={`${fmt(valor.totales.totalSalarial, 2)} €`} alerta />}
              {valor?.totales.cuotaTotal > 0 && <Kpi titulo="Cuotas no ingresadas" valor={`${fmt(valor.totales.cuotaTotal, 2)} €`} alerta />}
              {resumen.excesoNoExento > 0 && <Kpi titulo="Dietas por encima del límite exento" valor={`${fmt(resumen.excesoNoExento, 2)} €`} alerta />}
            </div>

            <h3 className="tacografo__subtitulo">Cuadrante por días</h3>
            <div className="tacografo__tabla-scroll">
              <table className="calc__tabla">
                <thead>
                  <tr>
                    <th>Trabajador</th>
                    <th>Año</th>
                    <th>Días hábiles teóricos</th>
                    <th>Días con dieta</th>
                    <th>Días tacógrafo</th>
                    <th>Días trabajados</th>
                    <th>Exceso días</th>
                    <th>Exceso horas</th>
                    <th>Vacaciones disfrutadas / debidas</th>
                  </tr>
                </thead>
                <tbody>
                  {resumen.datos.map((d) =>
                    d.cuadrante.filas.map((f) => (
                      <tr key={d.trabajador.id + f.anio}>
                        <td>{d.trabajador.nombre}</td>
                        <td>
                          {f.anio}
                          {!f.completo && <small> ({fechaES(f.desde).slice(0, 5)}–{fechaES(f.hasta).slice(0, 5)})</small>}
                        </td>
                        <td>{fmt(f.diasTeoricos)}</td>
                        <td>{fmt(f.diasDieta)}</td>
                        <td>{fmt(f.diasTacografo)}</td>
                        <td>{fmt(f.diasTrabajados)}</td>
                        <td className={f.excesoDias > 0 ? 'dietas__exceso' : ''}>{fmt(f.excesoDias)}</td>
                        <td className={f.excesoHoras > 0 ? 'dietas__exceso' : ''}>
                          {fmt(f.excesoHoras)}
                          {f.superaLimiteHE && ' ⚠️'}
                        </td>
                        <td className={f.deficitVacaciones > 0 ? 'dietas__exceso' : ''}>
                          {f.vacaciones === null ? '—' : `${fmt(f.vacaciones)} / ${fmt(f.vacacionesDebidas)}`}
                          {f.diasEnVacaciones > 0 && <small> · {fmt(f.diasEnVacaciones)} trabajados</small>}
                        </td>
                      </tr>
                    )),
                  )}
                </tbody>
              </table>
            </div>
            <p className="campo__ayuda">⚠️ supera el límite de {fmt(cfgN.limiteHEAnual)} horas extraordinarias al año (art. 35.2 ET).</p>

            {resumen.conHoras.length > 0 && (
              <>
                <h3 className="tacografo__subtitulo">Cálculo por horas (jornada máxima proporcional a los días de alta)</h3>
                <div className="tacografo__tabla-scroll">
                  <table className="calc__tabla">
                    <thead>
                      <tr>
                        <th>Trabajador</th>
                        <th>Año</th>
                        <th>Días en alta</th>
                        <th>Días IT</th>
                        <th>Jornada máxima (h)</th>
                        <th>Trabajo efectivo (h)</th>
                        <th>Presencia (h)</th>
                        <th>Exceso HE (B. CP)</th>
                        <th>Exceso jornada (B. CC)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resumen.conHoras.map((d) =>
                        d.cuadrante.filas
                          .filter((f) => f.excesoHE !== null)
                          .map((f) => (
                            <tr key={d.trabajador.id + f.anio}>
                              <td>{d.trabajador.nombre}</td>
                              <td>{f.anio}</td>
                              <td>{fmt(f.diasAlta)}</td>
                              <td>{fmt(f.diasIT)}</td>
                              <td>{fmt(f.jornadaMaxima, 2)}</td>
                              <td>{fmt(f.horasEfectivas, 2)}</td>
                              <td>{fmt(f.horasPresencia, 2)}</td>
                              <td className={f.excesoHE > 0 ? 'dietas__exceso' : ''}>{fmt(f.excesoHE, 2)}</td>
                              <td className={f.excesoCC > 0 ? 'dietas__exceso' : ''}>{fmt(f.excesoCC, 2)}</td>
                            </tr>
                          )),
                      )}
                    </tbody>
                  </table>
                </div>
                <p className="campo__ayuda">
                  Jornada máxima = {fmt(cfgN.jornadaAnual)} h × (días en alta − IT) / días del año. El trabajo efectivo
                  que la excede son horas extraordinarias (base de contingencias profesionales); el resto del exceso
                  (presencia), base de contingencias comunes. Son horas a cotizar si no constan cotizadas en nómina.
                </p>
              </>
            )}

            {valor && (
              <>
                <h3 className="tacografo__subtitulo">Diferencias salariales y de cotización</h3>
                {valor.faltanPrecios && (
                  <p className="aviso aviso--alerta">
                    Faltan precios de hora en las tablas salariales (apartado 1) para valorar todos los excesos.
                  </p>
                )}
                <div className="tacografo__tabla-scroll">
                  <table className="calc__tabla">
                    <thead>
                      <tr>
                        <th>Trabajador</th>
                        <th>Año</th>
                        <th>Horas extra</th>
                        <th>Importe HE</th>
                        <th>Horas presencia</th>
                        <th>Importe presencia</th>
                        <th>Dietas a cotizar</th>
                        <th>Diferencia salarial</th>
                        <th>Cuota empresa</th>
                        <th>Cuota trabajador</th>
                        <th>Cuota total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {valor.filas.map((x) => (
                        <tr key={x.trabajador.id + x.anio}>
                          <td>{x.trabajador.nombre}</td>
                          <td>
                            {x.anio} <small>({x.metodo === 'horas' ? 'por horas' : 'por días'})</small>
                          </td>
                          <td>{fmt(x.horasHE, 2)}</td>
                          <td>{fmt(x.importeHE, 2)} €</td>
                          <td>{fmt(x.horasOrd, 2)}</td>
                          <td>{fmt(x.importeOrd, 2)} €</td>
                          <td>{fmt(x.dietas, 2)} €</td>
                          <td className={x.totalSalarial > 0 ? 'dietas__exceso' : ''}>{fmt(x.totalSalarial, 2)} €</td>
                          <td>{fmt(x.cuotaEmpresa, 2)} €</td>
                          <td>{fmt(x.cuotaTrabajador, 2)} €</td>
                          <td className={x.cuotaTotal > 0 ? 'dietas__exceso' : ''}>{fmt(x.cuotaTotal, 2)} €</td>
                        </tr>
                      ))}
                      <tr className="dietas__total">
                        <td>Total</td>
                        <td />
                        <td />
                        <td>{fmt(valor.totales.importeHE, 2)} €</td>
                        <td />
                        <td>{fmt(valor.totales.importeOrd, 2)} €</td>
                        <td>{fmt(valor.totales.dietas, 2)} €</td>
                        <td>{fmt(valor.totales.totalSalarial, 2)} €</td>
                        <td>{fmt(valor.totales.cuotaEmpresa, 2)} €</td>
                        <td>{fmt(valor.totales.cuotaTrabajador, 2)} €</td>
                        <td>{fmt(valor.totales.cuotaTotal, 2)} €</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="campo__ayuda">
                  Se valoran las horas del método por horas (tacógrafo) cuando existen y, si no, el exceso por días.
                  Las horas extraordinarias cotizan en la base de contingencias profesionales más la cotización
                  adicional; el exceso de presencia y las dietas integradas, en ambas bases. No se aplican topes de
                  bases ni la cotización de solidaridad.
                </p>
              </>
            )}

            {resumen.datos.some((d) => d.dietas.porTipo.length) && (
              <>
                <h3 className="tacografo__subtitulo">Importes de las dietas</h3>
                <div className="tacografo__tabla-scroll">
                  <table className="calc__tabla">
                    <thead>
                      <tr>
                        <th>Trabajador</th>
                        <th>Tipo</th>
                        <th>Días</th>
                        <th>Rango €/día</th>
                        <th>Importes distintos</th>
                        <th>Media €/día</th>
                        <th>Total</th>
                        <th>Por encima del límite exento</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resumen.datos.flatMap((d) =>
                        d.dietas.porTipo.map((x) => (
                          <tr key={d.trabajador.id + x.tipo}>
                            <td>{d.trabajador.nombre}</td>
                            <td>{x.nombre}</td>
                            <td>{fmt(x.dias)}</td>
                            <td>
                              {fmt(x.min, 2)} – {fmt(x.max, 2)}
                            </td>
                            <td className={x.precios.length > 1 ? 'dietas__exceso' : ''}>{x.precios.length}</td>
                            <td>{fmt(x.media, 2)}</td>
                            <td>{fmt(x.total, 2)} €</td>
                            <td className={x.excesoNoExento > 0 ? 'dietas__exceso' : ''}>{fmt(x.excesoNoExento, 2)} €</td>
                          </tr>
                        )),
                      )}
                    </tbody>
                  </table>
                </div>
                <p className="campo__ayuda">
                  Límites exentos diarios orientativos (art. 9.A RIRPF): manutención 26,67 € / 53,34 € en España y 48,08 € /
                  91,35 € en el extranjero, más 15 € / 25 € de estancia sin justificar para conductores de transporte de
                  mercancías por carretera. Compruébalos para cada ejercicio.
                </p>
              </>
            )}
          </section>
        )}

        {/* 6. Informe */}
        {resumen && (
          <section className="analizador__panel">
            <h2>6. Hechos comprobados</h2>
            <p className="campo__ayuda">
              Propuesta de redacción generada con los datos anteriores. Revísala y adáptala antes de incorporarla al
              informe, requerimiento o acta.
            </p>
            <div className="analizador__acciones">
              <button className="btn btn--primario" onClick={copiarTexto}>
                {copiado ? '¡Copiado!' : 'Copiar texto'}
              </button>
              <button className="btn--secundario" onClick={descargarWord}>
                Descargar Word
              </button>
              <button className="btn--secundario" onClick={descargarExcel} disabled={generando}>
                {generando ? 'Generando…' : 'Descargar Excel'}
              </button>
              <button className="btn--secundario" onClick={imprimir}>
                Imprimir / PDF
              </button>
            </div>
            <article className="dietas__informe">
              {bloques.map((b, i) => {
                if (b.tipo === 'titulo') return <h3 key={i}>{b.texto}</h3>
                if (b.tipo === 'cita') return <blockquote key={i}>{b.texto}</blockquote>
                if (b.tipo === 'lista')
                  return (
                    <ul key={i}>
                      {b.items.map((x, j) => (
                        <li key={j}>{x}</li>
                      ))}
                    </ul>
                  )
                if (b.tipo === 'tabla')
                  return (
                    <div key={i} className="tacografo__tabla-scroll">
                      <table className="calc__tabla">
                        <thead>
                          <tr>
                            {b.cabecera.map((c) => (
                              <th key={c}>{c}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {b.filas.map((f, j) => (
                            <tr key={j}>
                              {f.map((c, k) => (
                                <td key={k}>{c}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                return <p key={i}>{b.texto}</p>
              })}
            </article>
          </section>
        )}
      </div>
    </div>
  )
}

function Kpi({ titulo, valor, alerta }) {
  return (
    <div className={`tacografo__kpi ${alerta ? 'dietas__kpi--alerta' : ''}`}>
      <span>{titulo}</span>
      <strong>{valor}</strong>
    </div>
  )
}

function Trabajador({ t, cfg, periodoValido, abierto, onToggle, onCambio, onAnio, onQuitar }) {
  const cuadrante = periodoValido ? cuadranteTrabajador({ ...t, anios: {} }, cfg) : { filas: [] }
  const calc = Object.fromEntries(cuadrante.filas.map((f) => [f.anio, f]))
  const anios = cuadrante.filas.map((f) => f.anio)

  function setLinea(i, cambios) {
    onCambio((x) => ({ dietas: x.dietas.map((l, j) => (j === i ? { ...l, ...cambios } : l)) }))
  }
  function setVac(i, cambios) {
    onCambio((x) => ({ vacaciones: x.vacaciones.map((l, j) => (j === i ? { ...l, ...cambios } : l)) }))
  }

  return (
    <div className="dietas__trabajador">
      <button className="dietas__cabecera" onClick={onToggle} aria-expanded={abierto}>
        <span>{abierto ? '▾' : '▸'}</span>
        <strong>{t.nombre || 'Sin nombre'}</strong>
        <small>
          {t.tacografo ? `🚚 ${t.tacografo.fechas.length} días de tacógrafo · ` : ''}
          {t.dietas.length ? `🧾 ${t.dietas.length} líneas de dietas · ` : ''}
          {t.vacaciones.length ? `🏖️ ${t.vacaciones.length} periodos de vacaciones` : ''}
        </small>
      </button>
      {abierto && (
        <div className="dietas__detalle">
          <div className="tacografo__parametros">
            <div className="campo">
              <label>Nombre</label>
              <input value={t.nombre} onChange={(e) => onCambio({ nombre: e.target.value })} />
            </div>
            <div className="campo">
              <label>DNI/NIE (opcional)</label>
              <input value={t.dni} onChange={(e) => onCambio({ dni: e.target.value })} />
            </div>
            <div className="campo">
              <label>Alta (si es posterior al inicio)</label>
              <input type="date" value={t.alta} onChange={(e) => onCambio({ alta: e.target.value })} />
            </div>
            <div className="campo">
              <label>Baja (si es anterior al fin)</label>
              <input type="date" value={t.baja} onChange={(e) => onCambio({ baja: e.target.value })} />
            </div>
          </div>

          {periodoValido && (
            <div className="tacografo__tabla-scroll">
              <table className="calc__tabla dietas__tabla-anios">
                <thead>
                  <tr>
                    <th>Año</th>
                    {CAMPOS_ANIO.map((c) => (
                      <th key={c.id} title={c.ayuda}>
                        {c.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {anios.map((a) => (
                    <tr key={a}>
                      <td>{a}</td>
                      {CAMPOS_ANIO.map((c) => {
                        const sugerido = c.calc ? calc[a]?.[c.calc] : null
                        return (
                          <td key={c.id}>
                            <input
                              inputMode="decimal"
                              aria-label={`${c.label} ${a}`}
                              value={t.anios[a]?.[c.id] ?? ''}
                              placeholder={sugerido === null || sugerido === undefined ? '' : String(sugerido).replace('.', ',')}
                              onChange={(e) => onAnio(a, c.id, e.target.value)}
                            />
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <h4 className="dietas__subtitulo">Periodos de vacaciones disfrutados (cuadrante de la empresa)</h4>
          {t.vacaciones.map((v, i) => (
            <div className="dietas__fila" key={i}>
              <input type="date" value={v.desde} onChange={(e) => setVac(i, { desde: e.target.value })} aria-label="Vacaciones desde" />
              <input type="date" value={v.hasta} onChange={(e) => setVac(i, { hasta: e.target.value })} aria-label="Vacaciones hasta" />
              <button className="btn--texto" onClick={() => onCambio((x) => ({ vacaciones: x.vacaciones.filter((_, j) => j !== i) }))}>
                Quitar
              </button>
            </div>
          ))}
          <button className="btn--texto" onClick={() => onCambio((x) => ({ vacaciones: [...x.vacaciones, { desde: '', hasta: '' }] }))}>
            + Añadir periodo de vacaciones
          </button>

          <h4 className="dietas__subtitulo">Líneas de dietas de las nóminas</h4>
          {t.dietas.length > 0 && (
            <div className="tacografo__tabla-scroll">
              <table className="calc__tabla dietas__tabla-lineas">
                <thead>
                  <tr>
                    <th>Mes</th>
                    <th>Tipo</th>
                    <th>Días</th>
                    <th>€/día</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {t.dietas.map((l, i) => (
                    <tr key={i}>
                      <td>
                        <input type="month" value={l.mes} onChange={(e) => setLinea(i, { mes: e.target.value })} aria-label="Mes" />
                      </td>
                      <td>
                        <select className="tacografo__select" value={l.tipo} onChange={(e) => setLinea(i, { tipo: e.target.value })} aria-label="Tipo">
                          {TIPOS_DIETA.map((x) => (
                            <option key={x.id} value={x.id}>
                              {x.nombre}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input inputMode="numeric" value={l.dias} onChange={(e) => setLinea(i, { dias: e.target.value })} aria-label="Días" />
                      </td>
                      <td>
                        <input inputMode="decimal" value={l.importe} onChange={(e) => setLinea(i, { importe: e.target.value })} aria-label="Importe por día" />
                      </td>
                      <td>
                        <button className="btn--texto" onClick={() => onCambio((x) => ({ dietas: x.dietas.filter((_, j) => j !== i) }))}>
                          Quitar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="analizador__acciones">
            <button
              className="btn--texto"
              onClick={() =>
                onCambio((x) => ({
                  dietas: [...x.dietas, { mes: x.dietas[x.dietas.length - 1]?.mes || (cfg.desde || '').slice(0, 7), tipo: 'nacional_con', dias: '', importe: '' }],
                }))
              }
            >
              + Añadir línea de dieta
            </button>
            {t.tacografo && (
              <button className="btn--texto" onClick={() => onCambio({ tacografo: null })}>
                Quitar datos de tacógrafo
              </button>
            )}
            <button className="btn--texto dietas__quitar" onClick={onQuitar}>
              Eliminar trabajador
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
