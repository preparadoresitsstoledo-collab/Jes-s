import { profesion } from '../data/sitio.js'

export default function Profesion() {
  return (
    <section className="seccion" id="profesion">
      <div className="contenedor">
        <span className="etiqueta-seccion">A qué te dedicarás</span>
        <h2 className="seccion__titulo">La profesión: Inspector/a de Trabajo y Seguridad Social</h2>
        <p className="seccion__subtitulo">{profesion.intro}</p>

        {profesion.cita && (
          <blockquote className="profesion__cita">{profesion.cita.texto}</blockquote>
        )}

        <div className="profesion-grid">
          {profesion.puntos.map((p, i) => (
            <article className="profesion-card" key={i}>
              <span className="profesion-card__icono" aria-hidden="true">
                {p.icono}
              </span>
              <h3>{p.titulo}</h3>
              <p>{p.texto}</p>
            </article>
          ))}
        </div>

        {profesion.marco && (
          <div className="marco">
            <h3 className="marco__titulo">{profesion.marco.titulo}</h3>
            <ul className="marco__lista">
              {profesion.marco.normas.map((n, i) => (
                <li key={i}>
                  <strong>{n.nombre}</strong>
                  <span>{n.detalle}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
