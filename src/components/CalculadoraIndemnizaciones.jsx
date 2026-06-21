import { useMemo, useState } from 'react'
import {
  REGIMENES,
  OTRAS_RELACIONES,
  TIPOS_CONTRATO,
  buscarCausa,
} from '../data/indemnizaciones.js'
import {
  calcular,
  formatoEuros,
  formatoNumero,
} from '../lib/calcIndemnizacion.js'

function antiguedadTexto(a) {
  if (!a) return '—'
  const partes = []
  if (a.años) partes.push(`${a.años} ${a.años === 1 ? 'año' : 'años'}`)
  if (a.meses) partes.push(`${a.meses} ${a.meses === 1 ? 'mes' : 'meses'}`)
  if (a.dias) partes.push(`${a.dias} ${a.dias === 1 ? 'día' : 'días'}`)
  return partes.length ? partes.join(', ') : '0 días'
}

function periodoTexto(p) {
  return antiguedadTexto(p)
}

export default function CalculadoraIndemnizaciones() {
  const [regimenId, setRegimenId] = useState('comun')
  const [causaId, setCausaId] = useState('improcedente')
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [salarioTipo, setSalarioTipo] = useState('mensual')
  const [importe, setImporte] = useState('')
  const [tipoContrato, setTipoContrato] = useState('completa')
  const [diasNoComputables, setDiasNoComputables] = useState('')
  const [resultado, setResultado] = useState(null)
  const [error, setError] = useState('')

  const regimen = useMemo(
    () => REGIMENES.find((r) => r.id === regimenId) || REGIMENES[0],
    [regimenId],
  )
  const causa = useMemo(
    () => buscarCausa(regimenId, causaId) || regimen.causas[0],
    [regimenId, causaId, regimen],
  )
  const tipoContratoObj = useMemo(
    () => TIPOS_CONTRATO.find((t) => t.id === tipoContrato) || TIPOS_CONTRATO[0],
    [tipoContrato],
  )
  const muestraNoComputable =
    tipoContrato === 'fijodiscontinuo' || tipoContrato === 'excedencia'

  function onCambiaRegimen(id) {
    setRegimenId(id)
    const reg = REGIMENES.find((r) => r.id === id)
    setCausaId(reg ? reg.causas[0].id : '')
    setResultado(null)
    setError('')
  }

  function consultar(e) {
    e?.preventDefault()
    setError('')
    const res = calcular({
      fechaInicio,
      fechaFin,
      salarioImporte: Number(String(importe).replace(',', '.')),
      salarioTipo,
      causa,
      diasNoComputables: muestraNoComputable
        ? Number(String(diasNoComputables).replace(',', '.')) || 0
        : 0,
    })
    if (!res.ok) {
      setError(res.error)
      setResultado(null)
      return
    }
    setResultado(res)
  }

  function limpiar() {
    setFechaInicio('')
    setFechaFin('')
    setImporte('')
    setDiasNoComputables('')
    setResultado(null)
    setError('')
  }

  function imprimir() {
    window.print()
  }

  return (
    <div className="analizador calc">
      <header className="analizador__hero no-impresion">
        <div className="contenedor">
          <a className="analizador__volver" href="#/herramientas">
            ← Volver a herramientas
          </a>
          <h1>Cálculo de indemnizaciones por extinción del contrato</h1>
          <p className="analizador__lema">
            Formulario para el <strong>cálculo de la cuantía de las indemnizaciones laborales</strong> por
            extinción del contrato de trabajo, conforme al <strong>Estatuto de los Trabajadores</strong> y
            a las normas de las relaciones laborales de carácter especial. Introduce las fechas de la
            relación, el salario y la causa de extinción.
          </p>
          <p className="analizador__aviso-legal">
            ⚖️ Herramienta meramente <strong>orientativa e informativa</strong>. Los resultados{' '}
            <strong>no son vinculantes</strong> ni constituyen asesoramiento jurídico. La cuantía
            definitiva depende del salario regulador, de la calificación judicial del despido y de los
            pactos individuales o de convenio. Ante un caso real, consulta con un profesional.
          </p>
        </div>
      </header>

      <div className="contenedor analizador__grid">
        {/* Columna del formulario */}
        <section className="analizador__panel no-impresion">
          <form onSubmit={consultar}>
            <h2>1. Régimen y causa de extinción</h2>
            <div className="campo">
              <label>Régimen / tipo de relación laboral *</label>
              <select
                className="chip"
                value={regimenId}
                onChange={(e) => onCambiaRegimen(e.target.value)}
              >
                {REGIMENES.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.relacionEspecial ? 'Especial · ' : ''}
                    {r.nombre}
                  </option>
                ))}
              </select>
              <p className="campo__ayuda">{regimen.descripcion}</p>
            </div>

            <div className="campo">
              <label>Causa de extinción *</label>
              <select
                className="chip"
                value={causaId}
                onChange={(e) => {
                  setCausaId(e.target.value)
                  setResultado(null)
                }}
              >
                {regimen.causas.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
              <p className="campo__ayuda">
                {causa.descripcion}
                {causa.genera && (
                  <>
                    {' '}
                    <strong>
                      Módulo: {causa.modulo} días/año
                      {causa.topeMensualidades
                        ? `, tope ${causa.topeMensualidades} mensualidades`
                        : ', sin tope legal fijo'}
                      {causa.transitorio ? ' (régimen transitorio 45/33 días)' : ''}
                      .
                    </strong>
                  </>
                )}
              </p>
              <p className="calc__base">Base legal: {causa.baseLegal}</p>
              {causa.nota && <p className="aviso aviso--info">{causa.nota}</p>}
            </div>

            <h2>2. Datos de la relación laboral</h2>
            <div className="campo-fila">
              <div className="campo">
                <label>Fecha de inicio *</label>
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  required
                />
              </div>
              <div className="campo">
                <label>Fecha de finalización *</label>
                <input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="campo">
              <label>Salario bruto *</label>
              <div className="calc__radios">
                {[
                  ['diario', 'Diario'],
                  ['mensual', 'Mensual'],
                  ['anual', 'Anual'],
                ].map(([val, txt]) => (
                  <label key={val} className="calc__radio">
                    <input
                      type="radio"
                      name="salarioTipo"
                      value={val}
                      checked={salarioTipo === val}
                      onChange={(e) => setSalarioTipo(e.target.value)}
                    />
                    {txt}
                  </label>
                ))}
              </div>
              <p className="campo__ayuda">
                En los importes diario y mensual, el salario bruto debe incluir el prorrateo de las
                pagas extraordinarias.
              </p>
            </div>

            <div className="campo">
              <label>Importe del salario (€) *</label>
              <input
                type="text"
                inputMode="decimal"
                value={importe}
                onChange={(e) => setImporte(e.target.value)}
                placeholder="Ej.: 2000.5 o 2000,5"
              />
            </div>

            <h2>3. Tipo de contrato (variantes)</h2>
            <div className="campo">
              <label>Modalidad / jornada</label>
              <select
                className="chip"
                value={tipoContrato}
                onChange={(e) => {
                  setTipoContrato(e.target.value)
                  setResultado(null)
                }}
              >
                {TIPOS_CONTRATO.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nombre}
                  </option>
                ))}
              </select>
              {tipoContratoObj.nota && (
                <p className="aviso aviso--info">{tipoContratoObj.nota}</p>
              )}
            </div>

            {muestraNoComputable && (
              <div className="campo">
                <label>Tiempo no computable a efectos de indemnización (días)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={diasNoComputables}
                  onChange={(e) => setDiasNoComputables(e.target.value)}
                  placeholder="Ej.: 180 (días de inactividad / excedencia)"
                />
                <p className="campo__ayuda">
                  Estos días se descuentan de la antigüedad computable para la indemnización.
                </p>
              </div>
            )}

            <div className="analizador__acciones">
              <button type="submit" className="btn btn--primario">
                Consultar
              </button>
              <button type="button" className="btn btn--texto" onClick={limpiar}>
                Limpiar formulario
              </button>
            </div>

            {error && <p className="aviso aviso--alerta">{error}</p>}
          </form>
        </section>

        {/* Columna del resultado / informe */}
        <section className="analizador__informe calc__informe">
          {!resultado && (
            <div className="calc__placeholder no-impresion">
              <p>
                Rellena el formulario y pulsa <strong>Consultar</strong> para ver el desglose de la
                indemnización orientativa.
              </p>
            </div>
          )}

          {resultado && (
            <article className="calc__resultado">
              <div className="calc__informe-cabecera">
                <h2>Resultado orientativo</h2>
                <button className="btn btn--secundario no-impresion" onClick={imprimir}>
                  🖨️ Imprimir / guardar PDF
                </button>
              </div>

              <p className="calc__causa-titulo">
                {regimen.nombre} · {causa.nombre}
              </p>

              {!resultado.genera ? (
                <div className="calc__cifra calc__cifra--cero">
                  <span className="calc__importe">{formatoEuros(0)}</span>
                  <p>
                    Esta causa de extinción <strong>no genera derecho a indemnización</strong> tasada.
                  </p>
                  <p className="calc__base">Base legal: {causa.baseLegal}</p>
                </div>
              ) : (
                <>
                  <div className="calc__cifra">
                    <span className="calc__importe">{formatoEuros(resultado.importe)}</span>
                    <span className="calc__importe-sub">
                      {formatoNumero(resultado.dias)} días de salario ·{' '}
                      {formatoNumero(resultado.mensualidades)} mensualidades
                    </span>
                  </div>

                  <table className="calc__tabla">
                    <tbody>
                      <tr>
                        <th>Antigüedad (de fecha a fecha)</th>
                        <td>{antiguedadTexto(resultado.antiguedad)}</td>
                      </tr>
                      {resultado.diasNoComputables > 0 && (
                        <tr>
                          <th>Tiempo no computable descontado</th>
                          <td>{formatoNumero(resultado.diasNoComputables, 0)} días</td>
                        </tr>
                      )}
                      <tr>
                        <th>Salario regulador diario</th>
                        <td>{formatoEuros(resultado.salarioDiario)}</td>
                      </tr>
                      <tr>
                        <th>Salario mensual de referencia</th>
                        <td>{formatoEuros(resultado.salarioMensual)}</td>
                      </tr>
                    </tbody>
                  </table>

                  <h3>Desglose del cálculo</h3>

                  {resultado.regimen === 'transitorio' ? (
                    <table className="calc__tabla calc__tabla--tramos">
                      <thead>
                        <tr>
                          <th>Tramo</th>
                          <th>Periodo</th>
                          <th>Días de salario</th>
                        </tr>
                      </thead>
                      <tbody>
                        {resultado.tramos.map((t, i) => (
                          <tr key={i}>
                            <td>{t.etiqueta}</td>
                            <td>{periodoTexto(t.periodo)}</td>
                            <td>{formatoNumero(t.dias)}</td>
                          </tr>
                        ))}
                        <tr className="calc__tabla-total">
                          <td colSpan={2}>Total días (antes de tope)</td>
                          <td>{formatoNumero(resultado.diasBrutos)}</td>
                        </tr>
                      </tbody>
                    </table>
                  ) : (
                    <table className="calc__tabla calc__tabla--tramos">
                      <tbody>
                        <tr>
                          <th>Módulo</th>
                          <td>{resultado.modulo} días por año de servicio</td>
                        </tr>
                        <tr>
                          <th>Antigüedad computable</th>
                          <td>{periodoTexto(resultado.periodoComputable)}</td>
                        </tr>
                        <tr>
                          <th>Días de salario (antes de tope)</th>
                          <td>{formatoNumero(resultado.diasBrutos)}</td>
                        </tr>
                      </tbody>
                    </table>
                  )}

                  {resultado.hayTope ? (
                    <p className="aviso aviso--ambar">
                      ⚠️ Se ha aplicado el tope legal: la indemnización se limita a{' '}
                      <strong>{formatoNumero(resultado.topeDias)} días</strong> de salario
                      {resultado.regimen === 'transitorio' && resultado.motivoTope
                        ? `. ${resultado.motivoTope}`
                        : resultado.topeMensualidades
                          ? ` (${resultado.topeMensualidades} mensualidades).`
                          : '.'}
                    </p>
                  ) : (
                    <p className="campo__ayuda">No se ha alcanzado el tope legal.</p>
                  )}

                  <p className="calc__formula">
                    Indemnización = {formatoNumero(resultado.dias)} días ×{' '}
                    {formatoEuros(resultado.salarioDiario)}/día ={' '}
                    <strong>{formatoEuros(resultado.importe)}</strong>
                  </p>

                  <h3>Fundamento legal</h3>
                  <p className="calc__base">{causa.baseLegal}</p>
                  <p>{causa.descripcion}</p>
                  {causa.nota && <p className="aviso aviso--info">{causa.nota}</p>}
                  {tipoContratoObj.nota && (
                    <p className="aviso aviso--info">{tipoContratoObj.nota}</p>
                  )}
                </>
              )}

              <p className="calc__disclaimer">
                ⚖️ Cálculo orientativo según la doctrina del Tribunal Supremo sobre el módulo
                indemnizatorio (prorrateo por meses, computándose como mes completo la fracción de mes)
                y el régimen transitorio de la DT 11ª ET. No es vinculante ni sustituye el
                asesoramiento jurídico profesional.
              </p>
            </article>
          )}
        </section>
      </div>

      <div className="contenedor calc__otras no-impresion">
        <h2>Otras relaciones laborales de carácter especial (art. 2 ET)</h2>
        <p className="campo__ayuda">
          Estas relaciones especiales no disponen de un módulo indemnizatorio propio en el formulario:
          su extinción se rige por el Estatuto de los Trabajadores con especialidades o no genera
          indemnización tasada.
        </p>
        <ul className="calc__otras-lista">
          {OTRAS_RELACIONES.map((o) => (
            <li key={o.nombre}>
              <strong>{o.nombre}</strong> <span className="calc__base">({o.norma})</span>
              <br />
              {o.nota}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
