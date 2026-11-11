import React from "react";
import type { Expr, Pose, Quien } from "./guion";

// Personaje plano en SVG. Coordenadas locales: 220 x 540, pies en y≈530.
// Se dibuja mirando a la derecha; facing=-1 refleja brazos y desplaza rasgos.

type Estilo = {
  piel: string;
  pelo: string;
  peinado: "corto" | "mono" | "calvo" | "flequillo";
  camisa: string;
  chaqueta?: string;
  delantal?: string;
  pantalon: string;
  zapatos: string;
  ancho: number;
  gafas?: boolean;
  bigote?: boolean;
};

export const ESTILOS: Record<Quien, Estilo> = {
  INSP: { piel: "#E8B998", pelo: "#4A4646", peinado: "corto", camisa: "#CFE3F7", chaqueta: "#1F3354", pantalon: "#26324A", zapatos: "#1A1A1A", ancho: 1, gafas: true },
  LUCIA: { piel: "#D9A07E", pelo: "#5B3420", peinado: "mono", camisa: "#2B2B2E", delantal: "#8C2F3C", pantalon: "#222", zapatos: "#111", ancho: 0.92 },
  RAMON: { piel: "#E2A684", pelo: "#8E8A86", peinado: "calvo", camisa: "#3E6B4E", pantalon: "#4B4237", zapatos: "#2A2018", ancho: 1.22, bigote: true },
  DANI: { piel: "#C98E6A", pelo: "#1E1A18", peinado: "flequillo", camisa: "#F4F4F2", delantal: "#1E1E22", pantalon: "#1E1E22", zapatos: "#0E0E0E", ancho: 0.95 },
};

// [hombro, codo] para brazo trasero y delantero. 0 = colgando; negativo = hacia delante.
const POSES: Record<Pose, { t: [number, number]; d: [number, number]; traseroDelante?: boolean }> = {
  stand: { t: [6, 4], d: [-6, -4] },
  card: { t: [5, 0], d: [-45, -78] },
  folder: { t: [4, 0], d: [-8, -8] },
  paper: { t: [-10, -88], d: [-14, -76], traseroDelante: true },
  tray: { t: [6, 2], d: [-22, -128] },
  point: { t: [6, 4], d: [-78, -18] },
  hands: { t: [8, -62], d: [-22, -62] },
  arms: { t: [-16, -80], d: [16, 82], traseroDelante: true },
  hips: { t: [34, -78], d: [-34, 78] },
  give: { t: [4, 2], d: [-58, -34] },
};

const L1 = 84;
const L2 = 80;

const Brazo: React.FC<{ x: number; y: number; a1: number; a2: number; manga: string; puno: string; piel: string; item?: React.ReactNode }> = ({ x, y, a1, a2, manga, puno, piel, item }) => (
  <g transform={`translate(${x} ${y}) rotate(${a1})`}>
    <rect x={-14} y={-10} width={28} height={L1 + 16} rx={14} fill={manga} />
    <g transform={`translate(0 ${L1}) rotate(${a2})`}>
      <rect x={-13} y={-8} width={26} height={L2 + 4} rx={13} fill={manga} />
      <rect x={-13} y={L2 - 12} width={26} height={8} rx={3} fill={puno} />
      <circle cx={0} cy={L2 + 2} r={13} fill={piel} />
      {item ? <g transform={`translate(0 ${L2}) rotate(${-(a1 + a2)})`}>{item}</g> : null}
    </g>
  </g>
);

const Acreditacion = () => (
  <g transform="translate(-4 -58)">
    <rect x={-36} y={-6} width={76} height={52} rx={5} fill="#FFFFFF" stroke="#1F3354" strokeWidth={2} />
    <rect x={-36} y={-6} width={76} height={12} rx={3} fill="#C8102E" />
    <rect x={-30} y={11} width={18} height={26} fill="#9FB3C8" />
    <rect x={-8} y={13} width={40} height={4} fill="#1F3354" />
    <rect x={-8} y={21} width={30} height={4} fill="#8796A8" />
    <rect x={-8} y={29} width={34} height={4} fill="#8796A8" />
  </g>
);

