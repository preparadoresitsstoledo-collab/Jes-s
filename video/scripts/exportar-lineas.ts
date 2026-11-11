// Exporta las líneas del guion a JSON para el generador de voces.
// Uso: node --experimental-strip-types scripts/exportar-lineas.ts > /ruta/lineas.json
import { ESCENAS } from "../src/guion.ts";

const lineas = ESCENAS.flatMap((e) =>
  e.lineas.map((l, i) => ({ id: `e${e.numero}-${i}`, quien: l.quien, texto: l.texto, tension: l.tension })),
);
process.stdout.write(JSON.stringify(lineas, null, 2));
