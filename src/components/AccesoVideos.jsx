/**
 * Acceso a la página de vídeos del preparador.
 * No incrusta ningún vídeo en la portada: solo un enlace que hay que pulsar
 * a propósito para entrar a la sección (#/videos).
 */
export default function AccesoVideos() {
  return (
    <section className="seccion" id="videos-acceso">
      <div className="contenedor">
        <span className="etiqueta-seccion">Multimedia</span>
        <h2 className="seccion__titulo">Vídeos del preparador</h2>
        <p className="seccion__subtitulo">
          Apariciones en medios y material audiovisual sobre la profesión. Se abren en una página
          aparte: entra solo si quieres verlos.
        </p>

        <div className="hub-herramientas">
          <a className="hub-card" href="#/videos">
            <span className="hub-card__icono" aria-hidden="true">🎬</span>
            <strong>Entrar a los vídeos</strong>
            <span className="hub-card__desc">
              Reportajes y apariciones en televisión sobre la Inspección de Trabajo.
            </span>
            <span className="hub-card__cta">Abrir sección →</span>
          </a>
        </div>
      </div>
    </section>
  )
}
