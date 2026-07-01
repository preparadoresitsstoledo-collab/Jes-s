/**
 * ============================================================================
 *  SANCIONES Y CUANTÍAS — juego/herramienta didáctica de estudio.
 * ============================================================================
 *  Fuente principal de preceptos y cuantías:
 *   · «Plantilla de preceptos infringidos, calificación y tipificación —
 *      Seguridad Social y trabajo de extranjeros», Escuela de la ITSS,
 *      octubre 2024 (cuantías vigentes desde 1.10.2021, Ley 10/2021).
 *   · Reducción por pronto pago: RD 688/2021 (modifica el RD 928/1998),
 *      en vigor desde 1.1.2022.
 *
 *  ⚠️  DATOS ORIENTATIVOS. Revisa y ajusta importes, preceptos y ejemplos:
 *      las cuantías se actualizan y cada acta debe verificar la norma vigente.
 * ============================================================================
 */

// Reduce un importe por pronto pago (−40%).
const pp = (n) => Math.round(n * 0.6)
const eur = (n) => n.toLocaleString('es-ES') + ' €'

export const marcoSanciones = {
  cuotas:
    'En las infracciones por cuotas (falta de ingreso, diferencias de cotización) la multa NO es una cantidad fija: es un PORCENTAJE del importe no ingresado (cuotas + recargos, intereses y costas), conforme al art. 40.1.d) LISOS. El grado depende de la cuantía no ingresada: mínimo si no supera 10.000 €, medio entre 10.001 y 25.000 €, y máximo por encima de 25.000 €.',
  bandasGrave: [
    'GRAVE (art. 22.3): mínimo 50–65 %, medio 65,01–80 %, máximo 80,01–100 % del importe.',
  ],
  bandasMuyGrave: [
    'MUY GRAVE (art. 23.1.b, falta absoluta de cotización sin presentar documentos): mínimo 100,01–115 %, medio 115,01–130 %, máximo 130,01–150 % del importe.',
  ],
  altas:
    'La falta de afiliación/alta (art. 22.2 LISOS, grave) es UNA infracción por cada trabajador. Cada una se sanciona en grado mínimo por 3.750 € (art. 40.1.e), y ese importe se incrementa según el número de trabajadores detectados en la misma actuación: +20 % (2), +30 % (3), +40 % (4) y +50 % (5 o más). La cuantía del art. 22.2 no puede exceder de 12.000 € por infracción.',
  prontoPago:
    'Pronto pago (RD 688/2021): si la sanción es exclusivamente pecuniaria, el sujeto responsable puede pagar la multa propuesta antes de la resolución, renunciando a alegaciones y recursos; ello supone el reconocimiento de responsabilidad y una REDUCCIÓN DEL 40 % del importe de la sanción. Ojo: reduce la MULTA, no la deuda de cuotas — el acta de liquidación se abona íntegra.',
}

