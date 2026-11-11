import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { staticFile } from "remotion";
import { Barra, Defs, FondoExterior, FondoInterior, MesaPrimerPlano } from "./Escenarios";
import { Persona } from "./Persona";
import { EscenaDialogo, Expr, FPS, NOMBRES, Plano, Pose, PUNTOS_CLAVE, Quien, Sfx } from "./guion";
import { duracionLinea, duracionVoz, idLinea, inicioEscena } from "./tiempos";
import { VOCES } from "./voces";

const FONT = "Inter, 'DejaVu Sans', sans-serif";
const NAVY = "#0F1E36";
const ORO = "#F2C14E";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const suave = Easing.bezier(0.16, 1, 0.3, 1);

const ESCALA = 1.1;
const SUELO = 1000;

const PersonaEn: React.FC<{
  quien: Quien;
  pose: Pose;
  expr: Expr;
  facing: 1 | -1;
  x: number;
  hablando: boolean;
  escuchando?: boolean;
  frame: number;
  escala?: number;
  suelo?: number;
  caminando?: boolean;
  apertura?: number;
}> = ({ quien, pose, expr, facing, x, hablando, escuchando, frame, escala = ESCALA, suelo = SUELO, caminando, apertura }) => (
  <g transform={`translate(${x - 110 * escala} ${suelo - 530 * escala}) scale(${escala})`}>
    <Persona quien={quien} pose={pose} expr={expr} facing={facing} hablando={hablando} escuchando={escuchando} frame={frame} caminando={caminando} apertura={apertura} />
  </g>
);

const Efecto: React.FC<{ sfx: Sfx; from: number; dur?: number; vol?: number }> = ({ sfx, from, dur, vol = 0.8 }) => (
  <Sequence from={Math.max(0, Math.round(from))} durationInFrames={dur ? Math.round(dur) : undefined} layout="none">
    <Audio src={staticFile(`audio/${sfx}.wav`)} volume={vol} loop={sfx === "pasos"} />
  </Sequence>
);

