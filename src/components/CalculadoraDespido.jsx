import { useState } from 'react'
import { calcularIndemnizacion } from '../lib/indemnizacion.js'

const eur = (n) =>
  n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 })

export default function CalculadoraDespido() {
  const [datos, setDatos] = useState({
    inicio: '',
    fin: new Date().toISOString().slice(0, 10),
    salarioMensual: '',
    pagas: 14,
    tipo: 'improcedente',
  })
  const [resultado, setResultado] = useState(null)

  const set = (campo, valor) => setDatos((d) => ({ ...d, [campo]: valor }))

  function calcular() {
    setResultado(calcularIndemnizacion(datos))
  }

  return (
    <div className="analizador">
      <header className="analizador__hero no-impresion">
        <div className="contenedor">
          <a className="analizador__volver" href="#inicio">← Volver a la web</a>
          <h1>Calculadora de indemnización por despido</h1>
          <p className="analizador__lema">
            Estima la indemnización según el tipo de despido y la antigüedad, conforme al Estatuto de
            los Trabajadores (incluido el régimen transitorio 45/33 días de la reforma de 2012).
          </p>
          <p className="analizador__aviso-legal">
            ⚖️ Cálculo orientativo. No sustituye el asesoramiento jurídico: hay supuestos especiales
            (salarios variables, jornada reducida, topes por convenio, etc.) que pueden alterar el resultado.
          </p>
        </div>
      </header>

      <div className="contenedor analizador__grid">
        <section className="analizador__panel no-impresion">
          <h2>Datos</h2>
          <div className="campo-fila">
            <div className="campo">
              <label>Fecha de inicio (alta)</label>
              <input type="date" value={datos.inicio} onChange={(e) => set('inicio', e.target.value)} />
            </div>
            <div className="campo">
              <label>Fecha del despido</label>
              <input type="date" value={datos.fin} onChange={(e) => set('fin', e.target.value)} />
            </div>
          </div>
          <div className="campo-fila">
            <div className="campo">
              <label>Salario bruto mensual (€)</label>
              <input
                type="number"
                value={datos.salarioMensual}
                onChange={(e) => set('salarioMensual', e.target.value)}
                placeholder="Ej. 1800"
              />
            </div>
            <div className="campo">
              <label>Nº de pagas al año</label>
              <input type="number" value={datos.pagas} onChange={(e) => set('pagas', e.target.value)} />
            </div>
          </div>
          <div className="campo">
            <label>Tipo de despido</label>
            <select value={datos.tipo} onChange={(e) => set('tipo', e.target.value)}>
              <option value="improcedente">Improcedente (33/45 días por año)</option>
              <option value="objetivo">Objetivo o colectivo (20 días por año)</option>
              <option value="procedente">Procedente / disciplinario (sin indemnización)</option>
            </select>
          </div>
          <p className="campo__ayuda">
            Indica el salario <strong>bruto mensual</strong> con prorrata de pagas si las cobras aparte; el
            salario diario regulador se calcula como salario anual ÷ 365.
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
                <p className="despido__sub">
                  {resultado.diasIndemnizacion.toFixed(0)} días de salario ·{' '}
                  {(resultado.diasIndemnizacion / 30).toFixed(1)} mensualidades
                </p>

                <table className="documento__tabla">
                  <tbody>
                    <tr>
                      <th>Antigüedad</th>
                      <td>
                        {resultado.antiguedad.años} años, {resultado.antiguedad.meses} meses y{' '}
                        {resultado.antiguedad.dias} días
                      </td>
                    </tr>
                    <tr>
                      <th>Salario diario regulador</th>
                      <td>{eur(resultado.salarioDiario)}</td>
                    </tr>
                    <tr>
                      <th>Salario anual bruto</th>
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
                            <td>{d.dias.toFixed(1)}</td>
                            <td>{eur(d.dias * resultado.salarioDiario)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}

                <p className="documento__obs" style={{ paddingLeft: 0 }}>{resultado.nota}</p>
              </>
            )}
          </article>
        </section>
      </div>
    </div>
  )
}
