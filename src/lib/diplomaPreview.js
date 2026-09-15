/**
 * Renderiza la primera página de un PDF (ArrayBuffer) como imagen PNG (data URL)
 * usando pdf.js. Se carga bajo demanda; sirve para la vista previa del diploma
 * en cualquier dispositivo (los iframes con PDF no funcionan bien en móvil).
 */
export async function renderizarPdfComoImagen(arrayBuffer, anchoPx = 1200) {
  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs')
  const { default: workerUrl } = await import('pdfjs-dist/legacy/build/pdf.worker.min.mjs?url')
  pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl

  const tarea = pdfjsLib.getDocument({ data: arrayBuffer })
  const pdf = await tarea.promise
  const pagina = await pdf.getPage(1)
  const base = pagina.getViewport({ scale: 1 })
  const viewport = pagina.getViewport({ scale: anchoPx / base.width })
  const canvas = document.createElement('canvas')
  canvas.width = Math.ceil(viewport.width)
  canvas.height = Math.ceil(viewport.height)
  const ctx = canvas.getContext('2d')
  await pagina.render({ canvasContext: ctx, viewport }).promise
  const url = canvas.toDataURL('image/png')
  await tarea.destroy()
  return url
}
