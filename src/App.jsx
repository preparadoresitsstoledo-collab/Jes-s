import { lazy, Suspense, useEffect, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import Ventajas from './components/Ventajas.jsx'
import Preparador from './components/Preparador.jsx'
import MiCamino from './components/MiCamino.jsx'
import Profesion from './components/Profesion.jsx'
import Resultados from './components/Resultados.jsx'
import Estadisticas from './components/Estadisticas.jsx'
import Proceso from './components/Proceso.jsx'
import Cronograma from './components/Cronograma.jsx'
import Herramientas from './components/Herramientas.jsx'
import Metodologia from './components/Metodologia.jsx'
import Toledo from './components/Toledo.jsx'
import Pasos from './components/Pasos.jsx'
import Precios from './components/Precios.jsx'
import Testimonios from './components/Testimonios.jsx'
import Actualidad from './components/Actualidad.jsx'
import Faq from './components/Faq.jsx'
import CtaFinal from './components/CtaFinal.jsx'
import Contacto from './components/Contacto.jsx'
import Footer from './components/Footer.jsx'
import WhatsappFlotante from './components/WhatsappFlotante.jsx'

// Herramientas pesadas: se cargan solo al abrir su ruta (no lastran la web).
const CalculadoraDespido = lazy(() => import('./components/CalculadoraDespido.jsx'))
const PlanesAmianto = lazy(() => import('./components/PlanesAmianto.jsx'))
const AnalizadorConvenios = lazy(() => import('./components/AnalizadorConvenios.jsx'))
const Graduacion = lazy(() => import('./components/Graduacion.jsx'))
const Sanciones = lazy(() => import('./components/Sanciones.jsx'))

function useRutaHash() {
  const [ruta, setRuta] = useState(() => window.location.hash)
  useEffect(() => {
    const onHash = () => setRuta(window.location.hash)
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  return ruta
}

function Cargando() {
  return (
    <div className="analizador">
      <div className="analizador__hero">
        <p>Cargando herramienta…</p>
        <a className="analizador__volver" href="#inicio">
          ← Volver a la web
        </a>
      </div>
    </div>
  )
}

export default function App() {
  const ruta = useRutaHash()

  // Herramientas como páginas propias (carga diferida)
  if (ruta.startsWith('#/analizador')) {
    return (
      <Suspense fallback={<Cargando />}>
        <AnalizadorConvenios />
      </Suspense>
    )
  }
  if (ruta.startsWith('#/despido')) {
    return (
      <Suspense fallback={<Cargando />}>
        <CalculadoraDespido />
      </Suspense>
    )
  }
  if (ruta.startsWith('#/amianto')) {
    return (
      <Suspense fallback={<Cargando />}>
        <PlanesAmianto />
      </Suspense>
    )
  }
  if (ruta.startsWith('#/graduacion')) {
    return (
      <Suspense fallback={<Cargando />}>
        <Graduacion />
      </Suspense>
    )
  }
  if (ruta.startsWith('#/sanciones')) {
    return (
      <Suspense fallback={<Cargando />}>
        <Sanciones />
      </Suspense>
    )
  }

  return (
    <>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <Navbar />
      <main id="contenido">
        <Hero />
        <Ventajas />
        <Preparador />
        <MiCamino />
        <Profesion />
        <Resultados />
        <Estadisticas />
        <Proceso />
        <Cronograma />
        <Herramientas />
        <Metodologia />
        <Toledo />
        <Pasos />
        <Precios />
        <Testimonios />
        <Actualidad />
        <Faq />
        <CtaFinal />
        <Contacto />
      </main>
      <Footer />
      <WhatsappFlotante />
    </>
  )
}
