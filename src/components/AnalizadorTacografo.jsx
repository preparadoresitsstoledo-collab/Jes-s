import { useMemo, useRef, useState } from 'react'
import { leerArchivoTarjeta } from '../lib/tacografo/ddd.js'
import { agruparPorConductor } from '../lib/tacografo/conductores.js'
import { analizar, heSegunMetodo, resumenInfracciones } from '../lib/tacografo/analisis.js'
import { fechaES, hhmm, sumarDias, inicioDia, diaSemana, MESES, MIN } from '../lib/tacografo/tiempo.js'
import { CONFIG_POR_DEFECTO, METODOS_HE, DATOS_EXPEDIENTE } from '../data/tacografo.js'
import { AvisoPrivacidad, useAvisoAlSalir, borrarYSalir } from './PrivacidadDatos.jsx'

const CLAVE_CFG = 'tacografo:config'
const EXTENSIONES = /\.(ddd|tgd|c1b|esm|dtc|bin)$/i
const TAM_MAX = 8 * 1024 * 1024

function cargarConfig() {
  try {
    const guardada = JSON.parse(localStorage.getItem(CLAVE_CFG) || 'null')
    if (guardada) return { ...CONFIG_POR_DEFECTO, ...guardada }
  } catch {
    /* sin almacenamiento disponible */
  }
  return { ...CONFIG_POR_DEFECTO }
}

function guardarConfig(cfg) {
  try {
    localStorage.setItem(CLAVE_CFG, JSON.stringify(cfg))
  } catch {
    /* sin almacenamiento disponible */
  }
}

const horas = (min) => `${hhmm(min)} h`

