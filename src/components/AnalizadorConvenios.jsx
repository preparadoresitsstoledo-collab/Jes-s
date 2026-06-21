import { useMemo, useState } from 'react'
import {
  CUADRO_VERIFICACION,
  TODOS_LOS_ITEMS,
  ESTADOS,
  CABECERA_DEFECTO,
  parrafoApertura,
  RESULTADO_INTRO,
  CIERRE,
} from '../data/plantillaInforme.js'
import { ARTICULOS, SMI } from '../data/normativa.js'
import { analizarConvenio } from '../lib/analizadorConvenios.js'
// El extractor (pdf.js + mammoth) se carga de forma diferida solo al subir un archivo.

const EJEMPLO = `CONVENIO COLECTIVO DE EJEMPLO

Artículo 1. Ámbito. El presente convenio regula las condiciones de la empresa.

Artículo 5. Clasificación profesional. El personal se clasifica en las siguientes
categorías profesionales: categoría 1, categoría 2 y categoría 3. Cada categoría
profesional tendrá las funciones que se detallan. La categoría superior...

Artículo 20. Salario. El salario base del grupo inicial será de 950 € mensuales.

Artículo 30. Jubilación. Será obligatoria la jubilación forzosa del trabajador al
cumplir la edad ordinaria de jubilación.

Artículo 35. Vacaciones. Las vacaciones que coincidan con una incapacidad temporal
por maternidad se limitarán y deberán disfrutarse hasta el 31 de enero del año siguiente.

Artículo 40. Contratación. La empresa podrá celebrar contratos para obra o servicio
determinado conforme a la legislación.`

function colorClase(color) {
  return `chip chip--${color}`
}

