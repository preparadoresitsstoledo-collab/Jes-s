import React from "react";

// Fondos y primer plano del local (ficticio). Lienzo 1920 x 1080.

export const Defs: React.FC = () => (
  <defs>
    <pattern id="azulejo" width="60" height="60" patternUnits="userSpaceOnUse">
      <rect width="60" height="60" fill="#F3EEE2" />
      <rect x="1" y="1" width="58" height="58" fill="none" stroke="#D9CFBA" strokeWidth="2" />
      <path d="M30 8 L52 30 L30 52 L8 30 Z" fill="none" stroke="#2F5D8A" strokeWidth="3" />
      <circle cx="30" cy="30" r="7" fill="#C9852E" />
      <circle cx="0" cy="0" r="7" fill="#2F5D8A" />
      <circle cx="60" cy="0" r="7" fill="#2F5D8A" />
      <circle cx="0" cy="60" r="7" fill="#2F5D8A" />
      <circle cx="60" cy="60" r="7" fill="#2F5D8A" />
    </pattern>
    <pattern id="suelo" width="120" height="60" patternUnits="userSpaceOnUse">
      <rect width="120" height="60" fill="#8C6A50" />
      <rect width="60" height="30" fill="#7E5E46" />
      <rect x="60" y="30" width="60" height="30" fill="#7E5E46" />
    </pattern>
    <linearGradient id="madera" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stopColor="#7A4B2A" />
      <stop offset="1" stopColor="#5A341C" />
    </linearGradient>
    <linearGradient id="cielo" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stopColor="#8EC5EC" />
      <stop offset="1" stopColor="#D8ECF7" />
    </linearGradient>
    <clipPath id="ventana">
      <rect x={1240} y={110} width={600} height={420} />
    </clipPath>
    <filter id="difuso" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="6" />
    </filter>
    <radialGradient id="luz" cx="0.5" cy="0.2" r="0.8">
      <stop offset="0" stopColor="#FFE9B8" stopOpacity="0.35" />
      <stop offset="1" stopColor="#000" stopOpacity="0" />
    </radialGradient>
  </defs>
);

const Botellas: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const colores = ["#3B6E3A", "#8A3B2A", "#C9A24A", "#2F4F6E", "#5E2B4F", "#A8642A", "#3B6E3A", "#D8D2C0", "#8A3B2A"];
  return (
    <g>
      {colores.map((c, i) => (
        <g key={i} transform={`translate(${x + i * 78} ${y})`}>
          <rect x={0} y={-70} width={30} height={70} rx={6} fill={c} />
          <rect x={10} y={-96} width={10} height={30} rx={3} fill={c} />
          <rect x={4} y={-50} width={22} height={20} fill="#F2E9D0" opacity={0.8} />
        </g>
      ))}
    </g>
  );
};

const Cliente: React.FC<{ x: number; color: string; pelo: string; frame: number }> = ({ x, color, pelo, frame }) => {
  const sorbo = Math.sin(frame / 40 + x) > 0.85 ? -18 : 0;
  return (
    <g transform={`translate(${x} 0)`} opacity={0.85}>
      <rect x={-40} y={640} width={80} height={110} rx={30} fill={color} />
      <circle cx={0} cy={610} r={32} fill="#D9A889" />
      <path d="M-32 606 Q-30 574 0 574 Q30 574 32 606 Q20 590 0 590 Q-20 590 -32 606 Z" fill={pelo} />
      <rect x={30} y={672 + sorbo} width={16} height={18} rx={3} fill="#FFFFFF" />
    </g>
  );
};

