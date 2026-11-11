# Vídeo formativo: control de empleo en una cafetería

Proyecto [Remotion](https://www.remotion.dev) con un caso práctico animado (≈4 min, 1920×1080, 30 fps)
para formación en Inspección de Trabajo y Seguridad Social.

**Escenificación ficticia**: personas y establecimiento inventados.

## Estructura del caso

| Bloque | Contenido |
|---|---|
| Título | Caso práctico · Control de empleo en una cafetería |
| Exterior | Llegada del inspector, coche y peatón, puerta que se abre · orden de servicio |
| Escena 1 | Entrada y acreditación (art. 13.1 Ley 23/2015) |
| Escena 2 | Trabajadora sin DNI · toma de datos (art. 13.3.a Ley 23/2015, art. 50 LISOS) |
| Escena 3 | Aparece el empresario: «vuelva otro día» · desescalar |
| Escena 4 | «Es un extra, ha venido a hacer una prueba» (arts. 1.1, 8.1 y 14 ET; art. 32.3 RD 84/1996; art. 22.2 LISOS) |
| Escena 5 | Negativa a firmar la citación (art. 41.5 Ley 39/2015; art. 23 Ley 23/2015) |
| Después | Comprobación en TGSS, diligencia, comparecencia, actas |
| Claves | Siete puntos para el inspector |

Todo el texto (diálogos, notas jurídicas y claves) está en `src/guion.ts`; se puede editar
sin tocar la animación: la duración de cada escena se recalcula sola.

### Puesta en escena (también en `src/guion.ts`)

Cada línea de diálogo admite:

- `plano`: `general`, `dos` (plano a dos), `medio` o `primer` (primer plano). Corte seco al empezar la línea.
- `reaccion`: a mitad de la línea, corte al plano de reacción de ese personaje.
- `a`: a quién se dirige (los personajes miran a quien habla).
- `cambios`: pose, expresión o posición `x` (el personaje camina hasta allí, con pasos).
- `sfx`: `campana`, `pasos`, `taza`, `papel`, `golpe`, `vapor`, `mesa`.

Poses: `stand`, `card` (acreditación), `folder`, `paper` (portapapeles; el inspector toma notas
mientras escucha), `tray`, `point`, `hands`, `arms` (brazos cruzados), `hips` (brazos en jarra), `give` (entrega un papel).

## Uso

```bash
npm install
npm run dev                      # Remotion Studio (vista previa)
npx remotion render ControlEmpleoCafeteria out/control-empleo-cafeteria.mp4
```

En entornos sin acceso a la descarga de Chrome, indica un navegador local:
`REMOTION_CHROME=/ruta/a/chrome-headless-shell npx remotion render ...`

## Pendiente de revisar

- Contrastar los apartados citados (en especial art. 50 LISOS y art. 13.3.a Ley 23/2015) con el texto consolidado del BOE.
- El audio es sintético (ambiente, dron de tensión y efectos generados con ffmpeg); no hay locución.
