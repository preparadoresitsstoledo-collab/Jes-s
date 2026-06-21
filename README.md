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
