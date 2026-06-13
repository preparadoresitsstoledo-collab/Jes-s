import { marca } from '../data/sitio.js'

export default function WhatsappFlotante() {
  return (
    <a
      className="wa-flotante"
      href={`https://wa.me/${marca.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbeme por WhatsApp"
      title="Escríbeme por WhatsApp"
    >
      <span className="wa-flotante__icono" aria-hidden="true">💬</span>
      <span className="wa-flotante__texto">WhatsApp</span>
    </a>
  )
}
