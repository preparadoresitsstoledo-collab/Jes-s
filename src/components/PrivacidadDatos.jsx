import { useEffect } from 'react'

// Aviso de privacidad común a las herramientas que procesan datos personales
// (tacógrafos, nóminas…) y utilidades para borrarlos.

export function AvisoPrivacidad({ onBorrar, hayDatos }) {
  return (
    <section className="analizador__panel privacidad" aria-labelledby="privacidad-titulo">
      <h2 id="privacidad-titulo">🔒 Tus datos son solo tuyos</h2>
      <ul className="privacidad__lista">
        <li>
          Los archivos y datos que cargues (tarjetas de tacógrafo, nóminas, nombres, DNI…) se procesan{' '}
          <strong>únicamente en este navegador, en tu equipo</strong>. No se envían a ningún servidor ni se
          guardan en esta web. <strong>Nadie —ni el titular de esta web ni ningún tercero— recibe ni tiene
          acceso a ellos</strong>: nadie puede verlos, conservarlos ni utilizarlos. Solo tú, en esta pestaña.
        </li>
        <li>
          Los datos solo existen mientras esta pestaña está abierta. Se eliminan al pulsar{' '}
          <strong>«Borrar todo y salir»</strong>, al cerrar la pestaña o al recargar la página.
        </li>
        <li>
          Los archivos que <strong>descargues tú</strong> (Excel, Word, expediente .json) quedan en tu equipo bajo
          tu responsabilidad: guárdalos y bórralos conforme a tu normativa de protección de datos y deber de
          sigilo.
        </li>
        <li>
          Recomendación: usa la herramienta en un equipo de confianza y pulsa «Borrar todo y salir» al terminar,
          sobre todo en ordenadores compartidos.
        </li>
      </ul>
      <div className="analizador__acciones">
        <button type="button" className="btn privacidad__borrar" onClick={onBorrar}>
          🗑️ Borrar todo y salir
        </button>
        <span className="campo__ayuda privacidad__estado">
          {hayDatos ? 'Hay datos cargados en esta pestaña.' : 'No hay datos cargados.'}
        </span>
      </div>
    </section>
  )
}

// Pide confirmación al cerrar o recargar la pestaña si hay datos cargados.
export function useAvisoAlSalir(hayDatos) {
  useEffect(() => {
    if (!hayDatos) return undefined
    const aviso = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', aviso)
    return () => window.removeEventListener('beforeunload', aviso)
  }, [hayDatos])
}

// Aviso sobre la naturaleza y las limitaciones de la herramienta.
export function AvisoResponsabilidad() {
  return (
    <section className="analizador__panel aviso-herramienta" aria-labelledby="aviso-herramienta-titulo">
      <h2 id="aviso-herramienta-titulo">⚖️ Sobre esta herramienta</h2>
      <ul className="privacidad__lista">
        <li>
          Ha sido elaborada por un <strong>Inspector de Trabajo y Seguridad Social</strong>, a título personal, con
          la única intención de <strong>ayudar</strong>.
        </li>
        <li>
          Es <strong>gratuita</strong>: su uso no tiene coste alguno para quien la utilice.
        </li>
        <li>
          <strong>Puede contener errores u omisiones.</strong> Los resultados son orientativos: compruébalos con la
          normativa vigente, el convenio aplicable y la documentación del caso antes de utilizarlos.
        </li>
        <li>
          <strong>Su autor no se hace responsable de los errores</strong> que pueda contener ni de las decisiones o
          consecuencias derivadas de su uso, que corresponden a quien la utiliza.
        </li>
        <li>
          No es una herramienta oficial de la Inspección de Trabajo y Seguridad Social ni sustituye el criterio
          profesional de quien la utiliza.
        </li>
      </ul>
    </section>
  )
}

// Pregunta, borra y vuelve al apartado de herramientas de la web.
export function borrarYSalir(borrar, hayDatos) {
  if (hayDatos && !window.confirm('Se borrarán de esta pestaña todos los datos cargados y los resultados. ¿Continuar?')) {
    return
  }
  borrar()
  window.location.hash = '#herramientas-transporte'
}