export const casosSanciones = [
  {
    materia: 'Seguridad Social · altas',
    supuesto:
      'En una visita se detectan 4 trabajadores prestando servicios sin estar dados de alta en la Seguridad Social. Primera actuación, sin otras circunstancias agravantes.',
    pregunta: '¿Qué importe corresponde a cada una de las sanciones?',
    opciones: [
      { k: 'a', t: '3.750 € por trabajador (sin incremento)' },
      { k: 'b', t: '5.250 € por trabajador (+40 %)' },
      { k: 'c', t: 'Una única sanción de 15.000 €' },
    ],
    correcta: 'b',
    precepto:
      'Arts. 16.2; 18.1, 2 y 3; 22.1; 29.1; 139.1; 140.1; 141.1; 142.1; 144.1, 2, 3 y 4 LGSS (RDLeg 8/2015) y RD 84/1996 (inscripción, afiliación y altas).',
    calificacion: 'GRAVE — art. 22.2 LISOS. Una infracción POR CADA trabajador (art. 22.16).',
    tipificacion:
      'Art. 40.1.e) LISOS: grado mínimo 3.750 € por infracción, incrementado por nº de trabajadores (2→+20 %, 3→+30 %, 4→+40 %, 5+→+50 %).',
    cuantia: `4 trabajadores → +40 % → ${eur(5250)} por infracción × 4 = ${eur(21000)}.`,
    prontoPago: `Con pronto pago (−40 %): ${eur(5250)} → ${eur(pp(5250))} por infracción (total ${eur(21000)} → ${eur(pp(21000))}).`,
    nota: 'La cuantía del art. 22.2 no puede exceder de 12.000 € por infracción.',
  },
  {
    materia: 'Seguridad Social · altas',
    supuesto:
      'Un único trabajador sin alta, detectado y regularizado de inmediato, sin perjuicio para prestaciones y sin antecedentes.',
    pregunta: '¿Cuál es la cuantía de la sanción?',
    opciones: [
      { k: 'a', t: '3.750 € (grado mínimo, sin incremento)' },
      { k: 'b', t: '4.500 € (+20 %)' },
      { k: 'c', t: '750 €' },
    ],
    correcta: 'a',
    precepto:
      'Arts. 16.2; 18; 29.1 LGSS (RDLeg 8/2015) y RD 84/1996 (afiliación y altas).',
    calificacion: 'GRAVE — art. 22.2 LISOS (una infracción por trabajador).',
    tipificacion: 'Art. 40.1.e) LISOS: grado mínimo 3.750 € (sin incremento al ser un solo afectado).',
    cuantia: `${eur(3750)} (grado mínimo).`,
    prontoPago: `Con pronto pago (−40 %): ${eur(3750)} → ${eur(pp(3750))}.`,
    nota: null,
  },
  {
    materia: 'Seguridad Social · diferencias de cotización',
    supuesto:
      'Actuación que detecta una liquidación de diferencias de cotización de 30.000 € (por conceptos no incluidos en las bases), habiendo la empresa presentado los documentos de cotización.',
    pregunta: '¿En qué grado se sanciona y con qué porcentaje sobre el importe?',
    opciones: [
      { k: 'a', t: 'Mínimo — 50 % a 65 %' },
      { k: 'b', t: 'Medio — 65,01 % a 80 %' },
      { k: 'c', t: 'Máximo — 80,01 % a 100 %' },
    ],
    correcta: 'c',
    precepto:
      'Arts. 18.1, 2 y 3; 141.1; 142.1; 144.1, 2, 3 y 4; 147.1 LGSS y Reglamento General de Cotización (RD 2064/1995).',
    calificacion: 'GRAVE — art. 22.3 LISOS.',
    tipificacion:
      'Art. 40.1.d) LISOS: multa = % del importe no ingresado. Grado por cuantía: >25.000 € → MÁXIMO → 80,01–100 %.',
    cuantia: `30.000 € no ingresados → grado máximo → entre ${eur(24003)} (80,01 %) y ${eur(30000)} (100 %).`,
    prontoPago: `Con pronto pago (−40 %) sobre, p. ej., una multa del 90 % (${eur(27000)}): ${eur(pp(27000))}. La liquidación de cuotas (30.000 €) se paga aparte e íntegra.`,
    nota: 'El umbral del grado máximo es 80,01 % (no 81,01 %).',
  },
  {
    materia: 'Seguridad Social · impago de cuotas',
    supuesto:
      'Empresa que, habiendo presentado los documentos de cotización, no ingresa cuotas por un total de 12.000 € (sin declaración concursal, fuerza mayor ni aplazamiento).',
    pregunta: '¿Qué grado y porcentaje se aplican?',
    opciones: [
      { k: 'a', t: 'Mínimo — 50 % a 65 %' },
      { k: 'b', t: 'Medio — 65,01 % a 80 %' },
      { k: 'c', t: 'Máximo — 80,01 % a 100 %' },
    ],
    correcta: 'b',
    precepto:
      'Arts. 18.1, 2 y 3; 22.1; 141.1; 142.1; 144.1, 2, 3 y 4; 147.1 LGSS y RD 2064/1995 y RD 1415/2004 (recaudación).',
    calificacion: 'GRAVE — art. 22.3 LISOS (falta de ingreso con documentos presentados).',
    tipificacion: 'Art. 40.1.d) LISOS: % del importe. Cuantía entre 10.001 y 25.000 € → grado MEDIO → 65,01–80 %.',
    cuantia: `12.000 € no ingresados → grado medio → entre ${eur(7801)} (65,01 %) y ${eur(9600)} (80 %).`,
    prontoPago: `Con pronto pago (−40 %) sobre, p. ej., una multa del 70 % (${eur(8400)}): ${eur(pp(8400))}. La deuda de 12.000 € se abona aparte.`,
    nota: null,
  },
  {
    materia: 'Seguridad Social · falta absoluta de cotización',
    supuesto:
      'Empresa que NO ingresa las cuotas y TAMPOCO presenta los documentos de cotización. La deuda del periodo asciende a 30.000 €.',
    pregunta: '¿Cómo cambia la sanción respecto al impago con documentos presentados?',
    opciones: [
      { k: 'a', t: 'Igual: grave, 80,01–100 %' },
      { k: 'b', t: 'Muy grave: 130,01 % a 150 % del importe' },
      { k: 'c', t: 'Leve: 70 €' },
    ],
    correcta: 'b',
    precepto:
      'Arts. 18.1, 2 y 3; 22.1; 29.1; 141.1; 142.1; 144.1, 2, 3 y 4; 147.1 LGSS y RD 2064/1995, RD 1415/2004 y Orden TAS/1562/2005.',
    calificacion: 'MUY GRAVE — art. 23.1.b) LISOS (no ingresar sin presentar documentos).',
    tipificacion:
      'Art. 40.1.d).2 LISOS: % del importe. Cuantía >25.000 € → grado MÁXIMO → 130,01–150 %.',
    cuantia: `30.000 € → grado máximo → entre ${eur(39003)} (130,01 %) y ${eur(45000)} (150 %). Muy por encima del mismo importe como grave.`,
    prontoPago: `Con pronto pago (−40 %) sobre, p. ej., una multa del 140 % (${eur(42000)}): ${eur(pp(42000))}. Puede llevar además sanción accesoria (art. 46 LISOS), que excluye el carácter “exclusivamente pecuniario”.`,
    nota: 'No presentar los documentos convierte el impago (grave, art. 22.3) en muy grave (art. 23.1.b).',
  },
  {
    materia: 'Relaciones laborales · contratación',
    supuesto:
      'Empresa que celebra 3 contratos temporales en fraude de ley (art. 7.2 LISOS). Fuera del manual de Seguridad Social: régimen sancionador de relaciones laborales.',
    pregunta: '¿Cómo se sanciona?',
    opciones: [
      { k: 'a', t: 'Una sola infracción para los 3 contratos' },
      { k: 'b', t: 'Una infracción por cada contrato (art. 40.1.b)' },
      { k: 'c', t: 'No es sancionable' },
    ],
    correcta: 'b',
    precepto: 'Art. 15 ET (contratación temporal) en relación con el art. 7.2 LISOS.',
    calificacion: 'GRAVE — art. 7.2 LISOS. Una infracción POR CADA contrato.',
    tipificacion:
      'Art. 40.1.b) LISOS (graves de relaciones laborales): grado mínimo 751–1.500 €, medio 1.501–3.750 €, máximo 3.751–7.500 € por contrato.',
    cuantia: '3 contratos = 3 infracciones, cada una graduada por el art. 39.2 dentro de esos tramos.',
    prontoPago: 'Con pronto pago (−40 %) sobre cada multa pecuniaria, misma reducción del 40 %.',
    nota: 'Cuantías de relaciones laborales: verifica los importes vigentes (este caso no procede del manual de SS).',
  },
]
