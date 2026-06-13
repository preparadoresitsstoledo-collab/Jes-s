import { procesoIntro, ejercicios, temario } from '../data/proceso.js'

export default function Proceso() {
  return (
    <section className="seccion" id="proceso">
      <div className="contenedor">
        <span className="etiqueta-seccion">Cómo es la oposición</span>
        <h2 className="seccion__titulo">El proceso selectivo</h2>
        <p className="seccion__subtitulo">{procesoIntro}</p>

        <div className="ejercicios-grid">
          {ejercicios.map((e) => (
            <article className="ejercicio" key={e.n}>
              <div className="ejercicio__cabecera">
                <span className="ejercicio__num">{e.n}</span>
                <div>
                  <h3>{e.titulo}</h3>
                  <span className="ejercicio__forma">{e.forma}</span>
                </div>
              </div>

              <div className="ejercicio__meta">
                <span title="Tiempo">⏱️ {e.tiempo}</span>
                <span title="Temas">📑 {e.temas}</span>
              </div>

              <p className="ejercicio__desc">{e.descripcion}</p>
              <p className="ejercicio__calif">
                <strong>Calificación:</strong> {e.calificacion}
              </p>
            </article>
          ))}
        </div>

        <div className="temario">
          <div className="temario__texto">
            <h3>El temario</h3>
            <p>{temario.intro}</p>
            {temario.comprar?.length > 0 && (
              <div className="temario__comprar">
                <span className="temario__comprar-titulo">Dónde adquirir el temario CEF:</span>
                {temario.comprar.map((c, i) => (
                  <a key={i} href={c.url} target="_blank" rel="noopener noreferrer">
                    {c.etiqueta} ↗
                  </a>
                ))}
              </div>
            )}
          </div>
          <ul className="temario__lista">
            {temario.puntos.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
