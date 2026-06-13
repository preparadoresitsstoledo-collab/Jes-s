import { pasos } from '../data/sitio.js'

export default function Pasos() {
  return (
    <section className="seccion" id="empezar">
      <div className="contenedor">
        <span className="etiqueta-seccion">Empezar es fácil</span>
        <h2 className="seccion__titulo">Cómo empezar</h2>
        <p className="seccion__subtitulo">
          Cuatro pasos para incorporarte a la preparación presencial en Toledo.
        </p>

        <ol className="pasos">
          {pasos.map((p, i) => (
            <li className="paso" key={i}>
              <span className="paso__num">{i + 1}</span>
              <h3>{p.titulo}</h3>
              <p>{p.texto}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
