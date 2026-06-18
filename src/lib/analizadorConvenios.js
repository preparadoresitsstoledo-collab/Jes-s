// Motor de detección automática (heurístico) para pre-marcar el cuadro de
// verificación a partir del texto del convenio.
//
// ⚠️ Es una AYUDA orientativa basada en coincidencias de texto, NO un dictamen
// jurídico. El inspector debe confirmar, corregir o completar cada punto.
//
// Criterio de precisión:
//   · Solo se PRE-MARCA el cuadro cuando la señal es razonablemente fiable.
//   · Las simples menciones de una figura (que pueden o no infringir la ley)
//     se emiten como AVISOS para que el inspector las revise, sin marcar.

import { SMI, LIMITES } from '../data/normativa.js'

// Normaliza: minúsculas y sin acentos, para comparar de forma robusta.
function normalizar(t) {
  return (t || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

// Cuenta apariciones de una expresión regular global.
function contar(norm, re) {
  const m = norm.match(re)
  return m ? m.length : 0
}

// Convierte "1.184,50" → 1184.5
function numES(s) {
  if (!s) return NaN
  return parseFloat(s.replace(/\./g, '').replace(/,/g, '.'))
}

// Extrae importes en euros del texto.
function importesEuros(norm) {
  const re = /(\d{1,3}(?:\.\d{3})+(?:,\d+)?|\d+(?:,\d+)?)\s*(?:€|euros?)/g
  const out = []
  let m
  while ((m = re.exec(norm)) !== null) {
    const v = numES(m[1])
    if (!Number.isNaN(v)) out.push(v)
  }
  return out
}

// Devuelve el primer número que aparezca cerca de una expresión.
function numeroJunto(norm, fuente) {
  const m = norm.match(fuente)
  if (!m) return null
  for (let i = 1; i < m.length; i++) {
    if (m[i] != null) {
      const v = numES(m[i])
      if (!Number.isNaN(v)) return v
    }
  }
  return null
}

/**
 * Analiza el texto del convenio y devuelve sugerencias por punto del cuadro.
 * @param {string} texto  Texto del convenio.
 * @param {object} opciones  { smiMensual }
 * @returns {{ sugerencias: Object, avisos: Array, meta: object }}
 */
export function analizarConvenio(texto, opciones = {}) {
  const smiMensual = opciones.smiMensual || SMI.mensual
  const norm = normalizar(texto)
  const sugerencias = {}
  const avisos = []

  // Marca un punto del cuadro (no sobreescribe una marca previa más fuerte).
  const marcar = (id, estado, nota) => {
    sugerencias[id] = { estado, nota }
  }
  const avisar = (tipo, texto) => avisos.push({ tipo, texto })

  if (norm.trim().length < 80) {
    return {
      sugerencias,
      avisos: [
        {
          tipo: 'info',
          texto:
            'Sube el convenio o pega su texto completo para que la detección automática pueda funcionar.',
        },
      ],
      meta: { palabras: 0, caracteres: norm.length },
    }
  }

  // ───────────────────────────── Clasificación profesional (art. 22)
  const nCategorias = contar(norm, /\bcategor[ií]as?\b/g)
  const nGrupos = contar(norm, /grupos?\s+profesional(?:es)?/g)
  if (nCategorias > 0 || nGrupos > 0) {
    if (nCategorias > nGrupos && nCategorias >= 2) {
      marcar(
        'clasificacion_grupos',
        'vulneracion',
        `El convenio hace referencia a "categorías profesionales" en ${nCategorias} ocasiones, ` +
          `mientras que el término "grupo" se utiliza en ${nGrupos} ocasiones. Debe adscribirse a ` +
          'los grupos profesionales del art. 22 ET y, en su caso, subdividirse en especialidades ' +
          'profesionales, no en categorías. Debe adaptarse al propio artículo 22.',
      )
    } else if (nGrupos > 0) {
      marcar(
        'clasificacion_grupos',
        'conforme',
        `Se regula la clasificación por grupos profesionales (término "grupo": ${nGrupos} apariciones).`,
      )
    }
  }

  // ───────────────────────────── Jubilación forzosa (DA 10ª)
  if (
    /jubilaci[oó]n\s+(forzosa|obligatoria)/.test(norm) ||
    /jubilaci[oó]n[^.]{0,40}al cumplir[^.]{0,20}edad/.test(norm)
  ) {
    marcar(
      'jubilacion_forzosa',
      'vulneracion',
      'Se detecta una cláusula de jubilación forzosa/obligatoria por edad. Solo es válida si cumple ' +
        'los requisitos de la DA 10ª ET (derecho al 100 % de la pensión y compromiso de relevo ' +
        'generacional mediante contratación indefinida y a tiempo completo). Revisar su validez.',
    )
  }

  // ───────────────────────────── MSCT (art. 41)
  if (/modificaci[oó]n sustancial/.test(norm)) {
    marcar(
      'msct',
      'vulneracion',
      '⚠️ Revisar: se regula la modificación sustancial de condiciones de trabajo; comprobar que no ' +
        'es menos favorable que el art. 41 ET.',
    )
  }

  // ───────────────────────────── Vacaciones e IT (art. 38.3)
  if (/vacaciones/.test(norm) && /(incapacidad temporal|maternidad|embarazo|lactancia)/.test(norm)) {
    if (/(limit|hasta el 31|no podr[aá]n disfrutar|caducar)/.test(norm)) {
      marcar(
        'vacaciones_it',
        'vulneracion',
        'Se regulan las vacaciones coincidentes con IT por embarazo, parto, lactancia o maternidad ' +
          'limitando el tiempo de disfrute, sin recoger lo previsto en el art. 38.3 ET (derecho a ' +
          'disfrutarlas en fecha distinta aunque haya terminado el año natural).',
      )
    }
  }

  // ───────────────────────────── Vacaciones: mínimo 30 días naturales (art. 38.1)
  const diasVac = numeroJunto(
    norm,
    /vacaciones[^.]{0,60}?(\d{1,3})\s*d[ií]as|(\d{1,3})\s*d[ií]as[^.]{0,40}vacaciones/,
  )
  if (diasVac != null && diasVac >= 15 && diasVac < LIMITES.vacacionesMin && /naturales/.test(norm)) {
    avisar(
      'alerta',
      `Se detectan ${diasVac} días naturales de vacaciones, por debajo del mínimo de 30 días ` +
        'naturales del art. 38.1 ET. Verificar (puede tratarse de días laborables).',
    )
  }

  // ───────────────────────────── Reducción de jornada por guarda legal (art. 37.6)
  if (/reducci[oó]n de (la )?jornada/.test(norm)) {
    if (/37\.?6/.test(norm)) {
      marcar('reduccion_376', 'conforme', 'Se contempla la reducción de jornada con remisión al art. 37.6 ET.')
    }
    if (/(doce|12)\s*a[nñ]os/.test(norm)) {
      marcar('reduccion_12', 'conforme', 'Se regula hasta los 12 años del menor.')
    }
    if (/c[aá]ncer|enfermedad grave/.test(norm)) {
      marcar('reduccion_cancer', 'conforme', 'Se incluyen supuestos de menores con cáncer / enfermedad grave.')
    }
  }

  // ───────────────────────────── Permisos y licencias (art. 37.3)
  if (/37\.?3/.test(norm) && /(permiso|licencia)/.test(norm)) {
    marcar('permisos_373', 'conforme', 'Los permisos y licencias remiten al art. 37.3 ET.')
  }

  // ───────────────────────────── Contratación temporal
  if (/obra\s+[oy]\s+servicio/.test(norm)) {
    marcar(
      'obra_servicio',
      'vulneracion',
      'Se regula el contrato para obra o servicio determinado, derogado desde el 1 de abril de 2022 ' +
        '(RDL 36/2021). Debe suprimirse o adaptarse a la nueva regulación de la contratación temporal.',
    )
  }
  if (/contrato[s]? eventual|eventual por circunstancias/.test(norm)) {
    marcar('contrato_eventual', 'vulneracion', '⚠️ Revisar: contrato eventual; comprobar su adecuación al art. 15.2 ET.')
  }
  if (/fijos?\s+discontinu/.test(norm)) {
    marcar('fijos_discontinuos', 'vulneracion', '⚠️ Revisar: contratos fijos discontinuos; comprobar su adecuación al art. 16 ET.')
  }
  if (/contrato[s]? formativ|en pr[aá]cticas|para la formaci[oó]n/.test(norm)) {
    marcar('formativos', 'vulneracion', '⚠️ Revisar: contratos formativos; comprobar su adecuación al art. 11 ET.')
  }
  if (/jubilaci[oó]n parcial|contrato de relevo/.test(norm)) {
    marcar('jubilacion_parcial', 'vulneracion', '⚠️ Revisar: jubilación parcial / contrato de relevo; comprobar el art. 12.6 y 7 ET.')
  }

  // ───────────────────────────── Movilidad funcional (art. 39)
  if (/movilidad funcional/.test(norm)) {
    marcar('movilidad_funcional', 'vulneracion', '⚠️ Revisar: movilidad funcional; comprobar los límites del art. 39 ET.')
  }

  // ───────────────────────────── Excedencia por cuidado de hijos (art. 46.3)
  if (/excedencia[^.]{0,80}(cuidado de hijos|hijo|familiar)/.test(norm)) {
    marcar(
      'excedencia_simultanea',
      'vulneracion',
      '⚠️ Revisar: excedencia por cuidado de hijos/familiares; comprobar que no limita el derecho ' +
        'sin razones justificadas (art. 46.3 ET).',
    )
  }

  // ───────────────────────────── Subrogación (art. 44)
  if (/subrogaci[oó]n/.test(norm)) {
    marcar('subrogacion', 'conforme', 'El convenio regula la subrogación empresarial; verificar su compatibilidad con el art. 44 ET.')
  }

  // ───────────────────────────── Tiempo de trabajo y descansos (art. 34)
  const descansoJornadas = numeroJunto(
    norm,
    /descanso[^.]{0,40}?(\d{1,2})\s*horas[^.]{0,30}(entre jornada|jornadas)|(\d{1,2})\s*horas[^.]{0,30}entre jornada/,
  )
  if (descansoJornadas != null && descansoJornadas < LIMITES.descansoEntreJornadas) {
    marcar(
      'descansos',
      'vulneracion',
      `Se fija un descanso entre jornadas de ${descansoJornadas} horas, inferior al mínimo de 12 ` +
        'horas del art. 34.3 ET.',
    )
  }
  const jornadaSemanal = numeroJunto(
    norm,
    /(\d{2}(?:,\d+)?)\s*horas[^.]{0,20}(semana|semanal)|jornada[^.]{0,30}?(\d{2}(?:,\d+)?)\s*horas[^.]{0,20}semana/,
  )
  if (jornadaSemanal != null && jornadaSemanal > LIMITES.jornadaMaxSemanal) {
    avisar(
      'alerta',
      `Se detecta una jornada de ${jornadaSemanal} horas semanales, superior a las 40 horas de promedio ` +
        'en cómputo anual del art. 34.1 ET. Verificar.',
    )
  }
  const horasExtra = numeroJunto(
    norm,
    /horas\s+extraordinarias[^.]{0,60}?(\d{1,3})|(\d{1,3})\s*horas\s+extraordinarias/,
  )
  if (horasExtra != null && horasExtra > LIMITES.horasExtraMax) {
    avisar(
      'alerta',
      `Se detectan ${horasExtra} horas extraordinarias, por encima del máximo de 80 al año del art. 35.2 ET.`,
    )
  }

  // ───────────────────────────── Régimen disciplinario: prescripción (art. 60)
  if (/prescrip/.test(norm) && /(falta|infraccion)/.test(norm)) {
    marcar(
      'prescripcion_faltas',
      'vulneracion',
      '⚠️ Revisar: prescripción de faltas; comprobar que no supera los plazos del art. 60 ET ' +
        '(leves 10 días, graves 20 días, muy graves 60 días).',
    )
  }
  if (/acoso[^.]{0,40}muy grave|muy grave[^.]{0,40}acoso/.test(norm)) {
    marcar('acoso_falta_grave', 'conforme', 'Se tipifica el acoso sexual y por razón de sexo como infracción muy grave.')
  }

  // ───────────────────────────── Igualdad (art. 85.1)
  if (/plan de igualdad|igualdad de trato|igualdad de oportunidades|medidas? de igualdad/.test(norm)) {
    marcar('plan_igualdad', 'conforme', 'El convenio contempla medidas de igualdad / plan de igualdad.')
  } else if (!/igualdad/.test(norm)) {
    marcar(
      'plan_igualdad',
      'no_regula',
      'No se aprecian medidas dirigidas a promover la igualdad de trato y de oportunidades, exigidas ' +
        'por el art. 85.1 ET (contenido mínimo introducido por la LO 3/2007).',
    )
  }

  // ───────────────────────────── Protocolo de acoso (art. 48 LO 3/2007)
  if (/acoso/.test(norm)) {
    if (/(protocolo|procedimiento)[^.]{0,60}acoso|acoso[^.]{0,60}(protocolo|procedimiento|denuncia)/.test(norm)) {
      marcar(
        'protocolo_acoso',
        'conforme',
        'Se incluyen procedimientos para la prevención y denuncia del acoso sexual y por razón de sexo.',
      )
    }
  } else {
    marcar(
      'protocolo_acoso',
      'no_regula',
      'No se recogen procedimientos específicos para la prevención y denuncia del acoso sexual y por ' +
        'razón de sexo (art. 48 LO 3/2007).',
    )
  }

  // ───────────────────────────── Lactancia acumulada (art. 37.4)
  if (/lactancia/.test(norm) && /acumul/.test(norm)) {
    const diasLact = numeroJunto(norm, /acumul[^.]{0,40}?(\d{1,2})\s*d[ií]as|(\d{1,2})\s*d[ií]as[^.]{0,30}lactancia/)
    if (diasLact != null) {
      marcar('lactancia_acumulacion', 'conforme', `Se fija la acumulación de la lactancia (${diasLact} días).`)
    } else {
      marcar(
        'lactancia_acumulacion',
        'vulneracion',
        'Se acuerda la acumulación de la lactancia pero no se aprecia el número concreto de días.',
      )
    }
  }

  // ───────────────────────────── Diferencias retributivas (modo agresivo)
  if (/nuevo ingreso|nuevos ingresos|doble escala|nueva contrataci[oó]n/.test(norm)) {
    marcar('retrib_a', 'vulneracion', '⚠️ Revisar: posibles diferencias retributivas para personal de nuevo ingreso sin justificación objetiva.')
  }
  if (/(por raz[oó]n de edad|en funci[oó]n de la edad|seg[uú]n la edad)/.test(norm)) {
    marcar('retrib_b', 'vulneracion', '⚠️ Revisar: posible desigualdad retributiva por razón de edad.')
  }
  if (/festivo/.test(norm)) {
    marcar('retrib_d', 'vulneracion', '⚠️ Revisar: comprobar que la compensación por trabajo en festivo no es inferior a la fijada en convenio.')
  }
  if (/(permiso|licencia)/.test(norm) && /(no retribuid|sin retribuci|no remunerad)/.test(norm)) {
    marcar('retrib_e', 'vulneracion', '⚠️ Revisar: posible retribución inferior a la legal durante los permisos del art. 37.3 ET.')
  }
  if (/vacaciones/.test(norm) && /compensaci[oó]n econ[oó]mica/.test(norm)) {
    marcar('retrib_f', 'vulneracion', '⚠️ Revisar: posible sustitución de vacaciones por compensación económica (art. 38.1 ET).')
  }

  // ───────────────────────────── Salario inferior al SMI (art. 27)
  const importes = importesEuros(norm).filter((v) => v >= 300 && v <= 6000)
  if (importes.length) {
    const minMensual = Math.min(...importes)
    if (minMensual < smiMensual) {
      avisar(
        'alerta',
        `Se detecta un importe de ${minMensual.toLocaleString('es-ES')} € que podría ser inferior al SMI ` +
          `vigente (${smiMensual.toLocaleString('es-ES')} €/mes). Verificar tablas salariales (art. 27 ET).`,
      )
      marcar(
        'retrib_c',
        'vulneracion',
        `Posible salario inferior al SMI (${smiMensual.toLocaleString('es-ES')} €/mes). Importe detectado: ${minMensual.toLocaleString('es-ES')} €.`,
      )
    }
  }

  const palabras = norm.split(/\s+/).filter(Boolean).length
  return { sugerencias, avisos, meta: { palabras, caracteres: texto.length } }
}
