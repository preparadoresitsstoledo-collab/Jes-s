import { useState } from 'react'
import { marca } from '../data/sitio.js'

export default function Contacto() {
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', mensaje: '' })

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  // Sin backend: al enviar, se abre el cliente de correo del usuario con los
  // datos ya rellenados hacia el email del preparador.
  const onSubmit = (e) => {
    e.preventDefault()
    const asunto = `Información preparación ITSS — ${form.nombre || 'Solicitud'}`
    const cuerpo =
      `Nombre: ${form.nombre}\n` +
      `Email: ${form.email}\n` +
      `Teléfono: ${form.telefono}\n\n` +
      `${form.mensaje}`
    window.location.href = `mailto:${marca.email}?subject=${encodeURIComponent(
      asunto,
    )}&body=${encodeURIComponent(cuerpo)}`
  }

  return (
    <section className="seccion" id="contacto">
      <div className="contenedor">
        <span className="etiqueta-seccion">Contacto</span>
        <h2 className="seccion__titulo">Solicita información o reserva tu plaza</h2>
        <p className="seccion__subtitulo">
          Preparación presencial en {marca.ciudad}. Escríbeme y te respondo lo antes posible.
        </p>

        <div className="contacto">
          <div className="contacto__info">
            <h3>Datos de contacto</h3>
            <p>Resuelvo tus dudas sobre la preparación, fechas y disponibilidad de plazas.</p>

            <ul className="contacto__lista">
              <li>
                <span className="contacto__icono" aria-hidden="true">
                  📧
                </span>
                <div>
                  <strong>Email</strong>
                  <a href={`mailto:${marca.email}`}>{marca.email}</a>
                </div>
              </li>
              <li>
                <span className="contacto__icono" aria-hidden="true">
                  📞
                </span>
                <div>
                  <strong>Teléfono</strong>
                  <a href={`tel:${marca.telefono.replace(/\s/g, '')}`}>{marca.telefono}</a>
                </div>
              </li>
              <li>
                <span className="contacto__icono" aria-hidden="true">
                  💬
                </span>
                <div>
                  <strong>WhatsApp</strong>
                  <a
                    href={`https://wa.me/${marca.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Enviar mensaje
                  </a>
                </div>
              </li>
              <li>
                <span className="contacto__icono" aria-hidden="true">
                  📍
                </span>
                <div>
                  <strong>Dónde</strong>
                  Preparación presencial en {marca.ciudad} y provincia (sin videoconferencia)
                </div>
              </li>
              {(marca.x || marca.linkedin) && (
                <li>
                  <span className="contacto__icono" aria-hidden="true">
                    🔗
                  </span>
                  <div>
                    <strong>Redes</strong>
                    <span className="contacto__redes">
                      {marca.x && (
                        <a href={marca.x} target="_blank" rel="noopener noreferrer">
                          X {marca.xUsuario}
                        </a>
                      )}
                      {marca.linkedin && (
                        <a href={marca.linkedin} target="_blank" rel="noopener noreferrer">
                          LinkedIn
                        </a>
                      )}
                    </span>
                  </div>
                </li>
              )}
            </ul>
          </div>

          <form className="form" onSubmit={onSubmit}>
            <label htmlFor="nombre">Nombre y apellidos</label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              value={form.nombre}
              onChange={onChange}
              required
            />

            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              required
            />

            <label htmlFor="telefono">Teléfono</label>
            <input
              id="telefono"
              name="telefono"
              type="tel"
              value={form.telefono}
              onChange={onChange}
            />

            <label htmlFor="mensaje">Mensaje</label>
            <textarea
              id="mensaje"
              name="mensaje"
              value={form.mensaje}
              onChange={onChange}
              placeholder="Cuéntame en qué punto de la preparación estás y qué necesitas."
              required
            />

            <button className="btn btn--primario" type="submit">
              Enviar solicitud
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
