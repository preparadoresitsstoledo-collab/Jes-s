import { HERRAMIENTAS } from '../data/herramientas.js'

export default function PortalHerramientas() {
  return (
    <div className="analizador portal">
      <header className="analizador__hero">
        <div className="contenedor">
          <a className="analizador__volver" href="#inicio">
            ← Volver a la web
          </a>
          <h1>Herramientas</h1>
          <p className="analizador__lema">
            Aplicaciones de apoyo en materia laboral y de Inspección de Trabajo. Todas son{' '}
            <strong>orientativas e informativas</strong> y se procesan en tu navegador.
          </p>
        </div>
      </header>

      <div className="contenedor portal__grid">
        {HERRAMIENTAS.map((h) => (
          <a key={h.id} className="portal__card" href={h.ruta}>
            <span className="portal__icono" aria-hidden="true">
              {h.icono}
            </span>
            <h2>{h.nombre}</h2>
            <p className="portal__resumen">{h.resumen}</p>
            <p className="portal__descripcion">{h.descripcion}</p>
            {h.etiquetas?.length > 0 && (
              <ul className="portal__etiquetas">
                {h.etiquetas.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            )}
            <span className="portal__abrir">Abrir herramienta →</span>
          </a>
        ))}
      </div>
    </div>
  )
}
