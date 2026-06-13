import { marca } from '../data/sitio.js'
import { totales, tasaMediaAprobados } from '../data/convocatorias.js'

export default function Hero() {
  return (
    <header className="hero" id="inicio">
      <div className="contenedor hero__inner">
        <span className="hero__badge">📍 Preparación presencial en {marca.ciudad} y provincia</span>
        <h1>Oposición al Cuerpo Superior de Inspección de Trabajo y Seguridad Social</h1>
        <p>
          Preparación <strong>100% presencial</strong> en la provincia de {marca.ciudad}, con
          metodología personalizada, casos prácticos reales y seguimiento continuo para ayudarte a
          conseguir tu plaza de Inspector/a de Trabajo y Seguridad Social.
        </p>

        <div className="hero__acciones">
          <a className="btn btn--primario" href="#contacto">
            Solicita información
          </a>
          <a className="btn btn--secundario" href="#estadisticas">
            Ver estadísticas de la oposición
          </a>
        </div>

        <div className="hero__datos">
          <div className="hero__dato">
            <strong>{tasaMediaAprobados.toFixed(0)}%</strong>
            <span>tasa media de aprobados sobre presentados*</span>
          </div>
          <div className="hero__dato">
            <strong>{totales.plazas.toLocaleString('es-ES')}</strong>
            <span>plazas convocadas en el periodo*</span>
          </div>
          <div className="hero__dato">
            <strong>Presencial</strong>
            <span>sin videoconferencia, en {marca.ciudad}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
