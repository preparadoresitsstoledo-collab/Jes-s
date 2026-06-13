# Preparación ITSS Toledo

Web promocional para la **preparación presencial** de la oposición al **Cuerpo Superior de
Inspección de Trabajo y Seguridad Social (ITSS)** en la provincia de Toledo.

Construida con **React + Vite**. Es una página de una sola pantalla (landing) con estas secciones:

- **Inicio (Hero):** presentación y reclamo principal.
- **El preparador:** quién eres, bio, méritos y vídeo de presentación.
- **Estadísticas:** plazas, aspirantes, presentados y aprobados por convocatoria, con el
  porcentaje de aprobados sobre presentados y enlace al BOE de cada año.
- **Metodología:** cómo son las clases (100% presenciales en Toledo, sin videoconferencia).
- **Precios:** coste de la preparación.
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
- `planes`: **precios** y conceptos.
- `faqs`: preguntas frecuentes.

#### Foto del preparador
Coloca tu foto en `public/` (por ejemplo `public/preparador.jpg`) y en `src/data/sitio.js`
pon `foto: './preparador.jpg'`. Si lo dejas vacío, se muestra un avatar genérico.

#### Vídeo de presentación
En `preparador.videoUrl` pega la URL de tu vídeo de YouTube (la web la convierte automáticamente
al formato de inserción). Si lo dejas vacío, se muestra un aviso en su lugar.

---

## Despliegue

Tras `npm run build`, la carpeta `dist/` contiene archivos estáticos que puedes subir a
cualquier hosting (GitHub Pages, Netlify, Vercel, un servidor propio…). La configuración usa
rutas relativas (`base: './'`), así que funciona también en subcarpetas.

---

## Nota sobre el formulario de contacto

El formulario **no usa servidor**: al enviarlo abre el cliente de correo del visitante con un
email ya redactado hacia tu dirección. Si en el futuro quieres recibir los mensajes sin abrir el
correo del usuario, puedes integrar un servicio como Formspree, Netlify Forms o similar.
