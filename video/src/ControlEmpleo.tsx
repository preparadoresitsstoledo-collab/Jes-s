import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { duracionEscena, ESCENAS, FPS } from "./guion";
import { Cierre, EscenaInterior, Exterior, Posteriores, Resumen, Titulo } from "./Escenas";

const T = 12; // frames de fundido

type Bloque = { id: string; dur: number; el: React.ReactNode };

export const BLOQUES: Bloque[] = [
  { id: "titulo", dur: 6 * FPS, el: <Titulo /> },
  { id: "exterior", dur: Math.round(9.2 * FPS), el: <Exterior /> },
  ...ESCENAS.map((esc) => ({ id: `esc${esc.numero}`, dur: duracionEscena(esc), el: <EscenaInterior esc={esc} /> })),
  { id: "posteriores", dur: 10 * FPS, el: <Posteriores /> },
  { id: "resumen", dur: 17 * FPS, el: <Resumen /> },
  { id: "cierre", dur: 6 * FPS, el: <Cierre /> },
];

export const DURACION_TOTAL = BLOQUES.reduce((a, b) => a + b.dur, 0) - T * (BLOQUES.length - 1);

export const ControlEmpleo: React.FC = () => (
  <AbsoluteFill style={{ background: "#0F1E36" }}>
    <Audio src={staticFile("audio/ambiente.wav")} volume={0.35} loop />
    <TransitionSeries>
      {BLOQUES.flatMap((b, i) => {
        const items = [
          <TransitionSeries.Sequence key={b.id} durationInFrames={b.dur}>
            {b.el}
          </TransitionSeries.Sequence>,
        ];
        if (i < BLOQUES.length - 1) {
          items.push(<TransitionSeries.Transition key={`${b.id}-t`} presentation={fade()} timing={linearTiming({ durationInFrames: T })} />);
        }
        return items;
      })}
    </TransitionSeries>
  </AbsoluteFill>
);
