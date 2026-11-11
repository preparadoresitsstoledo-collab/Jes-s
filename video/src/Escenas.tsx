import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { staticFile } from "remotion";
import { Barra, Defs, FondoExterior, FondoInterior, MesaPrimerPlano } from "./Escenarios";
import { Persona } from "./Persona";
import {
  duracionLinea,
  EscenaDialogo,
  EstadoPersonaje,
  FPS,
  NOMBRES,
  PUNTOS_CLAVE,
  Quien,
} from "./guion";

const FONT = "Inter, 'DejaVu Sans', sans-serif";
const NAVY = "#0F1E36";
const ORO = "#F2C14E";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const suave = Easing.bezier(0.16, 1, 0.3, 1);

const ESCALA = 1.1;
const SUELO = 1000;

const PersonaEn: React.FC<{
  quien: Quien;
  e: EstadoPersonaje;
  x: number;
  hablando: boolean;
  frame: number;
  opacity?: number;
  escala?: number;
  suelo?: number;
  caminando?: boolean;
}> = ({ quien, e, x, hablando, frame, opacity = 1, escala = ESCALA, suelo = SUELO, caminando }) => (
  <g transform={`translate(${x - 110 * escala} ${suelo - 530 * escala}) scale(${escala})`} opacity={opacity}>
    <Persona quien={quien} pose={e.pose} expr={e.expr} facing={e.facing} hablando={hablando} frame={frame} caminando={caminando} />
  </g>
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
export const Exterior: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const x = interpolate(frame, [0, 6.5 * fps], [-120, 1060], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const andando = frame < 6.5 * fps;
  const cam = interpolate(frame, [0, durationInFrames], [1, 1.08], clamp);
  const chy = spring({ frame: frame - 15, fps, config: { damping: 200 } });
  const orden = spring({ frame: frame - 2.8 * fps, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ fontFamily: FONT, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${cam})`, transformOrigin: "60% 70%" }}>
        <svg width={1920} height={1080}>
          <Defs />
          <FondoExterior frame={frame} />
          <PersonaEn
            quien="INSP"
            e={{ x, pose: "folder", expr: "calm", facing: 1, visible: true }}
            x={x}
            hablando={false}
            frame={frame}
            escala={1.05}
            suelo={850}
            caminando={andando}
          />
        </svg>
      </AbsoluteFill>
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

// ───────────────────────── Rótulo de capítulo ─────────────────────────
export const Capitulo: React.FC<{ numero: number; titulo: string }> = ({ numero, titulo }) => {
  const frame = useCurrentFrame();
  const a = interpolate(frame, [0, 18], [0, 1], { ...clamp, easing: suave });
  const w = interpolate(frame, [6, 36], [0, 380], { ...clamp, easing: suave });
  return (
    <AbsoluteFill style={{ background: NAVY, fontFamily: FONT, justifyContent: "center", paddingLeft: 200 }}>
      <div style={{ color: ORO, fontSize: 200, fontWeight: 800, opacity: a, lineHeight: 1 }}>{String(numero).padStart(2, "0")}</div>
      <div style={{ width: w, height: 6, background: ORO, margin: "24px 0" }} />
      <div style={{ color: "white", fontSize: 76, fontWeight: 800, opacity: a, transform: `translateX(${(1 - a) * 40}px)` }}>{titulo}</div>
    </AbsoluteFill>
  );
};

// ───────────────────────── Escena con diálogo ─────────────────────────
const LEAD = 15;

const estados = (esc: EscenaDialogo, idx: number) => {
  const r: Record<Quien, EstadoPersonaje> = JSON.parse(JSON.stringify(esc.reparto));
  for (let i = 0; i <= idx; i++) {
    const c = esc.lineas[i]?.cambios;
    if (!c) continue;
    (Object.keys(c) as Quien[]).forEach((q) => Object.assign(r[q], c[q]));
  }
  return r;
};

export const EscenaInterior: React.FC<{ esc: EscenaDialogo }> = ({ esc }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const starts: number[] = [];
  let acc = LEAD;
  esc.lineas.forEach((l) => {
    starts.push(acc);
    acc += duracionLinea(l);
  });
  const finLinea = (i: number) => (i + 1 < starts.length ? starts[i + 1] : durationInFrames);

  let idx = -1;
  starts.forEach((s, i) => {
    if (frame >= s) idx = i;
  });
  const lin = idx >= 0 ? esc.lineas[idx] : null;
  const t0 = idx >= 0 ? starts[idx] : 0;
  const dt = frame - t0;

  const cur = estados(esc, idx);
  const prev = estados(esc, idx - 1);
  const mover = (q: Quien) => interpolate(dt, [0, 24], [prev[q].x, cur[q].x], { ...clamp, easing: suave });

  // Tensión
  const tPrev = idx > 0 ? esc.lineas[idx - 1].tension : (esc.lineas[0].tension * 0.7);
  const tension = lin ? interpolate(dt, [0, 20], [tPrev, lin.tension], clamp) : tPrev;

  // Texto que se va escribiendo
  const caracteres = lin ? Math.floor(Math.max(0, dt - 4) * 0.95) : 0;
  const escribiendo = lin ? caracteres < lin.texto.length + 6 : false;

  // Cámara
  const foco = (i: number) => {
    if (i < 0) return 960;
    const q = esc.lineas[i].quien;
    return estados(esc, i)[q].x;
  };
  const fx = idx >= 0 ? interpolate(dt, [0, 22], [foco(idx - 1 >= 0 ? idx - 1 : idx), foco(idx)], { ...clamp, easing: suave }) : 960;
  const z = 1.06 + 0.07 * tension;
  const maxT = (z - 1) * 960;
  let tx = Math.max(-maxT, Math.min(maxT, (960 - fx) * 0.32 * z));
  let ty = Math.min((z - 1) * 540, 40 * (z - 1) * 10);
  if (tension > 0.8) {
    const k = (tension - 0.8) * 5;
    tx += Math.sin(frame * 1.7) * 3 * k;
    ty += Math.cos(frame * 2.3) * 2 * k;
  }
  const entrada = interpolate(frame, [0, 15], [0, 1], clamp);

  const orden: Quien[] = (["RAMON", "INSP", "DANI"] as Quien[]).sort((a, b) => cur[a].x - cur[b].x);

  const pintar = (q: Quien) => {
    const e = cur[q];
    if (!e.visible) return null;
    const hab = !!lin && lin.quien === q && escribiendo;
    return <PersonaEn key={q} quien={q} e={e} x={mover(q)} hablando={hab} frame={frame} opacity={q === "RAMON" && esc.numero === 3 ? entrada : 1} />;
  };

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

  return (
    <AbsoluteFill style={{ fontFamily: FONT, overflow: "hidden", background: "#000" }}>
      <Audio src={staticFile("audio/tension.wav")} volume={() => 0.05 + 0.4 * tension * tension} loop />
      <AbsoluteFill style={{ transform: `translate(${tx}px, ${ty}px) scale(${z})` }}>
        <svg width={1920} height={1080}>
          <Defs />
          <FondoInterior frame={frame} />
          {pintar("LUCIA")}
          <Barra />
          {orden.map(pintar)}
          <MesaPrimerPlano />
          <rect width={1920} height={1080} fill="url(#luz)" />
        </svg>
      </AbsoluteFill>

      {/* viñeta de tensión */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(150,10,10,0.85) 100%)",
          opacity: Math.max(0, (tension - 0.55) * 1.6),
        }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 65%, rgba(0,0,0,0.45) 100%)" }} />

      {/* etiqueta de escena y tensiómetro */}
      <div style={{ position: "absolute", left: 50, top: 44, color: "white" }}>
        <div style={{ background: "rgba(15,30,54,0.88)", padding: "12px 22px", borderRadius: 8, fontSize: 24, fontWeight: 700, borderLeft: `6px solid ${ORO}` }}>
          ESCENA {esc.numero} · {esc.capitulo}
        </div>
        <div style={{ marginTop: 12, background: "rgba(15,30,54,0.75)", padding: "10px 16px", borderRadius: 8, width: 300 }}>
          <div style={{ fontSize: 16, letterSpacing: 4, fontWeight: 700, color: "#C9D6E8" }}>TENSIÓN</div>
          <div style={{ marginTop: 8, height: 12, borderRadius: 6, background: "rgba(255,255,255,0.15)", overflow: "hidden" }}>
            <div
              style={{
                width: `${Math.round(tension * 100)}%`,
                height: "100%",
                background: "linear-gradient(90deg, #5CCB8A, #F2C14E 50%, #E5483B)",
                backgroundSize: "268px 12px",
              }}
            />
          </div>
        </div>
      </div>

      {/* nota jurídica */}
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
          <div
            style={{
              display: "inline-block",
              marginTop: 14,
              fontSize: 19,
              fontWeight: 700,
              background: "#EEF2F7",
              padding: "6px 12px",
              borderRadius: 6,
              color: "#30435E",
            }}
          >
            {nota.ref}
          </div>
        </div>
      ) : null}

      {/* subtítulo */}
      {lin ? (
        <div
          style={{
            position: "absolute",
            left: 210,
            right: 210,
            bottom: 50,
            opacity: subIn * salida,
            transform: `translateY(${(1 - subIn) * 20}px)`,
            background: "rgba(10,14,22,0.86)",
            borderRadius: 14,
            padding: "22px 34px 26px",
            borderTop: `5px solid ${color}`,
          }}
        >
          <div style={{ fontSize: 23, fontWeight: 800, color, letterSpacing: 2 }}>
            {NOMBRES[lin.quien].nombre.toUpperCase()}
            <span style={{ color: "#8A97A8", fontWeight: 600, letterSpacing: 0 }}> · {NOMBRES[lin.quien].rol}</span>
          </div>
          <div style={{ fontSize: 40, color: "white", lineHeight: 1.3, marginTop: 6, minHeight: 104 }}>
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
