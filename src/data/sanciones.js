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
    materia: 'Seguridad Social · deducciones fraudulentas (IT)',
    supuesto:
      'Empresa que NO abona al trabajador la prestación de incapacidad temporal en pago delegado (colaboración obligatoria) pero SÍ se deduce/compensa esas cuantías en los documentos de cotización (RLC y RNT), a sabiendas de que no las ha pagado.',
    pregunta: '¿Cómo se califica esta conducta?',
    opciones: [
      { k: 'a', t: 'Grave (art. 22.4): mero impago de la IT' },
      { k: 'b', t: 'Muy grave (art. 23.1.f): impago + compensación fraudulenta en RLC/RNT' },
      { k: 'c', t: 'Leve' },
    ],
    correcta: 'b',
    precepto:
      'Art. 20.1 y 2 de la Orden de 25/11/1966 (colaboración) en relación con los arts. 102.1.b), 102.2 y 142.1 LGSS, y RD 2064/1995 y RD 1415/2004.',
    calificacion:
      'MUY GRAVE — art. 23.1.f) LISOS. Requiere ánimo fraudulento (dolo) al compensar en los RLC/RNT una IT no abonada.',
    tipificacion:
      'Art. 40.1.d).1 LISOS: multa = % del importe no ingresado (mín. 50–65 %, medio 65,01–80 %, máx. 80,01–100 %), en acta COORDINADA con el acta de liquidación de las deducciones indebidas.',
    cuantia: `Ej.: 8.000 € compensados indebidamente → grado mínimo → entre ${eur(4000)} (50 %) y ${eur(5200)} (65 %), más el acta de liquidación por los 8.000 €.`,
    prontoPago: `Con pronto pago (−40 %) sobre, p. ej., una multa del 60 % (${eur(4800)}): ${eur(pp(4800))}. La liquidación de las deducciones se abona íntegra.`,
    nota: 'Sin ánimo fraudulento acreditado, la conducta sería grave (art. 22.3); el mero impago de la IT, sin compensarlo, es grave (art. 22.4).',
  },
  {
    materia: 'Seguridad Social · prestaciones (desempleo)',
    supuesto:
      'Empresa que da ocupación a un perceptor de la prestación por desempleo, incompatible con el trabajo por cuenta ajena, sin haberle dado de alta con carácter previo.',
    pregunta: '¿Qué sanción corresponde por cada trabajador?',
    opciones: [
      { k: 'a', t: '3.750 € (como una falta de alta ordinaria)' },
      { k: 'b', t: '12.001 € por trabajador (grado mínimo, muy grave)' },
      { k: 'c', t: '70 €' },
    ],
    correcta: 'b',
    precepto:
      'Arts. 139.1 y 140.1 en relación con el art. 268 y ss. LGSS (desempleo) y RD 84/1996 (altas). Una infracción por cada trabajador (art. 23.2 LISOS).',
    calificacion: 'MUY GRAVE — art. 23.1.a) LISOS.',
    tipificacion:
      'Art. 40.1.e).2 LISOS: grado mínimo 12.001 € por trabajador, incrementable por nº de afectados (2→+20 %, 3→+30 %, 4→+40 %, 5+→+50 %).',
    cuantia: `1 beneficiario → ${eur(12001)}. Con varios, cada sanción se incrementa (p. ej., 4 → +40 % → ${eur(16801)} c/u).`,
    prontoPago: `Con pronto pago (−40 %): ${eur(12001)} → ${eur(pp(12001))} por trabajador (salvo que proceda sanción accesoria, art. 46 LISOS, que excluye el carácter pecuniario).`,
    nota: 'La cuantía del art. 23.1.a) no puede exceder de 225.018 € por infracción.',
  },
  {
    materia: 'Extranjería · sin residencia ni trabajo',
    supuesto:
      'Empresa que ocupa a un trabajador extranjero que carece de autorización de residencia Y de trabajo (situación irregular).',
    pregunta: '¿Qué régimen y cuantía se aplican?',
    opciones: [
      { k: 'a', t: 'Muy grave art. 37.1 LISOS → 7.501 €' },
      { k: 'b', t: 'Muy grave art. 54.1.d) LOEX → 10.001 € por trabajador' },
      { k: 'c', t: 'Leve → 50 €' },
    ],
    correcta: 'b',
    precepto:
      'Art. 36.1 y 4 de la LO 4/2000 (LOEX) y arts. 63.1 y 64.1 del RD 557/2011. Una infracción por cada trabajador extranjero.',
    calificacion: 'MUY GRAVE — art. 54.1.d) LO 4/2000 (LOEX), no la LISOS.',
    tipificacion:
      'Art. 55.1.c) LOEX y art. 254.4.c) RD 557/2011: grado mínimo 10.001 € por trabajador. Se gradúa solo por los criterios del art. 55.3 y 4 LOEX (culpabilidad, daño/riesgo, capacidad económica); NO se aplican las agravantes de la TRLISOS.',
    cuantia: `${eur(10001)} por cada trabajador (grado mínimo), MÁS el incremento del art. 48 de la Ley 62/2003: se añade la cuantía de las cuotas de Seguridad Social y conceptos de recaudación conjunta que hubieran correspondido desde el inicio de la prestación de servicios del trabajador extranjero.`,
    prontoPago:
      'El pronto pago del orden social (RD 688/2021) no opera igual en el procedimiento sancionador de extranjería (RD 557/2011): revísalo antes de aplicarlo.',
    nota: 'Clave: sin residencia NI trabajo → LOEX (54.1.d). El incremento del art. 48 Ley 62/2003 (cuotas de SS) opera en todos los supuestos de ocupación de extranjeros.',
  },
  {
    materia: 'Extranjería · con residencia, sin permiso de trabajo',
    supuesto:
      'Empresa que ocupa a un trabajador extranjero que SÍ tiene autorización de residencia válida, pero carece de autorización de trabajo.',
    pregunta: '¿Qué precepto y cuantía se aplican?',
    opciones: [
      { k: 'a', t: 'Art. 54.1.d) LOEX → 10.001 €' },
      { k: 'b', t: 'Art. 37.1 LISOS → 7.501 € (grado mínimo)' },
      { k: 'c', t: 'Leve → 50 €' },
    ],
    correcta: 'b',
    precepto:
      'Art. 36.1 y 4 de la LO 4/2000 y arts. 63.1 y 64.1 del RD 557/2011. Una infracción por cada trabajador extranjero.',
    calificacion: 'MUY GRAVE — art. 37.1 LISOS (TRLISOS), al tener residencia pero faltar la autorización de trabajo.',
    tipificacion: 'Art. 40.1.c) LISOS: grado mínimo 7.501 € (desde 1.10.2021; antes 6.251 €).',
    cuantia: `${eur(7501)} por cada trabajador (grado mínimo), MÁS el incremento del art. 48 de la Ley 62/2003: se añade la cuantía de las cuotas de Seguridad Social y conceptos de recaudación conjunta que hubieran correspondido desde el inicio de la prestación de servicios.`,
    prontoPago: `Con pronto pago (−40 %): ${eur(7501)} → ${eur(pp(7501))} por trabajador (la reducción se aplica sobre la sanción; el incremento del art. 48 sigue su régimen).`,
    nota: 'Clave: con residencia pero sin permiso de trabajo → art. 37.1 LISOS (no LOEX 54.1.d). El incremento del art. 48 Ley 62/2003 opera en todos los supuestos de ocupación de extranjeros.',
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
