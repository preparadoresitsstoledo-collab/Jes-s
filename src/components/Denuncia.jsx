import { useState } from 'react'
import { HECHOS, ENLACES_OFICIALES } from '../data/denuncia.js'

const hoy = () => new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })

export default function Denuncia() {
  const [d, setD] = useState({
    denNombre: '', denDoc: '', denDomicilio: '', denContacto: '',
    empNombre: '', empCif: '', empCentro: '', empActividad: '', provincia: '',
    fechaLugar: '', relato: '', lugarFirma: '',
  })
  const [marcados, setMarcados] = useState({})
  const [escrito, setEscrito] = useState('')
  const [copiado, setCopiado] = useState(false)

  const set = (k, v) => setD((o) => ({ ...o, [k]: v }))
  const toggle = (id) => setMarcados((m) => ({ ...m, [id]: !m[id] }))

  function generar() {
    const seleccion = HECHOS.filter((h) => marcados[h.id])
    const L = []
    L.push(`A LA INSPECCIÓN PROVINCIAL DE TRABAJO Y SEGURIDAD SOCIAL DE ${(d.provincia || '[provincia]').toUpperCase()}`)
    L.push('')
    L.push('DENUNCIANTE')
    L.push(`Nombre y apellidos: ${d.denNombre || '[nombre y apellidos]'}`)
    L.push(`DNI/NIE: ${d.denDoc || '[documento]'}`)
    L.push(`Domicilio: ${d.denDomicilio || '[domicilio a efectos de notificaciones]'}`)
    L.push(`Teléfono / correo: ${d.denContacto || '[teléfono o correo]'}`)
    L.push('(La identidad de la persona denunciante tiene carácter confidencial — art. 20.4 de la Ley 23/2015.)')
    L.push('')
    L.push('EMPRESA / PERSONA DENUNCIADA')
    L.push(`Denominación o razón social: ${d.empNombre || '[nombre de la empresa]'}`)
    L.push(`CIF/NIF: ${d.empCif || '[CIF/NIF]'}`)
    L.push(`Centro de trabajo (dirección): ${d.empCentro || '[dirección del centro de trabajo]'}`)
    L.push(`Actividad: ${d.empActividad || '[actividad]'}`)
    L.push('')
    L.push('HECHOS QUE SE DENUNCIAN')
    if (seleccion.length) {
      seleccion.forEach((h, i) => {
        L.push(`${i + 1}. ${h.texto}`)
        L.push(`   (Materia: ${h.materia} — ${h.clave}. Posible infracción: ${h.precepto}.)`)
      })
    } else {
      L.push('[Marca al menos un tipo de hecho en el formulario.]')
    }
    if (d.relato.trim()) {
      L.push('')
      L.push('Descripción de lo ocurrido:')
      L.push(d.relato.trim())
    }
    L.push('')
    L.push(`Fecha(s) y lugar de los hechos: ${d.fechaLugar || '[fechas y lugar en que ocurren o han ocurrido]'}`)
    L.push('')
    L.push('SOLICITA')
    L.push('Que se tenga por presentada esta denuncia y se realicen las actuaciones inspectoras que procedan para comprobar los hechos descritos y, en su caso, se adopten las medidas que correspondan.')
    L.push('')
    L.push(`En ${d.lugarFirma || '[lugar]'}, a ${hoy()}.`)
    L.push('')
    L.push('Firma:')
    L.push(d.denNombre || '[nombre y apellidos]')
    setEscrito(L.join('\n'))
    setCopiado(false)
    setTimeout(() => {
      document.getElementById('denuncia-resultado')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  async function copiar() {
    try {
      await navigator.clipboard.writeText(escrito)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2500)
    } catch {
      setCopiado(false)
    }
  }

  return (
    <div className="analizador">
      <header className="analizador__hero no-impresion">
        <div className="contenedor">
          <a className="analizador__volver" href="#inicio">← Volver a la web</a>
          <h1>Asistente de denuncia a la Inspección de Trabajo</h1>
          <p className="analizador__lema">
            Rellena los datos paso a paso y genera un escrito de denuncia listo para presentar. Pensado
            para quien no es jurista: tú describes lo que pasa y la herramienta lo ordena según el
            modelo de la Inspección, indicando la materia y el precepto orientativo de cada hecho.
          </p>
          <p className="analizador__aviso-legal">
            ⚖️ Orientativo. La Inspección no tramita denuncias anónimas (art. 20.2 Ley 23/2015): debes
            identificarte, aunque tu identidad es confidencial. Revisa el escrito antes de presentarlo.
          </p>
        </div>
      </header>

      <div className="contenedor analizador__grid">
        <section className="analizador__panel no-impresion">
          <h2>1 · Tus datos (denunciante)</h2>
          <div className="campo">
            <label>Nombre y apellidos</label>
            <input value={d.denNombre} onChange={(e) => set('denNombre', e.target.value)} placeholder="Nombre y apellidos" />
          </div>
          <div className="campo-fila">
            <div className="campo">
              <label>DNI / NIE</label>
              <input value={d.denDoc} onChange={(e) => set('denDoc', e.target.value)} placeholder="00000000A" />
            </div>
            <div className="campo">
              <label>Teléfono o correo</label>
              <input value={d.denContacto} onChange={(e) => set('denContacto', e.target.value)} placeholder="Para notificaciones" />
            </div>
          </div>
          <div className="campo">
            <label>Domicilio</label>
            <input value={d.denDomicilio} onChange={(e) => set('denDomicilio', e.target.value)} placeholder="Domicilio a efectos de notificaciones" />
          </div>

          <h2>2 · Empresa denunciada</h2>
          <div className="campo-fila">
            <div className="campo">
              <label>Nombre / razón social</label>
              <input value={d.empNombre} onChange={(e) => set('empNombre', e.target.value)} placeholder="Empresa S.L." />
            </div>
            <div className="campo">
              <label>CIF / NIF</label>
              <input value={d.empCif} onChange={(e) => set('empCif', e.target.value)} placeholder="B00000000" />
            </div>
          </div>
          <div className="campo">
            <label>Centro de trabajo (dirección)</label>
            <input value={d.empCentro} onChange={(e) => set('empCentro', e.target.value)} placeholder="Calle, nº, localidad" />
          </div>
          <div className="campo-fila">
            <div className="campo">
              <label>Actividad</label>
              <input value={d.empActividad} onChange={(e) => set('empActividad', e.target.value)} placeholder="Hostelería, construcción…" />
            </div>
            <div className="campo">
              <label>Provincia</label>
              <input value={d.provincia} onChange={(e) => set('provincia', e.target.value)} placeholder="Toledo" />
            </div>
          </div>

          <h2>3 · ¿Qué ocurre? (marca lo que corresponda)</h2>
          <div className="denuncia__hechos">
            {HECHOS.map((h) => (
              <label key={h.id} className={`denuncia__hecho ${marcados[h.id] ? 'denuncia__hecho--on' : ''}`}>
                <input type="checkbox" checked={!!marcados[h.id]} onChange={() => toggle(h.id)} />
                <span>
                  <strong>{h.label}</strong>
                  <em>{h.materia} · {h.precepto}</em>
                </span>
              </label>
            ))}
          </div>

          <div className="campo">
            <label>Cuéntalo con tus palabras</label>
            <textarea rows={4} value={d.relato} onChange={(e) => set('relato', e.target.value)}
              placeholder="Qué pasa, desde cuándo, cuántas personas afectadas, cómo lo sabes…" />
          </div>
          <div className="campo-fila">
            <div className="campo">
              <label>Fecha(s) y lugar de los hechos</label>
              <input value={d.fechaLugar} onChange={(e) => set('fechaLugar', e.target.value)} placeholder="Desde marzo de 2026, en el centro de…" />
            </div>
            <div className="campo">
              <label>Lugar de la firma</label>
              <input value={d.lugarFirma} onChange={(e) => set('lugarFirma', e.target.value)} placeholder="Toledo" />
            </div>
          </div>

          <div className="analizador__acciones">
            <button className="btn btn--primario" onClick={generar}>Generar denuncia</button>
          </div>
        </section>

        <section className="analizador__informe" id="denuncia-resultado">
          <div className="analizador__informe-acciones no-impresion">
            <h2>Escrito de denuncia</h2>
            {escrito && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button className="btn btn--secundario" onClick={copiar}>{copiado ? '✅ Copiado' : 'Copiar'}</button>
                <button className="btn btn--primario" onClick={() => window.print()}>Imprimir / PDF</button>
              </div>
            )}
          </div>

          <article className="documento">
            {!escrito && <p className="documento__vacio">Rellena el formulario y pulsa “Generar denuncia”.</p>}
            {escrito && <pre className="denuncia__escrito">{escrito}</pre>}
          </article>

          <div className="denuncia__enlaces no-impresion">
            <h4>Dónde presentarla</h4>
            <p>Puedes presentarla en la sede electrónica oficial o en el registro de la Inspección Provincial:</p>
            <ul>
              {ENLACES_OFICIALES.map((e, i) => (
                <li key={i}>
                  <a href={e.url} target="_blank" rel="noopener noreferrer">{e.texto} ↗</a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}
