import { metodologia } from '../data/sitio.js'

export default function Metodologia() {
  return (
    <section className="seccion" id="metodologia">
      <div className="contenedor">
        <span className="etiqueta-seccion">Cómo trabajamos</span>
        <h2 className="seccion__titulo">Metodología</h2>
        <p className="seccion__subtitulo">
          Una preparación presencial, cercana y orientada a resultados.
        </p>

        <div className="metodologia-grid">
          {metodologia.map((m, i) => (
            <article className="metodo-card" key={i}>
              <div className="metodo-card__icono" aria-hidden="true">
                {m.icono}
              </div>
              <h3>{m.titulo}</h3>
              <p>{m.texto}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