export default function AnalizadorConvenios() {
  const [cabecera, setCabecera] = useState(CABECERA_DEFECTO)
  const [nombreConvenio, setNombreConvenio] = useState('')
  const [fecha, setFecha] = useState(new Date().toLocaleDateString('es-ES'))
  const [texto, setTexto] = useState('')
  const [smiMensual, setSmiMensual] = useState(SMI.mensual)
  const [estados, setEstados] = useState({})
  const [notas, setNotas] = useState({})
  const [avisos, setAvisos] = useState([])
  const [analizado, setAnalizado] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [archivoNombre, setArchivoNombre] = useState('')
  const [pdfParaOcr, setPdfParaOcr] = useState(null)
  const [ocrProgreso, setOcrProgreso] = useState('')

  function actualizarCabecera(campo, valor) {
    setCabecera((c) => ({ ...c, [campo]: valor }))
  }

  async function onArchivo(e) {
    const file = e.target.files?.[0]
    e.target.value = '' // permite volver a subir el mismo archivo
    if (!file) return
    setCargando(true)
    setArchivoNombre(file.name)
    setPdfParaOcr(null)
    const esPdf = /\.pdf$/i.test(file.name) || file.type === 'application/pdf'
    try {
      const { extraerTextoArchivo } = await import('../lib/extraerTexto.js')
      const { texto: extraido, aviso } = await extraerTextoArchivo(file)
      setTexto(extraido)
      if (!nombreConvenio) {
        setNombreConvenio(file.name.replace(/\.[^.]+$/, ''))
      }
      ejecutarAnalisis(extraido)
      if (aviso) setAvisos((prev) => [{ tipo: 'info', texto: aviso }, ...prev])
      // PDF con poco texto → probablemente escaneado: ofrecer OCR.
      if (esPdf && extraido.trim().length < 200) {
        setPdfParaOcr(file)
      }
    } catch (err) {
      setAvisos([
        {
          tipo: 'alerta',
          texto: `No se ha podido leer el archivo (${err.message || 'error desconocido'}). Prueba a pegar el texto.`,
        },
      ])
    } finally {
      setCargando(false)
    }
  }

  async function ejecutarOcr() {
    if (!pdfParaOcr) return
    setOcrProgreso('Preparando OCR…')
    try {
      const { ocrPdf } = await import('../lib/ocr.js')
      const buffer = await pdfParaOcr.arrayBuffer()
      const texto = await ocrPdf(buffer, ({ pagina, total }) =>
        setOcrProgreso(`Reconociendo texto… página ${pagina} de ${total}`),
      )
      setTexto(texto)
      ejecutarAnalisis(texto)
      setOcrProgreso('')
      setPdfParaOcr(null)
    } catch (err) {
      setOcrProgreso('')
      setAvisos((prev) => [
        { tipo: 'alerta', texto: `El OCR no se ha podido completar (${err.message || 'error'}). Requiere conexión a internet.` },
        ...prev,
      ])
    }
  }

  function ejecutarAnalisis(textoArg) {
    const fuente = typeof textoArg === 'string' ? textoArg : texto
    const { sugerencias, avisos: nuevosAvisos } = analizarConvenio(fuente, { smiMensual })
    setEstados((prev) => {
      const next = { ...prev }
      for (const [id, sug] of Object.entries(sugerencias)) {
        if (!next[id] || next[id] === 'pendiente') next[id] = sug.estado
      }
      return next
    })
    setNotas((prev) => {
      const next = { ...prev }
      for (const [id, sug] of Object.entries(sugerencias)) {
        if (!next[id]) next[id] = sug.nota
      }
      return next
    })
    setAvisos(nuevosAvisos)
    setAnalizado(true)
  }

  function limpiar() {
    setEstados({})
    setNotas({})
    setAvisos([])
    setAnalizado(false)
    setTexto('')
    setNombreConvenio('')
    setArchivoNombre('')
    setPdfParaOcr(null)
    setOcrProgreso('')
  }

  function cargarEjemplo() {
    setTexto(EJEMPLO)
    setNombreConvenio('Convenio colectivo de ejemplo')
  }

  // Construye la estructura del informe a partir de las valoraciones.
  const informe = useMemo(() => {
    const revisados = TODOS_LOS_ITEMS.filter((it) => estados[it.id] && estados[it.id] !== 'pendiente')
    const filasCuadro = revisados.map((it) => ({
      etiqueta: it.etiqueta,
      fundamento: it.fundamento,
      estado: estados[it.id],
      nota: notas[it.id] || '',
    }))
    const hayVulneraciones = revisados.some((it) => estados[it.id] === 'vulneracion')
    const observaciones = revisados
      .filter((it) => estados[it.id] === 'vulneracion' || estados[it.id] === 'no_regula')
      .map((it) => ({
        fundamento: it.fundamento,
        nota: notas[it.id] || it.etiqueta,
        articulo: it.articulo ? ARTICULOS[it.articulo] : null,
      }))
    return { filasCuadro, hayVulneraciones, observaciones }
  }, [estados, notas])

  function textoInforme() {
    const L = []
    if (cabecera.encabezado) {
      L.push(cabecera.encabezado)
      L.push('')
    }
    L.push(cabecera.asunto.toUpperCase())
    L.push(`Fecha: ${fecha}`)
    L.push('')
    L.push((nombreConvenio || '[NOMBRE DEL CONVENIO]').toUpperCase())
    L.push('')
    L.push(parrafoApertura(nombreConvenio))
    L.push('')
    L.push('CUADRO DE REVISIÓN')
    if (informe.filasCuadro.length === 0) {
      L.push('(Sin puntos valorados todavía.)')
    } else {
      informe.filasCuadro.forEach((f) => {
        const marca = ESTADOS[f.estado].etiqueta
        L.push(`- [${marca}] ${f.etiqueta} (${f.fundamento})${f.nota ? ' — ' + f.nota : ''}`)
      })
    }
    L.push('')
    L.push('RESULTADO DE LA REVISIÓN')
    L.push(informe.hayVulneraciones ? RESULTADO_INTRO.conVulneraciones : RESULTADO_INTRO.sinVulneraciones)
    L.push('')
    informe.observaciones.forEach((o, i) => {
      const letra = String.fromCharCode(97 + i)
      L.push(`${letra}) [${o.fundamento}] ${o.nota}`)
      if (o.articulo) {
        L.push(`   ${o.articulo.titulo}:`)
        L.push('   ' + o.articulo.texto.replace(/\n/g, '\n   '))
      }
      L.push('')
    })
    L.push(CIERRE)
    if (cabecera.autor) {
      L.push('')
      L.push(`Revisado por: ${cabecera.autor}`)
    }
    return L.join('\n')
  }

  function copiar() {
    navigator.clipboard?.writeText(textoInforme())
  }

  const resumen = useMemo(() => {
    const r = { conforme: 0, vulneracion: 0, no_regula: 0, remision: 0, na: 0 }
    TODOS_LOS_ITEMS.forEach((it) => {
      const e = estados[it.id]
      if (e && r[e] !== undefined) r[e] += 1
    })
    return r
  }, [estados])

  return (
    <div className="analizador">
      <header className="analizador__hero no-impresion">
        <div className="contenedor">
          <a className="analizador__volver" href="#/herramientas">← Volver a herramientas</a>
          <h1>Revisión de convenios colectivos</h1>
          <p className="analizador__lema">
            Herramienta de apoyo para <strong>revisar la legalidad</strong> de convenios colectivos
            frente al Estatuto de los Trabajadores. Sube o pega el texto del convenio, revisa el cuadro
            y genera una <strong>revisión</strong> lista para guardar o imprimir.
          </p>
          <p className="analizador__aviso-legal">
            ⚖️ Herramienta orientativa y educativa. No sustituye el criterio del/de la profesional ni
            constituye asesoramiento jurídico. La detección automática se basa en coincidencias de texto.
          </p>
        </div>
      </header>

      <div className="contenedor analizador__grid">
        {/* Columna de entrada y valoración */}
        <section className="analizador__panel no-impresion">
          <h2>1. Datos de la revisión</h2>
          <div className="campo">
            <label>Encabezado del documento (opcional)</label>
            <input
              type="text"
              value={cabecera.encabezado}
              onChange={(e) => actualizarCabecera('encabezado', e.target.value)}
              placeholder="Tu nombre, despacho o academia (opcional)"
            />
          </div>
          <div className="campo">
            <label>Nombre del convenio</label>
            <input
              type="text"
              value={nombreConvenio}
              onChange={(e) => setNombreConvenio(e.target.value)}
              placeholder="Convenio colectivo de…"
            />
          </div>
          <div className="campo-fila">
            <div className="campo">
              <label>Fecha</label>
              <input type="text" value={fecha} onChange={(e) => setFecha(e.target.value)} />
            </div>
            <div className="campo">
              <label>SMI vigente (€/mes)</label>
              <input
                type="number"
                value={smiMensual}
                onChange={(e) => setSmiMensual(Number(e.target.value))}
              />
            </div>
          </div>
          <div className="campo">
            <label>Revisado por (opcional)</label>
            <input
              type="text"
              value={cabecera.autor}
              onChange={(e) => actualizarCabecera('autor', e.target.value)}
              placeholder="Nombre y apellidos"
            />
          </div>

          <h2>2. Texto del convenio</h2>
          <p className="campo__ayuda">
            Sube el archivo (<code>PDF</code>, <code>Word</code> o <code>TXT</code>) y se extraerá el
            texto automáticamente, o pégalo directamente. 🔒 Los archivos se procesan en tu navegador;
            no se suben a ningún servidor.
          </p>
          <div className="analizador__subir">
            <label className="btn btn--secundario">
              {cargando ? 'Leyendo archivo…' : '📄 Subir convenio (PDF/Word/TXT)'}
              <input
                type="file"
                accept=".pdf,.docx,.doc,.txt"
                onChange={onArchivo}
                hidden
                disabled={cargando}
              />
            </label>
            {archivoNombre && <span className="analizador__archivo">{archivoNombre}</span>}
          </div>
          {pdfParaOcr && !ocrProgreso && (
            <div className="aviso aviso--info analizador__ocr">
              Este PDF parece escaneado (sin texto seleccionable).{' '}
              <button className="btn btn--secundario" onClick={ejecutarOcr}>
                🔎 Reconocer texto (OCR)
              </button>
            </div>
          )}
          {ocrProgreso && <p className="analizador__ocr-progreso">⏳ {ocrProgreso}</p>}
          <textarea
            className="analizador__texto"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Pega aquí el articulado del convenio colectivo…"
            rows={12}
          />
          <div className="analizador__acciones">
            <button className="btn btn--primario" onClick={ejecutarAnalisis}>
              Analizar automáticamente
            </button>
            <button className="btn btn--secundario" onClick={cargarEjemplo}>
              Cargar ejemplo
            </button>
            <button className="btn btn--texto" onClick={limpiar}>
              Limpiar
            </button>
          </div>

          {avisos.length > 0 && (
            <ul className="analizador__avisos">
              {avisos.map((a, i) => (
                <li key={i} className={`aviso aviso--${a.tipo}`}>{a.texto}</li>
              ))}
            </ul>
          )}
          {analizado && (
            <p className="analizador__resumen">
              <span className="chip chip--verde">{resumen.conforme} conforme</span>{' '}
              <span className="chip chip--rojo">{resumen.vulneracion} vulneración</span>{' '}
              <span className="chip chip--ambar">{resumen.no_regula} no regula</span>
            </p>
          )}

          <h2>3. Cuadro de revisión</h2>
          <p className="campo__ayuda">
            Revisa y ajusta cada punto. Las marcas propuestas automáticamente pueden corregirse.
          </p>
          {CUADRO_VERIFICACION.map((sec) => (
            <fieldset key={sec.num} className="cuadro__seccion">
              <legend>
                {sec.num}. {sec.titulo}
              </legend>
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
                        className={colorClase(ESTADOS[estado].color)}
                        value={estado}
                        onChange={(e) =>
                          setEstados((p) => ({ ...p, [it.id]: e.target.value }))
                        }
                      >
                        {Object.entries(ESTADOS).map(([k, v]) => (
                          <option key={k} value={k}>
                            {v.etiqueta}
                          </option>
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

        {/* Columna del informe generado */}
        <section className="analizador__informe" id="informe-generado">
          <div className="analizador__informe-acciones no-impresion">
            <h2>Revisión generada</h2>
            <div>
              <button className="btn btn--secundario" onClick={copiar}>Copiar texto</button>
              <button className="btn btn--primario" onClick={() => window.print()}>
                Imprimir / PDF
              </button>
            </div>
          </div>

          <article className="documento">
            {cabecera.encabezado && <p className="documento__org">{cabecera.encabezado}</p>}
            <p className="documento__meta">
              <strong>{cabecera.asunto.toUpperCase()}</strong>
              <br />
              <strong>Fecha:</strong> {fecha}
            </p>
            <h3 className="documento__titulo">
              {(nombreConvenio || '[NOMBRE DEL CONVENIO]').toUpperCase()}
            </h3>
            <p>{parrafoApertura(nombreConvenio)}</p>

            <h4>Cuadro de revisión</h4>
            {informe.filasCuadro.length === 0 ? (
              <p className="documento__vacio">
                Aún no has valorado ningún punto del cuadro. Usa “Analizar automáticamente” o ajusta los
                puntos a la izquierda.
              </p>
            ) : (
              <table className="documento__tabla">
                <thead>
                  <tr>
                    <th>Punto revisado</th>
                    <th>Fundamento</th>
                    <th>Valoración</th>
                    <th>Observación</th>
                  </tr>
                </thead>
                <tbody>
                  {informe.filasCuadro.map((f, i) => (
                    <tr key={i}>
                      <td>{f.etiqueta}</td>
                      <td>{f.fundamento}</td>
                      <td>
                        <span className={colorClase(ESTADOS[f.estado].color)}>
                          {ESTADOS[f.estado].etiqueta}
                        </span>
                      </td>
                      <td>{f.nota}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <h4>Resultado de la revisión</h4>
            <p>
              {informe.hayVulneraciones
                ? RESULTADO_INTRO.conVulneraciones
                : RESULTADO_INTRO.sinVulneraciones}
            </p>
            <ol className="documento__obs">
              {informe.observaciones.map((o, i) => (
                <li key={i}>
                  <strong>[{o.fundamento}]</strong> {o.nota}
                  {o.articulo && (
                    <blockquote>
                      <em>{o.articulo.titulo}:</em>
                      <br />
                      {o.articulo.texto.split('\n').map((linea, j) => (
                        <span key={j}>
                          {linea}
                          <br />
                        </span>
                      ))}
                    </blockquote>
                  )}
                </li>
              ))}
            </ol>

            <p className="documento__cierre">{CIERRE}</p>
            {cabecera.autor && (
              <p className="documento__firma">Revisado por: {cabecera.autor}</p>
            )}
          </article>
        </section>
      </div>
    </div>
  )
}
