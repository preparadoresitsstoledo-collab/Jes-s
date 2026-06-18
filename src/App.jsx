import { useEffect, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import Ventajas from './components/Ventajas.jsx'
import Preparador from './components/Preparador.jsx'
import Profesion from './components/Profesion.jsx'
import Resultados from './components/Resultados.jsx'
import Estadisticas from './components/Estadisticas.jsx'
import Proceso from './components/Proceso.jsx'
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
import AnalizadorConvenios from './components/AnalizadorConvenios.jsx'

function useRutaHash() {
  const [ruta, setRuta] = useState(() => window.location.hash)
  useEffect(() => {
    const onHash = () => setRuta(window.location.hash)
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  return ruta
}

export default function App() {
  const ruta = useRutaHash()

  if (ruta.startsWith('#/analizador')) {
    return <AnalizadorConvenios />
  }

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Ventajas />
        <Preparador />
        <Profesion />
        <Resultados />
        <Estadisticas />
        <Proceso />
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
