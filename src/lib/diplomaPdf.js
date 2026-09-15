/**
 * Generación del diploma en PDF (A4 apaisado) en el navegador con jsPDF.
 * Se carga bajo demanda para no engordar la web principal.
 */

const AZUL = [11, 37, 69]
const AZUL_MEDIO = [29, 78, 137]
const DORADO = [201, 162, 39]
const GRIS = [58, 58, 58]
const GRIS_CLARO = [107, 114, 128]

export function formatearFecha(iso) {
  if (!iso) return ''
  const [a, m, d] = String(iso).split('-').map(Number)
  if (!a || !m || !d) return String(iso)
  const fecha = new Date(a, m - 1, d)
  return fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
}

async function cargarImagen(url) {
  try {
    const resp = await fetch(url)
    if (!resp.ok) return null
    const blob = await resp.blob()
    return await new Promise((resolve) => {
      const lector = new FileReader()
      lector.onload = () => resolve(lector.result)
      lector.onerror = () => resolve(null)
      lector.readAsDataURL(blob)
    })
  } catch {
    return null
  }
}

function nombreArchivo(diploma) {
  const base = `diploma-${diploma.nombre || 'asistente'}`
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
  return `${base}.pdf`
}

/**
 * Construye el PDF del diploma. Devuelve la instancia de jsPDF.
 * @param {object} diploma datos descifrados del diploma
 * @param {object} opciones { logoUrl, codigo }
 */
