import {
  convocatoriasCalculadas,
  totales,
  tasaMediaAprobados,
  hayDatosAprobados,
} from '../data/convocatorias.js'

const fmt = (n) => (n == null ? '—' : n.toLocaleString('es-ES'))
const pct = (n) => (n == null ? '—' : `${n.toFixed(1)}%`)

/** Gráfico de plazas de acceso libre por convocatoria (dato siempre disponible). */
function GraficoPlazas() {
  const max = Math.max(...convocatoriasCalculadas.map((c) => c.plazasLibre), 1)
  const altura = (v) => `${Math.max((v / max) * 100, 2)}%`

  return (
    <div className="grafico">
      <h3 className="grafico__titulo">Plazas de acceso libre convocadas por año</h3>
      <div className="grafico__leyenda">
        <span>
          <i className="punto barra--aprobados" /> Plazas (acceso libre)
        </span>
      </div>
      <div className="barras">
        {convocatoriasCalculadas.map((c) => (
          <div className="barras__grupo" key={c.año}>
            <div className="barras__par">
              <div
                className="barra barra--aprobados"
                style={{ height: altura(c.plazasLibre), width: 46 }}
                title={`${c.plazasLibre} plazas de acceso libre`}
              >
                <span className="barra__valor">{c.plazasLibre}</span>
              </div>
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
            <th>Plazas (acceso libre)</th>
            <th>Promoción interna</th>
            <th>Aspirantes</th>
            <th>Presentados</th>
            <th>Aprobados</th>
            <th>% aprob. / present.</th>
            <th>BOE</th>
          </tr>
        </thead>
        <tbody>
          {convocatoriasCalculadas.map((c) => (
            <tr key={c.año}>
              <td>{c.año}</td>
              <td>{fmt(c.plazasLibre)}</td>
              <td>{fmt(c.plazasPI)}</td>
              <td>{fmt(c.aspirantes)}</td>
              <td>{fmt(c.presentados)}</td>
              <td>{fmt(c.aprobados)}</td>
              <td>
                {c.tasaAprobadosPresentados == null ? (
                  '—'
                ) : (
                  <span className="pill-tasa">{pct(c.tasaAprobadosPresentados)}</span>
                )}
              </td>
              <td>
                {c.boe ? (
                  <a
                    className="enlace-boe"
                    href={c.boe}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={c.nota}
                  >
                    {c.boeRef} ↗
                  </a>
                ) : (
                  <span className="enlace-boe enlace-boe--vacio">Pendiente</span>
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
          Evolución de las plazas convocadas para el Cuerpo Superior de Inspectores de Trabajo y
          Seguridad Social, con enlace a cada convocatoria publicada en el BOE.
        </p>

        <p className="aviso">
          ✅ <strong>Plazas y enlaces al BOE: datos oficiales.</strong> Las columnas de aspirantes,
          presentados, aprobados y el porcentaje se completarán con las cifras de las resoluciones
          de admitidos y de aprobados (campos editables en <code>src/data/convocatorias.js</code>).
        </p>

        <div className="resumen-stats">
          <div className="stat-card">
            <strong>{totales.plazasLibre.toLocaleString('es-ES')}</strong>
            <span>Plazas acceso libre (2024–2026)</span>
          </div>
          <div className="stat-card">
            <strong>{totales.plazasPI.toLocaleString('es-ES')}</strong>
            <span>Plazas promoción interna</span>
          </div>
          <div className="stat-card">
            <strong>{convocatoriasCalculadas.length}</strong>
            <span>Convocatorias recogidas</span>
          </div>
          <div className="stat-card stat-card--acento">
            <strong>{tasaMediaAprobados == null ? '—' : pct(tasaMediaAprobados)}</strong>
            <span>Tasa media aprob. / present.</span>
          </div>
        </div>

        {hayDatosAprobados ? null : (
          <GraficoPlazas />
        )}

        <Tabla />

        <p className="fuente-nota">
          Fuente: Boletín Oficial del Estado (boe.es). Convocatorias del Cuerpo Superior de
          Inspectores de Trabajo y Seguridad Social (Subsecretaría del Ministerio de Trabajo y
          Economía Social).
        </p>
      </div>
    </section>
  )
}
