import {
  convocatoriasCalculadas,
  totales,
  tasaMediaAprobados,
} from '../data/convocatorias.js'

function GraficoBarras() {
  // Escala según el mayor número de presentados.
  const maxPresentados = Math.max(...convocatoriasCalculadas.map((c) => c.presentados), 1)
  const altura = (valor) => `${Math.max((valor / maxPresentados) * 100, 1.5)}%`

  return (
    <div className="grafico">
      <h3 className="grafico__titulo">Presentados frente a aprobados por convocatoria</h3>
      <div className="grafico__leyenda">
        <span>
          <i className="punto barra--presentados" /> Presentados
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
                style={{ height: altura(c.presentados) }}
                title={`${c.presentados} presentados`}
              >
                <span className="barra__valor">{c.presentados.toLocaleString('es-ES')}</span>
              </div>
              <div
                className="barra barra--aprobados"
                style={{ height: altura(c.aprobados) }}
                title={`${c.aprobados} aprobados`}
              >
                <span className="barra__valor">{c.aprobados}</span>
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
            <th>Plazas</th>
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
              <td>{c.plazas.toLocaleString('es-ES')}</td>
              <td>{c.aspirantes.toLocaleString('es-ES')}</td>
              <td>{c.presentados.toLocaleString('es-ES')}</td>
              <td>{c.aprobados.toLocaleString('es-ES')}</td>
              <td>
                <span className="pill-tasa">{c.tasaAprobadosPresentados.toFixed(1)}%</span>
              </td>
              <td>
                {c.boe ? (
                  <a
                    className="enlace-boe"
                    href={c.boe}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {c.boeRef || 'Ver en BOE'} ↗
                  </a>
                ) : (
                  <span className="enlace-boe enlace-boe--vacio">
                    {c.boeRef || 'Pendiente'}
                  </span>
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
          Evolución de plazas, aspirantes y aprobados, con el porcentaje de aprobados sobre
          presentados y el enlace a cada publicación en el BOE.
        </p>

        <p className="aviso">
          ⚠️ <strong>Datos de ejemplo.</strong> Sustituye las cifras y los enlaces al BOE por los
          oficiales en <code>src/data/convocatorias.js</code>.
        </p>

        <div className="resumen-stats">
          <div className="stat-card">
            <strong>{totales.plazas.toLocaleString('es-ES')}</strong>
            <span>Plazas convocadas (total)</span>
          </div>
          <div className="stat-card">
            <strong>{totales.aspirantes.toLocaleString('es-ES')}</strong>
            <span>Aspirantes (total)</span>
          </div>
          <div className="stat-card">
            <strong>{totales.aprobados.toLocaleString('es-ES')}</strong>
            <span>Aprobados (total)</span>
          </div>
          <div className="stat-card stat-card--acento">
            <strong>{tasaMediaAprobados.toFixed(1)}%</strong>
            <span>Tasa media aprob. / present.</span>
          </div>
        </div>

        <GraficoBarras />
        <Tabla />
      </div>
    </section>
  )
}
