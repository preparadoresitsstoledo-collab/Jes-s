import { useState } from 'react'
import { infracciones } from '../data/infracciones.js'

const etiqueta = { grave: 'Grave', 'muy-grave': 'Muy grave' }

export default function Herramientas() {
  // index -> 'grave' | 'muy-grave' (respuesta elegida por el usuario)
  const [respuestas, setRespuestas] = useState({})

  const total = infracciones.length
  const respondidas = Object.keys(respuestas).length
  const aciertos = infracciones.reduce(
    (n, inf, i) => n + (respuestas[i] === inf.calificacion ? 1 : 0),
    0,
  )

  const responder = (i, valor) =>
    setRespuestas((r) => (r[i] ? r : { ...r, [i]: valor }))
  const reiniciar = () => setRespuestas({})

  return (
    <section className="seccion seccion--alt" id="herramientas">
      <div className="contenedor">
        <span className="etiqueta-seccion">Herramienta de estudio</span>
        <h2 className="seccion__titulo">Simulador de visita de inspección</h2>
        <p className="seccion__subtitulo">
          Estás de visita en una empresa. En cada hallazgo, decide si la infracción es{' '}
          <strong>grave</strong> o <strong>muy grave</strong>: se te revelará el artículo y la
          sanción correspondiente.
        </p>

        <div className="simulador__barra">
          <span>
            Respondidas: <strong>{respondidas} / {total}</strong>
          </span>
          <span className="simulador__marcador">
            Aciertos: <strong>{aciertos}</strong>
          </span>
          <button className="btn btn--oscuro" type="button" onClick={reiniciar}>
            Reiniciar
          </button>
        </div>

        {respondidas === total && (
          <p className="simulador__final" role="status">
            🎯 Has acertado <strong>{aciertos}</strong> de <strong>{total}</strong>.
          </p>
        )}

        <div className="infracciones-grid">
          {infracciones.map((inf, i) => {
            const elegida = respuestas[i]
            const acertada = elegida === inf.calificacion
            return (
              <article
                className={`infraccion ${elegida ? `infraccion--${inf.calificacion}` : ''}`}
                key={i}
              >
                <div className="infraccion__materia">{inf.materia}</div>
                <h3>{inf.titulo}</h3>
                <p className="infraccion__desc">{inf.descripcion}</p>

                {!elegida ? (
                  <div className="infraccion__opciones">
                    <button
                      type="button"
                      className="btn-opcion"
                      onClick={() => responder(i, 'grave')}
                    >
                      Grave
                    </button>
                    <button
                      type="button"
                      className="btn-opcion"
                      onClick={() => responder(i, 'muy-grave')}
                    >
                      Muy grave
                    </button>
                  </div>
                ) : (
                  <div className="infraccion__resultado">
                    <div className="infraccion__veredicto">
                      {acertada ? '✅ Correcto' : '❌ Era ' + etiqueta[inf.calificacion]}
                      <span className={`pill-gravedad pill-gravedad--${inf.calificacion}`}>
                        {etiqueta[inf.calificacion]}
                      </span>
                    </div>
                    <div className="infraccion__ref">{inf.ref}</div>
                    <div className="infraccion__sancion">
                      <strong>Sanción:</strong> {inf.sancion}
                    </div>
                  </div>
                )}
              </article>
            )
          })}
        </div>

        <p className="fuente-nota">
          Datos orientativos conforme a la LISOS (RDLeg 5/2000) y la LOEX (LO 4/2000). Las cuantías
          son los rangos vigentes y pueden actualizarse; consulta siempre la norma.
        </p>
      </div>
    </section>
  )
}
