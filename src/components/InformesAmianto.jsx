import { useState } from 'react'
import {
  NORMATIVA,
  DOCS_INSST,
  ARTICULOS_396,
  TIPOS_INFORME,
  SECCIONES_DEFECTO,
  VALOR_LIMITE,
  CONSERVACION_AÑOS,
} from '../data/amianto.js'

const DATOS_DEFECTO = {
  tipoInforme: 'plan',
  titulo: '',
  empresa: '',
  cif: '',
  rera: '',
  centro: '',
  emplazamiento: '',
  promotor: '',
  fecha: new Date().toLocaleDateString('es-ES'),
  tecnico: '',
  numTrabajadores: '',
}

export default function InformesAmianto() {
  const [datos, setDatos] = useState(DATOS_DEFECTO)
  const [secciones, setSecciones] = useState(() =>
    SECCIONES_DEFECTO.map((s) => ({ ...s, contenido: '' })),
  )

  const tipoActual = TIPOS_INFORME.find((t) => t.id === datos.tipoInforme) || TIPOS_INFORME[0]

  function actualizar(campo, valor) {
    setDatos((d) => ({ ...d, [campo]: valor }))
  }

  function actualizarSeccion(id, contenido) {
    setSecciones((prev) => prev.map((s) => (s.id === id ? { ...s, contenido } : s)))
  }

  function imprimir() {
    window.print()
  }

  return (
    <div className="analizador amianto">
      <header className="analizador__hero no-impresion">
        <div className="contenedor">
          <a className="analizador__volver" href="#/herramientas">
            ← Volver a herramientas
          </a>
          <h1>Informes de amianto</h1>
          <p className="analizador__lema">
            Herramienta de apoyo para la elaboración de <strong>informes en materia de amianto</strong>{' '}
            (plan de trabajo, identificación de materiales y evaluación de la exposición) conforme al{' '}
            <strong>RD 396/2006</strong> y a la documentación técnica del <strong>INSST</strong>.
          </p>
          <p className="analizador__aviso-legal">
            ⚖️ Herramienta meramente <strong>orientativa e informativa</strong>. No sustituye el plan de
            trabajo aprobado por la autoridad laboral (arts. 11 y 12 RD 396/2006), la inscripción en el
            RERA (art. 17) ni el criterio del/de la profesional. Las fuentes empleadas son{' '}
            <strong>exclusivamente oficiales</strong> (BOE e INSST).
          </p>
        </div>
      </header>

      <div className="contenedor analizador__grid">
        {/* Formulario */}
        <section className="analizador__panel no-impresion">
          <h2>1. Tipo de informe</h2>
          <div className="campo">
            <label>Tipo de informe</label>
            <select
              className="chip"
              value={datos.tipoInforme}
              onChange={(e) => actualizar('tipoInforme', e.target.value)}
            >
              {TIPOS_INFORME.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre}
                </option>
              ))}
            </select>
            <p className="campo__ayuda">{tipoActual.descripcion}</p>
          </div>

          <h2>2. Datos identificativos</h2>
          <div className="campo">
            <label>Título del informe</label>
            <input
              type="text"
              value={datos.titulo}
              onChange={(e) => actualizar('titulo', e.target.value)}
              placeholder={tipoActual.nombre}
            />
          </div>
          <div className="campo-fila">
            <div className="campo">
              <label>Empresa</label>
              <input type="text" value={datos.empresa} onChange={(e) => actualizar('empresa', e.target.value)} />
            </div>
            <div className="campo">
              <label>CIF / NIF</label>
              <input type="text" value={datos.cif} onChange={(e) => actualizar('cif', e.target.value)} />
            </div>
          </div>
          <div className="campo-fila">
            <div className="campo">
              <label>Nº de inscripción RERA</label>
              <input
                type="text"
                value={datos.rera}
                onChange={(e) => actualizar('rera', e.target.value)}
                placeholder="Registro de Empresas con Riesgo de Amianto"
              />
            </div>
            <div className="campo">
              <label>Nº de trabajadores expuestos</label>
              <input
                type="text"
                inputMode="numeric"
                value={datos.numTrabajadores}
                onChange={(e) => actualizar('numTrabajadores', e.target.value)}
              />
            </div>
          </div>
          <div className="campo">
            <label>Centro de trabajo</label>
            <input type="text" value={datos.centro} onChange={(e) => actualizar('centro', e.target.value)} />
          </div>
          <div className="campo">
            <label>Emplazamiento / dirección de la actuación</label>
            <input
              type="text"
              value={datos.emplazamiento}
              onChange={(e) => actualizar('emplazamiento', e.target.value)}
            />
          </div>
          <div className="campo">
            <label>Promotor / titular</label>
            <input type="text" value={datos.promotor} onChange={(e) => actualizar('promotor', e.target.value)} />
          </div>
          <div className="campo-fila">
            <div className="campo">
              <label>Fecha</label>
              <input type="text" value={datos.fecha} onChange={(e) => actualizar('fecha', e.target.value)} />
            </div>
            <div className="campo">
              <label>Técnico / redactor</label>
              <input type="text" value={datos.tecnico} onChange={(e) => actualizar('tecnico', e.target.value)} />
            </div>
          </div>

          <h2>3. Contenido del informe</h2>
          <p className="campo__ayuda">
            Secciones alineadas con el contenido mínimo del plan de trabajo (art. 11 RD 396/2006). Se
            ajustarán al modelo oficial que se incorpore.
          </p>
          {secciones.map((s) => (
            <div className="campo" key={s.id}>
              <label>{s.titulo}</label>
              <textarea
                rows={4}
                value={s.contenido}
                onChange={(e) => actualizarSeccion(s.id, e.target.value)}
                placeholder={s.ayuda}
              />
            </div>
          ))}

          <div className="analizador__acciones">
            <button className="btn btn--primario" onClick={imprimir}>
              🖨️ Imprimir / guardar PDF
            </button>
          </div>
        </section>

        {/* Vista previa del informe */}
        <section className="analizador__informe amianto__informe">
          <article className="documento">
            <h2 className="documento__titulo">
              {datos.titulo || tipoActual.nombre}
            </h2>
            <p className="amianto__subtitulo">{tipoActual.nombre}</p>

            <table className="calc__tabla">
              <tbody>
                {datos.empresa && (
                  <tr>
                    <th>Empresa</th>
                    <td>
                      {datos.empresa}
                      {datos.cif ? ` (${datos.cif})` : ''}
                    </td>
                  </tr>
                )}
                {datos.rera && (
                  <tr>
                    <th>Inscripción RERA</th>
                    <td>{datos.rera}</td>
                  </tr>
                )}
                {datos.centro && (
                  <tr>
                    <th>Centro de trabajo</th>
                    <td>{datos.centro}</td>
                  </tr>
                )}
                {datos.emplazamiento && (
                  <tr>
                    <th>Emplazamiento</th>
                    <td>{datos.emplazamiento}</td>
                  </tr>
                )}
                {datos.promotor && (
                  <tr>
                    <th>Promotor / titular</th>
                    <td>{datos.promotor}</td>
                  </tr>
                )}
                {datos.numTrabajadores && (
                  <tr>
                    <th>Trabajadores expuestos</th>
                    <td>{datos.numTrabajadores}</td>
                  </tr>
                )}
                <tr>
                  <th>Fecha</th>
                  <td>{datos.fecha}</td>
                </tr>
                {datos.tecnico && (
                  <tr>
                    <th>Técnico / redactor</th>
                    <td>{datos.tecnico}</td>
                  </tr>
                )}
              </tbody>
            </table>

            {secciones
              .filter((s) => s.contenido.trim())
              .map((s) => (
                <div className="documento__bloque" key={s.id}>
                  <h3>{s.titulo}</h3>
                  <p style={{ whiteSpace: 'pre-wrap' }}>{s.contenido}</p>
                </div>
              ))}

            {secciones.every((s) => !s.contenido.trim()) && (
              <p className="amianto__vacio no-impresion">
                Completa las secciones del formulario para ver aquí el informe.
              </p>
            )}

            <p className="documento__cierre">
              Valor límite de exposición: {VALOR_LIMITE.valor} {VALOR_LIMITE.unidad} ({VALOR_LIMITE.referencia},{' '}
              {VALOR_LIMITE.articulo}). Conservación de la documentación: mínimo {CONSERVACION_AÑOS} años
              (art. 18 RD 396/2006). Documento orientativo basado en fuentes oficiales (BOE e INSST); no
              sustituye el plan de trabajo aprobado por la autoridad laboral.
            </p>
          </article>
        </section>
      </div>

      {/* Marco normativo oficial */}
      <div className="contenedor amianto__normativa no-impresion">
        <h2>Marco normativo y documentación oficial</h2>
        <p className="campo__ayuda">
          Fuentes <strong>exclusivamente oficiales</strong>: Boletín Oficial del Estado (BOE) e Instituto
          Nacional de Seguridad y Salud en el Trabajo (INSST).
        </p>

        <h3>Normativa (BOE)</h3>
        <ul className="amianto__lista">
          {NORMATIVA.map((n) => (
            <li key={n.ref}>
              <a href={n.url} target="_blank" rel="noopener noreferrer">
                {n.titulo}
              </a>{' '}
              <span className="calc__base">({n.ref})</span>
              <br />
              {n.resumen}
            </li>
          ))}
        </ul>

        <h3>Documentación técnica (INSST)</h3>
        <ul className="amianto__lista">
          {DOCS_INSST.map((d) => (
            <li key={d.titulo}>
              <a href={d.url} target="_blank" rel="noopener noreferrer">
                {d.titulo}
              </a>
              <br />
              {d.nota}
            </li>
          ))}
        </ul>

        <h3>Artículos clave del RD 396/2006</h3>
        <ul className="amianto__articulos">
          {ARTICULOS_396.map((a) => (
            <li key={a.id}>
              <strong>{a.titulo}.</strong> {a.texto}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
