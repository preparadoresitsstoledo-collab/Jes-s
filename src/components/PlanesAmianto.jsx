import { useMemo, useState } from 'react'
import { CHECKLIST_AMIANTO, TODOS_AMIANTO, ESTADOS_AMIANTO } from '../data/amianto.js'
import { analizarPlanAmianto } from '../lib/analizadorAmianto.js'

export default function PlanesAmianto() {
  const [nombre, setNombre] = useState('')
  const [fecha, setFecha] = useState(new Date().toLocaleDateString('es-ES'))
  const [tecnico, setTecnico] = useState('')
  const [texto, setTexto] = useState('')
  const [estados, setEstados] = useState({})
  const [notas, setNotas] = useState({})
  const [avisos, setAvisos] = useState([])
  const [cargando, setCargando] = useState(false)
  const [archivoNombre, setArchivoNombre] = useState('')

  function ejecutar(textoArg) {
    const fuente = typeof textoArg === 'string' ? textoArg : texto
    const { sugerencias, avisos: nuevos } = analizarPlanAmianto(fuente)
    setEstados((prev) => {
      const next = { ...prev }
      for (const [id, s] of Object.entries(sugerencias)) next[id] = s.estado
      return next
    })
    setNotas((prev) => {
      const next = { ...prev }
      for (const [id, s] of Object.entries(sugerencias)) if (!next[id]) next[id] = s.nota
      return next
    })
    setAvisos(nuevos)
  }

  async function onArchivo(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setCargando(true)
    setArchivoNombre(file.name)
    try {
      const { extraerTextoArchivo } = await import('../lib/extraerTexto.js')
      const { texto: extraido, aviso } = await extraerTextoArchivo(file)
      setTexto(extraido)
      if (!nombre) setNombre(file.name.replace(/\.[^.]+$/, ''))
      ejecutar(extraido)
      if (aviso) setAvisos((prev) => [{ tipo: 'info', texto: aviso }, ...prev])
    } catch (err) {
      setAvisos([{ tipo: 'alerta', texto: `No se pudo leer el archivo (${err.message || 'error'}).` }])
    } finally {
      setCargando(false)
    }
  }

  const resumen = useMemo(() => {
    const r = { conforme: 0, no_consta: 0, revisar: 0 }
    TODOS_AMIANTO.forEach((it) => {
      const e = estados[it.id]
      if (e && r[e] !== undefined) r[e] += 1
    })
    return r
  }, [estados])

  const deficiencias = TODOS_AMIANTO.filter((it) => estados[it.id] === 'no_consta')

  return (
    <div className="analizador">
      <header className="analizador__hero no-impresion">
        <div className="contenedor">
          <a className="analizador__volver" href="#inicio">← Volver a la web</a>
          <h1>Control de planes de trabajo con amianto</h1>
          <p className="analizador__lema">
            Verifica el contenido del plan de trabajo con amianto frente a las exigencias del
            <strong> RD 396/2006</strong>. Sube el plan o pega su texto, revisa el cuadro y genera el informe.
          </p>
          <p className="analizador__aviso-legal">
            ⚖️ Lista de verificación orientativa. No sustituye el criterio técnico ni la resolución de la
            autoridad laboral. La detección se basa en coincidencias de texto.
          </p>
        </div>
      </header>

      <div className="contenedor analizador__grid">
        <section className="analizador__panel no-impresion">
          <h2>1. Datos</h2>
          <div className="campo">
            <label>Identificación del plan / empresa</label>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Plan de trabajo de…" />
          </div>
          <div className="campo-fila">
            <div className="campo">
              <label>Fecha</label>
              <input type="text" value={fecha} onChange={(e) => setFecha(e.target.value)} />
            </div>
            <div className="campo">
              <label>Técnico/a firmante</label>
              <input type="text" value={tecnico} onChange={(e) => setTecnico(e.target.value)} placeholder="Nombre" />
            </div>
          </div>

          <h2>2. Plan de trabajo</h2>
          <p className="campo__ayuda">
            Sube el archivo (PDF/Word/TXT) o pega el texto. 🔒 Los archivos se procesan en tu navegador.
          </p>
          <div className="analizador__subir">
            <label className="btn btn--secundario">
              {cargando ? 'Leyendo archivo…' : '📄 Subir plan (PDF/Word/TXT)'}
              <input type="file" accept=".pdf,.docx,.doc,.txt" onChange={onArchivo} hidden disabled={cargando} />
            </label>
            {archivoNombre && <span className="analizador__archivo">{archivoNombre}</span>}
          </div>
          <textarea
            className="analizador__texto"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Pega aquí el contenido del plan de trabajo con amianto…"
            rows={10}
          />
          <div className="analizador__acciones">
            <button className="btn btn--primario" onClick={() => ejecutar()}>Analizar plan</button>
          </div>

          {avisos.length > 0 && (
            <ul className="analizador__avisos">
              {avisos.map((a, i) => (
                <li key={i} className={`aviso aviso--${a.tipo}`}>{a.texto}</li>
              ))}
            </ul>
          )}

          <h2>3. Cuadro de verificación</h2>
          {CHECKLIST_AMIANTO.map((sec) => (
            <fieldset key={sec.num} className="cuadro__seccion">
              <legend>{sec.num}. {sec.titulo}</legend>
              {sec.items.map((it) => {
                const estado = estados[it.id] || 'pendiente'
                return (
                  <div key={it.id} className="cuadro__item">
                    <div className="cuadro__item-cab">
                      <span className="cuadro__etiqueta">{it.etiqueta}</span>
                      <span className="cuadro__fund">{it.fundamento}</span>
                    </div>
                    <div className="cuadro__controles">
                      <select
                        className={`chip chip--${ESTADOS_AMIANTO[estado].color}`}
                        value={estado}
                        onChange={(e) => setEstados((p) => ({ ...p, [it.id]: e.target.value }))}
                      >
                        {Object.entries(ESTADOS_AMIANTO).map(([k, v]) => (
                          <option key={k} value={k}>{v.etiqueta}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        className="cuadro__nota"
                        placeholder="Observación…"
                        value={notas[it.id] || ''}
                        onChange={(e) => setNotas((p) => ({ ...p, [it.id]: e.target.value }))}
                      />
                    </div>
                  </div>
                )
              })}
            </fieldset>
          ))}
        </section>

        <section className="analizador__informe" id="informe-generado">
          <div className="analizador__informe-acciones no-impresion">
            <h2>Informe</h2>
            <button className="btn btn--primario" onClick={() => window.print()}>Imprimir / PDF</button>
          </div>

          <article className="documento">
            <p className="documento__org">INFORME DE CONTROL DEL PLAN DE TRABAJO CON AMIANTO</p>
            <p className="documento__meta">
              <strong>Plan:</strong> {nombre || '[identificación del plan]'}
              <br />
              <strong>Fecha:</strong> {fecha}
            </p>
            <p>
              Examinado el plan de trabajo conforme al Real Decreto 396/2006, de 31 de marzo, se efectúan
              las siguientes observaciones sobre su contenido:
            </p>

            <p className="analizador__resumen">
              <span className="chip chip--verde">{resumen.conforme} consta</span>{' '}
              <span className="chip chip--rojo">{resumen.no_consta} no consta</span>{' '}
              <span className="chip chip--ambar">{resumen.revisar} revisar</span>
            </p>

            <h4>Apartados a subsanar</h4>
            {deficiencias.length === 0 ? (
              <p className="documento__vacio">No se han marcado deficiencias.</p>
            ) : (
              <ol className="documento__obs">
                {deficiencias.map((it) => (
                  <li key={it.id}>
                    <strong>[{it.fundamento}]</strong> {it.etiqueta}.
                    {notas[it.id] ? ' ' + notas[it.id] : ''}
                  </li>
                ))}
              </ol>
            )}

            <h4>Detalle de la verificación</h4>
            <table className="documento__tabla">
              <thead>
                <tr><th>Apartado</th><th>Fundamento</th><th>Valoración</th></tr>
              </thead>
              <tbody>
                {TODOS_AMIANTO.filter((it) => estados[it.id] && estados[it.id] !== 'pendiente').map((it) => (
                  <tr key={it.id}>
                    <td>{it.etiqueta}</td>
                    <td>{it.fundamento}</td>
                    <td>
                      <span className={`chip chip--${ESTADOS_AMIANTO[estados[it.id]].color}`}>
                        {ESTADOS_AMIANTO[estados[it.id]].etiqueta}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="documento__firma">Fdo. {tecnico || '[Técnico/a · Inspección de Trabajo y Seguridad Social]'}</p>
          </article>
        </section>
      </div>
    </div>
  )
}
