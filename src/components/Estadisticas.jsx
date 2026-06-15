import {
  convocatoriasCalculadas,
  totales,
  tasaMediaCobertura,
} from '../data/convocatorias.js'

const fmt = (n) => (n == null ? '—' : n.toLocaleString('es-ES'))
const pct = (n) => (n == null ? '—' : `${n.toFixed(1)}%`)

/** Gráfico de barras: plazas convocadas frente a aprobados por convocatoria. */
function Grafico() {
  const max = Math.max(...convocatoriasCalculadas.map((c) => c.plazas), 1)
  const alto = (v) => `${Math.max((v / max) * 100, 1.5)}%`

  return (
    <div className="grafico">
      <h3 className="grafico__titulo">Plazas convocadas y aprobados por convocatoria</h3>
      <div className="grafico__leyenda">
        <span>
          <i className="punto barra--presentados" /> Plazas convocadas
        </span>
        <span>
          <i className="punto barra--aprobados" /> Aprobados
        </span>
      </div>
      <div className="barras">
        {convocatoriasCalculadas.map((c) => (
          <div className="barras__grupo" key={c.año}>
            <div className="barras__par">
              <div
                className="barra barra--presentados"
                style={{ height: alto(c.plazas) }}
                title={`${c.plazas} plazas convocadas`}
              >
                <span className="barra__valor">{c.plazas}</span>
              </div>
              {c.aprobados != null && (
                <div
                  className="barra barra--aprobados"
                  style={{ height: alto(c.aprobados) }}
                  title={`${c.aprobados} aprobados`}
                >
                  <span className="barra__valor">{c.aprobados}</span>
                </div>
              )}
            </div>
            <div className="barras__año">{c.año}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Tabla() {
  return (
    <div className="tabla-wrap">
      <table className="convocatorias">
        <thead>
          <tr>
            <th>Convocatoria</th>
            <th>Plazas libre</th>
            <th>Plazas prom. interna</th>
            <th>Aprob. libre</th>
            <th>Aprob. prom. interna</th>
            <th>% cobertura</th>
            <th>BOE</th>
          </tr>
        </thead>
        <tbody>
          {convocatoriasCalculadas.map((c) => (
            <tr key={c.año}>
              <td>{c.año}</td>
              <td>{fmt(c.plazasLibre)}</td>
              <td>{fmt(c.plazasPI)}</td>
              <td>{fmt(c.aprobadosLibre)}</td>
              <td>{fmt(c.aprobadosPI)}</td>
              <td>
                {c.tasaCobertura == null ? (
                  '—'
                ) : (
                  <span className="pill-tasa">{pct(c.tasaCobertura)}</span>
                )}
              </td>
              <td>
                {c.boe ? (
                  <a className="enlace-boe" href={c.boe} target="_blank" rel="noopener noreferrer">
                    {c.boeRef} ↗
                  </a>
                ) : (
                  <span className="enlace-boe enlace-boe--vacio">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function Estadisticas() {
  return (
    <section className="seccion seccion--alt" id="estadisticas">
      <div className="contenedor">
        <span className="etiqueta-seccion">Datos de la oposición</span>
        <h2 className="seccion__titulo">Estadísticas de las convocatorias</h2>
        <p className="seccion__subtitulo">
          Evolución de las plazas convocadas y los aprobados del Cuerpo Superior de Inspectores de
          Trabajo y Seguridad Social (acceso libre y promoción interna).
        </p>

        <div className="resumen-stats">
          <div className="stat-card">
            <strong>{totales.plazas.toLocaleString('es-ES')}</strong>
            <span>Plazas convocadas (2019–2025)</span>
          </div>
          <div className="stat-card">
            <strong>{totales.aprobados.toLocaleString('es-ES')}</strong>
            <span>Aprobados (procesos finalizados)</span>
          </div>
          <div className="stat-card">
            <strong>{convocatoriasCalculadas.length}</strong>
            <span>Convocatorias recogidas</span>
          </div>
          <div className="stat-card stat-card--acento">
            <strong>{tasaMediaCobertura == null ? '—' : pct(tasaMediaCobertura)}</strong>
            <span>Cobertura media de plazas</span>
          </div>
        </div>

        <Grafico />
        <Tabla />

        <p className="fuente-nota">
          Fuente: convocatorias y resoluciones del Tribunal de Oposiciones (BOE). Los aprobados de
          las convocatorias 2024 y 2025 se publicarán al finalizar cada proceso selectivo.
        </p>
      </div>
    </section>
  )
}
