// Tiempos de cada línea y escena, a partir de la duración real de las voces.
import { EscenaDialogo, FPS } from "./guion";
import { VOCES } from "./voces";

export const idLinea = (e: EscenaDialogo, i: number) => `e${e.numero}-${i}`;

// Duración de la voz (s). Si no hay voz generada, se estima por la longitud del texto.
export const duracionVoz = (e: EscenaDialogo, i: number) => VOCES[idLinea(e, i)]?.dur ?? e.lineas[i].texto.length / 15;

export const duracionLinea = (e: EscenaDialogo, i: number) =>
  Math.round((Math.max(1.6, duracionVoz(e, i) + 0.75) + (e.lineas[i].extra ?? 0)) * FPS);

export const inicioEscena = (e: EscenaDialogo) => Math.round(e.inicio * FPS);

export const duracionEscena = (e: EscenaDialogo) =>
  inicioEscena(e) + e.lineas.reduce((acc, _l, i) => acc + duracionLinea(e, i), 0) + Math.round(1.0 * FPS);

