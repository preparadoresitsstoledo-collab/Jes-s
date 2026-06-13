import { ventajas } from '../data/sitio.js'

export default function Ventajas() {
  return (
    <section className="ventajas-band">
      <div className="contenedor ventajas-grid">
        {ventajas.map((v, i) => (
          <div className="ventaja" key={i}>
            <span className="ventaja__icono" aria-hidden="true">
              {v.icono}
            </span>
            <div>
              <strong>{v.titulo}</strong>
              <span>{v.texto}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
