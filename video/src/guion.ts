// Guion del caso práctico "Control de empleo en una cafetería".
// Escenificación ficticia con fines formativos. Personas y local inventados.

export const FPS = 30;

export type Quien = "INSP" | "LUCIA" | "RAMON" | "DANI";
export type Pose = "stand" | "card" | "folder" | "paper" | "tray" | "point" | "hands" | "arms" | "hips" | "give";
export type Expr = "neutral" | "calm" | "tense" | "angry" | "nervous";
export type Plano = "general" | "medio" | "primer" | "dos";
export type Sfx = "campana" | "pasos" | "taza" | "papel" | "golpe" | "vapor" | "mesa" | "coche";

export type EstadoPersonaje = {
  x: number;
  pose: Pose;
  expr: Expr;
  visible: boolean;
  desde?: number; // entra caminando desde esta x al empezar la escena
  entraEn?: number; // segundos
};

export type Linea = {
  quien: Quien;
  a?: Quien; // a quién se dirige
  texto: string;
  tension: number; // 0..1
  plano?: Plano;
  reaccion?: Quien; // corte a la reacción de este personaje en la segunda mitad
  sfx?: Sfx;
  cambios?: Partial<Record<Quien, Partial<EstadoPersonaje>>>;
  extra?: number;
};

export type Nota = {
  enLinea: number;
  hastaLinea?: number;
  titulo: string;
  texto: string;
  ref: string;
  tono?: "info" | "alerta";
};

export type EscenaDialogo = {
  numero: number;
  capitulo: string;
  inicio: number; // segundos antes de la primera línea
  reparto: Record<Quien, EstadoPersonaje>;
  lineas: Linea[];
  notas: Nota[];
  sfxInicio?: { t: number; sfx: Sfx }[];
  citacionEnBarra?: number; // índice de línea desde el que la citación queda sobre la barra
};

export const NOMBRES: Record<Quien, { nombre: string; rol: string; color: string }> = {
  INSP: { nombre: "Inspector", rol: "ITSS", color: "#4FA3FF" },
  LUCIA: { nombre: "Lucía", rol: "camarera", color: "#FFB45C" },
  RAMON: { nombre: "Ramón", rol: "titular del negocio", color: "#FF6B5C" },
  DANI: { nombre: "Dani", rol: "el «extra»", color: "#7BE0A0" },
};

const oculto = (x: number): EstadoPersonaje => ({ x, pose: "stand", expr: "neutral", visible: false });

