import { useState } from 'react'
import { marca } from '../data/sitio.js'

export default function Contacto() {
  const [form, setForm] = useState({ nombre: '', email: '', mensaje: '', website: '' })
  const [estado, setEstado] = useState('idle') // idle | enviando | ok | error

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  // Envía el formulario por correo a info@preparadoritsstoledo.es a través de
  // FormSubmit (servicio gratuito, sin backend propio). El visitante no necesita
  // ninguna app: el correo se manda en segundo plano.
  const onSubmit = async (e) => {
    e.preventDefault()
    setEstado('enviando')
    try {
      const resp = await fetch('https://formsubmit.co/ajax/45b42e56f8d27d27eb7a8a31303bef84', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          Nombre: form.nombre,
          Email: form.email,
          Mensaje: form.mensaje,
          _subject: `Solicitud de información — ${form.nombre}`,
          _template: 'table',
          _captcha: 'false',
          _honey: form.website, // antispam
        }),
      })
      const json = await resp.json().catch(() => ({}))

      if (resp.ok && String(json.success) === 'true') {
        setEstado('ok')
        setForm({ nombre: '', email: '', mensaje: '', website: '' })
      } else {
        setEstado('error')
      }
    } catch {
      setEstado('error')
    }
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
              {marca.mostrarTelefono && (
                <li>
                  <span className="contacto__icono" aria-hidden="true">
                    📞
                  </span>
                  <div>
                    <strong>Teléfono</strong>
                    <a href={`tel:${marca.telefono.replace(/\s/g, '')}`}>{marca.telefono}</a>
                  </div>
                </li>
              )}
              {marca.whatsapp && (
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
              )}
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

            <label htmlFor="mensaje">Mensaje</label>
            <textarea
              id="mensaje"
              name="mensaje"
              value={form.mensaje}
              onChange={onChange}
              placeholder="Cuéntame en qué punto de la preparación estás y qué necesitas."
              required
            />

            {/* Campo trampa antispam: oculto para personas, lo rellenan los bots */}
            <div className="hp" aria-hidden="true">
              <label htmlFor="website">No rellenar</label>
              <input
                id="website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={onChange}
              />
            </div>

            <button className="btn btn--primario" type="submit" disabled={estado === 'enviando'}>
              {estado === 'enviando' ? 'Enviando…' : 'Enviar solicitud'}
            </button>

            {estado === 'ok' && (
              <p className="form__aviso form__aviso--ok" role="status">
                ✅ ¡Mensaje enviado! Te responderé lo antes posible.
              </p>
            )}
            {estado === 'error' && (
              <p className="form__aviso form__aviso--error" role="status">
                ❌ No se ha podido enviar. Inténtalo de nuevo o escribe a{' '}
                <a href={`mailto:${marca.email}`}>{marca.email}</a>.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
