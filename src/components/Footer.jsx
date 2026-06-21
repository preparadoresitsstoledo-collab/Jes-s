import { marca } from '../data/sitio.js'
import ContadorVisitas from './ContadorVisitas.jsx'

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
            <a href="#preparador">El preparador</a> · <a href="#resultados">Resultados</a> ·{' '}
            <a href="#proceso">El examen</a> · <a href="#contacto">Contacto</a>
          </div>

          <div>
            <strong style={{ color: '#fff', display: 'block', marginBottom: 8 }}>Contacto</strong>
            <a href={`mailto:${marca.email}`}>{marca.email}</a>
            <br />
            {marca.mostrarTelefono && (
              <>
                <a href={`tel:${marca.telefono.replace(/\s/g, '')}`}>{marca.telefono}</a>
                <br />
              </>
            )}
            {marca.x && (
              <a href={marca.x} target="_blank" rel="noopener noreferrer">
                X {marca.xUsuario}
              </a>
            )}
            {marca.x && marca.linkedin && ' · '}
            {marca.linkedin && (
              <a href={marca.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            )}
          </div>
        </div>

        <div className="footer__legal">
          © {año} {marca.nombre}. Todos los derechos reservados. · Las estadísticas mostradas
          proceden de las publicaciones oficiales del BOE.
          <ContadorVisitas />
        </div>
      </div>
    </footer>
  )
}
