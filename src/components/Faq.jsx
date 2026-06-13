import { faqs } from '../data/sitio.js'

export default function Faq() {
  return (
    <section className="seccion seccion--alt" id="faq">
      <div className="contenedor">
        <span className="etiqueta-seccion">Dudas frecuentes</span>
        <h2 className="seccion__titulo">Preguntas frecuentes</h2>
        <p className="seccion__subtitulo">Resolvemos las dudas más habituales.</p>

        <div className="faq-lista">
          {faqs.map((f, i) => (
            <details className="faq-item" key={i}>
              <summary>{f.pregunta}</summary>
              <p>{f.respuesta}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
