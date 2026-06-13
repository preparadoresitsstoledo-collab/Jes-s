import { marca } from '../data/sitio.js'

export default function CtaFinal() {
  return (
    <section className="cta-final">
      <div className="contenedor cta-final__inner">
        <h2>¿Listo para conseguir tu plaza de Inspector/a de Trabajo y Seguridad Social?</h2>
        <p>Preparación presencial en {marca.ciudad}. Plazas limitadas: solicita información sin compromiso.</p>
        <div className="cta-final__acciones">
          <a className="btn btn--primario" href="#contacto">
            Solicita información
          </a>
          <a className="btn btn--secundario" href={`mailto:${marca.email}`}>
            Escríbeme por email
          </a>
        </div>
      </div>
    </section>
  )
}
