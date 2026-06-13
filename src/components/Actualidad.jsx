import { useEffect, useRef } from 'react'
import { marca } from '../data/sitio.js'

/**
 * Muestra la línea de tiempo de X (Twitter) del preparador, que se actualiza
 * automáticamente con lo que se publique en la cuenta.
 *
 * Nota: el widget de X carga desde platform.twitter.com en el navegador del
 * visitante. Si la cuenta es privada o el widget no carga, se muestra el
 * enlace de respaldo "Ver perfil en X".
 */
export default function Actualidad() {
  const ref = useRef(null)

  useEffect(() => {
    if (!marca.x) return
    const id = 'twitter-wjs'
    const cargar = () => window.twttr?.widgets?.load(ref.current)

    if (document.getElementById(id)) {
      cargar()
      return
    }
    const s = document.createElement('script')
    s.id = id
    s.async = true
    s.src = 'https://platform.twitter.com/widgets.js'
    s.onload = cargar
    document.body.appendChild(s)
  }, [])

  if (!marca.x) return null

  return (
    <section className="seccion seccion--alt" id="actualidad">
      <div className="contenedor">
        <span className="etiqueta-seccion">En directo</span>
        <h2 className="seccion__titulo">Actualidad</h2>
        <p className="seccion__subtitulo">
          Últimas publicaciones de {marca.xUsuario} en X. Se actualiza automáticamente.
        </p>

        <div className="actualidad" ref={ref}>
          <a
            className="twitter-timeline"
            data-height="600"
            data-theme="light"
            data-chrome="noheader nofooter transparent"
            href={marca.x}
          >
            Publicaciones de {marca.xUsuario}
          </a>
          <p className="actualidad__fallback">
            <a href={marca.x} target="_blank" rel="noopener noreferrer">
              Ver perfil en X ({marca.xUsuario}) ↗
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
