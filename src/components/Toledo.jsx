import toledoCiudad from '../assets/toledo-ciudad.jpg'
import trabajoSepe from '../assets/trabajo-sepe.jpg'

export default function Toledo() {
  return (
    <section className="seccion seccion--alt" id="toledo">
      <div className="contenedor">
        <span className="etiqueta-seccion">El lugar</span>
        <h2 className="seccion__titulo">Toledo, ciudad imperial</h2>
        <p className="seccion__subtitulo">
          La preparación es presencial en Toledo, una de las ciudades con más historia y patrimonio
          de España.
        </p>

        <div className="toledo">
          <figure className="toledo__foto">
            <img
              src={toledoCiudad}
              alt="Vista de Toledo con el Alcázar sobre el río Tajo al atardecer"
              loading="lazy"
            />
          </figure>

          <div className="toledo__texto">
            <p>
              Toledo, la <strong>Ciudad Imperial</strong>, es Patrimonio de la Humanidad por la
              UNESCO y un símbolo de la convivencia de las tres culturas —cristiana, judía y
              musulmana—. Capital de Castilla-La Mancha, su casco histórico, coronado por el Alcázar
              sobre el río Tajo, es uno de los conjuntos monumentales más impresionantes del país.
            </p>
            <p>
              Es también una ciudad con una profunda tradición jurídica y administrativa: un marco
              inmejorable para preparar, de forma presencial y cercana, la oposición al Cuerpo
              Superior de Inspección de Trabajo y Seguridad Social.
            </p>

            <div className="toledo__lugar">
              <img
                className="toledo__lugar-foto"
                src={trabajoSepe}
                alt="Jesús Prieto frente a una oficina del Ministerio de Trabajo y Economía Social"
                loading="lazy"
              />
              <h3>🏛️ Donde trabajo cada día</h3>
              <p>
                Ejerzo como Inspector de Trabajo y Seguridad Social en la{' '}
                <strong>Inspección Provincial de Toledo</strong>, donde soy jefe de la Unidad de
                Seguridad Social. Esa experiencia diaria —el contacto real con las empresas, los
                trabajadores y la aplicación de la normativa— es la que vuelco en la preparación,
                para que estudies la oposición desde la práctica de la profesión.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
