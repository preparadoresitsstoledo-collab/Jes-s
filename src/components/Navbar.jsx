import { useState } from 'react'
import logo from '../assets/logo.png'

const enlaces = [
  { href: '#preparador', texto: 'El preparador' },
  { href: '#profesion', texto: 'La profesión' },
  { href: '#resultados', texto: 'Resultados' },
  { href: '#proceso', texto: 'El examen' },
  { href: '#metodologia', texto: 'Metodología' },
  { href: '#toledo', texto: 'Toledo' },
  { href: '#precio', texto: 'Precio' },
  { href: '#contacto', texto: 'Contacto' },
]

export default function Navbar() {
  const [abierto, setAbierto] = useState(false)

  return (
    <nav className="navbar">
      <div className="contenedor navbar__inner">
        <a className="navbar__marca" href="#inicio" onClick={() => setAbierto(false)}>
          <img
            className="navbar__logo-img"
            src={logo}
            alt="Preparador de Oposiciones · Inspección de Trabajo · Provincia de Toledo"
            width="180"
            height="180"
          />
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
