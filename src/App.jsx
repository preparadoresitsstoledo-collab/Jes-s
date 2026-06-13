import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import Ventajas from './components/Ventajas.jsx'
import Preparador from './components/Preparador.jsx'
import Profesion from './components/Profesion.jsx'
import Resultados from './components/Resultados.jsx'
import Estadisticas from './components/Estadisticas.jsx'
import Proceso from './components/Proceso.jsx'
import Metodologia from './components/Metodologia.jsx'
import Pasos from './components/Pasos.jsx'
import Testimonios from './components/Testimonios.jsx'
import Faq from './components/Faq.jsx'
import CtaFinal from './components/CtaFinal.jsx'
import Contacto from './components/Contacto.jsx'
import Footer from './components/Footer.jsx'
import WhatsappFlotante from './components/WhatsappFlotante.jsx'

export default function App() {
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
        <Pasos />
        <Testimonios />
        <Faq />
        <CtaFinal />
        <Contacto />
      </main>
      <Footer />
      <WhatsappFlotante />
    </>
  )
}
