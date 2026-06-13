import { marca } from '../data/sitio.js'
import { totales, ultimaConvocatoria } from '../data/convocatorias.js'

export default function Hero() {
  return (
    <header className="hero" id="inicio">
      {/* Silueta del skyline de Toledo (Alcázar + catedral). Decorativa.
          Para usar una foto real, añade public/hero-toledo.jpg y descomenta
          la regla .hero--foto en index.css. */}
      <svg
        className="hero__skyline"
        viewBox="0 0 1440 240"
        preserveAspectRatio="xMidYMax slice"
        aria-hidden="true"
      >
        <g className="hero__skyline-back">
          <rect x="60" y="150" width="70" height="90" />
          <rect x="150" y="130" width="55" height="110" />
          <rect x="1240" y="140" width="60" height="100" />
          <rect x="1330" y="125" width="70" height="115" />
          <rect x="330" y="160" width="50" height="80" />
          <rect x="1080" y="155" width="55" height="85" />
        </g>
        <g className="hero__skyline-front">
          {/* Edificios izquierda con almenas */}
          <rect x="120" y="170" width="110" height="70" />
          <rect x="240" y="150" width="90" height="90" />
          <rect x="340" y="185" width="120" height="55" />
          {/* Catedral de Toledo (torre + chapitel) */}
          <rect x="500" y="120" width="58" height="120" />
          <polygon points="500,120 529,58 558,120" />
          {/* Alcázar de Toledo: cuerpo central con 4 torres en esquina */}
          <rect x="650" y="110" width="240" height="130" />
          <rect x="640" y="80" width="40" height="160" />
          <rect x="860" y="80" width="40" height="160" />
          <rect x="700" y="95" width="30" height="145" />
          <rect x="810" y="95" width="30" height="145" />
          {/* Edificios derecha */}
          <rect x="930" y="160" width="120" height="80" />
          <rect x="1060" y="140" width="90" height="100" />
          <rect x="1160" y="175" width="130" height="65" />
          {/* Puente / arcos en la base */}
          <path d="M0,240 L1440,240 L1440,225 L0,225 Z" />
        </g>
      </svg>

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