// ───────────────────────── ESCENA 1 ─────────────────────────
const e1: EscenaDialogo = {
  numero: 1,
  capitulo: "Entrada y acreditación",
  inicio: 3.4,
  sfxInicio: [
    { t: 0.1, sfx: "campana" },
    { t: 0.3, sfx: "pasos" },
    { t: 1.8, sfx: "taza" },
  ],
  reparto: {
    INSP: { x: 1260, pose: "folder", expr: "calm", visible: true, desde: 2080, entraEn: 0.2 },
    LUCIA: { x: 720, pose: "hands", expr: "neutral", visible: true },
    RAMON: oculto(2100),
    DANI: { x: 1720, pose: "tray", expr: "neutral", visible: true, desde: 1500, entraEn: 0.6 },
  },
  lineas: [
    {
      quien: "INSP",
      a: "LUCIA",
      texto: "Buenos días. Inspección de Trabajo y Seguridad Social. Esta es mi acreditación.",
      tension: 0.1,
      plano: "dos",
      cambios: { INSP: { pose: "card" } },
    },
    {
      quien: "INSP",
      a: "LUCIA",
      texto: "Vamos a hacer un control de empleo. Necesito identificar a todas las personas que están trabajando ahora mismo.",
      tension: 0.2,
      plano: "medio",
      reaccion: "LUCIA",
      cambios: { INSP: { pose: "paper" }, LUCIA: { expr: "nervous" } },
    },
    {
      quien: "LUCIA",
      a: "INSP",
      texto: "Eh… yo solo estoy echando una mano. El jefe está dentro, en el almacén.",
      tension: 0.3,
      plano: "medio",
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

// ───────────────────────── ESCENA 2 ─────────────────────────
const e2: EscenaDialogo = {
  numero: 2,
  capitulo: "La identificación",
  inicio: 1.2,
  sfxInicio: [{ t: 0.4, sfx: "vapor" }],
  reparto: {
    INSP: { x: 1180, pose: "paper", expr: "calm", visible: true },
    LUCIA: { x: 760, pose: "hands", expr: "nervous", visible: true },
    RAMON: oculto(2100),
    DANI: { x: 1740, pose: "tray", expr: "neutral", visible: true },
  },
  lineas: [
    { quien: "INSP", a: "LUCIA", texto: "¿Me dice su nombre y me enseña el DNI o el NIE, por favor?", tension: 0.3, plano: "dos" },
    {
      quien: "LUCIA",
      a: "INSP",
      texto: "No lo llevo encima… Me lo he dejado en casa.",
      tension: 0.5,
      plano: "primer",
      cambios: { LUCIA: { pose: "arms", expr: "tense" } },
    },
    {
      quien: "INSP",
      a: "LUCIA",
      texto: "No hay problema. Deme su nombre completo, fecha de nacimiento y número de documento. Lo comprobaremos.",
      tension: 0.45,
      plano: "medio",
      reaccion: "LUCIA",
    },
    {
      quien: "LUCIA",
      a: "INSP",
      texto: "¿Y esto para qué es? ¿Me va a pasar algo a mí?",
      tension: 0.55,
      plano: "primer",
      cambios: { LUCIA: { pose: "hands", expr: "nervous" } },
    },
    {
      quien: "INSP",
      a: "LUCIA",
      texto: "Es una comprobación. Usted no tiene nada que temer. ¿Desde cuándo trabaja aquí, qué horario hace y cuánto cobra?",
      tension: 0.4,
      plano: "medio",
    },
    {
      quien: "LUCIA",
      a: "INSP",
      texto: "Desde hace tres semanas. De siete a tres. Me pagan a final de mes… en mano.",
      tension: 0.45,
      plano: "primer",
      reaccion: "INSP",
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

// ───────────────────────── ESCENA 3 ─────────────────────────
const e3: EscenaDialogo = {
  numero: 3,
  capitulo: "Aparece el empresario",
  inicio: 2.0,
  sfxInicio: [
    { t: 0.0, sfx: "pasos" },
    { t: 1.2, sfx: "golpe" },
  ],
  reparto: {
    INSP: { x: 1120, pose: "paper", expr: "calm", visible: true },
    LUCIA: { x: 680, pose: "hands", expr: "tense", visible: true },
    RAMON: { x: 1460, pose: "stand", expr: "angry", visible: true, desde: 2120, entraEn: 0 },
    DANI: { x: 1800, pose: "tray", expr: "nervous", visible: true },
  },
  lineas: [
    {
      quien: "RAMON",
      a: "INSP",
      texto: "¿Qué pasa aquí? ¿Quién es usted para interrogar a mi gente en plena hora del café?",
      tension: 0.65,
      plano: "primer",
      cambios: { RAMON: { pose: "point" } },
    },
    {
      quien: "INSP",
      a: "RAMON",
      texto: "Inspector de Trabajo. Aquí tiene mi acreditación. ¿Es usted el titular del negocio?",
      tension: 0.55,
      plano: "dos",
      cambios: { INSP: { pose: "card" }, RAMON: { pose: "hips" } },
    },
    {
      quien: "RAMON",
      a: "INSP",
      texto: "Sí, el dueño soy yo. Pero vuelva otro día, que ahora no tengo tiempo.",
      tension: 0.65,
      plano: "medio",
      reaccion: "LUCIA",
      cambios: { RAMON: { pose: "arms" }, INSP: { pose: "folder" } },
    },
    {
      quien: "INSP",
      a: "RAMON",
      texto: "La visita no necesita aviso previo y no va a interrumpir su servicio. Serán unos minutos.",
      tension: 0.55,
      plano: "medio",
      reaccion: "RAMON",
    },
    {
      quien: "INSP",
      a: "DANI",
      texto: "¿Quién es el chico que está sirviendo las mesas?",
      tension: 0.6,
      plano: "general",
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

// ───────────────────────── ESCENA 4 ─────────────────────────
const e4: EscenaDialogo = {
  numero: 4,
  capitulo: "¿Trabajador o «prueba»?",
  inicio: 1.0,
  reparto: {
    INSP: { x: 1340, pose: "paper", expr: "calm", visible: true },
    LUCIA: { x: 560, pose: "hands", expr: "tense", visible: true },
    RAMON: { x: 1000, pose: "arms", expr: "angry", visible: true },
    DANI: { x: 1780, pose: "tray", expr: "nervous", visible: true },
  },
  lineas: [
    {
      quien: "RAMON",
      a: "INSP",
      texto: "¿Dani? Ese no es trabajador. Ha venido hoy a hacer una prueba, como extra. Ni cobra ni nada.",
      tension: 0.7,
      plano: "medio",
      reaccion: "DANI",
      cambios: { RAMON: { pose: "point" } },
    },
    {
      quien: "INSP",
      a: "DANI",
      texto: "Dani, ¿desde qué hora está aquí y qué está haciendo?",
      tension: 0.6,
      plano: "general",
      sfx: "mesa",
      cambios: { RAMON: { pose: "arms" }, DANI: { x: 1620, pose: "stand" } },
    },
    {
      quien: "DANI",
      a: "INSP",
      texto: "Desde las ocho. Sirvo mesas y recojo. Me dijo que si salía bien me quedaba… y que me pagaba la semana.",
      tension: 0.75,
      plano: "primer",
      reaccion: "RAMON",
      cambios: { DANI: { pose: "hands" } },
    },
    {
      quien: "RAMON",
      a: "INSP",
      texto: "¡Es una prueba! ¡Lo hace todo el mundo!",
      tension: 0.85,
      plano: "primer",
      sfx: "golpe",
      cambios: { RAMON: { pose: "hands", expr: "angry" }, DANI: { expr: "tense", pose: "stand" } },
    },
    {
      quien: "INSP",
      a: "RAMON",
      texto: "Lleva tres horas atendiendo a clientes, con delantal del local y siguiendo sus instrucciones. Eso es trabajar.",
      tension: 0.75,
      plano: "medio",
      reaccion: "RAMON",
    },
    {
      quien: "INSP",
      a: "RAMON",
      texto: "El periodo de prueba existe, pero dentro de un contrato. Y el alta en la Seguridad Social tiene que ser antes de empezar.",
      tension: 0.7,
      plano: "dos",
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
      titulo: "Presunción de laboralidad",
      texto: "Se presume el contrato entre quien presta un servicio por cuenta y dentro del ámbito de organización de otro y quien lo recibe a cambio de retribución.",
      ref: "Art. 8.1 y 1.1 ET",
    },
    {
      enLinea: 4,
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

// ───────────────────────── ESCENA 5 ─────────────────────────
const e5: EscenaDialogo = {
  numero: 5,
  capitulo: "La citación",
  inicio: 1.0,
  citacionEnBarra: 5,
  reparto: {
    INSP: { x: 1180, pose: "give", expr: "calm", visible: true },
    LUCIA: { x: 620, pose: "hands", expr: "tense", visible: true },
    RAMON: { x: 1480, pose: "arms", expr: "angry", visible: true },
    DANI: { x: 1820, pose: "stand", expr: "nervous", visible: true },
  },
  lineas: [
    {
      quien: "INSP",
      a: "RAMON",
      texto: "Le entrego una citación para comparecer en la Inspección el día 20 a las diez, con la documentación que se relaciona.",
      tension: 0.65,
      plano: "dos",
      sfx: "papel",
    },
    { quien: "INSP", a: "RAMON", texto: "Fírmeme el «recibí», por favor.", tension: 0.7, plano: "medio", reaccion: "RAMON" },
    {
      quien: "RAMON",
      a: "INSP",
      texto: "Yo no firmo nada. Si firmo, estoy reconociendo que el chico trabaja aquí.",
      tension: 0.9,
      plano: "primer",
      cambios: { RAMON: { pose: "hands" } },
    },
    {
      quien: "INSP",
      a: "RAMON",
      texto: "La firma solo acredita que la ha recibido. No supone reconocer ningún hecho.",
      tension: 0.8,
      plano: "primer",
    },
    {
      quien: "RAMON",
      a: "INSP",
      texto: "Pues no firmo. Y llévesela.",
      tension: 1,
      plano: "primer",
      sfx: "golpe",
      cambios: { RAMON: { pose: "arms" } },
    },
    {
      quien: "INSP",
      a: "RAMON",
      texto: "Queda usted notificado igualmente. Hago constar su negativa a firmar, con la hora y las circunstancias, y le dejo la citación.",
      tension: 0.8,
      plano: "general",
      sfx: "papel",
      cambios: { INSP: { x: 1060, pose: "folder" } },
    },
    {
      quien: "INSP",
      a: "RAMON",
      texto: "Si no comparece o no aporta la documentación, podría constituir una infracción por obstrucción.",
      tension: 0.7,
      plano: "medio",
      reaccion: "RAMON",
      cambios: { INSP: { x: 1200, pose: "paper" } },
    },
    {
      quien: "RAMON",
      a: "INSP",
      texto: "…Está bien. Déjela ahí.",
      tension: 0.4,
      plano: "primer",
      cambios: { RAMON: { pose: "stand", expr: "tense" } },
      extra: 0.8,
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

export const PUNTOS_CLAVE = [
  { t: "Acreditarse y explicar el objeto de la visita", r: "Art. 13 Ley 23/2015" },
  { t: "Identificar a todas las personas presentes: nombre, documento, tarea, horario, salario y antigüedad", r: "Art. 13.3.a) Ley 23/2015" },
  { t: "Documentar hechos objetivos, no opiniones: uniforme, tareas, tiempo, quién da las órdenes", r: "Art. 23 Ley 23/2015" },
  { t: "«Prueba» o «extra» no excluyen la relación laboral: alta previa a la prestación", r: "Arts. 8.1 y 14 ET · Art. 32.3 RD 84/1996" },
  { t: "Falta de alta: infracción grave, con su liquidación de cuotas", r: "Art. 22.2 LISOS" },
  { t: "Negativa a firmar: se hace constar y la notificación surte efecto", r: "Art. 41.5 Ley 39/2015" },
  { t: "Negativa a identificarse, impedir la actuación o no comparecer: obstrucción", r: "Art. 50 LISOS" },
];
