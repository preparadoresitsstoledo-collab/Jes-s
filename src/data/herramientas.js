// Registro centralizado de herramientas/aplicaciones de la web.
//
// Añadir una nueva aplicación es tan sencillo como agregar una entrada aquí:
// el menú (Navbar), el portal de herramientas (#/herramientas) y el enrutado
// (App.jsx) se alimentan automáticamente de esta lista.
import { lazy } from 'react'

export const HERRAMIENTAS = [
  {
    id: 'indemnizaciones',
    ruta: '#/indemnizaciones',
    nombre: 'Cálculo de indemnizaciones',
    icono: '⚖️',
    resumen: 'Indemnización por extinción del contrato',
    descripcion:
      'Calcula la cuantía orientativa de la indemnización por extinción del contrato de trabajo conforme al Estatuto de los Trabajadores y a las relaciones laborales de carácter especial (alta dirección, deportistas, hogar, etc.), con el régimen transitorio 45/33 días.',
    etiquetas: ['Despido', 'Estatuto de los Trabajadores', 'Relaciones especiales'],
    Componente: lazy(() => import('../components/CalculadoraIndemnizaciones.jsx')),
  },
  {
    id: 'analizador',
    ruta: '#/analizador',
    nombre: 'Analizador de convenios',
    icono: '📋',
    resumen: 'Control de legalidad de convenios colectivos',
    descripcion:
      'Revisa la legalidad de un convenio colectivo frente al Estatuto de los Trabajadores (art. 90.5 y 6 ET). Sube o pega el texto, marca el cuadro de verificación y genera un informe listo para imprimir.',
    etiquetas: ['Convenios', 'Inspección de Trabajo', 'Informe'],
    Componente: lazy(() => import('../components/AnalizadorConvenios.jsx')),
  },
  {
    id: 'amianto',
    ruta: '#/amianto',
    nombre: 'Informes de amianto',
    icono: '🏗️',
    resumen: 'Plan de trabajo y documentación de amianto',
    descripcion:
      'Apoyo a la elaboración de informes en materia de amianto (plan de trabajo, identificación de materiales y evaluación de la exposición) conforme al RD 396/2006 y a la documentación técnica del INSST. Solo fuentes oficiales (BOE e INSST).',
    etiquetas: ['Amianto', 'RD 396/2006', 'INSST'],
    Componente: lazy(() => import('../components/InformesAmianto.jsx')),
  },
]

// Devuelve la herramienta cuya ruta coincide con el hash actual (o null).
export function herramientaPorRuta(hash) {
  return HERRAMIENTAS.find((h) => hash.startsWith(h.ruta)) || null
}
