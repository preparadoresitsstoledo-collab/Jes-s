import { testimonios } from '../data/sitio.js'

export default function Testimonios() {
  return (
    <section className="seccion" id="testimonios">
      <div className="contenedor">
        <span className="etiqueta-seccion">Referencias</span>
        <h2 className="seccion__titulo">Lo que dicen mis alumnos</h2>
        <p className="seccion__subtitulo">
          Experiencias de aspirantes que se han preparado conmigo.
        </p>

        <div className="testimonios-grid">
          {testimonios.map((t, i) => (
            <figure className="testimonio" key={i}>
              <blockquote className="testimonio__texto">{t.texto}</blockquote>
              <figcaption>
                <div className="testimonio__autor">{t.nombre}</div>
                <div className="testimonio__promo">{t.promocion}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