// ───────────────────────── Título ─────────────────────────
export const Titulo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = (d: number) => interpolate(frame, [d, d + 20], [0, 1], { ...clamp, easing: suave });
  const linea = interpolate(frame, [10, 50], [0, 520], { ...clamp, easing: suave });
  const zoom = interpolate(frame, [0, 6 * fps], [1.08, 1], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: NAVY, fontFamily: FONT, overflow: "hidden" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", opacity: 0.12, transform: `scale(${zoom})` }}>
        <Defs />
        <rect width={1920} height={1080} fill="url(#azulejo)" />
      </svg>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 30% 40%, rgba(15,30,54,0.4), #0F1E36 75%)" }} />
      <div style={{ position: "absolute", left: 160, top: 300, color: "white" }}>
        <div style={{ opacity: a(0), color: ORO, fontSize: 34, fontWeight: 700, letterSpacing: 8 }}>CASO PRÁCTICO · FORMACIÓN ITSS</div>
        <div style={{ width: linea, height: 6, background: ORO, margin: "26px 0 34px" }} />
        <div style={{ opacity: a(12), transform: `translateY(${(1 - a(12)) * 30}px)`, fontSize: 104, fontWeight: 800, lineHeight: 1.02, maxWidth: 1500 }}>
          Control de empleo
          <br />
          en una cafetería
        </div>
        <div style={{ opacity: a(30), fontSize: 38, marginTop: 34, color: "#C9D6E8", maxWidth: 1400, lineHeight: 1.35 }}>
          Identificación de trabajadores, el «extra de prueba» y la negativa a firmar la citación
        </div>
      </div>
      <div style={{ position: "absolute", left: 160, bottom: 90, opacity: a(45), color: "#8EA3C0", fontSize: 26 }}>
        Escenificación ficticia con fines formativos. Personas y establecimiento inventados.
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────── Exterior ─────────────────────────
const Coche: React.FC<{ x: number }> = ({ x }) => (
  <g transform={`translate(${x} 0)`}>
    <rect x={-170} y={880} width={340} height={80} rx={26} fill="#B23A3A" />
    <path d="M-110 884 L-70 830 L80 830 L120 884 Z" fill="#9A2F2F" />
    <path d="M-95 882 L-62 840 L0 840 L0 882 Z M12 882 L12 840 L72 840 L104 882 Z" fill="#9FC3DD" />
    <circle cx={-100} cy={962} r={30} fill="#1C1C1C" />
    <circle cx={100} cy={962} r={30} fill="#1C1C1C" />
    <circle cx={-100} cy={962} r={12} fill="#888" />
    <circle cx={100} cy={962} r={12} fill="#888" />
    <rect x={-172} y={900} width={16} height={12} rx={3} fill="#FFE08A" />
  </g>
);

const Peaton: React.FC<{ x: number; frame: number }> = ({ x, frame }) => {
  const sw = Math.sin(frame / 4) * 16;
  return (
    <g transform={`translate(${x} ${-Math.abs(Math.sin(frame / 4)) * 5})`}>
      <ellipse cx={0} cy={842} rx={46} ry={8} fill="#000" opacity={0.15} />
      <rect x={-16} y={720} width={14} height={120} rx={6} fill="#33363D" transform={`rotate(${sw} -9 720)`} />
      <rect x={2} y={720} width={14} height={120} rx={6} fill="#33363D" transform={`rotate(${-sw} 9 720)`} />
      <rect x={-34} y={590} width={68} height={140} rx={24} fill="#C98B3A" />
      <circle cx={0} cy={560} r={30} fill="#C99476" />
      <path d="M-30 556 Q-28 524 0 524 Q30 524 30 556 Q18 540 0 540 Q-18 540 -30 556 Z" fill="#2A211C" />
      <rect x={30} y={640} width={34} height={42} rx={6} fill="#5A4A3A" />
    </g>
  );
};

export const Exterior: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const llegada = 6.2 * fps;
  const x = interpolate(frame, [0, llegada], [-160, 1110], clamp);
  const andando = frame < llegada;
  const puerta = interpolate(frame, [llegada + 12, llegada + 30], [1, 0.25], { ...clamp, easing: suave });
  const entra = interpolate(frame, [llegada + 34, llegada + 56], [1110, 1205], clamp);
  const opac = interpolate(frame, [llegada + 40, llegada + 58], [1, 0], clamp);
  const xi = frame > llegada + 34 ? entra : x;

  // cámara que sigue al inspector y termina en la puerta
  const z = interpolate(frame, [0, durationInFrames], [1.18, 1.4], clamp);
  const fx = Math.max(500, Math.min(1300, xi));
  const fy = 640;
  const tx = Math.max(1920 - 1920 * z, Math.min(0, 960 - fx * z));
  const ty = Math.max(1080 - 1080 * z, Math.min(0, 540 - fy * z));

  const coche = interpolate(frame, [2.6 * fps, 5.2 * fps], [2300, -400], clamp);
  const peaton = interpolate(frame, [0, durationInFrames], [1750, 1150], clamp);

  const chy = spring({ frame: frame - 15, fps, config: { damping: 200 } });
  const orden = spring({ frame: frame - 2.4 * fps, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ fontFamily: FONT, overflow: "hidden" }}>
      <Efecto sfx="pasos" from={0} dur={llegada} vol={0.5} />
      <Efecto sfx="coche" from={2.4 * fps} vol={0.6} />
      <AbsoluteFill style={{ transform: `translate(${tx}px, ${ty}px) scale(${z})`, transformOrigin: "0 0" }}>
        <svg width={1920} height={1080}>
          <Defs />
          <FondoExterior frame={frame} />
          <rect x={1120} y={560} width={170 * puerta} height={210} fill="#4A2A16" />
          <rect x={1135} y={580} width={140 * puerta} height={110} fill="#F7D99A" opacity={0.85} />
          <Peaton x={peaton} frame={frame} />
          <g opacity={opac}>
            <PersonaEn quien="INSP" pose="folder" expr="calm" facing={1} x={xi} hablando={false} frame={frame} escala={1.05} suelo={850} caminando={andando || frame > llegada + 34} />
          </g>
          <Coche x={coche} />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 60%, rgba(0,0,0,0.35) 100%)" }} />
      <div
        style={{
          position: "absolute",
          left: 80,
          bottom: 80,
          transform: `translateX(${(1 - chy) * -700}px)`,
          background: "rgba(15,30,54,0.92)",
          color: "white",
          padding: "22px 34px",
          borderLeft: `8px solid ${ORO}`,
          borderRadius: 6,
        }}
      >
        <div style={{ fontSize: 40, fontWeight: 800 }}>Martes · 10:40 h</div>
        <div style={{ fontSize: 26, color: "#C9D6E8", marginTop: 6 }}>Cafetería en el casco urbano · hora punta de desayunos</div>
      </div>
      <div
        style={{
          position: "absolute",
          right: 80,
          top: 70,
          width: 560,
          transform: `translateX(${(1 - orden) * 700}px)`,
          background: "rgba(255,255,255,0.96)",
          color: NAVY,
          padding: "22px 28px",
          borderRadius: 10,
          borderLeft: "10px solid #4FA3FF",
          boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
        }}
      >
        <div style={{ fontSize: 22, fontWeight: 700, color: "#4F6B8F", letterSpacing: 3 }}>ORDEN DE SERVICIO</div>
        <div style={{ fontSize: 30, fontWeight: 800, marginTop: 6 }}>Control de empleo en hostelería</div>
        <div style={{ fontSize: 23, marginTop: 8, lineHeight: 1.35 }}>
          Visita sin previo aviso para comprobar la identidad y el alta de quienes estén trabajando.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────── Escena con diálogo ─────────────────────────
