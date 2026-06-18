// OCR (reconocimiento óptico de caracteres) para PDF escaneados, en el navegador.
// El PDF se renderiza a imagen y se reconoce con Tesseract en español.
//
// Privacidad: el documento se procesa localmente. Tesseract descarga su motor y
// el modelo de idioma desde una CDN la primera vez (eso es código/modelo, no tu
// archivo), por lo que se necesita conexión a internet para usar el OCR.

import * as pdfjsLib from 'pdfjs-dist'
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import { createWorker } from 'tesseract.js'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl

/**
 * Reconoce el texto de un PDF escaneado.
 * @param {ArrayBuffer} arrayBuffer  Contenido del PDF.
 * @param {(info: {pagina:number,total:number,estado:string})=>void} onProgreso
 * @param {number} maxPaginas  Límite de páginas a procesar (por rendimiento).
 * @returns {Promise<string>}
 */
export async function ocrPdf(arrayBuffer, onProgreso, maxPaginas = 15) {
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  const total = Math.min(pdf.numPages, maxPaginas)
  const worker = await createWorker('spa')
  const partes = []
  try {
    for (let i = 1; i <= total; i++) {
      onProgreso?.({ pagina: i, total, estado: 'reconociendo' })
      const page = await pdf.getPage(i)
      const viewport = page.getViewport({ scale: 2 })
      const canvas = document.createElement('canvas')
      canvas.width = viewport.width
      canvas.height = viewport.height
      const ctx = canvas.getContext('2d')
      await page.render({ canvasContext: ctx, viewport }).promise
      const { data } = await worker.recognize(canvas)
      partes.push(data.text)
      canvas.width = 0
      canvas.height = 0
    }
  } finally {
    await worker.terminate()
  }
  return partes.join('\n\n')
}
