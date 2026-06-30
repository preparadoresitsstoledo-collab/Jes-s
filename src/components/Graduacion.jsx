import { useState } from 'react'
import {
  casosGraduacion,
  marcoGraduacion,
  GRADOS,
  jurisprudencia,
  criterioTecnicoGraduacion,
} from '../data/graduacion.js'

export default function Graduacion() {
  const [respuestas, setRespuestas] = useState({}) // index -> 'minimo'|'medio'|'maximo'

  const total = casosGraduacion.length
  const respondidas = Object.keys(respuestas).length
  const aciertos = casosGraduacion.reduce(
    (n, c, i) => n + (respuestas[i] === c.grado ? 1 : 0),
    0,
  )

  const responder = (i, valor) => setRespuestas((r) => (r[i] ? r : { ...r, [i]: valor }))
  const reiniciar = () => setRespuestas({})

  return (
    <section className="seccion" id="graduacion">
      <div className="contenedor">
        <span className="etiqueta-seccion">Juego de estudio</span>
        <h2 className="seccion__titulo">Graduación de la sanción</h2>
        <p className="seccion__subtitulo">
          Ya has detectado la infracción… ahora gradúala. Decide el grado —
          <strong> mínimo</strong>, <strong>medio</strong> o <strong>máximo</strong>— y comprueba
          los criterios que se aplican (art. 39 LISOS).
        </p>

        <details className="marco-legal">
          <summary>📘 Marco legal: cómo se gradúa (art. 39 LISOS)</summary>
          <div className="marco-legal__cuerpo">
            <p>{marcoGraduacion.grados}</p>
            <p className="marco-legal__regla">⚠️ {marcoGraduacion.noDobleComputo}</p>
            <div className="marco-legal__cols">
              <div>
                <h4>Criterios generales (art. 39.2)</h4>
                <ul>
                  {marcoGraduacion.criteriosGenerales.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4>Criterios de PRL (art. 39.3)</h4>
                <ul>
                  {marcoGraduacion.criteriosPRL.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="marco-legal__reglas">
              <h4>No confundas «graduar» con «cuántas infracciones hay»</h4>
              <ul>
                {marcoGraduacion.reglasEspeciales.map((r, i) => (
                  <li key={i}>
                    <strong>{r.titulo}:</strong> {r.texto}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </details>

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
          {casosGraduacion.map((c, i) => {
            const elegido = respuestas[i]
            const acertado = elegido === c.grado
            return (
              <article
                className={`infraccion ${elegido ? `grad--${c.grado}` : ''}`}
                key={i}
              >
                <div className="infraccion__materia">{c.materia}</div>
                {c.peculiaridad && <div className="grad__peculiaridad">⚑ {c.peculiaridad}</div>}
                <p className="infraccion__desc">{c.descripcion}</p>

                {!elegido ? (
                  <div className="infraccion__opciones grad__opciones">
                    {Object.entries(GRADOS).map(([k, v]) => (
                      <button
                        key={k}
                        type="button"
                        className="btn-opcion"
                        onClick={() => responder(i, k)}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="infraccion__resultado">
                    <div className="infraccion__veredicto">
                      {acertado ? '✅ Correcto' : '❌ Era grado ' + GRADOS[c.grado]}
                      <span className={`pill-grado pill-grado--${c.grado}`}>{GRADOS[c.grado]}</span>
                    </div>
                    <div className="grad__criterios">
                      <strong>Criterios que aplican:</strong>
                      <ul>
                        {c.criterios.map((cr, j) => (
                          <li key={j}>{cr}</li>
                        ))}
                      </ul>
                    </div>
                    <p className="grad__explicacion">{c.explicacion}</p>
                  </div>
                )}
              </article>
            )
          })}
        </div>

        <div className="jurisprudencia">
          <h3 className="jurisprudencia__titulo">📚 Jurisprudencia y criterios técnicos</h3>
          <p className="jurisprudencia__intro">{criterioTecnicoGraduacion}</p>

          <div className="jurisprudencia__grid">
            {jurisprudencia.map((j, i) => (
              <article className="juris-card" key={i}>
                <h4 className="juris-card__titulo">{j.titulo}</h4>
                <div className="juris-card__ref">{j.referencia}</div>
                <p className="juris-card__resumen">{j.resumen}</p>
                <ul className="juris-card__enlaces">
                  {j.enlaces.map((e, k) => (
                    <li key={k}>
                      <a href={e.url} target="_blank" rel="noopener noreferrer">
                        {e.texto} ↗
                      </a>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>

        <p className="fuente-nota">
          Datos orientativos conforme al art. 39 TRLISOS (RDLeg 5/2000). La graduación corresponde al
          criterio del/de la actuante en cada caso concreto. Las referencias jurisprudenciales están
          contrastadas en varias fuentes; conviene verificar el texto íntegro de cada resolución
          (CENDOJ) antes de citarla en un acta.
        </p>
      </div>
    </section>
  )
}
