import { marca } from '../data/sitio.js'
import { totales, ultimaConvocatoria } from '../data/convocatorias.js'
import heroToledo from '../assets/hero-toledo.jpg'

export default function Hero() {
  const fondo = {
    backgroundImage:
      `linear-gradient(rgba(11,37,69,0.78), rgba(11,37,69,0.92)), url(${heroToledo})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  return (
    <header className="hero hero--foto" id="inicio" style={fondo}>
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
            <strong>{ultimaConvocatoria.plazasLibre}</strong>
            <span>plazas de acceso libre en la convocatoria {ultimaConvocatoria.año}</span>
          </div>
          <div className="hero__dato">
            <strong>{totales.plazasLibre}</strong>
            <span>plazas convocadas en las últimas 3 convocatorias</span>
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