export const FondoInterior: React.FC<{ frame: number; reloj: number; vapor: number | null }> = ({ frame, reloj, vapor }) => (
  <g>
    {/* pared */}
    <rect x={0} y={0} width={1920} height={830} fill="#E7D3B5" />
    <rect x={0} y={560} width={1920} height={270} fill="url(#azulejo)" />
    <rect x={0} y={552} width={1920} height={10} fill="#9C6B3E" />
    {/* ventana a la calle */}
    <g>
      <rect x={1240} y={110} width={600} height={420} fill="url(#cielo)" />
      <rect x={1240} y={300} width={600} height={230} fill="#C7A77C" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={1270 + i * 150} y={330} width={70} height={110} fill="#6E5A44" opacity={0.6} />
      ))}
      <rect x={1240} y={470} width={600} height={60} fill="#9A9A96" />
      <g clipPath="url(#ventana)">
        {[
          { v: 2.1, o: 0, c: "#3D4A5C", d: 1 },
          { v: 1.6, o: 900, c: "#7A4E3A", d: -1 },
          { v: 2.6, o: 400, c: "#55606E", d: 1 },
        ].map((p, i) => {
          const rango = 1100;
          const pos = (((frame * p.v + p.o) % rango) + rango) % rango;
          const x = p.d === 1 ? 1100 + pos : 2200 - pos;
          const b = Math.abs(Math.sin(frame / 5 + i)) * 4;
          return (
            <g key={i} transform={`translate(${x} ${-b})`} opacity={0.75}>
              <circle cx={0} cy={380} r={18} fill="#2E2A28" />
              <rect x={-20} y={398} width={40} height={78} rx={14} fill={p.c} />
              <rect x={-14} y={470} width={10} height={50} fill="#2E2A28" transform={`rotate(${Math.sin(frame / 5 + i) * 18} -9 470)`} />
              <rect x={4} y={470} width={10} height={50} fill="#2E2A28" transform={`rotate(${-Math.sin(frame / 5 + i) * 18} 9 470)`} />
            </g>
          );
        })}
      </g>
      <rect x={1230} y={100} width={620} height={440} fill="none" stroke="#5A341C" strokeWidth={20} />
      <rect x={1532} y={100} width={14} height={440} fill="#5A341C" />
      <rect x={1240} y={110} width={600} height={420} fill="#FFFFFF" opacity={0.12} />
    </g>
    {/* reloj de pared */}
    <g transform="translate(1125 80)">
      <circle r={34} fill="#FFFFFF" stroke="#3E2312" strokeWidth={6} />
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={i} x={-1.5} y={-29} width={3} height={6} fill="#3E2312" transform={`rotate(${i * 30})`} />
      ))}
      <rect x={-2.5} y={-18} width={5} height={20} rx={2} fill="#222" transform={`rotate(${10 * 30 + 20 + reloj / 120})`} />
      <rect x={-1.5} y={-26} width={3} height={28} rx={1} fill="#222" transform={`rotate(${(40 + reloj / 60) * 6})`} />
      <rect x={-0.8} y={-28} width={1.6} height={32} fill="#C8102E" transform={`rotate(${Math.floor(frame / 30) * 6})`} />
    </g>
    {/* pizarra de menú */}
    <g transform="translate(1040 150)">
      <rect x={0} y={0} width={170} height={230} rx={8} fill="#2D3A33" stroke="#7A4B2A" strokeWidth={10} />
      <text x={85} y={50} fill="#F3F0E6" fontSize={22} fontWeight={700} textAnchor="middle" fontFamily="Inter">
        DESAYUNOS
      </text>
      <text x={85} y={92} fill="#F3F0E6" fontSize={18} textAnchor="middle" fontFamily="Inter">
        Café · 1,40
      </text>
      <text x={85} y={124} fill="#F3F0E6" fontSize={18} textAnchor="middle" fontFamily="Inter">
        Tostada · 2,20
      </text>
      <text x={85} y={156} fill="#F3F0E6" fontSize={18} textAnchor="middle" fontFamily="Inter">
        Zumo · 2,50
      </text>
      <text x={85} y={200} fill="#F2C14E" fontSize={20} fontWeight={700} textAnchor="middle" fontFamily="Inter">
        Menú 12 €
      </text>
    </g>
    {/* estanterías y botellas */}
    <rect x={160} y={140} width={820} height={300} fill="#CDB291" opacity={0.6} />
    <rect x={150} y={270} width={840} height={14} fill="#7A4B2A" />
    <rect x={150} y={430} width={840} height={14} fill="#7A4B2A" />
    <Botellas x={180} y={270} />
    <Botellas x={200} y={430} />
    {/* encimera trasera con cafetera */}
    <rect x={120} y={540} width={920} height={20} fill="#5A341C" />
    <g transform="translate(300 420)">
      <rect x={0} y={0} width={260} height={120} rx={10} fill="#B9BEC4" />
      <rect x={10} y={10} width={240} height={40} rx={6} fill="#8C9298" />
      <rect x={40} y={60} width={30} height={40} fill="#3A3A3A" />
      <rect x={190} y={60} width={30} height={40} fill="#3A3A3A" />
      <circle cx={130} cy={30} r={12} fill="#C8102E" />
    </g>
    {vapor !== null && vapor >= 0 && vapor < 75
      ? [0, 1, 2, 3].map((i) => {
          const t = vapor - i * 6;
          if (t < 0) return null;
          return (
            <circle
              key={i}
              cx={355 + i * 8 + Math.sin(t / 6 + i) * 10}
              cy={500 - t * 2.2}
              r={14 + t * 0.5}
              fill="#FFFFFF"
              opacity={Math.max(0, 0.55 - t / 75)}
              filter="url(#difuso)"
            />
          );
        })
      : null}
    {/* lámparas */}
    {[420, 840, 1480].map((x) => (
      <g key={x}>
        <line x1={x} y1={0} x2={x} y2={70} stroke="#333" strokeWidth={3} />
        <path d={`M${x - 50} 110 Q${x} 50 ${x + 50} 110 Z`} fill="#2B2B2B" />
        <ellipse cx={x} cy={110} rx={50} ry={8} fill="#FFE7A8" />
      </g>
    ))}
    {/* suelo */}
    <rect x={0} y={830} width={1920} height={250} fill="url(#suelo)" />
    <rect x={0} y={826} width={1920} height={8} fill="#5A341C" />
    {/* clientes al fondo */}
    <g transform="translate(0 70)">
      <Cliente x={1330} color="#6C7FA0" pelo="#3A2A20" frame={frame} />
      <Cliente x={1860} color="#B0715A" pelo="#C9B28A" frame={frame + 30} />
      <rect x={1280} y={740} width={140} height={14} rx={6} fill="#5A341C" />
      <rect x={1800} y={740} width={140} height={14} rx={6} fill="#5A341C" />
    </g>
  </g>
);

