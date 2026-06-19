import { useMemo, useState } from 'react'
import {
  NORMATIVA,
  DOCS_INSST,
  ARTICULOS_396,
  VALOR_LIMITE,
  CONSERVACION_AÑOS,
  ESTADOS_VERIFICACION,
  CONTENIDO_PLAN,
  COMPROBACIONES,
  PROPUESTAS,
} from '../data/amianto.js'

const DATOS_DEFECTO = {
  organo: 'INSPECCIÓN PROVINCIAL DE TRABAJO Y SEGURIDAD SOCIAL',
  expediente: '',
  empresa: '',
  cif: '',
  rera: '',
  emplazamiento: '',
  material: 'noFriable',
  fechaEntrada: '',
  fechaInforme: new Date().toLocaleDateString('es-ES'),
  actuante: '',
  propuesta: 'favorable',
  plazoSubsanacion: '',
  observaciones: '',
}

function claseEstado(color) {
  return `chip chip--${color}`
}

function colorDeEstado(id) {
  return ESTADOS_VERIFICACION.find((e) => e.id === id)?.color || 'gris'
}

export default function InformesAmianto() {
  const [datos, setDatos] = useState(DATOS_DEFECTO)
  const [items, setItems] = useState(() => {
    const base = {}
    for (const c of [...CONTENIDO_PLAN, ...COMPROBACIONES]) {
      base[c.id] = { estado: 'pendiente', obs: '' }
    }
    return base
  })

  const propuestaActual = PROPUESTAS.find((p) => p.id === datos.propuesta) || PROPUESTAS[0]

  const resumen = useMemo(() => {
    const valores = Object.values(items)
    return {
      correcto: valores.filter((v) => v.estado === 'correcto').length,
      subsanar: valores.filter((v) => v.estado === 'subsanar').length,
      noconsta: valores.filter((v) => v.estado === 'noconsta').length,
      pendiente: valores.filter((v) => v.estado === 'pendiente').length,
    }
  }, [items])

  function actualizar(campo, valor) {
    setDatos((d) => ({ ...d, [campo]: valor }))
  }

  function setEstado(id, estado) {
    setItems((prev) => ({ ...prev, [id]: { ...prev[id], estado } }))
  }
  function setObs(id, obs) {
    setItems((prev) => ({ ...prev, [id]: { ...prev[id], obs } }))
  }

  function imprimir() {
    window.print()
  }

  function renderFilas(lista) {
    return lista.map((c) => (
      <div className="amianto__item" key={c.id}>
        <div className="amianto__item-cab">
          <div>
            <strong>{c.titulo}</strong>
            <span className="calc__base"> · {c.base}</span>
          </div>
          <select
            className={claseEstado(colorDeEstado(items[c.id].estado))}
            value={items[c.id].estado}
            onChange={(e) => setEstado(c.id, e.target.value)}
          >
            {ESTADOS_VERIFICACION.map((e) => (
              <option key={e.id} value={e.id}>
                {e.etiqueta}
              </option>
            ))}
          </select>
        </div>
        <p className="campo__ayuda">{c.ayuda}</p>
        <input
          type="text"
          value={items[c.id].obs}
          onChange={(e) => setObs(c.id, e.target.value)}
          placeholder="Observación (opcional)"
        />
      </div>
    ))
  }

  const itemsConContenido = [...CONTENIDO_PLAN, ...COMPROBACIONES].filter(
    (c) => items[c.id].estado !== 'pendiente' || items[c.id].obs.trim(),
  )

  return (
    <div className="analizador amianto">
      <header className="analizador__hero no-impresion">
        <div className="contenedor">
          <a className="analizador__volver" href="#/herramientas">
            ← Volver a herramientas
          </a>
          <h1>Informe de la Inspección sobre el plan de trabajo con amianto</h1>
          <p className="analizador__lema">
            Apoyo para elaborar el <strong>informe de valoración del plan de trabajo</strong> con riesgo
            de exposición al amianto presentado ante la autoridad laboral (arts. 11 y 12 RD 396/2006).
            Verifica su contenido mínimo y genera una propuesta lista para imprimir.
          </p>
          <p className="analizador__aviso-legal">
            ⚖️ Herramienta meramente <strong>orientativa e informativa</strong>. No constituye resolución
            administrativa ni sustituye el criterio del/de la actuante. Fuentes{' '}
            <strong>exclusivamente oficiales</strong> (BOE e INSST).
          </p>
        </div>
      </header>

      <div className="contenedor analizador__grid">
        {/* Formulario */}
        <section className="analizador__panel no-impresion">
          <h2>1. Datos del expediente</h2>
          <div className="campo">
            <label>Órgano / encabezado</label>
            <input type="text" value={datos.organo} onChange={(e) => actualizar('organo', e.target.value)} />
          </div>
          <div className="campo-fila">
            <div className="campo">
              <label>Nº de plan de trabajo / expediente</label>
              <input type="text" value={datos.expediente} onChange={(e) => actualizar('expediente', e.target.value)} />
            </div>
            <div className="campo">
              <label>Fecha de entrada del plan</label>
              <input type="text" value={datos.fechaEntrada} onChange={(e) => actualizar('fechaEntrada', e.target.value)} placeholder="dd/mm/aaaa" />
            </div>
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
              <input type="text" value={datos.rera} onChange={(e) => actualizar('rera', e.target.value)} />
            </div>
            <div className="campo">
              <label>Tipo de material</label>
              <select className="chip" value={datos.material} onChange={(e) => actualizar('material', e.target.value)}>
                <option value="noFriable">No friable (p. ej. amianto-cemento)</option>
                <option value="friable">Friable (proyectado, calorifugado, paneles…)</option>
                <option value="mixto">Mixto</option>
              </select>
            </div>
          </div>
          <div className="campo">
            <label>Emplazamiento de los trabajos</label>
            <input type="text" value={datos.emplazamiento} onChange={(e) => actualizar('emplazamiento', e.target.value)} />
          </div>
          <div className="campo-fila">
            <div className="campo">
              <label>Fecha del informe</label>
              <input type="text" value={datos.fechaInforme} onChange={(e) => actualizar('fechaInforme', e.target.value)} />
            </div>
            <div className="campo">
              <label>Inspector/a o técnico/a actuante</label>
              <input type="text" value={datos.actuante} onChange={(e) => actualizar('actuante', e.target.value)} />
            </div>
          </div>

          <h2>2. Contenido del plan (art. 11.2 RD 396/2006)</h2>
          {renderFilas(CONTENIDO_PLAN)}

          <h2>3. Comprobaciones complementarias</h2>
          {renderFilas(COMPROBACIONES)}

          <h2>4. Propuesta</h2>
          <div className="campo">
            <label>Conclusión / propuesta</label>
            <select className="chip" value={datos.propuesta} onChange={(e) => actualizar('propuesta', e.target.value)}>
              {PROPUESTAS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.etiqueta}
                </option>
              ))}
            </select>
          </div>
          {datos.propuesta === 'subsanacion' && (
            <div className="campo">
              <label>Plazo de subsanación</label>
              <input type="text" value={datos.plazoSubsanacion} onChange={(e) => actualizar('plazoSubsanacion', e.target.value)} placeholder="p. ej. 10 días hábiles" />
            </div>
          )}
          <div className="campo">
            <label>Observaciones / fundamentación</label>
            <textarea rows={4} value={datos.observaciones} onChange={(e) => actualizar('observaciones', e.target.value)} placeholder="Motivación de la propuesta, deficiencias detectadas, requerimientos…" />
          </div>

          <div className="analizador__acciones">
            <button className="btn btn--primario" onClick={imprimir}>
              🖨️ Imprimir / guardar PDF
            </button>
          </div>

          <p className="analizador__resumen">
            <span className="chip chip--verde">{resumen.correcto} correctos</span>{' '}
            <span className="chip chip--ambar">{resumen.subsanar} a subsanar</span>{' '}
            <span className="chip chip--rojo">{resumen.noconsta} no constan</span>{' '}
            <span className="chip chip--gris">{resumen.pendiente} pendientes</span>
          </p>
        </section>

        {/* Vista previa del informe */}
        <section className="analizador__informe amianto__informe">
          <article className="documento">
            <p className="documento__organo">{datos.organo}</p>
            <h2 className="documento__titulo">
              Informe sobre el plan de trabajo con riesgo de exposición al amianto
            </h2>
            <p className="amianto__subtitulo">Arts. 11 y 12 del RD 396/2006, de 31 de marzo</p>

            <table className="calc__tabla">
              <tbody>
                {datos.expediente && (
                  <tr><th>Plan de trabajo / expediente</th><td>{datos.expediente}</td></tr>
                )}
                {datos.empresa && (
                  <tr><th>Empresa</th><td>{datos.empresa}{datos.cif ? ` (${datos.cif})` : ''}</td></tr>
                )}
                {datos.rera && <tr><th>Inscripción RERA</th><td>{datos.rera}</td></tr>}
                {datos.emplazamiento && <tr><th>Emplazamiento</th><td>{datos.emplazamiento}</td></tr>}
                <tr>
                  <th>Tipo de material</th>
                  <td>
                    {datos.material === 'friable'
                      ? 'Friable'
                      : datos.material === 'mixto'
                        ? 'Mixto'
                        : 'No friable'}
                  </td>
                </tr>
                {datos.fechaEntrada && <tr><th>Fecha de entrada</th><td>{datos.fechaEntrada}</td></tr>}
                <tr><th>Fecha del informe</th><td>{datos.fechaInforme}</td></tr>
                {datos.actuante && <tr><th>Actuante</th><td>{datos.actuante}</td></tr>}
              </tbody>
            </table>

            <h3>Resultado de la verificación</h3>
            {itemsConContenido.length === 0 ? (
              <p className="amianto__vacio no-impresion">
                Marca el estado de cada punto del cuadro para que aparezca aquí el resultado.
              </p>
            ) : (
              <table className="calc__tabla calc__tabla--tramos">
                <thead>
                  <tr>
                    <th>Punto verificado</th>
                    <th>Base</th>
                    <th>Estado</th>
                    <th>Observación</th>
                  </tr>
                </thead>
                <tbody>
                  {itemsConContenido.map((c) => {
                    const it = items[c.id]
                    const est = ESTADOS_VERIFICACION.find((e) => e.id === it.estado)
                    return (
                      <tr key={c.id}>
                        <td>{c.titulo}</td>
                        <td className="calc__base">{c.base}</td>
                        <td>
                          <span className={claseEstado(est?.color || 'gris')}>{est?.etiqueta}</span>
                        </td>
                        <td>{it.obs}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}

            <h3>Propuesta</h3>
            <p>
              <span className={claseEstado(propuestaActual.color)}>{propuestaActual.etiqueta}</span>
              {datos.propuesta === 'subsanacion' && datos.plazoSubsanacion && (
                <> · Plazo de subsanación: {datos.plazoSubsanacion}.</>
              )}
            </p>
            {datos.observaciones.trim() && (
              <p style={{ whiteSpace: 'pre-wrap' }}>{datos.observaciones}</p>
            )}

            <p className="documento__cierre">
              Valor límite de exposición: {VALOR_LIMITE.valor} {VALOR_LIMITE.unidad} ({VALOR_LIMITE.referencia},{' '}
              {VALOR_LIMITE.articulo}). Conservación de la documentación: mínimo {CONSERVACION_AÑOS} años
              (art. 18 RD 396/2006). Documento orientativo basado en fuentes oficiales (BOE e INSST); no
              constituye resolución administrativa.
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
              <a href={n.url} target="_blank" rel="noopener noreferrer">{n.titulo}</a>{' '}
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
              <a href={d.url} target="_blank" rel="noopener noreferrer">{d.titulo}</a>
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
