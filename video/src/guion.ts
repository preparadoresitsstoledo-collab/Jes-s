// Guion del caso práctico "Control de empleo en una cafetería".
// Escenificación ficticia con fines formativos. Personas y local inventados.

export const FPS = 30;

export type Quien = "INSP" | "LUCIA" | "RAMON" | "DANI";

export type Pose = "stand" | "card" | "folder" | "paper" | "tray" | "arms" | "point" | "hands";
export type Expr = "neutral" | "calm" | "tense" | "angry" | "nervous";

export type EstadoPersonaje = {
  x: number;
  pose: Pose;
  expr: Expr;
  facing: 1 | -1; // 1 mira a la derecha, -1 a la izquierda
  visible: boolean;
};

export type Linea = {
  quien: Quien;
  texto: string;
  tension: number; // 0..1
  // Cambios de posición / pose / expresión que se aplican al empezar la línea
  cambios?: Partial<Record<Quien, Partial<EstadoPersonaje>>>;
  extra?: number; // segundos de pausa adicional
};

export type Nota = {
  enLinea: number; // índice de línea en que aparece
  hastaLinea?: number; // índice de línea en que desaparece (inclusive). Por defecto, la misma + 1
  titulo: string;
  texto: string;
  ref: string;
  tono?: "info" | "alerta";
};

export type EscenaDialogo = {
  tipo: "interior";
  capitulo: string;
  numero: number;
  reparto: Record<Quien, EstadoPersonaje>;
  lineas: Linea[];
  notas: Nota[];
};

export const NOMBRES: Record<Quien, { nombre: string; rol: string; color: string }> = {
  INSP: { nombre: "Inspector", rol: "ITSS", color: "#4FA3FF" },
  LUCIA: { nombre: "Lucía", rol: "camarera", color: "#FFB45C" },
  RAMON: { nombre: "Ramón", rol: "titular del negocio", color: "#FF6B5C" },
  DANI: { nombre: "Dani", rol: "el «extra»", color: "#7BE0A0" },
};

const oculto = (x: number): EstadoPersonaje => ({ x, pose: "stand", expr: "neutral", facing: -1, visible: false });

// ───────────────────────── ESCENA 1: acreditación ─────────────────────────
const e1: EscenaDialogo = {
  tipo: "interior",
  numero: 1,
  capitulo: "Entrada y acreditación",
  reparto: {
    INSP: { x: 1260, pose: "folder", expr: "calm", facing: -1, visible: true },
    LUCIA: { x: 720, pose: "hands", expr: "neutral", facing: 1, visible: true },
    RAMON: oculto(1500),
    DANI: { x: 1700, pose: "tray", expr: "neutral", facing: -1, visible: true },
  },
  lineas: [
    {
      quien: "INSP",
      texto: "Buenos días. Inspección de Trabajo y Seguridad Social. Esta es mi acreditación.",
      tension: 0.1,
      cambios: { INSP: { pose: "card" } },
    },
    {
      quien: "INSP",
      texto: "Vamos a hacer un control de empleo. Necesito identificar a todas las personas que están trabajando ahora mismo.",
      tension: 0.2,
      cambios: { INSP: { pose: "folder" }, LUCIA: { expr: "nervous" } },
    },
    {
      quien: "LUCIA",
      texto: "Eh… yo solo estoy echando una mano. El jefe está dentro, en la cocina.",
      tension: 0.3,
      cambios: { LUCIA: { pose: "point" } },
    },
  ],
  notas: [
    {
      enLinea: 0,
      hastaLinea: 1,
      titulo: "Entrada sin previo aviso",
      texto: "El inspector, acreditado, puede entrar libremente y en cualquier momento en el centro de trabajo.",
      ref: "Art. 13.1 Ley 23/2015, ORITSS",
    },
    {
      enLinea: 2,
      titulo: "«Echar una mano»",
      texto: "Primer indicio a documentar: realiza tareas propias del negocio, tras la barra, en horario de servicio.",
      ref: "Hechos constatados in situ",
    },
  ],
};