// Barra que tapa a quien está detrás
export const Barra: React.FC = () => (
  <g>
    <rect x={130} y={706} width={1000} height={34} rx={6} fill="#4A2A16" />
    <rect x={150} y={738} width={960} height={270} fill="url(#madera)" />
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} x={180 + i * 235} y={770} width={200} height={200} rx={10} fill="none" stroke="#3E2312" strokeWidth={6} />
    ))}
    <rect x={150} y={1000} width={960} height={14} fill="#2E1A0D" />
    {/* tazas y servilletero */}
    <rect x={260} y={680} width={30} height={26} rx={5} fill="#FFFFFF" />
    <ellipse cx={275} cy={706} rx={26} ry={6} fill="#F2F2F2" />
    <rect x={520} y={668} width={50} height={38} rx={4} fill="#C9C9C9" />
    <rect x={880} y={684} width={26} height={22} rx={4} fill="#FFFFFF" />
    <ellipse cx={893} cy={706} rx={22} ry={5} fill="#F2F2F2" />
  </g>
);

export const MesaPrimerPlano: React.FC = () => (
  <g>
    <ellipse cx={1600} cy={880} rx={120} ry={22} fill="#5A341C" />
    <rect x={1592} y={884} width={16} height={150} fill="#2E1A0D" />
    <ellipse cx={1600} cy={1036} rx={60} ry={10} fill="#2E1A0D" />
    <rect x={1560} y={850} width={26} height={30} rx={4} fill="#FFFFFF" />
  </g>
);