const VEL = 300; // px por segundo al caminar
const TODOS: Quien[] = ["INSP", "LUCIA", "RAMON", "DANI"];

type Mov = { from: number; to: number; start: number; dur: number };

const movimientos = (esc: EscenaDialogo, q: Quien, starts: number[]): Mov[] => {
  const r = esc.reparto[q];
  const ms: Omit<Mov, "dur">[] = [];
  let cur = r.desde ?? r.x;
  if (r.desde !== undefined) {
    ms.push({ from: r.desde, to: r.x, start: Math.round((r.entraEn ?? 0) * FPS) });
    cur = r.x;
  }
  esc.lineas.forEach((l, i) => {
    const nx = l.cambios?.[q]?.x;
    if (nx !== undefined && nx !== cur) {
      ms.push({ from: cur, to: nx, start: starts[i] });
      cur = nx;
    }
  });
  return ms.map((m) => ({ ...m, dur: Math.max(16, Math.round((Math.abs(m.to - m.from) / VEL) * FPS)) }));
};

const posicion = (ms: Mov[], base: number, frame: number) => {
  let x = ms.length ? ms[0].from : base;
  let caminando = false;
  let dir = 0;
  for (const m of ms) {
    if (frame < m.start) break;
    const t = (frame - m.start) / m.dur;
    if (t < 1) {
      x = m.from + (m.to - m.from) * t;
      caminando = true;
      dir = Math.sign(m.to - m.from);
    } else {
      x = m.to;
    }
  }
  return { x, caminando, dir };
};

const ZOOM: Record<Plano, number> = { general: 1.04, dos: 1.3, medio: 1.55, primer: 2.05 };

