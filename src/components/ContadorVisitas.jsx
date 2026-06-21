import { useEffect, useState } from 'react'

// Contador de visitas con un servicio gratuito y sin registro (Abacus).
// El conteo se hace en el navegador de quien visita la web; cambia NAMESPACE/
// KEY por algo único tuyo. Si el servicio no responde, el contador no se
// muestra (no rompe la web). Nota de privacidad: la petición se envía a un
// servicio externo (abacus.jasoncameron.dev).
const NAMESPACE = 'preparacionitsstoledo'
const KEY = 'visitas-web'
const ENDPOINT = `https://abacus.jasoncameron.dev/hit/${NAMESPACE}/${KEY}`

export default function ContadorVisitas() {
  const [visitas, setVisitas] = useState(null)

  useEffect(() => {
    let activo = true
    fetch(ENDPOINT)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => {
        if (activo && typeof d.value === 'number') setVisitas(d.value)
      })
      .catch(() => {})
    return () => {
      activo = false
    }
  }, [])

  if (visitas == null) return null

  return (
    <p className="contador-visitas" aria-label="Número de visitas a la web">
      👁️ {new Intl.NumberFormat('es-ES').format(visitas)} visitas
    </p>
  )
}