const Carpeta = () => (
  <g transform="translate(-10 -26)">
    <rect x={-6} y={0} width={46} height={66} rx={4} fill="#7A1F2B" />
    <rect x={-6} y={0} width={8} height={66} rx={2} fill="#5A1520" />
  </g>
);

const Portapapeles = () => (
  <g transform="translate(-30 -84)">
    <rect x={-36} y={0} width={76} height={98} rx={6} fill="#8A6A45" />
    <rect x={-30} y={10} width={64} height={82} fill="#FFFFFF" />
    <rect x={-10} y={-4} width={24} height={10} rx={3} fill="#B8B8B8" />
    {[22, 34, 46, 58, 70].map((yy) => (
      <rect key={yy} x={-24} y={yy} width={yy === 70 ? 30 : 52} height={4} fill="#9AA6B4" />
    ))}
  </g>
);

const Bandeja = () => (
  <g transform="translate(6 -16)">
    <ellipse cx={0} cy={6} rx={74} ry={9} fill="#B9BEC4" />
    <rect x={-52} y={-26} width={22} height={28} rx={4} fill="#FFFFFF" stroke="#C9CDD2" />
    <rect x={-16} y={-36} width={16} height={38} rx={3} fill="#E8D9A8" opacity={0.9} />
    <rect x={16} y={-22} width={30} height={24} rx={6} fill="#FFFFFF" stroke="#C9CDD2" />
  </g>
);

const Hoja = () => (
  <g transform="translate(-6 -50) rotate(-8)">
    <rect x={0} y={0} width={60} height={80} fill="#FFFFFF" stroke="#C9CDD2" />
    <rect x={8} y={10} width={40} height={5} fill="#1F3354" />
    {[24, 34, 44, 54].map((yy) => (
      <rect key={yy} x={8} y={yy} width={44} height={3} fill="#9AA6B4" />
    ))}
    <rect x={8} y={66} width={20} height={3} fill="#C8102E" />
  </g>
);

const Boligrafo = () => <rect x={-3} y={-34} width={6} height={36} rx={2} fill="#1F3354" transform="rotate(30)" />;

type Props = {
  quien: Quien;
  pose: Pose;
  expr: Expr;
  facing: 1 | -1;
  hablando: boolean;
  escuchando?: boolean;
  frame: number;
  caminando?: boolean;
};

