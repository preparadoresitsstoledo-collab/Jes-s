// Motor de detección automática (heurístico) para pre-marcar el cuadro de
// verificación a partir del texto del convenio.
//
// ⚠️ Es una AYUDA orientativa basada en coincidencias de texto, NO un dictamen
// jurídico. El inspector debe confirmar, corregir o completar cada punto.

import { SMI } from '../data/normativa.js'

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

  if (norm.trim().length < 80) {
    return {
      sugerencias,
      avisos: [
        {
          tipo: 'info',
          texto:
            'Pega el texto completo del convenio para que la detección automática pueda funcionar.',
        },
      ],
      meta: { palabras: 0, caracteres: norm.length },
    }
  }

  // 1) Clasificación profesional: categorías vs grupos profesionales (art. 22).
  const nCategorias = contar(norm, /categor[ií]as?\s+profesional(?:es)?/g) + contar(norm, /\bcategor[ií]as?\b/g)
  const nGrupos = contar(norm, /grupos?\s+profesional(?:es)?/g)
  if (nCategorias > 0 || nGrupos > 0) {
    if (nCategorias > nGrupos && nCategorias >= 2) {
      sugerencias.clasificacion_grupos = {
        estado: 'vulneracion',
        nota:
          `El convenio hace referencia a "categorías profesionales" en ${nCategorias} ocasiones, ` +
          `mientras que el término "grupo" se utiliza en ${nGrupos} ocasiones. Debe adscribirse a ` +
          'los grupos profesionales del art. 22 ET y, en su caso, subdividirse en especialidades ' +
          'profesionales, no en categorías. Debe adaptarse al propio artículo 22.',
      }
    } else if (nGrupos > 0) {
      sugerencias.clasificacion_grupos = {
        estado: 'conforme',
        nota: `Se regula la clasificación por grupos profesionales (término "grupo": ${nGrupos} apariciones).`,
      }
    }
  }

  // Jubilación forzosa / obligatoria por edad (DA 10ª ET).
  if (/jubilaci[oó]n\s+(forzosa|obligatoria)/.test(norm) || /jubilaci[oó]n[^.]{0,40}al cumplir[^.]{0,20}edad/.test(norm)) {
    sugerencias.jubilacion_forzosa = {
      estado: 'vulneracion',
      nota:
        'Se detecta una cláusula de jubilación forzosa/obligatoria por edad. Solo es válida si cumple ' +
        'los requisitos de la DA 10ª ET (derecho al 100 % de la pensión y compromiso de relevo ' +
        'generacional mediante contratación indefinida y a tiempo completo). Revisar su validez.',
    }
  }

  // Vacaciones e incapacidad temporal (art. 38.3 ET).
  if (/vacaciones/.test(norm) && /(incapacidad temporal|maternidad|embarazo|lactancia)/.test(norm)) {
    if (/(limit|hasta el 31|no podr[aá]n disfrutar|caducar)/.test(norm)) {
      sugerencias.vacaciones_it = {
        estado: 'vulneracion',
        nota:
          'Se regulan las vacaciones coincidentes con IT por embarazo, parto, lactancia o maternidad ' +
          'limitando el tiempo de disfrute, sin recoger lo previsto en el art. 38.3 ET (derecho a ' +
          'disfrutarlas en fecha distinta aunque haya terminado el año natural).',
      }
    }
  }

  // Contrato de obra o servicio (derogado desde 1-4-2022).
  if (/obra\s+o\s+servicio|obra\s+y\s+servicio/.test(norm)) {
    sugerencias.obra_servicio = {
      estado: 'vulneracion',
      nota:
        'Se regula el contrato para obra o servicio determinado, derogado desde el 1 de abril de 2022 ' +
        '(RDL 36/2021). Debe suprimirse o adaptarse a la nueva regulación de la contratación temporal.',
    }
  }

  // Plan de igualdad / medidas de igualdad (art. 85.1 ET).
  if (/plan de igualdad|igualdad de trato|igualdad de oportunidades|medidas? de igualdad/.test(norm)) {
    sugerencias.plan_igualdad = {
      estado: 'conforme',
      nota: 'El convenio contempla medidas de igualdad / plan de igualdad.',
    }
  } else if (/igualdad/.test(norm) === false) {
    sugerencias.plan_igualdad = {
      estado: 'no_regula',
      nota:
        'No se aprecian medidas dirigidas a promover la igualdad de trato y de oportunidades, exigidas ' +
        'por el art. 85.1 ET (contenido mínimo introducido por la LO 3/2007).',
    }
  }

  // Protocolo de acoso (art. 48 LO 3/2007).
  if (/acoso/.test(norm)) {
    if (/(protocolo|procedimiento)[^.]{0,60}acoso|acoso[^.]{0,60}(protocolo|procedimiento|denuncia)/.test(norm)) {
      sugerencias.protocolo_acoso = {
        estado: 'conforme',
        nota: 'Se incluyen procedimientos para la prevención y denuncia del acoso sexual y por razón de sexo.',
      }
    }
    if (/acoso[^.]{0,40}muy grave|muy grave[^.]{0,40}acoso/.test(norm)) {
      sugerencias.acoso_falta_grave = {
        estado: 'conforme',
        nota: 'Se tipifica el acoso sexual y por razón de sexo como infracción muy grave.',
      }
    }
  } else {
    sugerencias.protocolo_acoso = {
      estado: 'no_regula',
      nota:
        'No se recogen procedimientos específicos para la prevención y denuncia del acoso sexual y por ' +
        'razón de sexo (art. 48 LO 3/2007).',
    }
  }

  // Subrogación empresarial.
  if (/subrogaci[oó]n/.test(norm)) {
    sugerencias.subrogacion = {
      estado: 'conforme',
      nota: 'El convenio regula la subrogación empresarial; verificar su compatibilidad con el art. 44 ET.',
    }
  }

  // Salario inferior al SMI (avisa además de marcar el punto C).
  const importes = importesEuros(norm).filter((v) => v >= 300 && v <= 6000)
  if (importes.length) {
    const minMensual = Math.min(...importes)
    if (minMensual < smiMensual) {
      avisos.push({
        tipo: 'alerta',
        texto:
          `Se detecta un importe de ${minMensual.toLocaleString('es-ES')} € que podría ser inferior al SMI ` +
          `vigente (${smiMensual.toLocaleString('es-ES')} €/mes). Verificar tablas salariales (art. 27 ET).`,
      })
      sugerencias.retrib_c = {
        estado: 'vulneracion',
        nota: `Posible salario inferior al SMI (${smiMensual.toLocaleString('es-ES')} €/mes). Importe detectado: ${minMensual.toLocaleString('es-ES')} €.`,
      }
    }
  }

  const palabras = norm.split(/\s+/).filter(Boolean).length
  return { sugerencias, avisos, meta: { palabras, caracteres: texto.length } }
}
