import { precio } from '../data/sitio.js'

export default function Precios() {
  return (
    <section className="seccion seccion--alt" id="precio">
      <div className="contenedor">
        <span className="etiqueta-seccion">Coste de la preparación</span>
        <h2 className="seccion__titulo">Precio</h2>
        <p className="seccion__subtitulo">Despliega para ver la cuota y lo que incluye.</p>

        <details className="precio-desplegable">
          <summary>Ver el precio</summary>

          <div className="precio-card">
            <div className="precio-card__cabecera">
              <div className="precio-card__importe-texto">{precio.importe}</div>
              <p className="precio-card__desc">{precio.descripcion}</p>
            </div>

            <ul className="precio-card__incluye">
              {precio.incluye.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>

            {precio.nota && <p className="precio-card__nota">{precio.nota}</p>}

            <a className="btn btn--primario" href="#contacto">
              Solicita información
            </a>
          </div>
        </details>
      </div>
    </section>
  )
}
