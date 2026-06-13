import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import Preparador from './components/Preparador.jsx'
import Resultados from './components/Resultados.jsx'
import Estadisticas from './components/Estadisticas.jsx'
import Proceso from './components/Proceso.jsx'
import Metodologia from './components/Metodologia.jsx'
import Precios from './components/Precios.jsx'
import Testimonios from './components/Testimonios.jsx'
import Faq from './components/Faq.jsx'
import Contacto from './components/Contacto.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Preparador />
        <Resultados />
        <Estadisticas />
        <Proceso />
        <Metodologia />
        <Precios />
        <Testimonios />
        <Faq />
        <Contacto />
      </main>
      <Footer />
    </>
  )
}
