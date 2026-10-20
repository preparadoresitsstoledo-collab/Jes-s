# Preparación ITSS Toledo

Web promocional para la **preparación presencial** de la oposición al **Cuerpo Superior de
Inspección de Trabajo y Seguridad Social (ITSS)** en la provincia de Toledo.

Construida con **React + Vite**. Es una página de una sola pantalla (landing) con estas secciones:

- **Inicio (Hero):** presentación y reclamo principal, con silueta del skyline de Toledo.
- **Ventajas:** franja con los diferenciadores principales.
- **El preparador:** quién eres, bio, méritos, cita, medios y vídeo de presentación.
- **La profesión:** en qué consiste el trabajo de inspector (servicio público, garante de la legalidad, las visitas) y marco normativo (OIT 81/129, Ley 23/2015).
- **Resultados:** alumnos aprobados por convocatoria.
- **Estadísticas:** plazas, aspirantes, presentados y aprobados por convocatoria, con el
  porcentaje de aprobados sobre presentados y enlace al BOE de cada año.
- **El examen:** estructura del proceso selectivo (ejercicios, temas, tiempos), requisitos y temario (CEF + temario propio).
- **Metodología:** cómo son las clases (100% presenciales en Toledo, sin videoconferencia).
- **Cómo empezar:** pasos para incorporarse a la preparación.
- **Referencias:** testimonios de antiguos alumnos.
- **Preguntas frecuentes.**
- **Contacto:** email, teléfono, WhatsApp y formulario.

---

## Cómo arrancar el proyecto

