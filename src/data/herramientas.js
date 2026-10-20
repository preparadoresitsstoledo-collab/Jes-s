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
    id: 'tacografo',
    ruta: '#/tacografo',
    nombre: 'Analizador de tacógrafo',
    icono: '🚚',
    resumen: 'Horas extraordinarias y descansos desde la tarjeta del conductor',
    descripcion:
      'Lee a la vez todas las descargas de la tarjeta de conductor (.DDD/.TGD, 1.ª y 2.ª generación), incluso de varios años, y calcula día a día conducción, trabajo, disponibilidad, descansos y horas extraordinarias conforme al Reglamento 561/2006, el RD 1561/1995, el ET y el convenio. Exporta un Excel con resúmenes y la base para el acta de liquidación.',
    etiquetas: ['Tacógrafo', 'Transporte', 'Horas extra', 'Acta de liquidación'],
    Componente: lazy(() => import('../components/AnalizadorTacografo.jsx')),
  },
  {
    id: 'dietas-jornada',
    ruta: '#/dietas-jornada',
    nombre: 'Dietas y jornada anual',
    icono: '🧾',
    resumen: 'Excesos de jornada, horas extra y dietas en el transporte',
    descripcion:
      'Cruza los días con dieta de las nóminas, la actividad del tacógrafo y las vacaciones con la jornada máxima anual del convenio. Calcula el cuadrante de excesos por años (por días y por horas, con la jornada proporcional a los días de alta e IT), detecta importes de dietas irregulares y redacta los hechos comprobados. Exporta a Word y Excel.',
    etiquetas: ['Dietas', 'Jornada anual', 'Horas extra', 'Vacaciones', 'Transporte'],
    Componente: lazy(() => import('../components/DietasJornada.jsx')),
  },
  {
    id: 'amianto',
    ruta: '#/amianto',
    nombre: 'Informes de amianto',
    icono: '🏗️',
    resumen: 'Informe sobre el plan de trabajo (art. 12.2)',
    descripcion:
      'Editor con la estructura oficial del art. 11.2 del RD 396/2006 para redactar el informe sobre el plan de trabajo con amianto (art. 12.2). Aporta los apartados legales y el marco normativo; el contenido lo redactas tú. Solo fuentes oficiales (BOE e INSST).',
    etiquetas: ['Amianto', 'RD 396/2006', 'INSST'],
    Componente: lazy(() => import('../components/InformesAmianto.jsx')),
  },
]

// Devuelve la herramienta cuya ruta coincide con el hash actual (o null).
export function herramientaPorRuta(hash) {
  return HERRAMIENTAS.find((h) => hash.startsWith(h.ruta)) || null
}