export default function AnalizadorTacografo() {
  const [lecturas, setLecturas] = useState([])
  const [errores, setErrores] = useState([])
  const [ignorados, setIgnorados] = useState(0)
  const [leyendo, setLeyendo] = useState(false)
  const [arrastrando, setArrastrando] = useState(false)
  const [claveConductor, setClaveConductor] = useState('')
  const [desde, setDesde] = useState('')
  const [hasta, setHasta] = useState('')
  const [cfg, setCfgEstado] = useState(cargarConfig)
  const [expediente, setExpediente] = useState({})
  const [resultado, setResultado] = useState(null)
  const [errorAnalisis, setErrorAnalisis] = useState('')
  const [generando, setGenerando] = useState(false)
  const inputArchivos = useRef(null)
  const inputCarpeta = useRef(null)

  const conductores = useMemo(() => agruparPorConductor(lecturas), [lecturas])
  const conductor = conductores.find((c) => c.clave === claveConductor) || conductores[0] || null

  function setCfg(cambios) {
    setCfgEstado((prev) => {
      const nuevo = { ...prev, ...cambios }
      guardarConfig(nuevo)
      return nuevo
    })
    setResultado(null)
  }

  async function leerFicheros(lista) {
    const ficheros = [...lista]
    if (!ficheros.length) return
    setLeyendo(true)
    const nuevas = []
    const errs = []
    let omitidos = 0
    for (const f of ficheros) {
      const nombre = f.webkitRelativePath || f.name
      const pareceTacografo = EXTENSIONES.test(f.name) || /^C_/i.test(f.name)
      if (f.size > TAM_MAX || f.size < 100) {
        if (pareceTacografo) errs.push({ nombre, error: 'Tamaño no válido para una descarga de tarjeta' })
        else omitidos++
        continue
      }
      try {
        const l = leerArchivoTarjeta(await f.arrayBuffer(), nombre)
        nuevas.push(l)
      } catch (e) {
        if (pareceTacografo) errs.push({ nombre, error: e.message })
        else omitidos++
      }
    }
    setLecturas((prev) => {
      const nombres = new Set(prev.map((l) => l.nombre))
      return [...prev, ...nuevas.filter((l) => !nombres.has(l.nombre))]
    })
    setErrores((prev) => [...prev, ...errs])
    setIgnorados((n) => n + omitidos)
    setResultado(null)
    setLeyendo(false)
  }

  function limpiar() {
    setLecturas([])
    setErrores([])
    setIgnorados(0)
    setResultado(null)
    setClaveConductor('')
    setDesde('')
    setHasta('')
    setErrorAnalisis('')
  }

  const hayDatos = lecturas.length > 0 || errores.length > 0 || Object.values(expediente).some(Boolean)
  useAvisoAlSalir(hayDatos)

  function borrarTodo() {
    limpiar()
    setExpediente({})
    try {
      localStorage.removeItem(CLAVE_CFG)
    } catch {
      /* sin almacenamiento disponible */
    }
    setCfgEstado({ ...CONFIG_POR_DEFECTO })
  }

  function periodoRapido(anios) {
    if (!conductor) return
    if (!anios) {
      setDesde('')
      setHasta('')
    } else {
      const fin = conductor.ultimoDia
      const ini = `${+fin.slice(0, 4) - anios}${fin.slice(4)}`
      setDesde(sumarDias(ini, 1))
      setHasta(fin)
    }
    setResultado(null)
  }

  function ejecutar() {
    setErrorAnalisis('')
    try {
      setResultado(analizar(conductor, cfg, { desde, hasta }))
    } catch (e) {
      setResultado(null)
      setErrorAnalisis(e.message)
    }
  }

  async function descargarExcel() {
    if (!resultado) return
    setGenerando(true)
    try {
      const { generarExcel } = await import('../lib/tacografo/excel.js')
      const buf = await generarExcel({ conductor, resultado, cfg, expediente, periodoSolicitado: { desde, hasta } })
      const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      // Nombre de archivo solo con caracteres ASCII (los acentos impiden la descarga en algunos navegadores)
      const apellidos = (conductor.titular.apellidos || 'conductor')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^A-Za-z0-9]+/g, '_')
        .replace(/^_|_$/g, '')
      a.href = url
      a.download = `Tacografo_${apellidos}_${resultado.desde}_${resultado.hasta}.xlsx`
      document.body.appendChild(a)
      a.click()
      a.remove()
      setTimeout(() => URL.revokeObjectURL(url), 2000)
    } catch (e) {
      setErrorAnalisis(`No se pudo generar el Excel: ${e.message}`)
    } finally {
      setGenerando(false)
    }
  }

  const aniosPeriodo = useMemo(() => {
    if (!conductor) return []
    const a = +(desde || conductor.primerDia).slice(0, 4)
    const b = +(hasta || conductor.ultimoDia).slice(0, 4)
    const r = []
    for (let y = a; y <= b; y++) r.push(String(y))
    return r
  }, [conductor, desde, hasta])

  const resumen = resultado ? resumenInfracciones(resultado.infracciones) : []
  const importe = resultado
    ? resultado.meses.reduce((s, m) => s + (heSegunMetodo(m, cfg.metodoHE) / 60) * (Number(cfg.preciosHE?.[m.mes.slice(0, 4)]) || 0), 0)
    : 0

  return (
    <div className="analizador tacografo">
      <header className="analizador__hero">
        <div className="contenedor">
          <a className="analizador__volver" href="#herramientas-transporte">
            ← Volver a herramientas
          </a>
          <h1>Analizador de tacógrafo</h1>
          <p className="analizador__lema">
            Carga <strong>todas las descargas de la tarjeta del conductor</strong> (archivos C: .DDD, .TGD…) a la vez,
            incluso de varios años. La aplicación las une, elimina los días duplicados y calcula día a día los tiempos
            de conducción, trabajo, disponibilidad y descanso, las <strong>horas extraordinarias</strong> y los
            incumplimientos del <strong>Reglamento (CE) 561/2006</strong>, el <strong>RD 1561/1995</strong>, el{' '}
            <strong>Estatuto de los Trabajadores</strong> y el convenio, con exportación a Excel.
          </p>
          <p className="analizador__aviso-legal">
            🔒 Los archivos se procesan <strong>solo en tu navegador</strong>: no se envían a ningún servidor y nadie,
            ni el titular de esta web, tiene acceso a ellos. ⚖️
            Resultado <strong>orientativo</strong>: revisa los parámetros del convenio y contrasta los datos con el resto
            de pruebas del expediente.
          </p>
        </div>
      </header>

      <div className="contenedor tacografo__cuerpo">
        <AvisoPrivacidad hayDatos={hayDatos} onBorrar={() => borrarYSalir(borrarTodo, hayDatos)} />

        {/* 1. Archivos */}
        <section className="analizador__panel">
          <h2>1. Archivos de la tarjeta de conductor</h2>
          <div
            className={`tacografo__zona ${arrastrando ? 'tacografo__zona--activa' : ''}`}
            onDragOver={(e) => {
              e.preventDefault()
              setArrastrando(true)
            }}
            onDragLeave={() => setArrastrando(false)}
            onDrop={(e) => {
              e.preventDefault()
              setArrastrando(false)
              leerFicheros(e.dataTransfer.files)
            }}
          >
            <p>
              <strong>Arrastra aquí los archivos</strong> (puedes seleccionar decenas a la vez) o usa los botones.
            </p>
            <div className="analizador__acciones">
              <button className="btn btn--primario" onClick={() => inputArchivos.current?.click()} disabled={leyendo}>
                📄 Seleccionar archivos
              </button>
              <button className="btn--secundario" onClick={() => inputCarpeta.current?.click()} disabled={leyendo}>
                📁 Seleccionar una carpeta completa
              </button>
              {lecturas.length > 0 && (
                <button className="btn--texto" onClick={limpiar}>
                  Quitar todos
                </button>
              )}
            </div>
            <input
              ref={inputArchivos}
              type="file"
              multiple
              hidden
              onChange={(e) => {
                leerFicheros(e.target.files)
                e.target.value = ''
              }}
            />
            <input
              ref={inputCarpeta}
              type="file"
              multiple
              hidden
              webkitdirectory=""
              directory=""
              onChange={(e) => {
                leerFicheros(e.target.files)
                e.target.value = ''
              }}
            />
            {leyendo && <p className="tacografo__estado">Leyendo archivos…</p>}
          </div>

          {(lecturas.length > 0 || errores.length > 0) && (
            <div className="tacografo__lista">
              <p className="campo__ayuda">
                {lecturas.length} archivo(s) de tarjeta leídos
                {errores.length > 0 && ` · ${errores.length} con errores`}
                {ignorados > 0 && ` · ${ignorados} archivo(s) ajenos ignorados`}
              </p>
              <div className="tacografo__tabla-scroll">
                <table className="calc__tabla calc__tabla--tramos">
                  <thead>
                    <tr>
                      <th>Archivo</th>
                      <th>Conductor</th>
                      <th>Gen.</th>
                      <th>Desde</th>
                      <th>Hasta</th>
                      <th>Días</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lecturas.map((l) => (
                      <tr key={l.nombre}>
                        <td>{l.nombre}</td>
                        <td>
                          {l.titular.apellidos}, {l.titular.nombre}
                        </td>
                        <td>{l.generacion}.ª</td>
                        <td>{fechaES(l.dias[0]?.fecha)}</td>
                        <td>{fechaES(l.dias[l.dias.length - 1]?.fecha)}</td>
                        <td>{l.dias.length}</td>
                      </tr>
                    ))}
                    {errores.map((e, i) => (
                      <tr key={`e${i}`} className="tacografo__fila-error">
                        <td>{e.nombre}</td>
                        <td colSpan={5}>⚠️ {e.error}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        {conductor && (
          <>
            {/* 2. Conductor y periodo */}
            <section className="analizador__panel">
              <h2>2. Conductor y periodo</h2>
              {conductores.length > 1 && (
                <div className="campo">
                  <label>Conductor ({conductores.length} detectados)</label>
                  <select
                    className="tacografo__select"
                    value={conductor.clave}
                    onChange={(e) => {
                      setClaveConductor(e.target.value)
                      setResultado(null)
                    }}
                  >
                    {conductores.map((c) => (
                      <option key={c.clave} value={c.clave}>
                        {c.nombreCompleto} · tarjeta {c.tarjeta.numero} · {c.dias.length} días
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <p className="tacografo__conductor">
                <strong>{conductor.nombreCompleto}</strong> · tarjeta {conductor.tarjeta.numero} ({conductor.tarjeta.pais})
                · {conductor.archivos.length} archivo(s) · datos del {fechaES(conductor.primerDia)} al{' '}
                {fechaES(conductor.ultimoDia)} ({conductor.dias.length} días con registro)
              </p>
              <div className="campo-fila">
                <div className="campo">
                  <label>Desde</label>
                  <input
                    type="date"
                    value={desde}
                    min={conductor.primerDia}
                    max={conductor.ultimoDia}
                    onChange={(e) => {
                      setDesde(e.target.value)
                      setResultado(null)
                    }}
                  />
                </div>
                <div className="campo">
                  <label>Hasta</label>
                  <input
                    type="date"
                    value={hasta}
                    min={conductor.primerDia}
                    max={conductor.ultimoDia}
                    onChange={(e) => {
                      setHasta(e.target.value)
                      setResultado(null)
                    }}
                  />
                </div>
              </div>
              <div className="analizador__acciones">
                <button className="btn--secundario" onClick={() => periodoRapido(0)}>
                  Todo
                </button>
                <button className="btn--secundario" onClick={() => periodoRapido(1)}>
                  Último año
                </button>
                <button className="btn--secundario" onClick={() => periodoRapido(4)}>
                  Últimos 4 años
                </button>
              </div>
            </section>

            {/* 3. Parámetros */}
            <section className="analizador__panel">
              <h2>3. Parámetros del convenio y de cálculo</h2>
              <p className="aviso aviso--alerta">
                Comprueba la jornada anual y el precio de la hora extraordinaria en el texto vigente del Convenio de
                Transporte de Mercancías por Carretera de Toledo (BOP de Toledo núm. 64, de 4/4/2024, y revisiones
                salariales). Los valores se guardan en este navegador.
              </p>
              <div className="tacografo__parametros">
                <Numero etiqueta="Jornada anual del convenio (h de trabajo efectivo)" valor={cfg.jornadaAnual} onChange={(v) => setCfg({ jornadaAnual: v })} />
                <Numero etiqueta="Jornada semanal ordinaria (h) · art. 34.1 ET" valor={cfg.jornadaSemanal} onChange={(v) => setCfg({ jornadaSemanal: v })} />
                <Numero etiqueta="Máximo diario ordinario (h) · art. 34.3 ET" valor={cfg.jornadaDiariaMax} onChange={(v) => setCfg({ jornadaDiariaMax: v })} />
                <Numero etiqueta="Descanso mínimo entre jornadas (h) · art. 34.3 ET" valor={cfg.descansoEntreJornadas} onChange={(v) => setCfg({ descansoEntreJornadas: v })} />
                <Numero etiqueta="Límite anual de horas extra (h) · art. 35.2 ET" valor={cfg.limiteHEAnual} onChange={(v) => setCfg({ limiteHEAnual: v })} />
                <Numero etiqueta="Presencia máxima (h/semana, promedio mensual)" valor={cfg.presenciaMaxSemanal} onChange={(v) => setCfg({ presenciaMaxSemanal: v })} />
                <div className="campo">
                  <label>Franja nocturna (art. 36 ET)</label>
                  <div className="campo-fila">
                    <input type="time" value={cfg.nocturnoInicio} onChange={(e) => setCfg({ nocturnoInicio: e.target.value || '22:00' })} />
                    <input type="time" value={cfg.nocturnoFin} onChange={(e) => setCfg({ nocturnoFin: e.target.value || '06:00' })} />
                  </div>
                </div>
                <div className="campo">
                  <label>Hora del análisis</label>
                  <select className="tacografo__select" value={cfg.zonaHoraria} onChange={(e) => setCfg({ zonaHoraria: e.target.value })}>
                    <option value="Europe/Madrid">Hora peninsular (Europe/Madrid)</option>
                    <option value="Atlantic/Canary">Hora canaria (Atlantic/Canary)</option>
                    <option value="UTC">UTC (hora del tacógrafo)</option>
                  </select>
                </div>
              </div>

              <h3 className="tacografo__subtitulo">Método de cómputo de las horas extraordinarias para el acta</h3>
              <div className="tacografo__metodos">
                {METODOS_HE.map((m) => (
                  <label key={m.id} className={`tacografo__metodo ${cfg.metodoHE === m.id ? 'tacografo__metodo--activo' : ''}`}>
                    <input type="radio" name="metodoHE" checked={cfg.metodoHE === m.id} onChange={() => setCfg({ metodoHE: m.id })} />
                    <span>
                      <strong>{m.nombre}</strong>
                      <small>{m.detalle}</small>
                    </span>
                  </label>
                ))}
              </div>

              <h3 className="tacografo__subtitulo">Precio de la hora extraordinaria (€/h) y cotización</h3>
              <div className="tacografo__parametros">
                {aniosPeriodo.map((a) => (
                  <Numero
                    key={a}
                    etiqueta={`Año ${a}`}
                    valor={cfg.preciosHE?.[a] ?? ''}
                    paso="0.01"
                    onChange={(v) => setCfg({ preciosHE: { ...cfg.preciosHE, [a]: v } })}
                  />
                ))}
                <Numero etiqueta="Tipo de cotización (%) · opcional" valor={cfg.tipoCotizacion} paso="0.01" onChange={(v) => setCfg({ tipoCotizacion: v })} />
              </div>

              <h3 className="tacografo__subtitulo">Criterios</h3>
              <Casilla valor={cfg.desconocidoComoDescanso} onChange={(v) => setCfg({ desconocidoComoDescanso: v })}>
                Tarjeta extraída sin actividad introducida = descanso
              </Casilla>
              <Casilla valor={cfg.sinDatosComoDescanso} onChange={(v) => setCfg({ sinDatosComoDescanso: v })}>
                Días sin registro en la tarjeta = descanso
              </Casilla>
              <Casilla valor={cfg.disponibilidadEsPausa} onChange={(v) => setCfg({ disponibilidadEsPausa: v })}>
                La disponibilidad de 15 min o más interrumpe el trabajo continuado (art. 10 bis.2 RD 1561/1995)
              </Casilla>
              <div className="analizador__acciones">
                <button className="btn--texto" onClick={() => setCfg({ ...CONFIG_POR_DEFECTO, preciosHE: cfg.preciosHE })}>
                  Restablecer valores por defecto
                </button>
              </div>
            </section>

            {/* 4. Expediente */}
            <section className="analizador__panel">
              <h2>4. Datos del expediente (opcional, para el Excel)</h2>
              <div className="tacografo__parametros">
                {DATOS_EXPEDIENTE.map((d) => (
                  <div className="campo" key={d.id}>
                    <label>{d.label}</label>
                    <input
                      type="text"
                      value={expediente[d.id] || ''}
                      placeholder={d.placeholder || ''}
                      onChange={(e) => setExpediente((p) => ({ ...p, [d.id]: e.target.value }))}
                    />
                  </div>
                ))}
              </div>
            </section>

            <div className="analizador__acciones tacografo__analizar">
              <button className="btn btn--primario" onClick={ejecutar}>
                🔍 Analizar
              </button>
              {resultado && (
                <button className="btn btn--oscuro" onClick={descargarExcel} disabled={generando}>
                  {generando ? 'Generando Excel…' : '⬇️ Descargar Excel completo'}
                </button>
              )}
            </div>
            {errorAnalisis && <p className="aviso aviso--alerta">{errorAnalisis}</p>}
          </>
        )}

        {/* 5. Resultados */}
        {resultado && (
          <section className="analizador__panel">
            <h2>
              5. Resultados · {fechaES(resultado.desde)} – {fechaES(resultado.hasta)}
            </h2>
            <div className="tacografo__kpis">
              <Kpi titulo="Días con actividad" valor={`${resultado.totales.diasActividad} / ${resultado.diasPeriodo}`} />
              <Kpi titulo="Trabajo efectivo" valor={horas(resultado.totales.trabajoEfectivo)} />
              <Kpi titulo="Conducción" valor={horas(resultado.totales.conduccion)} />
              <Kpi titulo="Disponibilidad" valor={horas(resultado.totales.presencia)} />
              <Kpi titulo={`Horas extra (${METODOS_HE.find((m) => m.id === cfg.metodoHE)?.nombre.toLowerCase()})`} valor={horas(heSegunMetodo(resultado.totales, cfg.metodoHE))} destacado />
              <Kpi titulo="Importe HE estimado" valor={importe ? `${importe.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €` : 'Indica los precios'} destacado />
            </div>

            <h3 className="tacografo__subtitulo">Resumen por año</h3>
            <div className="tacografo__tabla-scroll">
              <table className="calc__tabla calc__tabla--tramos tacografo__numeros">
                <thead>
                  <tr>
                    <th>Año</th>
                    <th>Días</th>
                    <th>Conducción</th>
                    <th>Otros trabajos</th>
                    <th>Trabajo efectivo</th>
                    <th>Disponibilidad</th>
                    <th>Jornada convenio</th>
                    <th>HE mensual</th>
                    <th>HE anual</th>
                    <th>HE semanal</th>
                    <th>HE diaria</th>
                  </tr>
                </thead>
                <tbody>
                  {resultado.anios.map((y) => (
                    <tr key={y.anio}>
                      <td>{y.anio}</td>
                      <td>{y.dias}</td>
                      <td>{hhmm(y.conduccion)}</td>
                      <td>{hhmm(y.trabajo)}</td>
                      <td>{hhmm(y.trabajoEfectivo)}</td>
                      <td>{hhmm(y.presencia)}</td>
                      <td>{hhmm(y.jornadaOrdinaria)}</td>
                      {['mensual', 'anual', 'semanal', 'diario'].map((m) => (
                        <td key={m} className={cfg.metodoHE === m ? 'tacografo__celda-activa' : ''}>
                          {hhmm(heSegunMetodo(y, m))}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <details className="tacografo__detalle">
              <summary>Resumen por mes</summary>
              <div className="tacografo__tabla-scroll">
                <table className="calc__tabla calc__tabla--tramos tacografo__numeros">
                  <thead>
                    <tr>
                      <th>Mes</th>
                      <th>Días act.</th>
                      <th>Conducción</th>
                      <th>Trabajo efectivo</th>
                      <th>Disponibilidad</th>
                      <th>Jornada convenio</th>
                      <th>HE ({METODOS_HE.find((m) => m.id === cfg.metodoHE)?.nombre.toLowerCase()})</th>
                      <th>Exceso presencia</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultado.meses.map((m) => (
                      <tr key={m.mes}>
                        <td>
                          {MESES[+m.mes.slice(5, 7) - 1]} {m.mes.slice(0, 4)}
                        </td>
                        <td>{m.diasActividad}</td>
                        <td>{hhmm(m.conduccion)}</td>
                        <td>{hhmm(m.trabajoEfectivo)}</td>
                        <td>{hhmm(m.presencia)}</td>
                        <td>{hhmm(m.jornadaOrdinaria)}</td>
                        <td className="tacografo__celda-activa">{hhmm(heSegunMetodo(m, cfg.metodoHE))}</td>
                        <td>{hhmm(m.excesoPresencia)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>

            <GraficoActividades resultado={resultado} />

            <h3 className="tacografo__subtitulo">Incidencias detectadas ({resultado.infracciones.length})</h3>
            {resumen.length === 0 ? (
              <p className="aviso aviso--info">No se han detectado incidencias con los parámetros utilizados.</p>
            ) : (
              <div className="tacografo__tabla-scroll">
                <table className="calc__tabla calc__tabla--tramos">
                  <thead>
                    <tr>
                      <th>Norma</th>
                      <th>Artículo</th>
                      <th>Nº</th>
                      <th>Ejemplo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resumen.map((x) => (
                      <tr key={`${x.norma}${x.articulo}${x.informativa}`}>
                        <td>{x.norma}</td>
                        <td>
                          {x.articulo}
                          {x.informativa && <small> (informativa)</small>}
                        </td>
                        <td>{x.numero}</td>
                        <td>{x.ejemplo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <p className="campo__ayuda">
              El Excel incluye el detalle día a día, las jornadas con sus descansos, las semanas, los meses, los
              cuatrimestres, todas las incidencias con fecha, la relación de actividades y la hoja de liquidación con
              importes recalculables.
            </p>
          </section>
        )}
      </div>
    </div>
  )
}

function Numero({ etiqueta, valor, onChange, paso = '1' }) {
  return (
    <div className="campo">
      <label>{etiqueta}</label>
      <input
        type="number"
        step={paso}
        min="0"
        value={valor}
        onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
      />
    </div>
  )
}

function Casilla({ valor, onChange, children }) {
  return (
    <label className="tacografo__casilla">
      <input type="checkbox" checked={!!valor} onChange={(e) => onChange(e.target.checked)} />
      <span>{children}</span>
    </label>
  )
}

function Kpi({ titulo, valor, destacado }) {
  return (
    <div className={`tacografo__kpi ${destacado ? 'tacografo__kpi--destacado' : ''}`}>
      <span>{titulo}</span>
      <strong>{valor}</strong>
    </div>
  )
}

const COLORES = {
  CONDUCCION: '#2563eb',
  TRABAJO: '#f59e0b',
  DISPONIBILIDAD: '#10b981',
  DESCANSO: '#e5e7eb',
  DESCONOCIDO: '#f4b4b4',
  SIN_DATOS: '#ffffff',
}
const LEYENDA = [
  ['CONDUCCION', 'Conducción'],
  ['TRABAJO', 'Otros trabajos'],
  ['DISPONIBILIDAD', 'Disponibilidad'],
  ['DESCANSO', 'Descanso'],
  ['DESCONOCIDO', 'Desconocida'],
  ['SIN_DATOS', 'Sin registro'],
]

// Gráfico de 24 h por día del mes elegido, con las actividades en hora local
function GraficoActividades({ resultado }) {
  const meses = resultado.meses.map((m) => m.mes)
  const [mes, setMes] = useState(meses[meses.length - 1])
  const mesActivo = meses.includes(mes) ? mes : meses[meses.length - 1]
  const tz = resultado.cfg.zonaHoraria
  const filas = useMemo(() => {
    const dias = resultado.dias.filter((d) => d.fecha.startsWith(mesActivo))
    const tramos = resultado.tramos
    let k = 0
    return dias.map((d) => {
      const a = inicioDia(d.fecha, tz)
      const b = inicioDia(sumarDias(d.fecha, 1), tz)
      while (k < tramos.length && tramos[k].fin <= a) k++
      const seg = []
      for (let j = k; j < tramos.length && tramos[j].ini < b; j++) {
        const x = Math.max(tramos[j].ini, a)
        const y = Math.min(tramos[j].fin, b)
        if (y > x) seg.push({ x: (x - a) / MIN, w: (y - x) / MIN, act: tramos[j].act, manual: tramos[j].manual })
      }
      return { dia: d, seg, ancho: (b - a) / MIN }
    })
  }, [resultado, mesActivo, tz])
  const idx = meses.indexOf(mesActivo)

  return (
    <div className="tacografo__grafico">
      <div className="tacografo__grafico-cabecera">
        <h3 className="tacografo__subtitulo">Actividades día a día</h3>
        <div className="tacografo__grafico-nav">
          <button className="btn--secundario" disabled={idx <= 0} onClick={() => setMes(meses[idx - 1])} aria-label="Mes anterior">
            ‹
          </button>
          <select className="tacografo__select" value={mesActivo} onChange={(e) => setMes(e.target.value)}>
            {meses.map((m) => (
              <option key={m} value={m}>
                {MESES[+m.slice(5, 7) - 1]} {m.slice(0, 4)}
              </option>
            ))}
          </select>
          <button className="btn--secundario" disabled={idx >= meses.length - 1} onClick={() => setMes(meses[idx + 1])} aria-label="Mes siguiente">
            ›
          </button>
        </div>
      </div>
      <ul className="tacografo__leyenda">
        {LEYENDA.map(([k, t]) => (
          <li key={k}>
            <i style={{ background: COLORES[k] }} /> {t}
          </li>
        ))}
      </ul>
      <div className="tacografo__dias">
        <div className="tacografo__dia tacografo__dia--horas">
          <span />
          <div className="tacografo__escala">
            {[0, 3, 6, 9, 12, 15, 18, 21, 24].map((h) => (
              <em key={h} style={{ left: `${(h / 24) * 100}%`, transform: `translateX(${h === 0 ? 0 : h === 24 ? -100 : -50}%)` }}>
                {h}
              </em>
            ))}
          </div>
          <span />
        </div>
        {filas.map(({ dia, seg, ancho }) => (
          <div key={dia.fecha} className={`tacografo__dia ${dia.incidencias.length ? 'tacografo__dia--incidencia' : ''}`}>
            <span className="tacografo__dia-fecha">
              {diaSemana(dia.fecha).slice(0, 3)} {dia.fecha.slice(8, 10)}
            </span>
            <svg viewBox={`0 0 ${ancho} 10`} preserveAspectRatio="none" role="img" aria-label={`Actividades del ${fechaES(dia.fecha)}`}>
              {seg.map((s, i) => (
                <rect
                  key={i}
                  x={s.x}
                  y={s.act === 'CONDUCCION' ? 0 : s.act === 'DESCANSO' || s.act === 'SIN_DATOS' ? 6 : 3}
                  width={s.w}
                  height={s.act === 'CONDUCCION' ? 10 : s.act === 'DESCANSO' || s.act === 'SIN_DATOS' ? 4 : 7}
                  fill={COLORES[s.act]}
                >
                  <title>{`${LEYENDA.find((l) => l[0] === s.act)?.[1]}${s.manual ? ' (manual)' : ''}: ${hhmm(s.x)}–${hhmm(s.x + s.w)} (${hhmm(s.w)} h)`}</title>
                </rect>
              ))}
            </svg>
            <span className="tacografo__dia-totales" title={dia.incidencias.join('\n')}>
              {dia.conActividad ? (
                <>
                  <b style={{ color: COLORES.CONDUCCION }}>{hhmm(dia.conduccion)}</b> · {hhmm(dia.trabajoEfectivo)}
                  {dia.heDiaria > 0 && <b className="tacografo__extra"> +{hhmm(dia.heDiaria)}</b>}
                  {dia.incidencias.length > 0 && ' ⚠️'}
                </>
              ) : (
                <small>—</small>
              )}
            </span>
          </div>
        ))}
      </div>
      <p className="campo__ayuda">
        A la derecha: conducción · trabajo efectivo del día y, en rojo, el exceso sobre el máximo diario ordinario. ⚠️
        indica incidencias (pasa el ratón para verlas).
      </p>
    </div>
  )
}