export const FondoExterior: React.FC<{ frame: number }> = ({ frame }) => (
  <g>
    <rect x={0} y={0} width={1920} height={1080} fill="url(#cielo)" />
    {/* nubes */}
    {[0, 1, 2].map((i) => {
      const x = ((i * 700 + frame * 0.6) % 2300) - 300;
      return (
        <g key={i} opacity={0.9}>
          <ellipse cx={x} cy={120 + i * 40} rx={110} ry={34} fill="#FFFFFF" />
          <ellipse cx={x + 70} cy={100 + i * 40} rx={70} ry={30} fill="#FFFFFF" />
        </g>
      );
    })}
    {/* casco histórico al fondo (genérico) */}
    <g fill="#CDB38D">
      <rect x={0} y={300} width={260} height={400} />
      <rect x={240} y={240} width={180} height={460} />
      <rect x={1620} y={280} width={300} height={420} />
      <rect x={1500} y={330} width={160} height={370} />
    </g>
    <g fill="#B79A72">
      <rect x={300} y={150} width={60} height={110} />
      <path d="M290 150 L330 80 L370 150 Z" />
      <rect x={1700} y={200} width={70} height={90} />
      <path d="M1690 200 L1735 140 L1780 200 Z" />
    </g>
    {/* fachada de la cafetería */}
    <rect x={420} y={250} width={1100} height={520} fill="#E3C9A0" />
    <rect x={420} y={250} width={1100} height={26} fill="#C9A87A" />
    {/* ventanas superiores */}
    {[520, 820, 1120, 1360].map((x) => (
      <g key={x}>
        <rect x={x} y={300} width={110} height={130} fill="#5F7C94" />
        <rect x={x - 8} y={430} width={126} height={12} fill="#8B6B48" />
        <rect x={x} y={300} width={110} height={130} fill="none" stroke="#FFFFFF" strokeWidth={6} />
      </g>
    ))}
    {/* toldo */}
    <g>
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={i} x={460 + i * 85} y={470} width={85} height={70} fill={i % 2 ? "#F4F1E8" : "#2F6B4F"} />
      ))}
      <path d={Array.from({ length: 12 }).map((_, i) => `M${460 + i * 85} 540 q42 28 85 0`).join(" ")} fill="#2F6B4F" />
      <rect x={560} y={440} width={820} height={44} rx={6} fill="#2B2B2B" />
      <text x={970} y={472} fill="#F2C14E" fontSize={30} fontWeight={800} textAnchor="middle" fontFamily="Inter" letterSpacing={6}>
        CAFETERÍA LA PLAZA
      </text>
    </g>
    {/* escaparate y puerta */}
    <rect x={480} y={570} width={600} height={200} fill="#F7D99A" />
    <rect x={480} y={570} width={600} height={200} fill="none" stroke="#3E2312" strokeWidth={12} />
    <rect x={1120} y={560} width={170} height={210} fill="#4A2A16" />
    <rect x={1135} y={580} width={140} height={110} fill="#F7D99A" opacity={0.85} />
    <circle cx={1265} cy={700} r={7} fill="#E6C25A" />
    {/* siluetas dentro */}
    <circle cx={640} cy={640} r={22} fill="#8A6A55" opacity={0.6} />
    <rect x={615} y={662} width={50} height={80} rx={18} fill="#8A6A55" opacity={0.6} />
    <circle cx={900} cy={650} r={22} fill="#5A4A40" opacity={0.6} />
    <rect x={875} y={672} width={50} height={80} rx={18} fill="#5A4A40" opacity={0.6} />
    {/* acera y calzada */}
    <rect x={0} y={770} width={1920} height={90} fill="#BDB6AA" />
    {Array.from({ length: 16 }).map((_, i) => (
      <rect key={i} x={i * 130} y={772} width={4} height={86} fill="#A39C90" />
    ))}
    <rect x={0} y={860} width={1920} height={220} fill="#6B6B6B" />
    <rect x={0} y={856} width={1920} height={10} fill="#8E8A82" />
  </g>
);
