import { useState } from 'react'
import {
  casosObstruccion,
  marcoObstruccion,
  jurisprudenciaObstruccion,
  criterioTecnicoObstruccion,
} from '../data/obstruccion.js'

export default function Obstruccion() {
  const [respuestas, setRespuestas] = useState({}) // index -> clave elegida

  const total = casosObstruccion.length
  const respondidas = Object.keys(respuestas).length
  const aciertos = casosObstruccion.reduce(
    (n, c, i) => n + (respuestas[i] === c.correcta ? 1 : 0),
    0,
  )

  const responder = (i, k) => setRespuestas((r) => (r[i] ? r : { ...r, [i]: k }))
  const reiniciar = () => setRespuestas({})

  return (
    <section className="seccion" id="obstruccion">
      <div className="contenedor">
        <a className="analizador__volver" href="#herramientas">
          ← Volver a la web
        </a>
        <span className="etiqueta-seccion">Casos prácticos</span>
        <h2 className="seccion__titulo">Obstrucción a la labor inspectora</h2>
        <p className="seccion__subtitulo">
          Lee lo que ha pasado en cada visita y decide el tipo de infracción. Se revela la
          calificación (art. 50), los preceptos infringidos, la graduación (art. 39) y la posible
          cuantía de la sanción (art. 40).
        </p>

        <details className="marco-legal">
          <summary>📘 Marco legal: obstrucción (arts. 50, 40 y 39 TRLISOS)</summary>
          <div className="marco-legal__cuerpo">
            <p>{marcoObstruccion.concepto}</p>
            <h4>Calificación (art. 50)</h4>
            <ul>
              {marcoObstruccion.calificacion.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
            <p className="marco-legal__regla">💶 {marcoObstruccion.escalas}</p>
            <p>{marcoObstruccion.graduacion}</p>
            <p className="marco-legal__nota">{marcoObstruccion.competencia}</p>
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
          {casosObstruccion.map((c, i) => {
            const elegido = respuestas[i]
            const acertado = elegido === c.correcta
            return (
              <article
                className={`infraccion ${elegido ? (acertado ? 'infraccion--grave' : 'infraccion--muy-grave') : ''}`}
                key={i}
              >
                <div className="infraccion__materia">{c.materia}</div>
                <p className="infraccion__desc">{c.relato}</p>
                <p className="san__pregunta">{c.pregunta}</p>

                {!elegido ? (
                  <div className="infraccion__opciones grad__opciones">
                    {c.opciones.map((o) => (
                      <button
                        key={o.k}
                        type="button"
                        className="btn-opcion"
                        onClick={() => responder(i, o.k)}
                      >
                        {o.t}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="infraccion__resultado">
                    <div className="infraccion__veredicto">
                      {acertado
                        ? '✅ Correcto'
                        : '❌ La respuesta correcta era: ' +
                          c.opciones.find((o) => o.k === c.correcta).t}
                    </div>
                    <dl className="san__ficha">
                      <dt>Tipo de infracción</dt>
                      <dd>{c.tipo}</dd>
                      <dt>Preceptos infringidos</dt>
                      <dd>{c.preceptos}</dd>
                      <dt>Cuantía de la sanción</dt>
                      <dd>{c.cuantia}</dd>
                      <dt>Graduación</dt>
                      <dd>{c.graduacion}</dd>
                    </dl>
                    {c.nota && <p className="grad__explicacion">⚑ {c.nota}</p>}
                  </div>
                )}
              </article>
            )
          })}
        </div>

        <div className="jurisprudencia">
          <h3 className="jurisprudencia__titulo">📚 Criterio técnico y jurisprudencia</h3>
          <p className="jurisprudencia__intro">{criterioTecnicoObstruccion}</p>

          <div className="jurisprudencia__grid">
            {jurisprudenciaObstruccion.map((j, i) => (
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
          Elaborado conforme a los arts. 39, 40 y 50 del TRLISOS (RDLeg 5/2000) y a los arts. 13,
          14, 16 y 18 de la Ley 23/2015. Referencias contrastadas en varias fuentes; conviene
          verificar el texto íntegro de cada resolución (CENDOJ) antes de citarla en un acta.
        </p>
      </div>
    </section>
  )
}
