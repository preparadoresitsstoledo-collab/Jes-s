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
        <span className="etiqueta-seccion">Herramientas</span>
        <h2 className="seccion__titulo">Herramientas para inspectores y opositores</h2>
        <p className="seccion__subtitulo">
          Recursos prácticos gratuitos: calcula indemnizaciones, revisa convenios, prepara informes
          de amianto y pon a prueba tu criterio sancionador.
        </p>

        <div className="hub-herramientas">
          <a className="hub-card" href="#/despido">
            <span className="hub-card__icono" aria-hidden="true">🧮</span>
            <strong>Calculadora de indemnización</strong>
            <span className="hub-card__desc">
              Por despido y extinción del contrato, con su artículo y cálculo.
            </span>
            <span className="hub-card__cta">Abrir herramienta →</span>
          </a>
          <a className="hub-card" href="#/analizador">
            <span className="hub-card__icono" aria-hidden="true">📑</span>
            <strong>Analizador de convenios</strong>
            <span className="hub-card__desc">
              Revisa la legalidad de cláusulas de un convenio colectivo.
            </span>
            <span className="hub-card__cta">Abrir herramienta →</span>
          </a>
          <a className="hub-card" href="#/amianto">
            <span className="hub-card__icono" aria-hidden="true">🦺</span>
            <strong>Planes de amianto</strong>
            <span className="hub-card__desc">
              Apartados del informe del plan de trabajo (RD 396/2006).
            </span>
            <span className="hub-card__cta">Abrir herramienta →</span>
          </a>
          <a className="hub-card" href="#/graduacion">
            <span className="hub-card__icono" aria-hidden="true">⚖️</span>
            <strong>Graduación de la sanción</strong>
            <span className="hub-card__desc">
              Juego de estudio: fija el grado (mín./medio/máx.) según los arts. 39-40 LISOS.
            </span>
            <span className="hub-card__cta">Abrir herramienta →</span>
          </a>
          <a className="hub-card" href="#/sanciones">
            <span className="hub-card__icono" aria-hidden="true">💶</span>
            <strong>Sanciones y cuantías</strong>
            <span className="hub-card__desc">
              Calcula la multa (altas, cotización, diferencias) y el efecto del pronto pago.
            </span>
            <span className="hub-card__cta">Abrir herramienta →</span>
          </a>
          <a className="hub-card" href="#/obstruccion">
            <span className="hub-card__icono" aria-hidden="true">🚧</span>
            <strong>Obstrucción a la inspección</strong>
            <span className="hub-card__desc">
              Casos prácticos: tipo, precepto y cuantía (art. 50 en relación con el 40 y 39).
            </span>
            <span className="hub-card__cta">Abrir herramienta →</span>
          </a>
          <a className="hub-card" href="#/denuncia">
            <span className="hub-card__icono" aria-hidden="true">📝</span>
            <strong>Asistente de denuncia</strong>
            <span className="hub-card__desc">
              Redacta tu denuncia ante la Inspección de Trabajo paso a paso, aunque no seas jurista.
            </span>
            <span className="hub-card__cta">Abrir herramienta →</span>
          </a>
          <a className="hub-card" href="test-proporcionalidad.html">
            <span className="hub-card__icono" aria-hidden="true">⚖️</span>
            <strong>Test de proporcionalidad (control laboral)</strong>
            <span className="hub-card__desc">
              Evalúa cámaras, biometría, GPS, IA… con el triple juicio y las garantías (RGPD, IA, RD 723/2026).
            </span>
            <span className="hub-card__cta">Abrir herramienta →</span>
          </a>
        </div>

        <div className="hub-transporte" id="herramientas-transporte">
          <span className="etiqueta-seccion">Inspección en el transporte por carretera</span>
          <h3 className="seccion__titulo hub-transporte__titulo">Tacógrafo, jornada y dietas</h3>
          <p className="seccion__subtitulo hub-transporte__subtitulo">
            Para que los conductores y conductoras conozcan sus derechos: lee las descargas de la tarjeta del
            conductor, calcula excesos de jornada y horas extraordinarias, detecta dietas que pueden esconder
            salario y valora lo que podría reclamarse a la empresa con las tablas del convenio. Los
            archivos se procesan solo en tu navegador.
          </p>
          <div className="hub-herramientas">
            <a className="hub-card" href="#/tacografo">
              <span className="hub-card__icono" aria-hidden="true">🚚</span>
              <strong>Analizador de tacógrafo</strong>
              <span className="hub-card__desc">
                Todas las descargas .DDD/.TGD a la vez: conducción, descansos e incumplimientos del
                R. 561/2006, el RD 1561/1995 y el ET, con Excel de las horas extraordinarias que se pueden reclamar.
              </span>
              <span className="hub-card__cta">Abrir herramienta →</span>
            </a>
            <a className="hub-card" href="#/dietas-jornada">
              <span className="hub-card__icono" aria-hidden="true">🧾</span>
              <strong>Dietas y jornada anual</strong>
              <span className="hub-card__desc">
                Cuadrante de excesos sobre la jornada anual del convenio, vacaciones, dietas irregulares,
                diferencias salariales y cotizaciones, y los plazos para reclamarlas (Word y Excel).
              </span>
              <span className="hub-card__cta">Abrir herramienta →</span>
            </a>
          </div>
        </div>

        <div className="hub-juego">
          <span className="etiqueta-seccion">Juego de repaso</span>
          <h3 className="seccion__titulo" style={{ fontSize: '1.5rem' }}>
            Simulador de visita de inspección
          </h3>
          <p className="seccion__subtitulo" style={{ marginBottom: '28px' }}>
            En cada hallazgo, decide si la infracción es <strong>grave</strong> o{' '}
            <strong>muy grave</strong>: se te revelará el artículo y la sanción correspondiente.
          </p>
        </div>

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
