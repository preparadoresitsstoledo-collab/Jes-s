// Referencias normativas usadas por el analizador de convenios.
// ⚠️ Revisa y actualiza estas cifras cada año (sobre todo el SMI).

// Salario Mínimo Interprofesional. Valor por defecto: 2025 (RD 87/2025).
// En la herramienta el usuario puede ajustarlo al SMI vigente.
export const SMI = {
  anio: 2025,
  mensual: 1184, // €/mes en 14 pagas
  pagas: 14,
  get anual() {
    return this.mensual * this.pagas
  },
  ref: 'RD 87/2025',
}

// Límites del Estatuto de los Trabajadores (RDL 2/2015) usados por las
// heurísticas de detección automática.
export const LIMITES = {
  vacacionesMin: 30, // días naturales al año (art. 38.1 ET)
  jornadaMaxSemanal: 40, // horas/semana de promedio en cómputo anual (art. 34.1 ET)
  horasExtraMax: 80, // horas extraordinarias al año (art. 35.2 ET)
  descansoEntreJornadas: 12, // horas mínimas entre jornadas (art. 34.3 ET)
}

// Transcripciones literales de los preceptos más citados en el apartado
// "RESULTADO DE LA VERIFICACIÓN" de los informes.
export const ARTICULOS = {
  et22: {
    titulo: 'Artículo 22 ET. Sistema de clasificación profesional',
    texto:
      '1. Mediante la negociación colectiva o, en su defecto, acuerdo entre la empresa y los representantes de los trabajadores, se establecerá el sistema de clasificación profesional de los trabajadores por medio de grupos profesionales.\n2. Se entenderá por grupo profesional el que agrupe unitariamente las aptitudes profesionales, titulaciones y contenido general de la prestación, y podrá incluir distintas tareas, funciones, especialidades profesionales o responsabilidades asignadas al trabajador.',
  },
  da10: {
    titulo: 'Disposición adicional 10ª ET. Cláusulas de jubilación forzosa',
    texto:
      'Los convenios colectivos podrán establecer cláusulas que posibiliten la extinción del contrato por el cumplimiento de una edad igual o superior a 68 años, siempre que: a) la persona trabajadora reúna los requisitos para tener derecho al 100 % de la pensión ordinaria de jubilación contributiva; y b) la medida se vincule, como objetivo de política de empleo, al relevo generacional mediante contratación indefinida y a tiempo completo de, al menos, un nuevo trabajador.',
  },
  et383: {
    titulo: 'Artículo 38.3 ET. Vacaciones e incapacidad temporal',
    texto:
      'Cuando el periodo de vacaciones coincida con una IT derivada del embarazo, parto o lactancia natural, o con el periodo de suspensión del contrato previsto en los apartados 4, 5 y 7 del artículo 48, se tendrá derecho a disfrutar las vacaciones en fecha distinta, aunque haya terminado el año natural a que correspondan.',
  },
  et376: {
    titulo: 'Artículo 37.6 ET. Reducción de jornada por guarda legal',
    texto:
      'Quien por razones de guarda legal tenga a su cuidado directo a un menor de doce años o una persona con discapacidad tendrá derecho a una reducción de la jornada de trabajo diaria, con la disminución proporcional del salario. Se prevén ampliaciones del derecho en supuestos de cáncer o enfermedad grave del menor.',
  },
  et41: {
    titulo: 'Artículo 41 ET. Modificación sustancial de condiciones de trabajo',
    texto:
      'La dirección de la empresa podrá acordar modificaciones sustanciales de las condiciones de trabajo cuando existan probadas razones económicas, técnicas, organizativas o de producción, con el procedimiento y garantías legalmente establecidos.',
  },
  et60: {
    titulo: 'Artículo 60 ET. Prescripción de las faltas',
    texto:
      'Respecto a los trabajadores, las faltas leves prescribirán a los diez días; las graves, a los veinte días, y las muy graves, a los sesenta días a partir de la fecha en que la empresa tuvo conocimiento de su comisión y, en todo caso, a los seis meses de haberse cometido.',
  },
  et851: {
    titulo: 'Artículo 85.1 ET. Contenido (igualdad)',
    texto:
      'Sin perjuicio de la libertad de las partes para determinar el contenido de los convenios colectivos, en la negociación de los mismos existirá, en todo caso, el deber de negociar medidas dirigidas a promover la igualdad de trato y de oportunidades entre mujeres y hombres en el ámbito laboral o, en su caso, planes de igualdad.',
  },
  lo3_48: {
    titulo: 'Artículo 48 LO 3/2007. Acoso sexual y por razón de sexo',
    texto:
      'Las empresas deberán promover condiciones de trabajo que eviten el acoso sexual y el acoso por razón de sexo y arbitrar procedimientos específicos para su prevención y para dar cauce a las denuncias o reclamaciones que puedan formular quienes hayan sido objeto del mismo.',
  },
}