export const EscenaInterior: React.FC<{ esc: EscenaDialogo }> = ({ esc }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const starts: number[] = [];
  let acc = inicioEscena(esc);
  esc.lineas.forEach((_l, i) => {
    starts.push(acc);
    acc += duracionLinea(esc, i);
  });
  const finLinea = (i: number) => (i + 1 < starts.length ? starts[i + 1] : durationInFrames);

  let idx = -1;
  starts.forEach((s, i) => {
    if (frame >= s) idx = i;
  });
  const lin = idx >= 0 ? esc.lineas[idx] : null;
  const t0 = idx >= 0 ? starts[idx] : 0;
  const dt = frame - t0;
  const durLin = idx >= 0 ? finLinea(idx) - t0 : starts[0];

  // estado discreto (pose, expresión, visibilidad)
  const est: Record<Quien, { pose: Pose; expr: Expr; visible: boolean }> = {} as never;
  TODOS.forEach((q) => {
    const r = esc.reparto[q];
    est[q] = { pose: r.pose, expr: r.expr, visible: r.visible };
  });
  for (let i = 0; i <= idx; i++) {
    const c = esc.lineas[i].cambios;
    if (!c) continue;
    TODOS.forEach((q) => {
      const cq = c[q];
      if (!cq) return;
      if (cq.pose) est[q].pose = cq.pose;
      if (cq.expr) est[q].expr = cq.expr;
      if (cq.visible !== undefined) est[q].visible = cq.visible;
    });
  }

  const pos = {} as Record<Quien, { x: number; caminando: boolean; dir: number }>;
  const movs = {} as Record<Quien, Mov[]>;
  TODOS.forEach((q) => {
    movs[q] = movimientos(esc, q, starts);
    pos[q] = posicion(movs[q], esc.reparto[q].x, frame);
  });

  const hablante: Quien | null = lin ? lin.quien : null;
  // Voz: empieza 3 fotogramas después del corte; el texto avanza al ritmo de la voz
  const VOZ_DESFASE = 3;
  const vozDur = idx >= 0 ? duracionVoz(esc, idx) * fps : 0;
  const tv = dt - VOZ_DESFASE;
  const caracteres = lin ? Math.min(lin.texto.length, Math.floor((Math.max(0, tv) / Math.max(1, vozDur)) * lin.texto.length * 1.04)) : 0;
  const escribiendo = lin ? tv >= 0 && tv < vozDur : false;
  const env = idx >= 0 ? VOCES[idLinea(esc, idx)]?.env : undefined;
  const apertura = env && tv >= 0 ? (env[Math.floor(tv)] ?? 0) : undefined;

  const mirarA = (q: Quien): Quien => {
    if (lin && q === lin.quien) return lin.a ?? (q === "INSP" ? "LUCIA" : "INSP");
    if (hablante && hablante !== q) return hablante;
    return q === "INSP" ? "LUCIA" : "INSP";
  };
  const facing = (q: Quien): 1 | -1 => {
    if (pos[q].caminando) return pos[q].dir >= 0 ? 1 : -1;
    const o = mirarA(q);
    return pos[o].x >= pos[q].x ? 1 : -1;
  };

  // Tensión
  const tPrev = idx > 0 ? esc.lineas[idx - 1].tension : esc.lineas[0].tension * 0.7;
  const tension = lin ? interpolate(dt, [0, 20], [tPrev, lin.tension], clamp) : tPrev;

  // ── Cámara: planos con corte seco y ligero acercamiento dentro del plano
  let tipo: Plano = "general";
  let sujeto: Quien | null = null;
  let corte = 0;
  let durPlano = durLin;
  if (lin) {
    tipo = lin.plano ?? "medio";
    sujeto = lin.quien;
    corte = t0;
    const mitad = Math.round(durLin * 0.58);
    if (lin.reaccion && dt >= mitad) {
      tipo = "medio";
      sujeto = lin.reaccion;
      corte = t0 + mitad;
      durPlano = durLin - mitad;
    } else if (lin.reaccion) {
      durPlano = mitad;
    }
  } else {
    durPlano = starts[0];
  }
  const visibles = TODOS.filter((q) => est[q].visible);
  let z = ZOOM[tipo];
  let fxs = 960;
  let fys = 540;
  let destino = 960;
  if (tipo === "general" || !sujeto) {
    const xs = visibles.map((q) => pos[q].x);
    fxs = (Math.min(...xs) + Math.max(...xs)) / 2;
    fys = 560;
  } else if (tipo === "dos" && lin) {
    const otro = lin.a ?? "INSP";
    const a1 = pos[sujeto].x;
    const a2 = pos[otro].x;
    fxs = (a1 + a2) / 2;
    fys = SUELO - 330 * ESCALA;
    z = Math.max(1.12, Math.min(1.5, 1500 / (Math.abs(a1 - a2) + 700)));
  } else {
    fxs = pos[sujeto].x;
    fys = SUELO - (tipo === "primer" ? 452 : 370) * ESCALA;
    destino = 960 - facing(sujeto) * (tipo === "primer" ? 230 : 180);
  }
  const prog = Math.max(0, Math.min(1, (frame - corte) / Math.max(1, durPlano)));
  z *= 1 + 0.06 * prog;
  if (lin && tension > 0.8) z *= 1 + (tension - 0.8) * 0.15;

  const camara = (zz: number) => {
    let tx = Math.max(1920 - 1920 * zz, Math.min(0, destino - fxs * zz));
    let ty = Math.max(1080 - 1080 * zz, Math.min(0, 540 - fys * zz));
    if (tension > 0.78) {
      const k = (tension - 0.78) * 4;
      tx = Math.max(1920 - 1920 * zz, Math.min(0, tx + Math.sin(frame * 1.7) * 4 * k));
      ty = Math.max(1080 - 1080 * zz, Math.min(0, ty + Math.cos(frame * 2.3) * 3 * k));
    }
    return { tx, ty };
  };
  const cp = camara(z);
  const zb = 1 + (z - 1) * 0.82;
  const cb = camara(zb);
  const desenfoque = Math.max(0, (z - 1.2) * 5);

  // ── Elementos
  const vapor = esc.sfxInicio?.find((s) => s.sfx === "vapor");
  const vaporF = vapor ? frame - vapor.t * fps : null;
  const reloj = esc.numero * 45 + frame / fps;

  const pintar = (q: Quien) => {
    if (!est[q].visible) return null;
    const hab = hablante === q && escribiendo;
    return (
      <PersonaEn
        key={q}
        quien={q}
        pose={est[q].pose}
        expr={est[q].expr}
        facing={facing(q)}
        x={pos[q].x}
        hablando={hab}
        escuchando={!hab}
        frame={frame}
        caminando={pos[q].caminando}
        apertura={hab ? apertura : undefined}
      />
    );
  };
  const delante: Quien[] = (["RAMON", "INSP", "DANI"] as Quien[]).sort((a, b) => pos[a].x - pos[b].x);

  const citacion = esc.citacionEnBarra !== undefined && idx >= esc.citacionEnBarra && frame >= starts[esc.citacionEnBarra] + 18;

  // Nota activa
  const nota = esc.notas.find((n) => {
    const ini = starts[n.enLinea] + 10;
    const fin = finLinea(n.hastaLinea ?? n.enLinea);
    return frame >= ini && frame < fin;
  });
  const notaIni = nota ? starts[nota.enLinea] + 10 : 0;
  const notaFin = nota ? finLinea(nota.hastaLinea ?? nota.enLinea) : 0;
  const nIn = nota ? spring({ frame: frame - notaIni, fps, config: { damping: 18, stiffness: 120 } }) : 0;
  const nOut = nota ? interpolate(frame, [notaFin - 10, notaFin], [0, 1], clamp) : 0;
  const notaX = (1 - nIn) * 720 + nOut * 720;

  const color = lin ? NOMBRES[lin.quien].color : "#fff";
  const subIn = lin ? interpolate(dt, [0, 8], [0, 1], clamp) : 0;
  const salida = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], clamp);

  // Rótulo de escena: grande al principio y luego pequeño
  const rot = interpolate(frame, [Math.max(30, starts[0] - 20), Math.max(50, starts[0])], [1, 0], { ...clamp, easing: suave });
  const rotIn = spring({ frame, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill style={{ fontFamily: FONT, overflow: "hidden", background: "#000" }}>
      <Audio src={staticFile("audio/tension.wav")} volume={() => (0.04 + 0.42 * tension * tension) * (escribiendo ? 0.45 : 1)} loop />
      {esc.lineas.map((_l, i) =>
        VOCES[idLinea(esc, i)] ? (
          <Sequence key={`v${i}`} from={starts[i] + VOZ_DESFASE} durationInFrames={Math.ceil(duracionVoz(esc, i) * fps) + 6} layout="none">
            <Audio src={staticFile(`voces/${idLinea(esc, i)}.wav`)} volume={1} />
          </Sequence>
        ) : null,
      )}
      {esc.sfxInicio?.map((s, i) => (
        <Efecto key={`i${i}`} sfx={s.sfx} from={s.t * fps} dur={s.sfx === "pasos" ? 2.2 * fps : undefined} vol={s.sfx === "golpe" ? 0.9 : 0.6} />
      ))}
      {esc.lineas.map((l, i) => (l.sfx ? <Efecto key={`l${i}`} sfx={l.sfx} from={starts[i] + (l.sfx === "papel" ? 4 : 0)} vol={l.sfx === "golpe" ? 0.9 : 0.7} /> : null))}
      {TODOS.flatMap((q) => movs[q].map((m, i) => <Efecto key={`p${q}${i}`} sfx="pasos" from={m.start} dur={m.dur} vol={0.45} />))}
      <Efecto sfx="taza" from={4.5 * fps} vol={0.25} />
      <Efecto sfx="taza" from={13 * fps} vol={0.2} />

      {/* Fondo con profundidad */}
      <AbsoluteFill style={{ transform: `translate(${cb.tx}px, ${cb.ty}px) scale(${zb})`, transformOrigin: "0 0", filter: desenfoque > 0.3 ? `blur(${desenfoque}px)` : undefined }}>
        <svg width={1920} height={1080}>
          <Defs />
          <FondoInterior frame={frame} reloj={reloj} vapor={vaporF} />
        </svg>
      </AbsoluteFill>

      {/* Personajes y barra */}
      <AbsoluteFill style={{ transform: `translate(${cp.tx}px, ${cp.ty}px) scale(${z})`, transformOrigin: "0 0" }}>
        <svg width={1920} height={1080}>
          <Defs />
          {pintar("LUCIA")}
          <Barra />
          {citacion ? (
            <g transform="translate(1010 694) skewX(-20)">
              <rect x={0} y={0} width={80} height={14} fill="#FFFFFF" stroke="#C9CDD2" />
              <rect x={8} y={4} width={40} height={3} fill="#1F3354" />
            </g>
          ) : null}
          {delante.map(pintar)}
          <MesaPrimerPlano />
          <rect width={1920} height={1080} fill="url(#luz)" />
        </svg>
      </AbsoluteFill>

      {/* viñetas */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(150,10,10,0.85) 100%)",
          opacity: Math.max(0, (tension - 0.55) * 1.6),
        }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 62%, rgba(0,0,0,0.5) 100%)" }} />

      {/* rótulo de escena + tensión */}
      <div style={{ position: "absolute", left: 50, top: 44, color: "white" }}>
        <div
          style={{
            transform: `scale(${1 + rot * 0.9})`,
            transformOrigin: "0 0",
            opacity: rotIn,
            background: "rgba(15,30,54,0.9)",
            padding: "12px 22px",
            borderRadius: 8,
            fontSize: 24,
            fontWeight: 700,
            borderLeft: `6px solid ${ORO}`,
          }}
        >
          <span style={{ color: ORO }}>ESCENA {esc.numero}</span> · {esc.capitulo}
        </div>
        <div style={{ marginTop: 12 + rot * 50, background: "rgba(15,30,54,0.75)", padding: "10px 16px", borderRadius: 8, width: 300, opacity: 1 - rot }}>
          <div style={{ fontSize: 16, letterSpacing: 4, fontWeight: 700, color: "#C9D6E8" }}>TENSIÓN</div>
          <div style={{ marginTop: 8, height: 12, borderRadius: 6, background: "rgba(255,255,255,0.15)", overflow: "hidden" }}>
            <div style={{ width: `${Math.round(tension * 100)}%`, height: "100%", background: "linear-gradient(90deg, #5CCB8A, #F2C14E 50%, #E5483B)", backgroundSize: "268px 12px" }} />
          </div>
        </div>
      </div>

      {nota ? (
        <div
          style={{
            position: "absolute",
            right: 50,
            top: 44,
            width: 610,
            transform: `translateX(${notaX}px)`,
            background: "rgba(255,255,255,0.97)",
            borderRadius: 12,
            padding: "22px 28px 22px 30px",
            borderLeft: `12px solid ${nota.tono === "alerta" ? "#E5483B" : "#4FA3FF"}`,
            boxShadow: "0 14px 50px rgba(0,0,0,0.35)",
            color: NAVY,
          }}
        >
          <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: 3, color: nota.tono === "alerta" ? "#C0352B" : "#2F6FB5" }}>
            {nota.tono === "alerta" ? "⚠ ATENCIÓN" : "§ CLAVE JURÍDICA"}
          </div>
          <div style={{ fontSize: 31, fontWeight: 800, marginTop: 6 }}>{nota.titulo}</div>
          <div style={{ fontSize: 23, lineHeight: 1.38, marginTop: 8 }}>{nota.texto}</div>
          <div style={{ display: "inline-block", marginTop: 14, fontSize: 19, fontWeight: 700, background: "#EEF2F7", padding: "6px 12px", borderRadius: 6, color: "#30435E" }}>
            {nota.ref}
          </div>
        </div>
      ) : null}

      {lin ? (
        <div
          style={{
            position: "absolute",
            left: 230,
            right: 230,
            bottom: 46,
            opacity: subIn * salida,
            transform: `translateY(${(1 - subIn) * 20}px)`,
            background: "rgba(10,14,22,0.84)",
            borderRadius: 14,
            padding: "20px 34px 24px",
            borderTop: `5px solid ${color}`,
          }}
        >
          <div style={{ fontSize: 23, fontWeight: 800, color, letterSpacing: 2 }}>
            {NOMBRES[lin.quien].nombre.toUpperCase()}
            <span style={{ color: "#8A97A8", fontWeight: 600, letterSpacing: 0 }}> · {NOMBRES[lin.quien].rol}</span>
          </div>
          <div style={{ fontSize: 39, color: "white", lineHeight: 1.3, marginTop: 6, minHeight: 100 }}>
            {lin.texto.slice(0, caracteres)}
            <span style={{ opacity: 0 }}>{lin.texto.slice(caracteres)}</span>
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ───────────────────────── Actuaciones posteriores ─────────────────────────
const ITEMS_POST = [
  { t: "Consulta en la Tesorería General de la Seguridad Social", d: "Dani: sin alta. Lucía: de alta hace 5 días, aunque declara 3 semanas de antigüedad." },
  { t: "Diligencia de la visita", d: "Personas identificadas, tareas, horarios y negativa a firmar el recibí, con hora y circunstancias." },
  { t: "Comparecencia del día 20", d: "Examen de contratos, recibos de salarios, registro de jornada y documentos de cotización." },
  { t: "Posibles actuaciones", d: "Acta de infracción por falta de alta, acta de liquidación de cuotas y altas de oficio." },
];

export const Posteriores: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#F4F1EA", fontFamily: FONT, padding: "90px 160px", color: NAVY }}>
      <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: 6, color: "#B08A2E" }}>DESPUÉS DE LA VISITA</div>
      <div style={{ fontSize: 66, fontWeight: 800, marginTop: 8 }}>Comprobación y actuaciones</div>
      <div style={{ marginTop: 44, display: "flex", flexDirection: "column", gap: 26 }}>
        {ITEMS_POST.map((it, i) => {
          const s = spring({ frame: frame - 20 - i * 1.6 * fps, fps, config: { damping: 200 } });
          return (
            <div key={i} style={{ display: "flex", gap: 28, alignItems: "flex-start", opacity: s, transform: `translateX(${(1 - s) * -60}px)` }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  background: NAVY,
                  color: ORO,
                  fontSize: 30,
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </div>
              <div>
                <div style={{ fontSize: 36, fontWeight: 800 }}>{it.t}</div>
                <div style={{ fontSize: 28, marginTop: 4, color: "#3D4C63", lineHeight: 1.35 }}>{it.d}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", bottom: 60, left: 160, fontSize: 22, color: "#7A8597" }}>
        Datos del supuesto inventados con fines didácticos.
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────── Claves ─────────────────────────
export const Resumen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: NAVY, fontFamily: FONT, padding: "80px 150px", color: "white" }}>
      <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: 6, color: ORO }}>CLAVES PARA EL INSPECTOR</div>
      <div style={{ fontSize: 60, fontWeight: 800, marginTop: 6, marginBottom: 34 }}>Lo que enseña este caso</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {PUNTOS_CLAVE.map((p, i) => {
          const s = spring({ frame: frame - 15 - i * 1.7 * fps, fps, config: { damping: 200 } });
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 30,
                opacity: s,
                transform: `translateY(${(1 - s) * 24}px)`,
                background: "rgba(255,255,255,0.06)",
                borderLeft: `6px solid ${ORO}`,
                borderRadius: 8,
                padding: "14px 24px",
              }}
            >
              <div style={{ fontSize: 30, lineHeight: 1.3 }}>
                <span style={{ color: ORO, fontWeight: 800, marginRight: 14 }}>{i + 1}</span>
                {p.t}
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#A9BCD6", whiteSpace: "nowrap" }}>{p.r}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────── Cierre ─────────────────────────
export const Cierre: React.FC = () => {
  const frame = useCurrentFrame();
  const a = interpolate(frame, [0, 25], [0, 1], { ...clamp, easing: suave });
  return (
    <AbsoluteFill style={{ background: NAVY, fontFamily: FONT, alignItems: "center", justifyContent: "center", color: "white", textAlign: "center" }}>
      <div style={{ opacity: a, transform: `scale(${0.95 + a * 0.05})` }}>
        <div style={{ fontSize: 30, letterSpacing: 8, color: ORO, fontWeight: 800 }}>PREPARADOR ITSS · TOLEDO</div>
        <div style={{ fontSize: 64, fontWeight: 800, marginTop: 20 }}>Formación en control de empleo</div>
        <div style={{ fontSize: 28, color: "#A9BCD6", marginTop: 24 }}>
          Cuerpo Superior de Inspección de Trabajo y Seguridad Social
        </div>
        <div style={{ fontSize: 21, color: "#6F84A3", marginTop: 70, maxWidth: 1300, lineHeight: 1.4 }}>
          Escenificación ficticia con fines formativos. Contrasta las referencias normativas con el texto consolidado vigente.
        </div>
      </div>
    </AbsoluteFill>
  );
};

export { FPS };
