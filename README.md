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
2. Pega el texto del convenio y pulsa **Analizar automáticamente**: la herramienta pre-marca
   los puntos detectables del cuadro (categorías vs grupos profesionales del art. 22, jubilación
   forzosa, vacaciones e IT, contrato de obra o servicio derogado, salario inferior al SMI, plan
   de igualdad, protocolo de acoso…).
3. Revisa y ajusta cada punto del **cuadro de verificación** (estado + observación).
4. El **informe** se genera en el formato oficial y puede **copiarse** o **imprimirse/guardarse en PDF**.

Archivos relevantes:

- `src/data/plantillaInforme.js` — cuadro de verificación y textos fijos del informe.
- `src/data/normativa.js` — SMI, límites del ET y transcripciones de artículos.
- `src/lib/analizadorConvenios.js` — motor de detección automática (heurístico).
- `src/components/AnalizadorConvenios.jsx` — interfaz de la herramienta.

> ⚖️ Es una herramienta **orientativa y educativa**: no sustituye el criterio profesional ni
> constituye asesoramiento jurídico. La detección automática se basa en coincidencias de texto y
> **el SMI debe mantenerse actualizado** en `src/data/normativa.js`.

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
