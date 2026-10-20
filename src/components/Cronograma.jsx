import { cronograma2026 } from '../data/proceso.js'

const BASE = import.meta.env.BASE_URL

export default function Cronograma() {
  const c = cronograma2026

  return (
    <section className="seccion" id="cronograma-2026">
      <div className="contenedor">
        <span className="etiqueta-seccion">Proceso selectivo 2026</span>
        <h2 className="seccion__titulo">Cronograma orientativo 2026</h2>
        <p className="seccion__subtitulo">{c.intro}</p>

        <ol className="cronograma">
          {c.hitos.map((h, i) => (
            <li className="cronograma__hito" key={i}>
              <span className="cronograma__punto" aria-hidden="true" />
              <div className="cronograma__contenido">
                <span className="cronograma__fecha">{h.fecha}</span>
                <p>{h.texto}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="cronograma__descarga">
          <a
            className="modelo-card"
            href={`${BASE}${c.archivo}`}
            target="_blank"
            rel="noopener noreferrer"
            download
          >
            <span className="modelo-card__icono" aria-hidden="true">
              📅
            </span>
            <span className="modelo-card__cuerpo">
              <strong>{c.archivoEtiqueta}</strong>
              <span className="modelo-card__desc">
                Fechas orientativas de examen por orden de llamamiento.
              </span>
              <span className="modelo-card__meta">{c.archivoMeta} · Descargar ↓</span>
            </span>
          </a>
        </div>

        <p className="fuente-nota">{c.nota}</p>
      </div>
    </section>
  )
}