// ───────────────────────── ESCENA 2: identificación ─────────────────────────
const e2: EscenaDialogo = {
  tipo: "interior",
  numero: 2,
  capitulo: "La identificación",
  reparto: {
    INSP: { x: 1180, pose: "paper", expr: "calm", facing: -1, visible: true },
    LUCIA: { x: 760, pose: "hands", expr: "nervous", facing: 1, visible: true },
    RAMON: oculto(1500),
    DANI: { x: 1720, pose: "tray", expr: "neutral", facing: -1, visible: true },
  },
  lineas: [
    { quien: "INSP", texto: "¿Me dice su nombre y me enseña el DNI o el NIE, por favor?", tension: 0.3 },
    {
      quien: "LUCIA",
      texto: "No lo llevo encima… Me lo he dejado en casa.",
      tension: 0.5,
      cambios: { LUCIA: { pose: "arms", expr: "tense" } },
    },
    {
      quien: "INSP",
      texto: "No hay problema. Deme su nombre completo, fecha de nacimiento y número de documento. Lo comprobaremos.",
      tension: 0.45,
    },
    {
      quien: "LUCIA",
      texto: "¿Y esto para qué es? ¿Me va a pasar algo a mí?",
      tension: 0.55,
      cambios: { LUCIA: { pose: "hands", expr: "nervous" } },
    },
    {
      quien: "INSP",
      texto: "Es una comprobación. Usted no tiene nada que temer. ¿Desde cuándo trabaja aquí, qué horario hace y cuánto cobra?",
      tension: 0.4,
    },
    {
      quien: "LUCIA",
      texto: "Desde hace tres semanas. De siete a tres. Me pagan a final de mes… en mano.",
      tension: 0.45,
      cambios: { LUCIA: { expr: "tense" } },
      extra: 0.5,
    },
  ],
  notas: [
    {
      enLinea: 0,
      hastaLinea: 1,
      titulo: "Exigir identificación",
      texto: "Facultad de exigir la identificación, o la razón de su presencia, de quienes se encuentren en el centro.",
      ref: "Art. 13.3.a) Ley 23/2015",
    },
    {
      enLinea: 2,
      hastaLinea: 3,
      titulo: "Sin documento: no se para",
      texto: "Se recogen los datos de filiación y se verifican después en las bases de datos. La negativa a identificarse es otra cosa: obstrucción.",
      ref: "Art. 50 LISOS",
      tono: "alerta",
    },
    {
      enLinea: 4,
      hastaLinea: 5,
      titulo: "Toma de datos",
      texto: "Antigüedad, horario, tareas, salario y forma de pago. Preguntas abiertas, sin presencia del empresario.",
      ref: "Diligencia de toma de datos",
    },
  ],
};

// ───────────────────────── ESCENA 3: el empresario ─────────────────────────
const e3: EscenaDialogo = {
  tipo: "interior",
  numero: 3,
  capitulo: "Aparece el empresario",
  reparto: {
    INSP: { x: 1120, pose: "paper", expr: "calm", facing: -1, visible: true },
    LUCIA: { x: 680, pose: "hands", expr: "tense", facing: 1, visible: true },
    RAMON: { x: 1470, pose: "stand", expr: "angry", facing: -1, visible: true },
    DANI: { x: 1800, pose: "tray", expr: "nervous", facing: -1, visible: true },
  },
  lineas: [
    {
      quien: "RAMON",
      texto: "¿Qué pasa aquí? ¿Quién es usted para interrogar a mi gente en plena hora del café?",
      tension: 0.65,
      cambios: { RAMON: { pose: "point" }, INSP: { facing: 1 } },
    },
    {
      quien: "INSP",
      texto: "Inspector de Trabajo. Aquí tiene mi acreditación. ¿Es usted el titular del negocio?",
      tension: 0.55,
      cambios: { INSP: { pose: "card" }, RAMON: { pose: "stand" } },
    },
    {
      quien: "RAMON",
      texto: "Sí, el dueño soy yo. Pero vuelva otro día, que ahora no tengo tiempo.",
      tension: 0.65,
      cambios: { RAMON: { pose: "arms" }, INSP: { pose: "folder" } },
    },
    {
      quien: "INSP",
      texto: "La visita no necesita aviso previo y no va a interrumpir su servicio. Serán unos minutos.",
      tension: 0.55,
    },
    {
      quien: "INSP",
      texto: "¿Quién es el chico que está sirviendo las mesas?",
      tension: 0.6,
      cambios: { INSP: { pose: "point" } },
    },
  ],
  notas: [
    {
      enLinea: 0,
      hastaLinea: 2,
      titulo: "Desescalar",
      texto: "Tono sereno, volver a identificarse y explicar el objeto de la visita. No entrar en la discusión.",
      ref: "Buena práctica inspectora",
    },
    {
      enLinea: 3,
      hastaLinea: 4,
      titulo: "«Vuelva otro día»",
      texto: "Impedir o retrasar la actuación inspectora puede constituir infracción por obstrucción.",
      ref: "Art. 50 LISOS",
      tono: "alerta",
    },
  ],
};

