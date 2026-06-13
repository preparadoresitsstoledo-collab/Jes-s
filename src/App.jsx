import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import Preparador from './components/Preparador.jsx'
import Estadisticas from './components/Estadisticas.jsx'
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
        <Estadisticas />
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
