import { testimonios } from '../data/sitio.js'

export default function Testimonios() {
  return (
    <section className="seccion" id="testimonios">
      <div className="contenedor">
        <span className="etiqueta-seccion">Referencias</span>
        <h2 className="seccion__titulo">Lo que dicen mis alumnos</h2>
        <p className="seccion__subtitulo">
          Experiencias reales de quienes han conseguido su plaza.
        </p>

        <div className="testimonios-grid">
          {testimonios.map((t, i) => (
            <figure className="testimonio" key={i}>
              <blockquote className="testimonio__texto">{t.texto}</blockquote>
              <figcaption className="testimonio__pie">
                <span className="testimonio__autor">{t.autor}</span>
                {t.cargo && <span className="testimonio__cargo">{t.cargo}</span>}
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="referencias-nota">
          Por respeto a la intimidad de mis alumnos y alumnas, publico sus testimonios sin más datos
          personales. Si necesitas más referencias antes de decidirte, escríbeme y, con su permiso,
          te pongo en contacto con personas que se han preparado conmigo.
        </p>
      </div>
    </section>
  )
}