// ───────────────────────── ESCENA 4: ¿trabajador o prueba? ─────────────────────────
const e4: EscenaDialogo = {
  tipo: "interior",
  numero: 4,
  capitulo: "¿Trabajador o «prueba»?",
  reparto: {
    INSP: { x: 1360, pose: "paper", expr: "calm", facing: 1, visible: true },
    LUCIA: { x: 560, pose: "hands", expr: "tense", facing: 1, visible: true },
    RAMON: { x: 1000, pose: "arms", expr: "angry", facing: 1, visible: true },
    DANI: { x: 1760, pose: "tray", expr: "nervous", facing: -1, visible: true },
  },
  lineas: [
    {
      quien: "RAMON",
      texto: "¿Dani? Ese no es trabajador. Ha venido hoy a hacer una prueba, como extra. Ni cobra ni nada.",
      tension: 0.7,
      cambios: { RAMON: { pose: "point" } },
    },
    {
      quien: "INSP",
      texto: "Dani, ¿desde qué hora está aquí y qué está haciendo?",
      tension: 0.6,
      cambios: { RAMON: { pose: "arms" } },
    },
    {
      quien: "DANI",
      texto: "Desde las ocho. Sirvo mesas y recojo. Me dijo que si salía bien me quedaba… y que me pagaba la semana.",
      tension: 0.75,
    },
    {
      quien: "RAMON",
      texto: "¡Es una prueba! ¡Lo hace todo el mundo!",
      tension: 0.85,
      cambios: { RAMON: { pose: "hands", expr: "angry" }, DANI: { expr: "tense" } },
    },
    {
      quien: "INSP",
      texto: "Lleva tres horas atendiendo a clientes, con delantal del local y siguiendo sus instrucciones. Eso es trabajar.",
      tension: 0.75,
      cambios: { INSP: { facing: -1 } },
    },
    {
      quien: "INSP",
      texto: "El periodo de prueba existe, pero dentro de un contrato. Y el alta en la Seguridad Social tiene que ser antes de empezar.",
      tension: 0.7,
      extra: 0.5,
    },
  ],
  notas: [
    {
      enLinea: 1,
      hastaLinea: 2,
      titulo: "Preguntar al propio trabajador",
      texto: "Su versión, por separado: hora de inicio, tareas, quién le da órdenes, si se ha pactado retribución.",
      ref: "Hechos constatados",
    },
    {
      enLinea: 3,
      hastaLinea: 3,
      titulo: "Presunción de laboralidad",
      texto: "Se presume el contrato entre quien presta un servicio por cuenta y dentro del ámbito de organización de otro y quien lo recibe a cambio de retribución.",
      ref: "Art. 8.1 y 1.1 ET",
    },
    {
      enLinea: 4,
      hastaLinea: 4,
      titulo: "Prueba ≠ fuera del contrato",
      texto: "Una selección breve y no productiva puede no ser relación laboral. Atender clientes reales durante horas, sí lo es.",
      ref: "Art. 14 ET · periodo de prueba",
      tono: "alerta",
    },
    {
      enLinea: 5,
      titulo: "Alta previa",
      texto: "El alta debe solicitarse antes del comienzo de la prestación de servicios. No hacerlo es infracción grave.",
      ref: "Art. 32.3 RD 84/1996 · Art. 22.2 LISOS",
      tono: "alerta",
    },
  ],
};

