import { marca } from '../data/sitio.js'

export default function Footer() {
  const año = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="contenedor">
        <div className="footer__grid">
          <div>
            <div className="footer__marca">{marca.nombre}</div>
            <p>
              Preparación presencial de la oposición al Cuerpo Superior de Inspección de Trabajo y
              Seguridad Social en {marca.ciudad}.
            </p>
          </div>

          <div>
            <strong style={{ color: '#fff', display: 'block', marginBottom: 8 }}>Secciones</strong>
            <a href="#preparador">El preparador</a> · <a href="#estadisticas">Estadísticas</a> ·{' '}
            <a href="#precios">Precios</a> · <a href="#contacto">Contacto</a>
          </div>

          <div>
            <strong style={{ color: '#fff', display: 'block', marginBottom: 8 }}>Contacto</strong>
            <a href={`mailto:${marca.email}`}>{marca.email}</a>
            <br />
            <a href={`tel:${marca.telefono.replace(/\s/g, '')}`}>{marca.telefono}</a>
          </div>
        </div>

        <div className="footer__legal">
          © {año} {marca.nombre}. Todos los derechos reservados. · Las estadísticas mostradas
          proceden de las publicaciones oficiales del BOE.
        </div>
      </div>
    </footer>
  )
}
