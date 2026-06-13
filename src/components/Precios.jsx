import { planes } from '../data/sitio.js'

export default function Precios() {
  return (
    <section className="seccion seccion--alt" id="precios">
      <div className="contenedor">
        <span className="etiqueta-seccion">Coste de la preparación</span>
        <h2 className="seccion__titulo">Precios</h2>
        <p className="seccion__subtitulo">
          Tarifas claras y sin sorpresas. Consulta condiciones y disponibilidad de plazas.
        </p>

        <div className="precios-grid">
          {planes.map((p, i) => (
            <article className={`plan ${p.destacado ? 'plan--destacado' : ''}`} key={i}>
              {p.destacado && <span className="plan__badge">Más popular</span>}
              <h3>{p.nombre}</h3>
              <div className="plan__precio">{p.precio}</div>
              <div className="plan__periodo">{p.periodo}</div>
              <p className="plan__desc">{p.descripcion}</p>
              <ul className="plan__incluye">
                {p.incluye.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
              {p.nota && <p className="plan__nota">{p.nota}</p>}
              <a className="btn btn--oscuro" href="#contacto">
                Solicitar información
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
