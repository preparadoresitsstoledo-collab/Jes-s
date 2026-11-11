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

## Voces

Las voces se generan sin conexión con [Kokoro](https://github.com/thewh1teagle/kokoro-onnx)
(TTS neuronal, voces en español):

| Personaje | Voz | Ajuste |
|---|---|---|
| Inspector | `em_alex` | ritmo sereno |
| Lucía | `ef_dora` | algo más rápida cuando está nerviosa |
| Ramón | `em_santa` | más grave; más rápido y fuerte cuando se enfada |
| Dani | `em_alex` | +2,5 semitonos (más joven) |

Los archivos ya generados están en `public/voces/` y sus duraciones y envolventes (para la
sincronía labial) en `src/voces.ts`. Si cambias el texto del guion, regénéralas:

```bash
pip install kokoro-onnx soundfile
# descarga una vez los modelos (≈350 MB) en una carpeta fuera del repo:
#   kokoro-v1.0.onnx y voices-v1.0.bin de
#   https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0
node --experimental-strip-types --no-warnings scripts/exportar-lineas.ts > /tmp/lineas.json
python3 scripts/generar_voces.py /tmp/lineas.json /ruta/a/modelos-kokoro
```

La duración de cada línea, el ritmo de los subtítulos y el movimiento de la boca se ajustan
solos a la voz. Pronunciaciones especiales (p. ej. «DNI» → «de ene i») en `PRONUNCIA` del script.

## Pendiente de revisar

- Contrastar los apartados citados (en especial art. 50 LISOS y art. 13.3.a Ley 23/2015) con el texto consolidado del BOE.
- Voces sintéticas (Kokoro): naturales pero sin la expresividad de un actor; para más calidad se pueden sustituir los WAV de `public/voces/` por grabaciones reales con el mismo nombre y volver a ejecutar solo la parte de duraciones.