// ───────────────────────── ESCENA 5: la citación ─────────────────────────
const e5: EscenaDialogo = {
  tipo: "interior",
  numero: 5,
  capitulo: "La citación",
  reparto: {
    INSP: { x: 1130, pose: "paper", expr: "calm", facing: 1, visible: true },
    LUCIA: { x: 620, pose: "hands", expr: "tense", facing: 1, visible: true },
    RAMON: { x: 1480, pose: "arms", expr: "angry", facing: -1, visible: true },
    DANI: { x: 1810, pose: "stand", expr: "nervous", facing: -1, visible: true },
  },
  lineas: [
    {
      quien: "INSP",
      texto: "Le entrego una citación para comparecer en la Inspección el día 20 a las diez, con la documentación que se relaciona.",
      tension: 0.65,
    },
    { quien: "INSP", texto: "Fírmeme el «recibí», por favor.", tension: 0.7 },
    {
      quien: "RAMON",
      texto: "Yo no firmo nada. Si firmo, estoy reconociendo que el chico trabaja aquí.",
      tension: 0.9,
      cambios: { RAMON: { pose: "hands" } },
    },
    {
      quien: "INSP",
      texto: "La firma solo acredita que la ha recibido. No supone reconocer ningún hecho.",
      tension: 0.8,
    },
    {
      quien: "RAMON",
      texto: "Pues no firmo. Y llévesela.",
      tension: 1,
      cambios: { RAMON: { pose: "arms" } },
    },
    {
      quien: "INSP",
      texto: "Queda usted notificado igualmente. Hago constar su negativa a firmar, con la hora y las circunstancias, y le dejo la citación.",
      tension: 0.8,
      cambios: { INSP: { pose: "folder" } },
    },
    {
      quien: "INSP",
      texto: "Si no comparece o no aporta la documentación, podría constituir una infracción por obstrucción.",
      tension: 0.7,
    },
    {
      quien: "RAMON",
      texto: "…Está bien. Déjela ahí.",
      tension: 0.4,
      cambios: { RAMON: { pose: "stand", expr: "tense" } },
      extra: 0.6,
    },
  ],
  notas: [
    {
      enLinea: 0,
      hastaLinea: 1,
      titulo: "Requerimiento de comparecencia",
      texto: "Lugar, fecha, hora y documentación concreta. Se entrega al titular o a quien esté al frente del centro.",
      ref: "Ley 23/2015 · RD 928/1998",
    },
    {
      enLinea: 2,
      hastaLinea: 4,
      titulo: "Firmar ≠ reconocer",
      texto: "La firma solo acredita que se ha recibido. Si se rechaza, se hace constar y el trámite se da por efectuado.",
      ref: "Art. 41.5 Ley 39/2015",
      tono: "alerta",
    },
    {
      enLinea: 5,
      hastaLinea: 7,
      titulo: "Presunción de certeza",
      texto: "Los hechos constatados por el inspector y formalizados en acta tienen presunción de certeza, salvo prueba en contrario.",
      ref: "Art. 23 Ley 23/2015",
    },
  ],
};

export const ESCENAS: EscenaDialogo[] = [e1, e2, e3, e4, e5];

export const duracionLinea = (l: Linea) =>
  Math.round((1.3 + l.texto.length / 15 + (l.extra ?? 0)) * FPS);

export const duracionEscena = (e: EscenaDialogo) =>
  e.lineas.reduce((acc, l) => acc + duracionLinea(l), 0) + Math.round(1.2 * FPS);

export const PUNTOS_CLAVE = [
  { t: "Acreditarse y explicar el objeto de la visita", r: "Art. 13 Ley 23/2015" },
  { t: "Identificar a todas las personas presentes: nombre, documento, tarea, horario, salario y antigüedad", r: "Art. 13.3.a) Ley 23/2015" },
  { t: "Documentar hechos objetivos, no opiniones: uniforme, tareas, tiempo, quién da las órdenes", r: "Art. 23 Ley 23/2015" },
  { t: "«Prueba» o «extra» no excluyen la relación laboral: alta previa a la prestación", r: "Arts. 8.1 y 14 ET · Art. 32.3 RD 84/1996" },
  { t: "Falta de alta: infracción grave, con su liquidación de cuotas", r: "Art. 22.2 LISOS" },
  { t: "Negativa a firmar: se hace constar y la notificación surte efecto", r: "Art. 41.5 Ley 39/2015" },
  { t: "Negativa a identificarse, impedir la actuación o no comparecer: obstrucción", r: "Art. 50 LISOS" },
];
