import { useState } from 'react'
import { calcularIndemnizacion, RELACIONES } from '../lib/indemnizacion.js'

const eur = (n) =>
  n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 })

export default function CalculadoraDespido() {
  const [datos, setDatos] = useState({
    inicio: '',
    fin: new Date().toISOString().slice(0, 10),
    salarioMensual: '',
    pagas: 14,
    relacion: 'comun',
    tipo: 'improcedente',
  })
  const [resultado, setResultado] = useState(null)

  const set = (campo, valor) => setDatos((d) => ({ ...d, [campo]: valor }))

  // Al cambiar la relación laboral, se ajusta la lista de modalidades de extinción.
  const cambiarRelacion = (rel) =>
    setDatos((d) => ({ ...d, relacion: rel, tipo: RELACIONES[rel].tipos[0].k }))

  const tiposDisponibles = RELACIONES[datos.relacion].tipos

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
            Estima la indemnización según la relación laboral, la modalidad de extinción y la
            antigüedad: régimen común del Estatuto de los Trabajadores (con el transitorio 45/33 días
            de 2012) y las <strong>relaciones laborales de carácter especial</strong> (alta dirección,
            hogar, deportistas, artistas, representantes de comercio y otras del art. 2 ET).
          </p>
          <p className="analizador__aviso-legal">
            ⚖️ Cálculo orientativo. No sustituye el asesoramiento jurídico: hay indemnizaciones
            pactadas o fijadas judicialmente, salarios variables, topes por convenio y peculiaridades
            de cada régimen especial que pueden alterar el resultado.
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
            <label>Relación laboral</label>
            <select value={datos.relacion} onChange={(e) => cambiarRelacion(e.target.value)}>
              {Object.entries(RELACIONES).map(([k, r]) => (
                <option key={k} value={k}>{r.nombre}</option>
              ))}
            </select>
          </div>
          <div className="campo">
            <label>Modalidad de extinción</label>
            <select value={datos.tipo} onChange={(e) => set('tipo', e.target.value)}>
              {tiposDisponibles.map((t) => (
                <option key={t.k} value={t.k}>{t.label}</option>
              ))}
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
