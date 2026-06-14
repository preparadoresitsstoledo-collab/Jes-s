export default function Testimonios() {
  return (
    <section className="seccion" id="testimonios">
      <div className="contenedor">
        <span className="etiqueta-seccion">Referencias</span>
        <h2 className="seccion__titulo">Discreción y resultados</h2>
        <p className="seccion__subtitulo">
          La mejor referencia es el trabajo de quienes han conseguido su plaza.
        </p>

        <div className="referencias-honesto">
          <p>
            Por <strong>respeto a la intimidad</strong> de mis alumnos y alumnas, no publico sus
            nombres ni sus datos personales. Prefiero que hablen los <strong>resultados</strong>:
            varios aprobados en las últimas convocatorias, preparados de forma presencial y en grupo
            reducido.
          </p>
          <p>
            Si necesitas referencias antes de decidirte, escríbeme: con su permiso, puedo ponerte en
            contacto con personas que se han preparado conmigo.
          </p>
          <div className="referencias-honesto__acciones">
            <a className="btn btn--oscuro" href="#resultados">
              Ver resultados
            </a>
            <a className="btn btn--primario" href="#contacto">
              Pedir referencias
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
