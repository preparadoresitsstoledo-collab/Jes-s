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

## 🚛 Herramientas de inspección en el transporte por carretera

Apartado propio dentro de **Herramientas** (`#herramientas-transporte`) con dos aplicaciones.

### 🚚 Analizador de tacógrafo (tarjeta de conductor)

Lee **a la vez todas las descargas de la tarjeta del conductor** (archivos C: `.DDD`, `.TGD`,
`.C1B`…, 1.ª y 2.ª generación), aunque sean decenas de archivos y abarquen varios años. Une las
descargas y elimina los días repetidos entre ellas. Después calcula día a día los tiempos y las horas
extraordinarias. Se accede desde Herramientas → Transporte por carretera o en la ruta `#/tacografo`. Los archivos **se procesan
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

### 🧾 Dietas y jornada anual

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
- **Cómputo horario** (con los registros del tacógrafo): jornada exigible del tramo = jornada anual × días
  computables (sin los de suspensión del contrato) / días naturales del año. El tiempo registrado que la rebasa
  es el exceso total; su parte de trabajo efectivo son horas extraordinarias (contingencias profesionales y
  cotización adicional, arts. 147.2 y 149 LGSS) y el resto, exceso de presencia (art. 8.3 RD 1561/1995).
- **Vacaciones**: disfrutadas frente a las debidas (30 días naturales, proporcionales) y días con actividad
  durante las vacaciones.
- **Dietas**: rango e importes distintos por tipo, nóminas con varios precios para el mismo tipo de dieta e
  importes por encima de los límites exentos del art. 9.A RIRPF (verificar cada ejercicio en
  `src/data/dietasJornada.js`).

- **Diferencias salariales y de cotización**: con el precio de la hora extraordinaria y de la hora
  ordinaria de cada año (tablas del convenio, que introduce el usuario) valora las horas extra, el exceso de
  presencia y, si se elige, las dietas que deben cotizar (exceso sobre el límite exento o todas). Calcula las
  cuotas de empresa y trabajador por conceptos (CC, MEI, desempleo, FOGASA, FP, AT/EP y cotización adicional
  por horas extra) con tipos editables por año. No aplica topes de bases ni cotización de solidaridad.

- **Convenio de Toledo incorporado** (`src/data/conveniosTransporte.js`): tablas del Anexo I de transporte
  de mercancías (BOP de Toledo núm. 64, de 4/4/2024; 2023 definitiva, 2024-2026 provisionales), antigüedad,
  plus de transporte y dietas. Precio de la hora según el art. 31 ((salario base + complementos personales y de
  puesto + antigüedad) × 15 / 1.800; conductores: salario diario × 30) y hora extra + 25 % (art. 35.b), por
  categoría y antigüedad de cada trabajador. Un precio escrito a mano prevalece. Para añadir otro convenio
  basta con una nueva entrada en `CONVENIOS`.

**Salidas:** informe de posibles incumplimientos (derechos afectados, cantidades, plazos para reclamar y qué hacer; copiar, Word, imprimir/PDF) y
Excel con el cuadrante por días, el cómputo horario, la liquidación de diferencias y cuotas (con fórmulas editables), el análisis de dietas y las
líneas de nómina.

Pruebas: `npm run test:dietas`.


### 🔒 Privacidad de los datos

Las dos herramientas muestran al principio el aviso «Tus datos son solo tuyos»: los archivos y datos se
procesan solo en el navegador de quien las usa, no se envían a ningún servidor ni se guardan en la web, y nadie
(ni el titular de la web ni terceros) tiene acceso a ellos. El botón **«Borrar todo y salir»** elimina de la
pestaña todos los datos y resultados (y, en el analizador de tacógrafo, los parámetros recordados) y vuelve a
Herramientas. Si se intenta cerrar o recargar la pestaña con datos cargados, el navegador pide confirmación.
Componente común: `src/components/PrivacidadDatos.jsx`.

### © Autoría

Las herramientas muestran al pie «© Jesús María Prieto Valbuena. Todos los derechos reservados» y el aviso de
uso (`src/data/autoria.js`). La misma marca figura en los Excel y Word que generan, en la etiqueta
`<meta name="copyright">` y en la primera línea de cada archivo de código publicado (plugin `aviso-autoria`
de `vite.config.js`).

## Publicar en Axarnet (preparadoritsstoledo.es)

La web pública está alojada en Axarnet. Para actualizarla:

1. `npm run build` y comprime el **contenido** de `dist/` (no la carpeta) en
   `web-preparadoritsstoledo.zip` (`cd dist && zip -r ../web-preparadoritsstoledo.zip .`).
2. En el panel de Axarnet (Administrador de archivos o FTP), sube el ZIP a `public_html/`,
   descomprímelo sobrescribiendo y borra el ZIP. Puedes borrar antes la carpeta `assets/` antigua.
3. Comprueba que se han subido los archivos ocultos `.htaccess` (raíz y `assets/`): fuerzan HTTPS,
   añaden cabeceras de seguridad y gestionan la caché.

La web no tiene servidor ni base de datos: las herramientas procesan los archivos en el navegador
de quien las usa y no envían ni guardan nada en Axarnet.
