import React from "react";
import type { Expr, Pose, Quien } from "./guion";

// Personaje plano en SVG. Sistema de coordenadas local: 220 x 540, pies en y≈530.
// Se dibuja "mirando a la derecha"; facing=-1 refleja brazos y desplaza rasgos.

type Estilo = {
  piel: string;
  pelo: string;
  peinado: "corto" | "mono" | "calvo" | "flequillo";
  camisa: string;
  chaqueta?: string;
  delantal?: string;
  pantalon: string;
  zapatos: string;
  ancho: number; // 1 = normal
  gafas?: boolean;
  bigote?: boolean;
};

export const ESTILOS: Record<Quien, Estilo> = {
  INSP: {
    piel: "#E8B998",
    pelo: "#4A4646",
    peinado: "corto",
    camisa: "#CFE3F7",
    chaqueta: "#1F3354",
    pantalon: "#26324A",
    zapatos: "#1A1A1A",
    ancho: 1,
    gafas: true,
  },
  LUCIA: {
    piel: "#D9A07E",
    pelo: "#5B3420",
    peinado: "mono",
    camisa: "#2B2B2E",
    delantal: "#8C2F3C",
    pantalon: "#222",
    zapatos: "#111",
    ancho: 0.92,
  },
  RAMON: {
    piel: "#E2A684",
    pelo: "#8E8A86",
    peinado: "calvo",
    camisa: "#3E6B4E",
    pantalon: "#4B4237",
    zapatos: "#2A2018",
    ancho: 1.22,
    bigote: true,
  },
  DANI: {
    piel: "#C98E6A",
    pelo: "#1E1A18",
    peinado: "flequillo",
    camisa: "#F4F4F2",
    delantal: "#1E1E22",
    pantalon: "#1E1E22",
    zapatos: "#0E0E0E",
    ancho: 0.95,
  },
};

type Props = {
  quien: Quien;
  pose: Pose;
  expr: Expr;
  facing: 1 | -1;
  hablando: boolean;
  frame: number;
  caminando?: boolean;
};

const ANGULOS: Record<Pose, [number, number]> = {
  // [brazo trasero, brazo delantero] en grados; 0 = colgando
  stand: [8, -8],
  card: [8, -72],
  folder: [6, -10],
  paper: [-28, -48],
  tray: [8, -150],
  point: [8, -122],
  hands: [34, -38],
  arms: [-78, 78],
};

const Brazo: React.FC<{
  x: number;
  y: number;
  ang: number;
  largo: number;
  manga: string;
  piel: string;
  item?: React.ReactNode;
}> = ({ x, y, ang, largo, manga, piel, item }) => (
  <g transform={`translate(${x} ${y}) rotate(${ang})`}>
    <rect x={-13} y={-6} width={26} height={largo} rx={13} fill={manga} />
    <circle cx={0} cy={largo} r={13} fill={piel} />
    {item ? <g transform={`translate(0 ${largo}) rotate(${-ang})`}>{item}</g> : null}
  </g>
);

const Acreditacion = () => (
  <g transform="translate(-6 -64)">
    <rect x={-34} y={-6} width={74} height={50} rx={5} fill="#FFFFFF" stroke="#1F3354" strokeWidth={2} />
    <rect x={-34} y={-6} width={74} height={12} rx={3} fill="#C8102E" />
    <rect x={-28} y={11} width={18} height={24} fill="#9FB3C8" />
    <rect x={-6} y={13} width={38} height={4} fill="#1F3354" />
    <rect x={-6} y={21} width={30} height={4} fill="#8796A8" />
    <rect x={-6} y={29} width={34} height={4} fill="#8796A8" />
  </g>
);

const Carpeta = () => (
  <g transform="translate(-6 -30)">
    <rect x={-8} y={0} width={46} height={66} rx={4} fill="#7A1F2B" />
    <rect x={-8} y={0} width={8} height={66} rx={2} fill="#5A1520" />
  </g>
);

const Portapapeles = () => (
  <g transform="translate(-10 -70)">
    <rect x={-36} y={0} width={76} height={98} rx={6} fill="#8A6A45" />
    <rect x={-30} y={10} width={64} height={82} fill="#FFFFFF" />
    <rect x={-10} y={-4} width={24} height={10} rx={3} fill="#B8B8B8" />
    {[22, 34, 46, 58, 70].map((yy) => (
      <rect key={yy} x={-24} y={yy} width={yy === 70 ? 30 : 52} height={4} fill="#9AA6B4" />
    ))}
  </g>
);