export const Persona: React.FC<Props> = ({ quien, pose, expr, facing, hablando, escuchando, frame, caminando }) => {
  const s = ESTILOS[quien];
  const sem = quien.charCodeAt(0) + quien.length * 13;
  const respira = Math.sin(frame / 20 + sem) * 2;
  const p = POSES[pose];

  // gestos al hablar
  const g1 = hablando ? Math.sin(frame / 7 + sem) * 6 : 0;
  const g2 = hablando ? Math.sin(frame / 5 + sem) * 10 : 0;
  const gestual = pose === "hands" || pose === "stand" || pose === "point" || pose === "hips";
  // tomar notas mientras escucha
  const escribe = !hablando && escuchando && pose === "paper" && quien === "INSP";
  const lapiz = escribe ? Math.sin(frame / 2.2) * 5 : 0;

  const w = 120 * s.ancho;
  const xl = 110 - w / 2;
  const xr = 110 + w / 2;

  const paso = caminando ? Math.sin(frame / 3.6) * 20 : 0;
  const bob = caminando ? -Math.abs(Math.sin(frame / 3.6)) * 7 : 0;
  const balanceo = caminando ? Math.sin(frame / 3.6) * 14 : 0;

  // cabeza: asiente al hablar, se inclina al enfadarse
  const tiltCab = (hablando ? Math.sin(frame / 8 + sem) * 3.5 : Math.sin(frame / 45 + sem) * 1.5) + (expr === "angry" ? 4 * facing : 0) + (expr === "nervous" ? -3 * facing : 0);
  const lean = hablando && expr === "angry" ? 3 : 0;

  const fx = 4 * facing;
  const ojoY = 78;
  const boca = (() => {
    if (hablando) {
      const h = 3 + Math.abs(Math.sin(frame / 2.4 + Math.sin(frame / 7) * 2)) * 10;
      return <ellipse cx={110 + fx} cy={101} rx={expr === "angry" ? 11 : 9} ry={h / 2} fill="#5A1E1E" />;
    }
    switch (expr) {
      case "calm":
        return <path d={`M${100 + fx} 99 Q${110 + fx} 106 ${120 + fx} 99`} stroke="#5A1E1E" strokeWidth={3} fill="none" strokeLinecap="round" />;
      case "angry":
        return <path d={`M${100 + fx} 104 Q${110 + fx} 97 ${120 + fx} 104`} stroke="#5A1E1E" strokeWidth={3.5} fill="none" strokeLinecap="round" />;
      case "nervous":
        return <path d={`M${101 + fx} 101 q4 -3 8 0 q4 3 8 0`} stroke="#5A1E1E" strokeWidth={3} fill="none" strokeLinecap="round" />;
      case "tense":
        return <line x1={102 + fx} y1={101} x2={118 + fx} y2={101} stroke="#5A1E1E" strokeWidth={3.5} strokeLinecap="round" />;
      default:
        return <line x1={103 + fx} y1={100} x2={117 + fx} y2={100} stroke="#5A1E1E" strokeWidth={3} strokeLinecap="round" />;
    }
  })();

  const ceja = (cx: number, lado: -1 | 1) => {
    const inner = expr === "angry" ? 7 : expr === "nervous" ? -6 : expr === "tense" ? 3 : 0;
    const sube = hablando ? Math.max(0, Math.sin(frame / 11 + sem)) * -3 : 0;
    const y = (expr === "tense" || expr === "angry" ? 64 : 62) + sube;
    const y1 = lado === -1 ? y : y + inner;
    const y2 = lado === -1 ? y + inner : y;
    return <line x1={cx - 10} y1={y1} x2={cx + 10} y2={y2} stroke={quien === "RAMON" ? "#6B6560" : s.pelo} strokeWidth={quien === "RAMON" ? 5 : 3.5} strokeLinecap="round" />;
  };

  const parpadeo = (frame + sem * 7) % 105 < 4;
  const mira = escuchando ? 1.5 * facing : 0;

  const itemD =
    pose === "card" ? <Acreditacion /> : pose === "tray" ? <Bandeja /> : pose === "paper" ? <Portapapeles /> : pose === "give" ? <Hoja /> : undefined;
  const itemT = quien === "INSP" && (pose === "folder" || pose === "card" || pose === "give") ? <Carpeta /> : quien === "INSP" && pose === "paper" ? <Boligrafo /> : undefined;

  const manga = s.chaqueta ?? s.camisa;
  const puno = s.chaqueta ? s.camisa : s.camisa;
  const flip = facing === -1 ? "translate(220 0) scale(-1 1)" : undefined;

  const caminaT = caminando ? -balanceo : 0;
  const caminaD = caminando ? balanceo : 0;

  const brazoT = (
    <g transform={flip}>
      <Brazo
        x={xl + 14}
        y={142}
        a1={(caminando ? 6 : p.t[0]) + caminaT + (gestual ? -g1 * 0.5 : 0) + lapiz * 0.3}
        a2={(caminando ? 4 : p.t[1]) + (gestual ? g2 * 0.5 : 0) + lapiz}
        manga={manga}
        puno={puno}
        piel={s.piel}
        item={itemT}
      />
    </g>
  );
  const poseD = caminando && pose !== "tray" && pose !== "paper" ? POSES.stand.d : p.d;
  const brazoD = (
    <g transform={flip}>
      <Brazo
        x={xr - 14}
        y={142}
        a1={poseD[0] + (pose === "tray" || pose === "paper" ? 0 : caminaD) + (gestual ? g1 : 0)}
        a2={poseD[1] + (gestual ? -g2 : 0)}
        manga={manga}
        puno={puno}
        piel={s.piel}
        item={caminando && pose !== "tray" && pose !== "paper" ? undefined : itemD}
      />
    </g>
  );
  const traseroDelante = !caminando && p.traseroDelante;

  return (
    <g transform={`translate(0 ${respira * 0.3 + bob})`}>
      <ellipse cx={110} cy={532} rx={78 * s.ancho} ry={10} fill="#000" opacity={0.2} />
      <g transform={`rotate(${paso} 93 322)`}>
        <rect x={78} y={316} width={30} height={202} rx={10} fill={s.pantalon} />
        <ellipse cx={95 + 7 * facing} cy={522} rx={25} ry={10} fill={s.zapatos} />
      </g>
      <g transform={`rotate(${-paso} 127 322)`}>
        <rect x={112} y={316} width={30} height={202} rx={10} fill={s.pantalon} />
        <ellipse cx={127 + 7 * facing} cy={522} rx={25} ry={10} fill={s.zapatos} />
      </g>

      <g transform={`rotate(${lean * facing} 110 320)`}>
        {traseroDelante ? null : brazoT}
        <g transform={`translate(0 ${respira * 0.25})`}>
          <path
            d={`M${xl} 152 Q${xl} 130 ${xl + 26} 128 L${xr - 26} 128 Q${xr} 130 ${xr} 152 L${xr + (s.ancho - 1) * 40} ${s.ancho > 1.1 ? 280 : 300} Q${xr} 336 ${xr - 8} 336 L${xl + 8} 336 Q${xl} 336 ${xl - (s.ancho - 1) * 40} ${s.ancho > 1.1 ? 280 : 300} Z`}
            fill={s.camisa}
          />
          {s.chaqueta ? (
            <>
              <path d={`M${xl} 152 Q${xl} 130 ${xl + 26} 128 L98 128 L110 210 L110 336 L${xl + 8} 336 Q${xl} 336 ${xl} 300 Z`} fill={s.chaqueta} />
              <path d={`M${xr} 152 Q${xr} 130 ${xr - 26} 128 L122 128 L110 210 L110 336 L${xr - 8} 336 Q${xr} 336 ${xr} 300 Z`} fill={s.chaqueta} />
              <path d="M98 128 L110 176 L122 128" fill="#FFFFFF" />
              <rect x={107} y={140} width={6} height={60} fill="#7A1F2B" />
              <path d="M92 130 L104 230 M128 130 L116 230" stroke="#C8102E" strokeWidth={3} fill="none" />
              <rect x={98} y={226} width={24} height={30} rx={3} fill="#FFFFFF" stroke="#C8102E" strokeWidth={2} />
            </>
          ) : null}
          {s.delantal ? (
            <>
              <path d={`M${xl + 14} 236 L${xr - 14} 236 L${xr - 6} 420 L${xl + 6} 420 Z`} fill={s.delantal} />
              <rect x={xl + 10} y={232} width={w - 20} height={8} fill={s.delantal} opacity={0.85} />
              {quien === "DANI" ? <rect x={86} y={300} width={48} height={30} rx={4} fill="#000" opacity={0.25} /> : null}
            </>
          ) : null}
          {quien === "RAMON" ? (
            <>
              <path d="M96 128 L110 150 L124 128" fill="#2E5139" />
              <circle cx={110} cy={170} r={3} fill="#E8E8E8" />
              <circle cx={110} cy={196} r={3} fill="#E8E8E8" />
            </>
          ) : null}
          {quien === "LUCIA" ? <path d="M96 128 L110 146 L124 128" fill="#1A1A1C" /> : null}
        </g>

        <rect x={98} y={104} width={24} height={30} rx={8} fill={s.piel} />
        <g transform={`rotate(${tiltCab} 110 118) translate(${facing * 2} 0)`}>
          {s.peinado === "mono" ? <circle cx={110 - 30 * facing} cy={48} r={20} fill={s.pelo} /> : null}
          <circle cx={70} cy={82} r={9} fill={s.piel} />
          <circle cx={150} cy={82} r={9} fill={s.piel} />
          <ellipse cx={110} cy={76} rx={40} ry={43} fill={s.piel} />
          {s.peinado === "corto" ? <path d="M69 74 Q66 32 110 30 Q154 32 151 74 Q146 54 132 50 Q110 44 88 50 Q74 54 69 74 Z" fill={s.pelo} /> : null}
          {s.peinado === "mono" ? <path d="M68 82 Q62 30 110 32 Q158 30 152 82 Q148 58 126 52 Q100 50 86 58 Q72 66 68 82 Z" fill={s.pelo} /> : null}
          {s.peinado === "calvo" ? (
            <>
              <path d="M68 92 Q64 66 74 58 Q76 76 78 92 Z" fill={s.pelo} />
              <path d="M152 92 Q156 66 146 58 Q144 76 142 92 Z" fill={s.pelo} />
              <ellipse cx={98} cy={44} rx={12} ry={5} fill="#FFFFFF" opacity={0.25} />
            </>
          ) : null}
          {s.peinado === "flequillo" ? (
            <path d="M68 78 Q60 28 112 30 Q160 32 152 76 Q146 60 140 56 L134 66 L124 54 L114 66 L104 54 L94 66 L86 56 Q74 62 68 78 Z" fill={s.pelo} />
          ) : null}
          {parpadeo ? (
            <>
              <line x1={90 + fx} y1={ojoY} x2={102 + fx} y2={ojoY} stroke="#222" strokeWidth={3} />
              <line x1={118 + fx} y1={ojoY} x2={130 + fx} y2={ojoY} stroke="#222" strokeWidth={3} />
            </>
          ) : (
            <>
              <ellipse cx={96 + fx} cy={ojoY} rx={5.5} ry={expr === "nervous" ? 6.8 : 5.8} fill="#FFFFFF" />
              <ellipse cx={124 + fx} cy={ojoY} rx={5.5} ry={expr === "nervous" ? 6.8 : 5.8} fill="#FFFFFF" />
              <circle cx={96 + fx + mira} cy={ojoY + 0.5} r={4.2} fill="#1E1E1E" />
              <circle cx={124 + fx + mira} cy={ojoY + 0.5} r={4.2} fill="#1E1E1E" />
              <circle cx={97.5 + fx + mira} cy={ojoY - 1.5} r={1.4} fill="#FFF" />
              <circle cx={125.5 + fx + mira} cy={ojoY - 1.5} r={1.4} fill="#FFF" />
            </>
          )}
          {ceja(96 + fx, -1)}
          {ceja(124 + fx, 1)}
          <path d={`M${110 + fx * 1.5} 82 q${4 * facing} 8 0 10`} stroke="#000" strokeOpacity={0.25} strokeWidth={2.5} fill="none" strokeLinecap="round" />
          {s.gafas ? (
            <g stroke="#2A2A2A" strokeWidth={2.5} fill="none">
              <rect x={84 + fx} y={68} width={24} height={19} rx={6} />
              <rect x={112 + fx} y={68} width={24} height={19} rx={6} />
              <line x1={108 + fx} y1={76} x2={112 + fx} y2={76} />
            </g>
          ) : null}
          {s.bigote ? <path d={`M${96 + fx} 95 Q${110 + fx} 86 ${124 + fx} 95 Q${110 + fx} 92 ${96 + fx} 95 Z`} fill="#6B6560" stroke="#6B6560" strokeWidth={4} strokeLinejoin="round" /> : null}
          {boca}
          {expr === "angry" ? (
            <>
              <circle cx={86 + fx} cy={94} r={8} fill="#E0453A" opacity={0.35 + (hablando ? 0.15 : 0)} />
              <circle cx={134 + fx} cy={94} r={8} fill="#E0453A" opacity={0.35 + (hablando ? 0.15 : 0)} />
            </>
          ) : null}
          {expr === "nervous" ? (
            <path d={`M${facing === 1 ? 146 : 74} ${56 + (frame % 45) * 0.4} q5 9 0 14 q-5 -5 0 -14 Z`} fill="#7FC4F2" opacity={0.9} />
          ) : null}
          {quien === "LUCIA" ? (
            <>
              <circle cx={70} cy={94} r={3.5} fill="#E6C25A" />
              <circle cx={150} cy={94} r={3.5} fill="#E6C25A" />
            </>
          ) : null}
        </g>
        {traseroDelante ? brazoT : null}
        {brazoD}
      </g>
    </g>
  );
};