Necesitas [Node.js](https://nodejs.org/) 18 o superior.

```bash
npm install      # instala dependencias (solo la primera vez)
npm run dev      # arranca el servidor de desarrollo (http://localhost:5173)
npm run build    # genera la versión de producción en /dist
npm run preview  # previsualiza la build de producción
```

---

## ✏️ Qué tienes que editar (datos de ejemplo)

Toda la información personalizable está en **dos archivos**. Los textos marcados con `(EDITAR)`
y los números son de **ejemplo**: sustitúyelos por los reales antes de publicar.

### 1. `src/data/convocatorias.js` — estadísticas oficiales

> ⚠️ Los números y los enlaces al BOE son **de ejemplo**. Debes poner las cifras **oficiales** de
> cada convocatoria (plazas, aspirantes, presentados y aprobados) y el enlace **real** al BOE.

Cada convocatoria tiene estos campos:

| Campo         | Significado                                         |
|---------------|-----------------------------------------------------|
| `año`         | Año de la convocatoria                               |
| `plazas`      | Plazas convocadas (acceso libre)                    |
| `aspirantes`  | Aspirantes admitidos / inscritos                    |
| `presentados` | Aspirantes que se presentaron al primer ejercicio   |
| `aprobados`   | Aprobados que obtuvieron plaza                       |
| `boe`         | URL al anuncio del BOE (`''` si aún no la tienes)    |
| `boeRef`      | Referencia del BOE (ej. `BOE-A-2024-XXXXX`)         |

El **porcentaje de aprobados sobre presentados** se calcula solo; no hace falta escribirlo.

### 2. `src/data/sitio.js` — tus datos y los del curso

- `marca`: nombre, email, teléfono y WhatsApp.
- `preparador`: tu nombre, cargo, **foto**, **bio**, **vídeo** y méritos.
- `testimonios`: referencias de alumnos.
- `metodologia`: tarjetas explicando cómo son las clases.
- `faqs`: preguntas frecuentes.

#### Foto del preparador
Coloca tu foto en `public/` (por ejemplo `public/preparador.jpg`) y en `src/data/sitio.js`
pon `foto: './preparador.jpg'`. Si lo dejas vacío, se muestra un avatar genérico.

#### Vídeo de presentación
En `preparador.videoUrl` pega la URL de tu vídeo de YouTube (la web la convierte automáticamente
al formato de inserción). Si lo dejas vacío, se muestra un aviso en su lugar.

---

## 🔍 Analizador de convenios colectivos

La web incluye una herramienta de apoyo al **control de legalidad de convenios colectivos**
(art. 90.5 y 6 ET), al estilo de los informes de la Inspección de Trabajo. Se accede desde el
menú (**Analizador de convenios**) o en la ruta `#/analizador`.

Cómo funciona:

1. Rellena los datos del informe (nombre del convenio, fecha, SMI vigente, inspector/a).
2. **Sube el archivo** del convenio (PDF, Word `.docx`/`.doc` o TXT) y la herramienta extrae el
   texto automáticamente, o pégalo a mano. 🔒 La extracción se hace **íntegramente en el navegador**
   (pdf.js + mammoth, cargados solo bajo demanda); los archivos **no se suben a ningún servidor**.
   Si el PDF está **escaneado** (sin texto seleccionable), aparece un botón para **reconocer el texto
   con OCR** (Tesseract en español, también en el navegador).
3. Pulsa **Analizar automáticamente**: la herramienta pre-marca
   los puntos detectables del cuadro (categorías vs grupos profesionales del art. 22, jubilación
   forzosa, vacaciones e IT, contrato de obra o servicio derogado, salario inferior al SMI, plan
   de igualdad, protocolo de acoso…).
3. Revisa y ajusta cada punto del **cuadro de verificación** (estado + observación).
4. El **informe** se genera en el formato oficial y puede **copiarse** o **imprimirse/guardarse en PDF**.

Archivos relevantes:

- `src/data/plantillaInforme.js` — cuadro de verificación y textos fijos del informe.
- `src/data/normativa.js` — SMI, límites del ET y transcripciones de artículos.
- `src/lib/analizadorConvenios.js` — motor de detección automática (heurístico).
- `src/lib/extraerTexto.js` — extracción de texto de PDF/Word/TXT en el navegador.
- `src/lib/ocr.js` — OCR de PDF escaneados (Tesseract), bajo demanda.
- `src/components/AnalizadorConvenios.jsx` — interfaz de la herramienta.

> ⚖️ Es una herramienta **orientativa y educativa**: no sustituye el criterio profesional ni
> constituye asesoramiento jurídico. La detección automática se basa en coincidencias de texto y
> **el SMI debe mantenerse actualizado** en `src/data/normativa.js`.

---

## ⚖️ Cálculo de indemnizaciones por extinción del contrato

Al estilo de la herramienta del Poder Judicial, la web incluye un **formulario para el cálculo de la
cuantía de las indemnizaciones laborales por extinción del contrato de trabajo**, conforme al
**Estatuto de los Trabajadores** y a las normas de las **relaciones laborales de carácter especial**
(art. 2 ET). Se accede desde el menú (**Cálculo de indemnizaciones**) o en la ruta
`#/indemnizaciones`.

Qué calcula:

1. **Régimen y causa de extinción.** Régimen común (despido improcedente, objetivo/colectivo, fin de
   temporal, arts. 40/41/50 ET, fuerza mayor, supuestos sin indemnización) y relaciones especiales:
   **alta dirección** (RD 1382/1985), **deportistas profesionales** (RD 1006/1985), **artistas**
   (RD 1435/1985), **representantes de comercio** (RD 1438/1985), **empleados de hogar**
   (RD 1620/2011) y **abogados de despachos** (RD 1331/2006).
2. **Régimen transitorio (DT 11ª ET):** para el despido improcedente, calcula el doble tramo
   **45 días/año hasta el 11/02/2012 + 33 días/año desde el 12/02/2012**, aplicando el tope de 720
   días, salvo que lo devengado antes de la reforma sea superior (máximo absoluto de 42 mensualidades).
3. **Variantes de contrato:** jornada completa, **tiempo parcial** y **fijo-discontinuo** (con
   descuento del tiempo no computable), y periodos no computables (excedencias).
4. **Informe imprimible** con el desglose paso a paso, el fundamento legal citado y los avisos.

Archivos relevantes:

- `src/data/indemnizaciones.js` — regímenes, causas, módulos, topes y base legal.
- `src/lib/calcIndemnizacion.js` — motor de cálculo (módulo, prorrateo por meses y DT 11ª).
- `src/components/CalculadoraIndemnizaciones.jsx` — interfaz de la herramienta.

> ⚖️ Herramienta **orientativa e informativa**: los resultados **no son vinculantes** ni constituyen
> asesoramiento jurídico. La cuantía definitiva depende del salario regulador, de la calificación
> judicial del despido y de los pactos individuales o de convenio.

---

## 🧰 Portal de herramientas

Todas las aplicaciones se centralizan en un **registro único** y se exponen en tres sitios
sincronizados: el menú (**Herramientas**), una **sección en la home** y un **portal** con tarjetas
en la ruta `#/herramientas`. Cada herramienta vuelve al portal con su enlace «Volver a herramientas».

**Para añadir una nueva aplicación basta con una entrada** en `src/data/herramientas.js`:

```js
{
  id: 'mi-app',
  ruta: '#/mi-app',
  nombre: 'Mi herramienta',
  icono: '🧮',
  resumen: 'Frase corta',
  descripcion: 'Descripción para la tarjeta…',
  etiquetas: ['Etiqueta'],
  Componente: lazy(() => import('../components/MiApp.jsx')),
}
```

El menú, la tarjeta y la ruta aparecen solos (carga diferida con `React.lazy`), sin tocar
`App.jsx` ni `Navbar.jsx`.

- `src/data/herramientas.js` — registro central de aplicaciones.
- `src/components/PortalHerramientas.jsx` — página índice (`#/herramientas`).
- `src/components/Herramientas.jsx` — sección de herramientas en la home.

---

## 🏗️ Informe sobre el plan de trabajo con amianto

Editor con la **estructura oficial del art. 11.2 del RD 396/2006** para redactar el informe de la
autoridad laboral sobre el plan de trabajo con riesgo de exposición al amianto (**art. 12.2**). Se
accede desde el portal o en la ruta `#/amianto`.

- **No incluye texto de informe**: aporta los apartados legales (solo títulos y base, del BOE) con
  áreas de texto vacías, los datos identificativos del expediente y el encabezado redactable.
- **Marco normativo y documentación, solo fuentes oficiales**: BOE (RD 396/2006, LPRL, RD 665/1997,
  RD 39/1997, Ley 7/2022) e INSST (guía técnica, directrices de retirada y portal del amianto).
- Vista previa **imprimible / PDF**.

Archivos relevantes:

- `src/data/amianto.js` — apartados del art. 11.2, normativa (BOE) y documentación (INSST).
- `src/components/InformesAmianto.jsx` — interfaz del editor.

> ⚖️ Herramienta **orientativa e informativa**: no constituye resolución ni informe administrativo
> ni sustituye el criterio profesional.

---

## 🚚 Analizador de tacógrafo (tarjeta de conductor)

Lee **a la vez todas las descargas de la tarjeta del conductor** (archivos C: `.DDD`, `.TGD`,
`.C1B`…, 1.ª y 2.ª generación), aunque sean decenas de archivos y abarquen varios años. Une las
descargas y elimina los días repetidos entre ellas. Después calcula día a día los tiempos y las horas
extraordinarias. Se accede desde el portal o en la ruta `#/tacografo`. Los archivos **se procesan
solo en el navegador**: no se envían a ningún servidor.

Cómo se usa:

1. Arrastra los archivos o selecciona una carpeta completa. Se agrupan por conductor (nº de tarjeta).
   Los archivos de vehículo (V) y los ajenos se descartan.
2. Elige el conductor y el periodo (todo, último año o últimos 4 años).
3. Revisa los **parámetros del convenio**: jornada anual, precio de la hora extraordinaria de cada
   año, método de cómputo de las horas extra y criterios. Se recuerdan en el navegador.
4. Pulsa **Analizar** para ver el resumen, el gráfico de actividades de cada mes y las incidencias.
   Pulsa **Descargar Excel** para obtener el libro completo.

Qué comprueba:

- **Reglamento (CE) 561/2006:**
  - Conducción diaria: 9/10 h y máximo 2 ampliaciones por semana.
  - Conducción semanal (56 h) y bisemanal (90 h).
  - Pausas tras 4 h 30 min (45 min o 15 + 30).
  - Descanso diario en 24 h: normal, reducido y fraccionado 3 + 9. En conducción en equipo, 9 h en 30 h.
  - Máximo 3 descansos diarios reducidos.
  - Descanso semanal: plazo de 6 periodos de 24 h, reducidos consecutivos y compensación.
- **RD 1561/1995:**
  - Tiempo de presencia (máximo 20 h/semana de promedio mensual).
  - Art. 10 bis: 48 h de promedio por cuatrimestre y 60 h semanales.
  - Pausas cada 6 h de trabajo (30/45 min).
  - Límite de 10 h en jornadas con trabajo nocturno.
- **Estatuto de los Trabajadores:**
  - Jornada diaria y semanal (art. 34).
  - Descanso entre jornadas (art. 34.3).
  - Límite de 80 horas extraordinarias/año (art. 35.2).
- **Horas extraordinarias** con cuatro métodos: mensual prorrateado, semanal, diario y anual. El
  elegido alimenta la hoja de liquidación.

El **Excel** contiene estas hojas:

- **Resumen:** datos del conductor y del expediente, totales por año, comparación de métodos de
  horas extra, incidencias y criterios aplicados.
- **Liquidación HE:** una fila por mes. Los precios y el tipo de cotización son editables y las
  fórmulas recalculan los importes; incluye un resumen anual.
- **Años, Meses, Cuatrimestres y Semanas.**
- **Detalle diario:** inicio, fin, amplitud, conducción, otros trabajos, disponibilidad, descanso,
  trabajo efectivo, exceso diario, nocturnidad, km, vehículos e incidencias.
- **Jornadas:** cada jornada con su descanso y tipo.
- **Incidencias:** fecha, norma, artículo, valor, límite y diferencia.
- **Actividades:** todos los tramos.
- **Vehículos y archivos.**

Archivos relevantes:

- `src/lib/tacografo/ddd.js` — lector de archivos de tarjeta (Reglamento (UE) 2016/799, anexo IC).
- `src/lib/tacografo/analisis.js` — motor de análisis normativo y de horas extraordinarias.
- `src/lib/tacografo/excel.js` — generación del Excel (ExcelJS, se carga solo al descargar).
- `src/data/tacografo.js` — **parámetros por defecto** (jornada anual del convenio, límites, etc.).
- `src/components/AnalizadorTacografo.jsx` — interfaz.
- Pruebas: `npm run test:tacografo`. Usan archivos de tarjeta sintéticos generados por
  `src/lib/tacografo/__tests__/generador.js`.

> ⚠️ La **jornada anual** (1.800 h por defecto) y los **precios de la hora extraordinaria** deben
> comprobarse en el texto vigente del Convenio de Transporte de Mercancías por Carretera de Toledo
> (BOP de Toledo núm. 64, de 4/4/2024, y revisiones salariales). La franja nocturna por defecto
> (22:00–06:00, art. 36 ET) y el descanso entre jornadas (12 h) son configurables.
>
> ⚖️ Herramienta **orientativa**. Las horas del tacógrafo (UTC) se convierten a hora peninsular. Los
> días sin registro y las entradas manuales deben contrastarse con otras pruebas. Las infracciones
> del R. 561/2006 son competencia de la Inspección de Transporte (LOTT).

---

## 🧾 Dietas y jornada anual

Herramienta pública en `#/dietas-jornada` para comprobar, en empresas de transporte, si las **dietas
exentas** encubren salario y si se supera la **jornada máxima anual** del convenio. Todo se procesa en el
navegador: no se envía ni se guarda nada en la web (el expediente se guarda como archivo `.json` en el equipo).

**Datos de entrada** (por trabajador y año, cualquiera de ellos es opcional):

- Días con dieta de las nóminas, o líneas de nómina pegadas desde Excel/CSV
  (`trabajador · mes · tipo de dieta · días · importe por día`).
- Archivos de la tarjeta del conductor (.DDD/.TGD): días con actividad y horas de trabajo efectivo y de presencia.
- Periodos de vacaciones del cuadrante de la empresa, días de IT, fechas de alta y baja.

**Cálculos:**

- **Por días** (modelo de requerimiento): días hábiles teóricos = jornada anual / jornada diaria
  (1.800 / 8 = 225), proporcionales en periodos inferiores al año (por meses: enero–octubre = 188 días; o por
  días naturales). Días trabajados = el mayor entre días con dieta y días de tacógrafo (configurable).
  Exceso de días × jornada diaria = horas de exceso.
- **Por horas** (calculadora de transportes): jornada máxima = jornada anual × (días en alta − IT) / días del
  año (365 o 366). El trabajo efectivo que la excede son horas extraordinarias (base de contingencias
  profesionales); el resto del exceso (presencia), base de contingencias comunes.
- **Vacaciones**: disfrutadas frente a las debidas (30 días naturales, proporcionales) y días con actividad
  durante las vacaciones.
- **Dietas**: rango e importes distintos por tipo, nóminas con varios precios para el mismo tipo de dieta e
  importes por encima de los límites exentos del art. 9.A RIRPF (verificar cada ejercicio en
  `src/data/dietasJornada.js`).

**Salidas:** hechos comprobados redactados con la estructura del requerimiento (copiar, Word, imprimir/PDF) y
Excel con el cuadrante por días, el cálculo por horas (con fórmulas editables), el análisis de dietas y las
líneas de nómina.

Pruebas: `npm run test:dietas`.

## SEO (posicionamiento en buscadores)

La web está preparada para buscadores: etiquetas meta, Open Graph y Twitter Card,
geolocalización en Toledo, datos estructurados **JSON-LD** (organización educativa,
persona, curso y FAQ), `robots.txt`, `sitemap.xml`, imagen social `og-image.jpg` y un
fallback `<noscript>`.

**⚠️ Importante — antes de publicar, cambia el dominio de ejemplo por el tuyo real**
(`https://www.preparacionitsstoledo.es`) en estos archivos:

- `index.html` (canonical, Open Graph, Twitter y JSON-LD)
- `public/robots.txt`
- `public/sitemap.xml`

Tras publicar, da de alta la web en **Google Search Bing Webmaster Tools** y envía el
`sitemap.xml` para acelerar la indexación.

### Imagen de fondo de Toledo

El hero incluye una **silueta del skyline de Toledo** (Alcázar y catedral) en SVG, sin
depender de archivos externos. Si prefieres una **foto real**, sigue las instrucciones
del comentario `.hero--foto` en `src/index.css` (añade `public/hero-toledo.jpg` y la
clase `hero--foto` al hero).

## Despliegue

Tras `npm run build`, la carpeta `dist/` contiene archivos estáticos que puedes subir a
cualquier hosting (GitHub Pages, Netlify, Vercel, un servidor propio…). La configuración usa
rutas relativas (`base: './'`), así que funciona también en subcarpetas.

---

## Nota sobre el formulario de contacto

El formulario **no usa servidor**: al enviarlo abre el cliente de correo del visitante con un
email ya redactado hacia tu dirección. Si en el futuro quieres recibir los mensajes sin abrir el
correo del usuario, puedes integrar un servicio como Formspree, Netlify Forms o similar.