const Bandeja = () => (
  <g transform="translate(0 -14)">
    <rect x={-70} y={0} width={140} height={8} rx={4} fill="#B9BEC4" />
    <rect x={-50} y={-26} width={22} height={26} rx={4} fill="#FFFFFF" stroke="#C9CDD2" />
    <rect x={-16} y={-34} width={16} height={34} rx={3} fill="#E8D9A8" opacity={0.85} />
    <rect x={14} y={-22} width={30} height={22} rx={6} fill="#FFFFFF" stroke="#C9CDD2" />
  </g>
);

export const Persona: React.FC<Props> = ({ quien, pose, expr, facing, hablando, frame, caminando }) => {
  const s = ESTILOS[quien];
  const respira = Math.sin(frame / 18 + quien.length) * 2.2;
  const gesto = hablando && (pose === "hands" || pose === "point" || pose === "stand") ? Math.sin(frame / 5) * 7 : 0;
  const [aT, aD] = ANGULOS[pose];
  const largo = pose === "arms" ? 118 : pose === "tray" ? 112 : pose === "point" ? 132 : 158;

  const w = 120 * s.ancho;
  const xl = 110 - w / 2;
  const xr = 110 + w / 2;

  // Piernas
  const paso = caminando ? Math.sin(frame / 4) * 18 : 0;
  const bob = caminando ? Math.abs(Math.sin(frame / 4)) * -6 : 0;

  // Rasgos de la cara (miran hacia "facing")
  const fx = 4 * facing;
  const ojoY = 78;
  const boca = (() => {
    if (hablando) {
      const h = 3 + Math.abs(Math.sin(frame / 2.6)) * 9;
      return <ellipse cx={110 + fx} cy={101} rx={9} ry={h / 2} fill="#5A1E1E" />;
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
    // lado -1: ceja izquierda; 1: derecha. Inclinación según expresión
    const inner = expr === "angry" ? 6 : expr === "nervous" ? -6 : expr === "tense" ? 2 : 0;
    const y = expr === "tense" || expr === "angry" ? 64 : 62;
    const x1 = cx - 10;
    const x2 = cx + 10;
    const y1 = lado === -1 ? y : y + inner;
    const y2 = lado === -1 ? y + inner : y;
    return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={s.pelo === "#8E8A86" ? "#6B6560" : s.pelo} strokeWidth={quien === "RAMON" ? 5 : 3.5} strokeLinecap="round" />;
  };

  const parpadeo = (frame + quien.charCodeAt(0) * 7) % 110 < 4;

  const itemDelantero = pose === "card" ? <Acreditacion /> : pose === "tray" ? <Bandeja /> : pose === "paper" ? <Portapapeles /> : undefined;
  const itemTrasero = pose === "folder" || pose === "card" ? (quien === "INSP" ? <Carpeta /> : undefined) : undefined;

  const manga = s.chaqueta ?? s.camisa;

  const brazos = (
    <g transform={facing === -1 ? "translate(220 0) scale(-1 1)" : undefined}>
      <Brazo x={xl + 12} y={140} ang={aT - gesto * 0.4} largo={largo} manga={manga} piel={s.piel} item={itemTrasero} />
      <Brazo x={xr - 12} y={140} ang={aD + gesto} largo={largo} manga={manga} piel={s.piel} item={itemDelantero} />
    </g>
  );

  return (
    <g transform={`translate(0 ${respira * 0.3 + bob})`}>
      {/* sombra */}
      <ellipse cx={110} cy={532} rx={78 * s.ancho} ry={10} fill="#000" opacity={0.18} />
      {/* piernas */}
      <g transform={`rotate(${paso} 92 322)`}>
        <rect x={78} y={318} width={30} height={200} rx={10} fill={s.pantalon} />
        <ellipse cx={95 + 6 * facing} cy={522} rx={24} ry={10} fill={s.zapatos} />
      </g>
      <g transform={`rotate(${-paso} 128 322)`}>
        <rect x={112} y={318} width={30} height={200} rx={10} fill={s.pantalon} />
        <ellipse cx={127 + 6 * facing} cy={522} rx={24} ry={10} fill={s.zapatos} />
      </g>
      {/* brazos detrás si están cruzados no; los cruzados van delante */}
      {pose !== "arms" ? null : null}
      {/* torso */}
      <g transform={`translate(0 ${respira * 0.2})`}>
        <path
          d={`M${xl} 152 Q${xl} 130 ${xl + 26} 128 L${xr - 26} 128 Q${xr} 130 ${xr} 152 L${xr + 4 * (s.ancho - 1) * 10} ${s.ancho > 1.1 ? 280 : 300} Q${xr} 336 ${xr - 8} 336 L${xl + 8} 336 Q${xl} 336 ${xl - 4 * (s.ancho - 1) * 10} ${s.ancho > 1.1 ? 280 : 300} Z`}
          fill={s.chaqueta ? s.camisa : s.camisa}
        />
        {s.chaqueta ? (
          <>
            <path d={`M${xl} 152 Q${xl} 130 ${xl + 26} 128 L98 128 L110 210 L110 336 L${xl + 8} 336 Q${xl} 336 ${xl} 300 Z`} fill={s.chaqueta} />
            <path d={`M${xr} 152 Q${xr} 130 ${xr - 26} 128 L122 128 L110 210 L110 336 L${xr - 8} 336 Q${xr} 336 ${xr} 300 Z`} fill={s.chaqueta} />
            <path d="M98 128 L110 176 L122 128" fill="#FFFFFF" />
            <rect x={107} y={140} width={6} height={60} fill="#7A1F2B" />
            {/* cordón con tarjeta */}
            <path d="M92 130 L104 230 M128 130 L116 230" stroke="#C8102E" strokeWidth={3} fill="none" />
            <rect x={98} y={226} width={24} height={30} rx={3} fill="#FFFFFF" stroke="#C8102E" strokeWidth={2} />
          </>
        ) : null}
        {s.delantal ? (
          <>
            <path d={`M${xl + 14} 236 L${xr - 14} 236 L${xr - 6} 420 L${xl + 6} 420 Z`} fill={s.delantal} />
            <rect x={xl + 10} y={232} width={w - 20} height={8} fill={s.delantal} opacity={0.85} />
            {quien === "DANI" ? (
              <rect x={86} y={300} width={48} height={30} rx={4} fill="#000" opacity={0.25} />
            ) : null}
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

      {/* cuello y cabeza */}
      <rect x={98} y={104} width={24} height={30} rx={8} fill={s.piel} />
      <g transform={`translate(${facing * 2} 0)`}>
        {s.peinado === "mono" ? <circle cx={110 - 30 * facing} cy={48} r={20} fill={s.pelo} /> : null}
        <circle cx={70} cy={82} r={9} fill={s.piel} />
        <circle cx={150} cy={82} r={9} fill={s.piel} />
        <ellipse cx={110} cy={76} rx={40} ry={43} fill={s.piel} />
        {/* pelo */}
        {s.peinado === "corto" ? (
          <path d="M69 74 Q66 32 110 30 Q154 32 151 74 Q146 54 132 50 Q110 44 88 50 Q74 54 69 74 Z" fill={s.pelo} />
        ) : null}
        {s.peinado === "mono" ? (
          <path d="M68 82 Q62 30 110 32 Q158 30 152 82 Q148 58 126 52 Q100 50 86 58 Q72 66 68 82 Z" fill={s.pelo} />
        ) : null}
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
        {/* ojos */}
        {parpadeo ? (
          <>
            <line x1={90 + fx} y1={ojoY} x2={102 + fx} y2={ojoY} stroke="#222" strokeWidth={3} />
            <line x1={118 + fx} y1={ojoY} x2={130 + fx} y2={ojoY} stroke="#222" strokeWidth={3} />
          </>
        ) : (
          <>
            <ellipse cx={96 + fx} cy={ojoY} rx={5} ry={expr === "nervous" ? 6.5 : 5.5} fill="#1E1E1E" />
            <ellipse cx={124 + fx} cy={ojoY} rx={5} ry={expr === "nervous" ? 6.5 : 5.5} fill="#1E1E1E" />
            <circle cx={97.5 + fx} cy={ojoY - 2} r={1.6} fill="#FFF" />
            <circle cx={125.5 + fx} cy={ojoY - 2} r={1.6} fill="#FFF" />
          </>
        )}
        {ceja(96 + fx, -1)}
        {ceja(124 + fx, 1)}
        {/* nariz */}
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
            <circle cx={86 + fx} cy={94} r={8} fill="#E0453A" opacity={0.35} />
            <circle cx={134 + fx} cy={94} r={8} fill="#E0453A" opacity={0.35} />
          </>
        ) : null}
        {expr === "nervous" ? (
          <path d={`M${146 - 70 * (facing === -1 ? 1 : 0)} ${56 + (frame % 40) * 0.4} q5 9 0 14 q-5 -5 0 -14 Z`} fill="#7FC4F2" opacity={0.9} />
        ) : null}
        {quien === "LUCIA" ? (
          <>
            <circle cx={70} cy={94} r={3.5} fill="#E6C25A" />
            <circle cx={150} cy={94} r={3.5} fill="#E6C25A" />
          </>
        ) : null}
      </g>

      {brazos}
    </g>
  );
};
