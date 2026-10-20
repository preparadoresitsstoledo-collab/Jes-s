// Autoría y derechos de las herramientas de la web.
// (no importa sitio.js para que las pruebas en Node no carguen imágenes)
export const AUTOR = 'Jesús María Prieto Valbuena'
export const ANIO_CREACION = 2026

export function textoCopyright(anio = new Date().getFullYear()) {
  const anios = anio > ANIO_CREACION ? `${ANIO_CREACION}-${anio}` : String(ANIO_CREACION)
  return `© ${anios} ${AUTOR}. Todos los derechos reservados.`
}

export const TEXTO_LICENCIA =
  'Uso gratuito de la herramienta a través de esta web. Quedan prohibidas su copia, reproducción, distribución, transformación o comunicación pública, total o parcial, incluido su código, sin autorización expresa y por escrito del autor (Real Decreto Legislativo 1/1996, de Propiedad Intelectual).'
