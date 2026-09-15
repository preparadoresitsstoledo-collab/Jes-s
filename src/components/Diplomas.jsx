import { useEffect, useMemo, useState } from 'react'
import archivoDiplomas from '../data/diplomas.json'
import { marca, preparador } from '../data/sitio.js'
import {
  cifrarDiploma,
  descifrarDiploma,
  formatearCodigo,
  generarCodigo,
  normalizarCodigo,
} from '../lib/diplomasCrypto.js'
import { descargarDiplomaPdf, formatearFecha, previsualizarDiplomaPdf } from '../lib/diplomaPdf.js'

const LOGO_URL = './logo.png'

function urlVerificacion() {
  return `${window.location.origin}${window.location.pathname}#/diplomas`
}

function usarHash() {
  const [hash, setHash] = useState(() => window.location.hash)
  useEffect(() => {
    const onHash = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  return hash
}

function codigoDesdeHash(hash) {
  const m = hash.match(/[?&]codigo=([^&]+)/)
  return m ? decodeURIComponent(m[1]) : ''
}

/* ------------------------------------------------------------------------ */
/*  Vista pública: descarga del diploma con el código personal               */
/* ------------------------------------------------------------------------ */
function DescargaDiploma({ codigoInicial }) {
  const [codigo, setCodigo] = useState(codigoInicial || '')
  const [estado, setEstado] = useState('inicio') // inicio | buscando | ok | error
  const [diploma, setDiploma] = useState(null)
  const [vistaPrevia, setVistaPrevia] = useState('')
  const [descargando, setDescargando] = useState(false)

  const registros = archivoDiplomas.diplomas || []
  const codigoNorm = normalizarCodigo(codigo)

  useEffect(() => {
    if (codigoInicial) {
      setCodigo(codigoInicial)
      buscar(codigoInicial)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codigoInicial])

  async function buscar(valor = codigo) {
    setEstado('buscando')
    setDiploma(null)
    setVistaPrevia('')
    const datos = await descifrarDiploma(valor, registros)
    if (!datos) {
      setEstado('error')
      return
    }
    setDiploma(datos)
    setEstado('ok')
    try {
      const url = await previsualizarDiplomaPdf(datos, {
        logoUrl: LOGO_URL,
        codigo: formatearCodigo(valor),
        urlVerificacion: urlVerificacion(),
      })
      setVistaPrevia(url)
    } catch (e) {
      console.warn('No se pudo generar la vista previa del diploma', e)
    }
  }

  async function descargar() {
    if (!diploma) return
    setDescargando(true)
    try {
      await descargarDiplomaPdf(diploma, {
        logoUrl: LOGO_URL,
        codigo: formatearCodigo(codigo),
        urlVerificacion: urlVerificacion(),
      })
    } finally {
      setDescargando(false)
    }
  }

  function enviar(e) {
    e.preventDefault()
    if (codigoNorm.length >= 8) buscar()
  }

  return (
    <div className="contenedor diplomas__cuerpo">
      <form className="diplomas__buscador" onSubmit={enviar}>
        <label htmlFor="codigo-diploma">Código personal del diploma</label>
        <div className="diplomas__fila">
          <input
            id="codigo-diploma"
            type="text"
            inputMode="text"
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            placeholder="ABCD-EFGH-JKLM"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
          />
          <button
            className="btn btn--primario"
            type="submit"
            disabled={codigoNorm.length < 8 || estado === 'buscando'}
          >
            {estado === 'buscando' ? 'Buscando…' : 'Buscar diploma'}
          </button>
        </div>
        <p className="diplomas__ayuda">
          Introduce el código que has recibido por correo electrónico o WhatsApp. No distingue
          mayúsculas de minúsculas y puedes escribirlo con o sin guiones.
        </p>
      </form>

      {estado === 'error' && (
        <div className="diplomas__aviso diplomas__aviso--error" role="alert">
          <strong>No hay ningún diploma con ese código.</strong> Comprueba que lo has copiado
          completo. Si el problema persiste, escribe a{' '}
          <a href={`mailto:${marca.email}`}>{marca.email}</a>.
        </div>
      )}

      {estado === 'ok' && diploma && (
        <section className="diplomas__resultado" aria-live="polite">
          <div className="diplomas__tarjeta">
            <p className="diplomas__tipo">{diploma.tipo || 'Diploma de asistencia'}</p>
            <h2 className="diplomas__nombre">{diploma.nombre}</h2>
            <p className="diplomas__curso">{diploma.curso}</p>
            {diploma.subtitulo && <p className="diplomas__subtitulo">{diploma.subtitulo}</p>}
            <dl className="diplomas__datos">
              {diploma.fecha && (
                <>
                  <dt>Fecha</dt>
                  <dd>
                    {formatearFecha(diploma.fecha)}
                    {diploma.fechaFin ? ` – ${formatearFecha(diploma.fechaFin)}` : ''}
                  </dd>
                </>
              )}
              {diploma.horas && (
                <>
                  <dt>Duración</dt>
                  <dd>{diploma.horas} horas</dd>
                </>
              )}
              {diploma.lugar && (
                <>
                  <dt>Lugar</dt>
                  <dd>{diploma.lugar}</dd>
                </>
              )}
              {diploma.modalidad && (
                <>
                  <dt>Modalidad</dt>
                  <dd>{diploma.modalidad}</dd>
                </>
              )}
              {diploma.formador && (
                <>
                  <dt>Firma</dt>
                  <dd>
                    {diploma.formador}
                    {diploma.cargo ? `, ${diploma.cargo}` : ''}
                  </dd>
                </>
              )}
            </dl>
            <div className="diplomas__acciones">
              <button className="btn btn--primario" type="button" onClick={descargar} disabled={descargando}>
                {descargando ? 'Generando PDF…' : '⬇️ Descargar diploma (PDF)'}
              </button>
            </div>
          </div>
          <div className="diplomas__previa">
            {vistaPrevia ? (
              <img src={vistaPrevia} alt={`Vista previa del diploma de ${diploma.nombre}`} />
            ) : (
              <p className="diplomas__previa-cargando">Preparando la vista previa…</p>
            )}
          </div>
        </section>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------------ */
/*  Vista del preparador: generación de códigos y registros cifrados         */
/* ------------------------------------------------------------------------ */
const CAMPOS_CURSO = [
  { id: 'tipo', etiqueta: 'Título del documento', placeholder: 'DIPLOMA DE ASISTENCIA' },
  { id: 'curso', etiqueta: 'Nombre del curso / jornada *', placeholder: 'Jornada sobre…', ancho: true },
  { id: 'subtitulo', etiqueta: 'Subtítulo (opcional)', placeholder: 'Contenidos, edición, etc.', ancho: true },
  { id: 'fecha', etiqueta: 'Fecha de inicio *', tipo: 'date' },
  { id: 'fechaFin', etiqueta: 'Fecha de fin (si dura varios días)', tipo: 'date' },
  { id: 'horas', etiqueta: 'Horas', placeholder: '5' },
  { id: 'lugar', etiqueta: 'Lugar', placeholder: 'Toledo' },
  { id: 'modalidad', etiqueta: 'Modalidad', placeholder: 'Presencial / Online' },
  { id: 'organizador', etiqueta: 'Organizador', placeholder: 'Entidad que organiza' },
  { id: 'formador', etiqueta: 'Firma (nombre)', placeholder: 'Nombre y apellidos' },
  { id: 'cargo', etiqueta: 'Firma (cargo)', placeholder: 'Cargo', ancho: true },
  { id: 'firmaLugarFecha', etiqueta: 'Lugar y fecha de la firma', placeholder: 'Toledo, 15 de septiembre de 2026', ancho: true },
]

function parsearAsistentes(texto) {
  return texto
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [nombre, documento = ''] = l.split(/[;,\t]/).map((s) => s.trim())
      return { nombre, documento }
    })
    .filter((a) => a.nombre && !/^nombre$/i.test(a.nombre))
}

function descargarTexto(nombre, contenido, tipo = 'text/plain') {
  const blob = new Blob([contenido], { type: `${tipo};charset=utf-8` })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = nombre
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function GeneradorDiplomas() {
  const [curso, setCurso] = useState({
    tipo: 'DIPLOMA DE ASISTENCIA',
    curso: '',
    subtitulo: '',
    fecha: '',
    fechaFin: '',
    horas: '',
    lugar: 'Toledo',
    modalidad: 'Presencial',
    organizador: marca.nombre,
    formador: preparador.nombre,
    cargo: preparador.cargo,
    firmaLugarFecha: '',
  })
  const [asistentesTexto, setAsistentesTexto] = useState('')
  const [resultado, setResultado] = useState(null) // { filas: [{nombre, documento, codigo}], registros: [] }
  const [generando, setGenerando] = useState(false)
  const [copiado, setCopiado] = useState('')

  const asistentes = useMemo(() => parsearAsistentes(asistentesTexto), [asistentesTexto])
  const listo = curso.curso.trim() && curso.fecha && asistentes.length > 0

  function setCampo(id, valor) {
    setCurso((prev) => ({ ...prev, [id]: valor }))
  }

  async function generar() {
    setGenerando(true)
    setCopiado('')
    try {
      const filas = []
      const registros = []
      const emitido = new Date().toISOString().slice(0, 10)
      for (const a of asistentes) {
        const codigo = generarCodigo(12)
        const datos = { ...curso, nombre: a.nombre, documento: a.documento, emitido }
        registros.push(await cifrarDiploma(codigo, datos))
        filas.push({ nombre: a.nombre, documento: a.documento, codigo: formatearCodigo(codigo) })
      }
      setResultado({ filas, registros })
    } finally {
      setGenerando(false)
    }
  }

  const jsonRegistros = resultado ? JSON.stringify(resultado.registros, null, 2) : ''
  const jsonCompleto = resultado
    ? JSON.stringify(
        { ...archivoDiplomas, diplomas: [...(archivoDiplomas.diplomas || []), ...resultado.registros] },
        null,
        2,
      ) + '\n'
    : ''
  const csvCodigos = resultado
    ? ['nombre;documento;codigo', ...resultado.filas.map((f) => `${f.nombre};${f.documento};${f.codigo}`)].join('\n') + '\n'
    : ''

  async function copiar(texto, etiqueta) {
    try {
      await navigator.clipboard.writeText(texto)
      setCopiado(etiqueta)
      setTimeout(() => setCopiado(''), 2500)
    } catch {
      setCopiado('')
    }
  }

  async function probarPdf(fila) {
    const datos = { ...curso, nombre: fila.nombre, documento: fila.documento }
    await descargarDiplomaPdf(datos, {
      logoUrl: LOGO_URL,
      codigo: fila.codigo,
      urlVerificacion: urlVerificacion(),
    })
  }

  return (
    <div className="contenedor diplomas__cuerpo diplomas__generador">
      <div className="diplomas__aviso">
        <strong>Zona del preparador.</strong> Todo se procesa en tu navegador: aquí se generan los
        códigos personales y los registros <em>cifrados</em>. Para publicarlos, sustituye el contenido de{' '}
        <code>src/data/diplomas.json</code> por el JSON completo que se genera abajo y sube el cambio al
        repositorio. Los códigos <strong>no se guardan en ningún sitio</strong>: descarga el CSV y envíalos
        a cada asistente. También puedes hacerlo desde la terminal con <code>npm run diplomas</code>.
      </div>

      <h2>1. Datos del curso o jornada</h2>
      <div className="diplomas__form">
        {CAMPOS_CURSO.map((c) => (
          <label key={c.id} className={c.ancho ? 'diplomas__campo--ancho' : ''}>
            <span>{c.etiqueta}</span>
            <input
              type={c.tipo || 'text'}
              value={curso[c.id]}
              placeholder={c.placeholder}
              onChange={(e) => setCampo(c.id, e.target.value)}
            />
          </label>
        ))}
      </div>

      <h2>2. Asistentes</h2>
      <label className="diplomas__campo--ancho">
        <span>
          Un asistente por línea: <code>Nombre y apellidos</code> o <code>Nombre y apellidos;DNI</code>{' '}
          ({asistentes.length} detectado{asistentes.length === 1 ? '' : 's'})
        </span>
        <textarea
          rows={8}
          value={asistentesTexto}
          placeholder={'Ana García López;12345678A\nLuis Pérez Ruiz'}
          onChange={(e) => setAsistentesTexto(e.target.value)}
        />
      </label>

      <div className="diplomas__acciones">
        <button className="btn btn--primario" type="button" disabled={!listo || generando} onClick={generar}>
          {generando ? 'Generando…' : `Generar ${asistentes.length || ''} código${asistentes.length === 1 ? '' : 's'}`}
        </button>
      </div>

      {resultado && (
        <>
          <h2>3. Códigos personales (confidencial)</h2>
          <div className="diplomas__tabla-wrap">
            <table className="diplomas__tabla">
              <thead>
                <tr>
                  <th>Asistente</th>
                  <th>Documento</th>
                  <th>Código</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {resultado.filas.map((f) => (
                  <tr key={f.codigo}>
                    <td>{f.nombre}</td>
                    <td>{f.documento || '—'}</td>
                    <td>
                      <code>{f.codigo}</code>
                    </td>
                    <td>
                      <button className="diplomas__enlace" type="button" onClick={() => probarPdf(f)}>
                        Probar PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="diplomas__acciones">
            <button
              className="btn btn--secundario"
              type="button"
              onClick={() => descargarTexto(`diplomas-codigos-${curso.fecha}.csv`, csvCodigos, 'text/csv')}
            >
              ⬇️ Descargar CSV de códigos
            </button>
            <button className="btn btn--secundario" type="button" onClick={() => copiar(csvCodigos, 'csv')}>
              {copiado === 'csv' ? '✔ Copiado' : 'Copiar CSV'}
            </button>
          </div>

          <h2>4. Publicar en la web</h2>
          <p>
            Descarga o copia el <strong>JSON completo</strong> (incluye los diplomas ya publicados más los
            nuevos) y guárdalo como <code>src/data/diplomas.json</code>. Al subirlo al repositorio, la web se
            vuelve a publicar automáticamente y los asistentes ya pueden descargar su diploma en{' '}
            <code>#/diplomas</code>.
          </p>
          <div className="diplomas__acciones">
            <button
              className="btn btn--primario"
              type="button"
              onClick={() => descargarTexto('diplomas.json', jsonCompleto, 'application/json')}
            >
              ⬇️ Descargar diplomas.json completo
            </button>
            <button className="btn btn--secundario" type="button" onClick={() => copiar(jsonCompleto, 'json')}>
              {copiado === 'json' ? '✔ Copiado' : 'Copiar JSON completo'}
            </button>
            <button className="btn btn--secundario" type="button" onClick={() => copiar(jsonRegistros, 'nuevos')}>
              {copiado === 'nuevos' ? '✔ Copiado' : 'Copiar solo los nuevos'}
            </button>
          </div>
          <details className="diplomas__detalle">
            <summary>Ver los registros cifrados generados</summary>
            <pre>{jsonRegistros}</pre>
          </details>
        </>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------------ */
export default function Diplomas() {
  const hash = usarHash()
  const esGenerador = hash.startsWith('#/diplomas/generar')
  const codigoInicial = codigoDesdeHash(hash)
  const total = (archivoDiplomas.diplomas || []).length

  return (
    <div className="analizador diplomas">
      <header className="analizador__hero">
        <div className="contenedor">
          <a className="analizador__volver" href={esGenerador ? '#/diplomas' : '#/herramientas'}>
            {esGenerador ? '← Volver a la descarga de diplomas' : '← Volver a herramientas'}
          </a>
          <h1>{esGenerador ? 'Generar diplomas' : 'Descarga tu diploma'}</h1>
          <p className="analizador__lema">
            {esGenerador ? (
              <>
                Crea los <strong>códigos personales</strong> y los registros cifrados de los diplomas de un
                curso o jornada.
              </>
            ) : (
              <>
                Diplomas de asistencia a los cursos y jornadas impartidos por{' '}
                <strong>{preparador.nombre}</strong>. Introduce tu código personal y descarga tu diploma en
                PDF.
              </>
            )}
          </p>
          <p className="analizador__aviso-legal">
            🔒 Los datos de los diplomas se guardan <strong>cifrados</strong> y solo pueden leerse con el
            código personal de cada asistente. Nada se envía a ningún servidor.
          </p>
        </div>
      </header>

      {esGenerador ? <GeneradorDiplomas /> : <DescargaDiploma codigoInicial={codigoInicial} />}

      <footer className="contenedor diplomas__pie">
        {esGenerador ? (
          <span>{total} diploma{total === 1 ? '' : 's'} publicado{total === 1 ? '' : 's'} actualmente.</span>
        ) : (
          <a href="#/diplomas/generar">Acceso del preparador: generar diplomas</a>
        )}
      </footer>
    </div>
  )
}
