import { useState } from 'react'
import { casosSanciones, marcoSanciones } from '../data/sanciones.js'

export default function Sanciones() {
  const [respuestas, setRespuestas] = useState({}) // index -> clave elegida

  const total = casosSanciones.length
  const respondidas = Object.keys(respuestas).length
  const aciertos = casosSanciones.reduce(
    (n, c, i) => n + (respuestas[i] === c.correcta ? 1 : 0),
    0,
  )

  const responder = (i, k) => setRespuestas((r) => (r[i] ? r : { ...r, [i]: k }))
  const reiniciar = () => setRespuestas({})

  return (
    <section className="seccion" id="sanciones">
      <div className="contenedor">
        <a className="analizador__volver" href="#herramientas">
          ← Volver a la web
        </a>
        <span className="etiqueta-seccion">Herramienta didáctica</span>
        <h2 className="seccion__titulo">Sanciones y cuantías</h2>
        <p className="seccion__subtitulo">
          Calcula la cuantía de la sanción en los supuestos más habituales de Seguridad Social
          (faltas de alta, impago y diferencias de cotización) con sus preceptos infringidos y el
          efecto del <strong>pronto pago</strong>.
        </p>

        <details className="marco-legal">
          <summary>📘 Cómo se calculan estas sanciones</summary>
          <div className="marco-legal__cuerpo">
            <p>
              <strong>Cuotas.</strong> {marcoSanciones.cuotas}
            </p>
            <ul>
              {marcoSanciones.bandasGrave.map((b, i) => (
                <li key={`g${i}`}>{b}</li>
              ))}
              {marcoSanciones.bandasMuyGrave.map((b, i) => (
                <li key={`mg${i}`}>{b}</li>
              ))}
            </ul>
            <p>
              <strong>Faltas de alta.</strong> {marcoSanciones.altas}
            </p>
            <p className="marco-legal__regla">💶 {marcoSanciones.prontoPago}</p>
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
          {casosSanciones.map((c, i) => {
            const elegido = respuestas[i]
            const acertado = elegido === c.correcta
            return (
              <article
                className={`infraccion ${elegido ? (acertado ? 'infraccion--grave' : 'infraccion--muy-grave') : ''}`}
                key={i}
              >
                <div className="infraccion__materia">{c.materia}</div>
                <p className="infraccion__desc">{c.supuesto}</p>
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
                      <dt>Precepto infringido</dt>
                      <dd>{c.precepto}</dd>
                      <dt>Calificación</dt>
                      <dd>{c.calificacion}</dd>
                      <dt>Tipificación de la sanción</dt>
                      <dd>{c.tipificacion}</dd>
                      <dt>Cuantía</dt>
                      <dd>{c.cuantia}</dd>
                      <dt>Pronto pago</dt>
                      <dd>{c.prontoPago}</dd>
                    </dl>
                    {c.nota && <p className="grad__explicacion">⚑ {c.nota}</p>}
                  </div>
                )}
              </article>
            )
          })}
        </div>

        <p className="fuente-nota">
          Cuantías y preceptos conforme a la «Plantilla de preceptos infringidos» de la Escuela de la
          ITSS (oct. 2024) y a los arts. 22, 23, 39 y 40 LISOS (RDLeg 5/2000); pronto pago según el
          RD 688/2021. Datos orientativos: verifica siempre la cuantía y el precepto vigentes en cada
          acta.
        </p>
      </div>
    </section>
  )
}
