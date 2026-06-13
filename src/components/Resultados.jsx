import { resultados } from '../data/sitio.js'

export default function Resultados() {
  const { porConvocatoria, nota } = resultados

  const totalLibre = porConvocatoria.reduce((s, c) => s + c.libre, 0)
  const totalPI = porConvocatoria.reduce((s, c) => s + c.promocionInterna, 0)
  const total = totalLibre + totalPI

  return (
    <section className="seccion seccion--alt" id="resultados">
      <div className="contenedor">
        <span className="etiqueta-seccion">La preparación funciona</span>
        <h2 className="seccion__titulo">Resultados: alumnos aprobados</h2>
        <p className="seccion__subtitulo">{nota}</p>

        <div className="resultado-destacado">
          <strong>{total}</strong>
          <span>alumnos aprobados en las últimas convocatorias</span>
          <div className="resultado-destacado__desglose">
            <span>{totalLibre} por acceso libre</span>
            <span aria-hidden="true">·</span>
            <span>{totalPI} por promoción interna</span>
          </div>
        </div>

        <div className="resultados-grid">
          {porConvocatoria.map((c) => {
            const t = c.libre + c.promocionInterna
            return (
              <article className="resultado-card" key={c.año}>
                <div className="resultado-card__año">Convocatoria {c.año}</div>
                <div className="resultado-card__total">
                  {t} <span>aprobado{t === 1 ? '' : 's'}</span>
                </div>
                <ul className="resultado-card__detalle">
                  <li>
                    <strong>{c.libre}</strong> acceso libre
                  </li>
                  {c.promocionInterna > 0 && (
                    <li>
                      <strong>{c.promocionInterna}</strong> promoción interna
                    </li>
                  )}
                </ul>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
