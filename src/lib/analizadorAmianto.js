// Detección automática para el control del plan de trabajo con amianto.
// Marca cada punto como "Consta" si encuentra sus palabras clave, o "No consta"
// si no aparece ninguna. Es una ayuda; el técnico debe confirmar.

import { TODOS_AMIANTO } from '../data/amianto.js'

function normalizar(t) {
  return (t || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

export function analizarPlanAmianto(texto) {
  const norm = normalizar(texto)
  const sugerencias = {}
  const avisos = []

  if (norm.trim().length < 80) {
    return {
      sugerencias,
      avisos: [{ tipo: 'info', texto: 'Sube el plan o pega su texto completo para analizarlo.' }],
      meta: { palabras: 0 },
    }
  }

  for (const item of TODOS_AMIANTO) {
    const encontrada = item.claves.find((c) => norm.includes(normalizar(c)))
    if (encontrada) {
      sugerencias[item.id] = { estado: 'conforme', nota: `Consta en el plan (referencia detectada: “${encontrada}”).` }
    } else {
      sugerencias[item.id] = {
        estado: 'no_consta',
        nota: `No se aprecia en el texto. Verificar su inclusión (${item.fundamento}).`,
      }
    }
  }

  const faltan = TODOS_AMIANTO.filter((it) => sugerencias[it.id]?.estado === 'no_consta').length
  if (faltan > 0) {
    avisos.push({
      tipo: 'alerta',
      texto: `Hay ${faltan} apartado(s) que no constan en el plan. Revisa si deben subsanarse antes de aprobarlo.`,
    })
  }

  const palabras = norm.split(/\s+/).filter(Boolean).length
  return { sugerencias, avisos, meta: { palabras } }
}
