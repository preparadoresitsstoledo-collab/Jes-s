import { camino } from '../data/camino.js'
import { marca } from '../data/sitio.js'

export default function MiCamino() {
  return (
    <section className="seccion seccion--alt" id="mi-camino">
      <div className="contenedor">
        <span className="etiqueta-seccion">{camino.etiqueta}</span>
        <h2 className="seccion__titulo">{camino.titulo}</h2>
        <p className="camino__intro">{camino.intro}</p>

        <ol className="camino__fases">
          {camino.fases.map((f, i) => (
            <li className="camino-fase" key={i}>
              <div className="camino-fase__num">{i + 1}</div>
              <div className="camino-fase__cuerpo">
                <span className="camino-fase__etiqueta">{f.etiqueta}</span>
                <h3>{f.titulo}</h3>
                <p>{f.texto}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="camino__cierre">
          <h3>{camino.cierreTitulo}</h3>
          <p>{camino.cierreTexto}</p>
          {camino.cierreNota && <p className="camino__escasez">⏳ {camino.cierreNota}</p>}
          <div className="camino__acciones">
            <a className="btn btn--primario" href="#contacto">
              Reserva tu plaza en el grupo
            </a>
            <a className="btn btn--oscuro" href={`mailto:${marca.email}`}>
              {marca.email}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
