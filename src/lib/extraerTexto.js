// Extracción de texto de archivos de convenio, 100 % en el navegador.
// Los archivos NO se suben a ningún servidor: se procesan localmente.

import mammoth from 'mammoth'
import * as pdfjsLib from 'pdfjs-dist'
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl

// PDF → texto, página a página.
async function extraerPdf(arrayBuffer) {
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  const partes = []
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    partes.push(content.items.map((it) => ('str' in it ? it.str : '')).join(' '))
  }
  return partes.join('\n\n')
}

// DOCX → texto plano (Word moderno).
async function extraerDocx(arrayBuffer) {
  const { value } = await mammoth.extractRawText({ arrayBuffer })
  return value
}

// .doc antiguo (binario OLE): extracción de mejor esfuerzo. Recupera las
// secuencias legibles del documento. No es perfecta; lo ideal es convertir el
// archivo a .docx o .pdf.
function extraerDocLegado(arrayBuffer) {
  const bytes = new Uint8Array(arrayBuffer)
  let txt = ''
  for (let i = 0; i < bytes.length; i++) {
    const c = bytes[i]
    // Caracteres imprimibles latin-1 + saltos de línea/tab.
    if (c === 9 || c === 10 || c === 13 || (c >= 32 && c <= 126) || (c >= 160 && c <= 255)) {
      txt += String.fromCharCode(c)
    } else {
      txt += '\n'
    }
  }
  // Conserva solo tramos de texto con sentido (>= 25 caracteres legibles).
  const tramos = txt.match(/[ \t\wÀ-ÿ.,;:%€/()ªº°\-"'¿?¡!]{25,}/g) || []
  return tramos.join('\n')
}

/**
 * Extrae el texto de un File de convenio.
 * @param {File} file
 * @returns {Promise<{ texto: string, aviso?: string }>}
 */
export async function extraerTextoArchivo(file) {
  const nombre = (file.name || '').toLowerCase()
  const ext = nombre.slice(nombre.lastIndexOf('.') + 1)

  if (ext === 'txt' || file.type === 'text/plain') {
    return { texto: await file.text() }
  }

  if (ext === 'pdf' || file.type === 'application/pdf') {
    const texto = await extraerPdf(await file.arrayBuffer())
    if (texto.trim().length < 40) {
      return {
        texto,
        aviso:
          'El PDF apenas contiene texto seleccionable (puede ser un PDF escaneado). En ese caso, ' +
          'pega el texto manualmente o usa un PDF con texto.',
      }
    }
    return { texto }
  }

  if (ext === 'docx') {
    return { texto: await extraerDocx(await file.arrayBuffer()) }
  }

  if (ext === 'doc') {
    return {
      texto: extraerDocLegado(await file.arrayBuffer()),
      aviso:
        'Archivo .doc antiguo: la extracción es aproximada. Para mejores resultados, abre el ' +
        'documento y guárdalo como .docx o .pdf, o copia y pega el texto.',
    }
  }

  // Último intento: tratarlo como texto.
  return {
    texto: await file.text(),
    aviso: `Formato no reconocido (.${ext}). Se ha intentado leer como texto plano.`,
  }
}
