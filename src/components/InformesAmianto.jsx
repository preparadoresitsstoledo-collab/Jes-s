import { useState } from 'react'
import {
  DATOS_CAMPOS,
  APARTADOS,
  NORMATIVA,
  DOCS_INSST,
  ARTICULOS_396,
  VALOR_LIMITE,
  CONSERVACION_AÑOS,
} from '../data/amianto.js'

function estadoInicial() {
  const datos = {}
  for (const c of DATOS_CAMPOS) datos[c.id] = ''
  const apartados = {}
  for (const a of APARTADOS) apartados[a.id] = ''
  return { datos, apertura: '', apartados }
}

export default function InformesAmianto() {
  const [datos, setDatos] = useState(() => estadoInicial().datos)
  const [apertura, setApertura] = useState('')
  const [apartados, setApartados] = useState(() => estadoInicial().apartados)

  function setDato(id, valor) {
    setDatos((prev) => ({ ...prev, [id]: valor }))
  }
  function setApartado(id, valor) {
    setApartados((prev) => ({ ...prev, [id]: valor }))
  }
  function imprimir() {
    window.print()
  }
  function limpiar() {
    const init = estadoInicial()
    setDatos(init.datos)
    setApertura('')
    setApartados(init.apartados)
  }

  const apartadosConContenido = APARTADOS.filter((a) => apartados[a.id].trim())
  const hayContenido = apertura.trim() || apartadosConContenido.length > 0

  return (
    <div className="analizador amianto">
      <header className="analizador__hero no-impresion">
        <div className="contenedor">
          <a className="analizador__volver" href="#/herramientas">
            ← Volver a herramientas
          </a>
          <h1>Informe sobre el plan de trabajo con amianto</h1>
          <p className="analizador__lema">
            Editor con la <strong>estructura oficial del art. 11.2 del RD 396/2006</strong> para redactar
            el informe sobre el plan de trabajo con riesgo de exposición al amianto (art. 12.2). La
            herramienta <strong>no incluye texto de informe</strong>: aporta los apartados legales y el
            marco normativo; el contenido lo redactas tú.
          </p>
          <p className="analizador__aviso-legal">
            ⚖️ Herramienta meramente <strong>orientativa e informativa</strong>. No constituye resolución
            ni informe administrativo, ni sustituye el criterio del/de la actuante. Fuentes{' '}
            <strong>exclusivamente oficiales</strong> (BOE e INSST).
          </p>
        </div>
      </header>

      <div className="contenedor analizador__grid">
        {/* Editor */}
        <section className="analizador__panel no-impresion">
          <h2>Datos del informe</h2>
          <div className="amianto__campos">
            {DATOS_CAMPOS.map((c) => (
              <div className={`campo ${c.ancho === 'full' ? 'campo--full' : ''}`} key={c.id}>
                <label>{c.label}</label>
                <input
                  type="text"
                  value={datos[c.id]}
                  onChange={(e) => setDato(c.id, e.target.value)}
                  placeholder={c.placeholder || ''}
                />
              </div>
            ))}
          </div>

          <h2>Encabezado</h2>
          <div className="campo">
            <label>Párrafo de apertura</label>
            <textarea
              rows={4}
              value={apertura}
              onChange={(e) => setApertura(e.target.value)}
              placeholder="Fórmula de apertura del informe (p. ej. cita del art. 12.2 RD 396/2006 y objeto del informe)…"
            />
          </div>

          <h2>Contenido del plan (art. 11.2 RD 396/2006)</h2>
          {APARTADOS.map((a) => (
            <div className="campo" key={a.id}>
              <label>
                {a.num}. {a.titulo} <span className="calc__base">· {a.base}</span>
              </label>
              <textarea
                rows={3}
                value={apartados[a.id]}
                onChange={(e) => setApartado(a.id, e.target.value)}
                placeholder="Redacta aquí el análisis de este apartado…"
              />
            </div>
          ))}

          <div className="analizador__acciones">
            <button className="btn btn--primario" onClick={imprimir}>
              🖨️ Imprimir / guardar PDF
            </button>
            <button className="btn btn--texto" onClick={limpiar}>
              Limpiar
            </button>
          </div>
        </section>

        {/* Vista previa */}
        <section className="analizador__informe amianto__informe">
          <article className="documento">
            {datos.solicitante && <p className="documento__organo">{datos.solicitante}</p>}
            <h2 className="documento__titulo">
              Informe sobre el plan de trabajo con riesgo de exposición al amianto
            </h2>
            <p className="amianto__subtitulo">Art. 12.2 del RD 396/2006, de 31 de marzo</p>

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
                {datos.fechaEntrada && <tr><th>Fecha de entrada</th><td>{datos.fechaEntrada}</td></tr>}
                {datos.fechaInforme && <tr><th>Fecha del informe</th><td>{datos.fechaInforme}</td></tr>}
                {datos.actuante && <tr><th>Actuante</th><td>{datos.actuante}</td></tr>}
              </tbody>
            </table>

            {apertura.trim() && (
              <p className="amianto__parrafo" style={{ whiteSpace: 'pre-wrap' }}>
                {apertura}
              </p>
            )}

            {apartadosConContenido.map((a) => (
              <div className="amianto__seccion" key={a.id}>
                <h3>
                  {a.num}. {a.titulo}
                </h3>
                <p className="amianto__parrafo" style={{ whiteSpace: 'pre-wrap' }}>
                  {apartados[a.id]}
                </p>
              </div>
            ))}

            {(datos.lugarFecha || datos.actuante) && (
              <div className="amianto__firma">
                {datos.lugarFecha && <p>{datos.lugarFecha}</p>}
                {datos.actuante && (
                  <p>
                    <br />
                    {datos.actuante}
                  </p>
                )}
              </div>
            )}

            {!hayContenido && (
              <p className="amianto__vacio no-impresion">
                Redacta el encabezado y los apartados en el editor para ver aquí el informe.
              </p>
            )}

            <p className="documento__cierre">
              Valor límite de exposición: {VALOR_LIMITE.valor} {VALOR_LIMITE.unidad} (
              {VALOR_LIMITE.referencia}, {VALOR_LIMITE.articulo}). Conservación de la documentación:
              mínimo {CONSERVACION_AÑOS} años (art. 18 RD 396/2006). Documento orientativo basado en
              fuentes oficiales (BOE e INSST); no constituye resolución ni informe administrativo.
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