export async function construirDiplomaPdf(diploma, opciones = {}) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  const ancho = doc.internal.pageSize.getWidth() // 297
  const alto = doc.internal.pageSize.getHeight() // 210
  const centro = ancho / 2

  // Fondo y marco
  doc.setFillColor(255, 255, 255)
  doc.rect(0, 0, ancho, alto, 'F')
  doc.setDrawColor(...AZUL)
  doc.setLineWidth(1.2)
  doc.rect(10, 10, ancho - 20, alto - 20)
  doc.setDrawColor(...DORADO)
  doc.setLineWidth(0.5)
  doc.rect(13, 13, ancho - 26, alto - 26)

  // Franja lateral dorada
  doc.setFillColor(...DORADO)
  doc.rect(10, 10, 4, alto - 20, 'F')

  // Logo
  const logo = opciones.logoUrl ? await cargarImagen(opciones.logoUrl) : null
  if (logo) {
    doc.addImage(logo, 'PNG', centro - 14, 20, 28, 28)
  }

  let y = logo ? 58 : 34

  // Organizador
  if (diploma.organizador) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(...AZUL_MEDIO)
    doc.text(String(diploma.organizador).toUpperCase(), centro, y, { align: 'center' })
    y += 10
  }

  // Título
  doc.setFont('times', 'bold')
  doc.setFontSize(34)
  doc.setTextColor(...AZUL)
  doc.text(diploma.tipo || 'DIPLOMA DE ASISTENCIA', centro, y, { align: 'center' })
  y += 6
  doc.setDrawColor(...DORADO)
  doc.setLineWidth(0.8)
  doc.line(centro - 40, y, centro + 40, y)
  y += 12

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(12)
  doc.setTextColor(...GRIS)
  doc.text('Se certifica que', centro, y, { align: 'center' })
  y += 14

  // Nombre
  doc.setFont('times', 'bolditalic')
  doc.setFontSize(28)
  doc.setTextColor(...AZUL)
  const nombre = diploma.nombre || ''
  doc.text(nombre, centro, y, { align: 'center' })
  const anchoNombre = doc.getTextWidth(nombre)
  doc.setDrawColor(...GRIS_CLARO)
  doc.setLineWidth(0.3)
  doc.line(centro - anchoNombre / 2 - 6, y + 2.5, centro + anchoNombre / 2 + 6, y + 2.5)
  y += 8
  if (diploma.documento) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(...GRIS_CLARO)
    doc.text(`con documento n.º ${diploma.documento}`, centro, y + 1, { align: 'center' })
    y += 6
  }
  y += 8

  // Texto del curso
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(12)
  doc.setTextColor(...GRIS)
  const verbo = diploma.verbo || 'ha asistido a'
  doc.text(verbo, centro, y, { align: 'center' })
  y += 9

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(17)
  doc.setTextColor(...AZUL_MEDIO)
  const lineasCurso = doc.splitTextToSize(diploma.curso || '', ancho - 70)
  doc.text(lineasCurso, centro, y, { align: 'center' })
  y += lineasCurso.length * 7.5 + 2

  if (diploma.subtitulo) {
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(11.5)
    doc.setTextColor(...GRIS)
    const lineasSub = doc.splitTextToSize(diploma.subtitulo, ancho - 80)
    doc.text(lineasSub, centro, y, { align: 'center' })
    y += lineasSub.length * 5.5 + 2
  }

  // Detalles: fecha, horas, lugar, modalidad
  const detalles = []
  if (diploma.fecha) {
    const fin = diploma.fechaFin ? ` al ${formatearFecha(diploma.fechaFin)}` : ''
    detalles.push(`${fin ? 'del ' : 'el '}${formatearFecha(diploma.fecha)}${fin}`)
  }
  if (diploma.lugar) detalles.push(`en ${diploma.lugar}`)
  if (diploma.modalidad) detalles.push(`(${diploma.modalidad})`)
  if (diploma.horas) detalles.push(`con una duración de ${diploma.horas} horas`)
  if (detalles.length) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11.5)
    doc.setTextColor(...GRIS)
    const lineasDet = doc.splitTextToSize(detalles.join(', ') + '.', ancho - 80)
    doc.text(lineasDet, centro, y + 2, { align: 'center' })
    y += lineasDet.length * 5.5 + 4
  }

  // Firma
  const yFirma = alto - 42
  const xFirma = ancho - 85
  if (diploma.firmaLugarFecha) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(...GRIS)
    doc.text(diploma.firmaLugarFecha, 30, yFirma + 14)
  }
  doc.setDrawColor(...AZUL)
  doc.setLineWidth(0.4)
  doc.line(xFirma - 40, yFirma + 6, xFirma + 40, yFirma + 6)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(...AZUL)
  doc.text(diploma.formador || '', xFirma, yFirma + 12, { align: 'center' })
  if (diploma.cargo) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(...GRIS_CLARO)
    const lineasCargo = doc.splitTextToSize(diploma.cargo, 90)
    doc.text(lineasCargo, xFirma, yFirma + 17, { align: 'center' })
  }

  // Pie: código de verificación
  doc.setFont('courier', 'normal')
  doc.setFontSize(8.5)
  doc.setTextColor(...GRIS_CLARO)
  const pie = [
    opciones.codigo ? `Código de verificación: ${opciones.codigo}` : null,
    opciones.urlVerificacion ? `Comprobar en ${opciones.urlVerificacion}` : null,
  ]
    .filter(Boolean)
    .join('  ·  ')
  if (pie) doc.text(pie, centro, alto - 17, { align: 'center' })

  doc.setProperties({
    title: `${diploma.tipo || 'Diploma'} - ${diploma.nombre || ''}`,
    subject: diploma.curso || '',
    author: diploma.organizador || diploma.formador || '',
  })

  return doc
}

/** Genera y descarga el PDF del diploma. */
export async function descargarDiplomaPdf(diploma, opciones = {}) {
  const doc = await construirDiplomaPdf(diploma, opciones)
  doc.save(nombreArchivo(diploma))
}

/** Devuelve una imagen (data URL PNG) de la primera página del diploma para previsualizarla. */
export async function previsualizarDiplomaPdf(diploma, opciones = {}) {
  const doc = await construirDiplomaPdf(diploma, opciones)
  const { renderizarPdfComoImagen } = await import('./diplomaPreview.js')
  return renderizarPdfComoImagen(doc.output('arraybuffer'), 1400)
}
