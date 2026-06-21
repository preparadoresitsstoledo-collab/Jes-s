import { HERRAMIENTAS } from '../data/herramientas.js'

export default function Herramientas() {
  return (
    <section className="seccion seccion--alt" id="herramientas">
      <div className="contenedor">
        <span className="etiqueta-seccion">Recursos prácticos</span>
        <h2 className="seccion__titulo">Herramientas</h2>
        <p className="seccion__subtitulo">
          Aplicaciones de apoyo en materia laboral y de Inspección de Trabajo. Orientativas e
          informativas, se procesan íntegramente en tu navegador.
        </p>

        <div className="home-herramientas-grid">
          {HERRAMIENTAS.map((h) => (
            <a key={h.id} className="home-herramienta" href={h.ruta}>
              <span className="home-herramienta__icono" aria-hidden="true">
                {h.icono}
              </span>
              <h3>{h.nombre}</h3>
              <p>{h.descripcion}</p>
              <span className="home-herramienta__abrir">Abrir herramienta →</span>
            </a>
          ))}
        </div>

        <p className="home-herramientas-pie">
          <a className="btn btn--secundario" href="#/herramientas">
            Ver todas las herramientas
          </a>
        </p>
      </div>
    </section>
  )
}
