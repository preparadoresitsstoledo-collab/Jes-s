import { preparador } from '../data/sitio.js'

/** Convierte una URL de YouTube normal en URL de embed, si hace falta. */
function urlEmbed(url) {
  if (!url) return ''
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/)
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`
  return url
}

export default function Preparador() {
  const embed = urlEmbed(preparador.videoUrl)

  return (
    <section className="seccion" id="preparador">
      <div className="contenedor">
        <span className="etiqueta-seccion">Quién soy</span>
        <h2 className="seccion__titulo">El preparador</h2>
        <p className="seccion__subtitulo">
          Conoce a quién te acompañará durante toda la preparación.
        </p>

        <div className="preparador">
          <div className="preparador__media">
            {preparador.foto ? (
              <img className="preparador__foto" src={preparador.foto} alt={preparador.nombre} />
            ) : (
              <div className="preparador__avatar" aria-hidden="true">
                👤
              </div>
            )}
          </div>

          <div className="preparador__texto">
            <h3>{preparador.nombre}</h3>
            <p className="preparador__cargo">{preparador.cargo}</p>

            <div className="preparador__bio">
              {preparador.bio.map((parrafo, i) => (
                <p key={i}>{parrafo}</p>
              ))}
            </div>

            <ul className="meritos">
              {preparador.meritos.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>

            {preparador.cita && (
              <blockquote className="cita-destacada">
                <p>{preparador.cita.texto}</p>
                {preparador.cita.fuente && <cite>{preparador.cita.fuente}</cite>}
              </blockquote>
            )}

            {preparador.medios?.length > 0 && (
              <div className="medios">
                <span className="medios__titulo">En los medios</span>
                <ul className="medios__lista">
                  {preparador.medios.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
                {preparador.galeria?.length > 0 && (
                  <div className="medios__galeria">
                    {preparador.galeria.map((g, i) => (
                      <img key={i} src={g.src} alt={g.alt} loading="lazy" />
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="video">
              {embed ? (
                <iframe
                  src={embed}
                  title={`Vídeo de presentación de ${preparador.nombre}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="video__placeholder">
                  🎬 Aquí aparecerá tu vídeo de presentación.
                  <br />
                  Añade la URL en <code>src/data/sitio.js</code> (campo <code>videoUrl</code>).
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
