import { useState } from 'react'
import { calcularIndemnizacion, getRelacion, RELACIONES, UNIDADES } from '../lib/indemnizacion.js'

const eur = (n) =>
  n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 })
const num = (n, d = 1) =>
  (n || 0).toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: d })

function antiguedadTexto(a) {
  if (!a) return '—'
  const p = []
  if (a.años) p.push(`${a.años} ${a.años === 1 ? 'año' : 'años'}`)
  if (a.meses) p.push(`${a.meses} ${a.meses === 1 ? 'mes' : 'meses'}`)
  if (a.dias) p.push(`${a.dias} ${a.dias === 1 ? 'día' : 'días'}`)
  return p.join(', ') || '0 días'
}

export default function CalculadoraDespido() {
  const [datos, setDatos] = useState({
    inicio: '',
    fin: new Date().toISOString().slice(0, 10),
    salario: '',
    unidad: 'mensual',
    relacion: 'comun',
    causa: 'improcedente',
  })
  const [resultado, setResultado] = useState(null)

  const set = (campo, valor) => setDatos((d) => ({ ...d, [campo]: valor }))
  const cambiarRelacion = (rel) =>
    setDatos((d) => ({ ...d, relacion: rel, causa: getRelacion(rel).causas[0].id }))

  const relacionSel = getRelacion(datos.relacion)
  const causaSel = relacionSel.causas.find((c) => c.id === datos.causa) || relacionSel.causas[0]

  function calcular() {
    setResultado(calcularIndemnizacion(datos))
  }

  return (
    <div className="analizador">
      <header className="analizador__hero no-impresion">
        <div className="contenedor">
          <a className="analizador__volver" href="#inicio">← Volver a la web</a>
          <h1>Calculadora de indemnización por extinción del contrato</h1>
          <p className="analizador__lema">
            Elige la relación laboral y la causa de extinción: régimen común del Estatuto de los
            Trabajadores y las <strong>relaciones laborales de carácter especial</strong> (alta
            dirección, hogar, deportistas, artistas, representantes, abogados, MIR, CEE…), con salario
            diario, mensual o anual.
          </p>
          <p className="analizador__aviso-legal">
            ⚖️ Cálculo orientativo. No sustituye el asesoramiento jurídico: prevalecen los pactos, el
            convenio y las cuantías fijadas judicialmente.
          </p>
        </div>
      </header>

      <div className="contenedor analizador__grid">
        <section className="analizador__panel no-impresion">
          <h2>Datos</h2>

          <div className="campo">
            <label>Relación laboral</label>
            <select value={datos.relacion} onChange={(e) => cambiarRelacion(e.target.value)}>
              {RELACIONES.map((r) => (
                <option key={r.id} value={r.id}>{r.nombre}</option>
              ))}
            </select>
          </div>
          <div className="campo">
            <label>Causa de extinción</label>
            <select value={datos.causa} onChange={(e) => set('causa', e.target.value)}>
              {relacionSel.causas.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
            <p className="campo__ayuda">{causaSel.baseLegal}</p>
          </div>

          <div className="campo-fila">
            <div className="campo">
              <label>Fecha de inicio (alta)</label>
              <input type="date" value={datos.inicio} onChange={(e) => set('inicio', e.target.value)} />
            </div>
            <div className="campo">
              <label>Fecha de la extinción</label>
              <input type="date" value={datos.fin} onChange={(e) => set('fin', e.target.value)} />
            </div>
          </div>
          <div className="campo-fila">
            <div className="campo">
              <label>Salario bruto (€)</label>
              <input
                type="number"
                value={datos.salario}
                onChange={(e) => set('salario', e.target.value)}
                placeholder="Ej. 1800"
              />
            </div>
            <div className="campo">
              <label>Unidad del salario</label>
              <select value={datos.unidad} onChange={(e) => set('unidad', e.target.value)}>
                {UNIDADES.map((u) => (
                  <option key={u.k} value={u.k}>{u.label}</option>
                ))}
              </select>
            </div>
          </div>
          <p className="campo__ayuda">
            El salario diario regulador se obtiene según la unidad elegida (mensual × 12 ÷ 365; anual ÷ 365).
          </p>
          <div className="analizador__acciones">
            <button className="btn btn--primario" onClick={calcular}>Calcular indemnización</button>
          </div>
        </section>

        <section className="analizador__informe" id="informe-generado">
          <div className="analizador__informe-acciones no-impresion">
            <h2>Resultado</h2>
            {resultado?.ok && (
              <button className="btn btn--primario" onClick={() => window.print()}>Imprimir / PDF</button>
            )}
          </div>

          <article className="documento">
            {!resultado && <p className="documento__vacio">Rellena los datos y pulsa “Calcular indemnización”.</p>}

            {resultado && !resultado.ok && (
              <ul className="analizador__avisos">
                {resultado.errores.map((e, i) => (
                  <li key={i} className="aviso aviso--alerta">{e}</li>
                ))}
              </ul>
            )}

            {resultado?.ok && (
              <>
                <p className="despido__importe">{eur(resultado.importe)}</p>
                {resultado.genera ? (
                  <p className="despido__sub">
                    {num(resultado.diasIndemnizacion, 0)} días de salario ·{' '}
                    {num(resultado.diasIndemnizacion / 30, 1)} mensualidades
                  </p>
                ) : (
                  <p className="despido__sub">Esta causa de extinción no genera indemnización tasada.</p>
                )}

                <table className="documento__tabla">
                  <tbody>
                    <tr>
                      <th>Relación / causa</th>
                      <td>{resultado.relacion.nombre} · {resultado.causa.nombre}</td>
                    </tr>
                    <tr>
                      <th>Base legal</th>
                      <td>{resultado.causa.baseLegal}</td>
                    </tr>
                    <tr>
                      <th>Antigüedad</th>
                      <td>{antiguedadTexto(resultado.antiguedad)}</td>
                    </tr>
                    <tr>
                      <th>Salario diario</th>
                      <td>{eur(resultado.salarioDiario)}</td>
                    </tr>
                    <tr>
                      <th>Salario mensual</th>
                      <td>{eur(resultado.salarioMensual)}</td>
                    </tr>
                    <tr>
                      <th>Salario anual</th>
                      <td>{eur(resultado.salarioAnual)}</td>
                    </tr>
                    {resultado.topeAplicado && (
                      <tr>
                        <th>Tope aplicado</th>
                        <td>{resultado.topeAplicado}</td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {resultado.desglose.length > 0 && (
                  <>
                    <h4>Desglose</h4>
                    <table className="documento__tabla">
                      <thead>
                        <tr>
                          <th>Concepto</th>
                          <th>Días</th>
                          <th>Importe</th>
                        </tr>
                      </thead>
                      <tbody>
                        {resultado.desglose.map((d, i) => (
                          <tr key={i}>
                            <td>{d.etiqueta}</td>
                            <td>{num(d.dias, 1)}</td>
                            <td>{eur(d.dias * resultado.salarioDiario)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}

                <p className="documento__obs" style={{ paddingLeft: 0 }}>{resultado.causa.descripcion}</p>
                {resultado.causa.nota && (
                  <p className="documento__obs" style={{ paddingLeft: 0 }}>⚑ {resultado.causa.nota}</p>
                )}
              </>
            )}
          </article>
        </section>
      </div>
    </div>
  )
}
