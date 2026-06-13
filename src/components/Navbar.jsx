import { useState } from 'react'
import { marca } from '../data/sitio.js'

const enlaces = [
  { href: '#preparador', texto: 'El preparador' },
  { href: '#resultados', texto: 'Resultados' },
  { href: '#estadisticas', texto: 'Estadísticas' },
  { href: '#proceso', texto: 'El examen' },
  { href: '#metodologia', texto: 'Metodología' },
  { href: '#precios', texto: 'Precios' },
  { href: '#testimonios', texto: 'Referencias' },
  { href: '#contacto', texto: 'Contacto' },
]

export default function Navbar() {
  const [abierto, setAbierto] = useState(false)

  return (
    <nav className="navbar">
      <div className="contenedor navbar__inner">
        <a className="navbar__marca" href="#inicio" onClick={() => setAbierto(false)}>
          <span className="navbar__logo">ITSS</span>
          <span>{marca.nombre}</span>
        </a>

        <ul className={`navbar__links ${abierto ? 'navbar__links--abierto' : ''}`}>
          {enlaces.map((e) => (
            <li key={e.href}>
              <a href={e.href} onClick={() => setAbierto(false)}>
                {e.texto}
              </a>
            </li>
          ))}
        </ul>

        <a className="btn btn--primario navbar__cta" href="#contacto">
          Reserva tu plaza
        </a>

        <button
          className="navbar__toggle"
          aria-label="Abrir menú"
          aria-expanded={abierto}
          onClick={() => setAbierto((v) => !v)}
        >
          {abierto ? '✕' : '☰'}
        </button>
      </div>
    </nav>
  )
}
