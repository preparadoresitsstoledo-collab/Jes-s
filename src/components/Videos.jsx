const BASE = import.meta.env.BASE_URL

const videos = [
  {
    titulo: 'Inspectores en prácticas sin plaza',
    fuente: 'Antena 3 Noticias',
    descripcion:
      'Reportaje de Antena 3 Noticias sobre la situación de los inspectores en prácticas sin plaza.',
    src: `${BASE}videos/antena3-inspectores-en-practicas-sin-plaza.mp4`,
  },
]

export default function Videos() {
  return (
    <div className="analizador">
      <div className="analizador__hero">
        <h1>Vídeos del preparador</h1>
        <p>
          Apariciones en medios y material audiovisual sobre la profesión de Inspector de Trabajo y
          Seguridad Social.
        </p>
        <a className="analizador__volver" href="#inicio">
          ← Volver a la web
        </a>
      </div>

      <div className="videos-pagina">
        {videos.map((v, i) => (
          <article className="video-item" key={i}>
            <h2 className="video-item__titulo">{v.titulo}</h2>
            <div className="video-item__fuente">{v.fuente}</div>
            <video className="video-item__player" controls preload="metadata" playsInline>
              <source src={v.src} type="video/mp4" />
              Tu navegador no admite la reproducción de vídeo. Puedes{' '}
              <a href={v.src}>descargar el vídeo aquí</a>.
            </video>
            <p className="video-item__desc">{v.descripcion}</p>
          </article>
        ))}

        <p className="fuente-nota">
          Fragmento informativo emitido en televisión, reproducido a título de cita con fines
          divulgativos e informativos. Los derechos del programa corresponden a su titular.
        </p>
      </div>
    </div>
  )
}
