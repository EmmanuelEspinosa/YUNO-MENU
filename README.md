# Yuno Menu — Demo comercial de menú digital con IA

Demo de ventas para mostrar a cafeterías y restaurantes cómo un menú digital con
sugerencias de IA **aumenta el ticket promedio**. Todo lo que parece backend
(IA, pagos, notificación al mozo) está **simulado en el frontend**: no hay APIs
externas, ni base de datos, ni variables de entorno.

## Rutas

| Ruta        | Qué muestra                                                        |
| ----------- | ------------------------------------------------------------------ |
| `/`         | Pantalla de acceso de demo (simula escanear el QR de una mesa)     |
| `/mesa/[id]`| El menú completo: productos, chat de IA, wizard de pedido y pago simulado |
| `/panel`    | Mini-dashboard del dueño con métricas ficticias                    |

## Correr en local

```bash
npm install
npm run dev
```

Abrí `http://localhost:3000/mesa/3` — tenés que ver el menú de Café Aurora con
el chip **Mesa 3**. Probá en un viewport mobile (375px) que es como lo va a ver
el prospecto.

---

## Clonar la demo para un prospecto nuevo (menos de 1 hora)

Todo el contenido y la estética salen de **tres archivos** en `data/`. No hace
falta tocar ningún componente.

### 1. Editar `data/brand.json`

```json
{
  "nombre": "Nombre del local",
  "logo": "/logo.svg",
  "colorPrimario": "#D9A05B",
  "colorSecundario": "#221812",
  "tipografia": { "titulos": "Fraunces", "cuerpo": "DM Sans" },
  "mensajeBienvenida": { "es": "...", "en": "...", "pt": "..." },
  "redes": {
    "instagram": "https://instagram.com/tulocal",
    "whatsapp": "https://wa.me/54911...",
    "facebook": "https://facebook.com/tulocal"
  }
}
```

- **`nombre`**: aparece en el header, la pantalla de inicio y el panel.
- **`logo`**: ruta a un archivo dentro de `public/` (reemplazá `public/logo.svg`)
  o una URL absoluta.
- **`colorPrimario`/`colorSecundario`**: toda la paleta (fondos, bordes, textos)
  se deriva automáticamente de estos dos colores.
- **`tipografia`**: nombres exactos de familias de [Google Fonts](https://fonts.google.com).
- **`mensajeBienvenida`**: un texto por idioma (`es`/`en`/`pt`). Se muestra según
  el idioma que elija el cliente en "⚙️ Preferencias".
- **`redes`**: los únicos íconos que aparecen en el footer. Si dejás un campo
  vacío (`""`), ese ícono no se muestra.

### 2. Editar `data/menu.json`

- **`categorias`**: id, emoji y `nombre` por idioma (`{es, en, pt}`).
- **`productos`**: cada producto tiene:

```json
{
  "id": "espresso",
  "categoria": "cafes",
  "precioArs": 3900,
  "video": "https://videos.pexels.com/video-files/....mp4",
  "poster": "https://images.pexels.com/videos/....jpeg",
  "maridajes": ["medialunas", "alfajor"],
  "tags": ["vegano", "sinTacc"],
  "i18n": {
    "es": { "nombre": "...", "descripcionCorta": "...", "descripcionLarga": "..." },
    "en": { "nombre": "...", "descripcionCorta": "...", "descripcionLarga": "..." },
    "pt": { "nombre": "...", "descripcionCorta": "...", "descripcionLarga": "..." }
  }
}
```

- **`precioArs`**: siempre en pesos argentinos (es la moneda base). El resto de
  las monedas se calculan solas con la tasa de `data/config.json`.
- **`maridajes`**: lista de `id` de otros productos, en orden de prioridad. Es lo
  que usa la IA simulada para armar la sugerencia del wizard.
- **`tags`**: ids del catálogo de badges definido en `data/config.json`
  (`picante`, `frio`, `sinTacc`, `vegano`, `vegetariano`, `sinLactosa`, `dulce`,
  `conAlcohol`). Dejá `[]` si el producto no aplica a ninguno.
- **`i18n`**: nombre y descripciones en español, inglés y portugués. Los tres
  idiomas son obligatorios (si falta uno, esa card se muestra en blanco en ese
  idioma).

### 3. Editar `data/config.json` (idiomas, monedas, tags)

```json
{
  "idiomas": [{ "id": "es", "label": "Español", "bandera": "🇦🇷" }, ...],
  "monedas": [{ "id": "ARS", "label": "...", "simbolo": "$", "tasaVsArs": 1 }, ...],
  "tags": [{ "id": "picante", "emoji": "🌶️", "label": { "es": "...", "en": "...", "pt": "..." } }, ...]
}
```

- **`tasaVsArs`**: cuántos pesos argentinos equivalen a 1 unidad de esa moneda
  (ej. `1450` para USD = 1 USD ≈ $1450). Son tasas fijas de demo — actualizalas
  a mano antes de cada reunión si querés que se vean realistas.
- Para agregar un badge nuevo (ej. "Sin azúcar"), sumalo al array `tags` acá y
  después usá su `id` en los productos de `menu.json`.

### 4. Reemplazar los videos

Los videos actuales son placeholders de [Pexels](https://www.pexels.com/videos/)
(stock gratuito). Para cada producto: buscá un video corto (o grabá el producto
real), copiá la URL del MP4 en calidad **SD (~640px)** y una imagen de portada,
y pegalas en `video`/`poster`. También podés subirlos a `public/videos/` y usar
rutas locales. Mantenelos cortos (5–15 s) y livianos (< 3 MB).

### 5. Agregar vista 3D a un producto (opcional)

Un producto muestra el botón **"Ver en 3D"** solo si tiene estos dos campos:

```json
{
  "modelo3d": "/modelos/mi-plato.glb",
  "anchoCm": 24
}
```

- **`modelo3d`**: ruta a un `.glb` dentro de `public/modelos/`.
- **`anchoCm`**: ancho real del plato en centímetros. Hace dos cosas: se le
  muestra al cliente ("Tamaño real: 24 cm") y **escala el modelo a tamaño real**.

> ⚠️ **Lo más importante de esta función.** Los `.glb` no traen una escala
> confiable: el modelo de prueba mide 112 "metros" de ancho. Sin corregirlo, el
> AR pondría un plato del tamaño de una cancha sobre la mesa. Por eso el visor
> **normaliza el modelo al `anchoCm` declarado**, sin importar en qué unidades
> venga. Si el `anchoCm` está mal, la promesa de "ver el tamaño real" se rompe:
> **medí el plato de verdad antes de cargarlo.**

#### De dónde sacar los modelos

| Opción | Cómo | Cuándo conviene |
| --- | --- | --- |
| **Fotogrametría** | Apps como Polycam o Luma AI: das una vuelta alrededor del plato con el celular | La mejor para vender: son *los platos reales del local* |
| **IA generativa** | Meshy, Tripo | Rápido y barato para armar la demo |
| **Comprar** | Sketchfab, TurboSquid | Rápido, pero genérico |

#### Cuidar el peso

El peso de un modelo de comida está en **las texturas, no en la geometría**
(comprobado: un modelo de 8 MB tenía 7,9 MB en 3 imágenes PNG). Bajá las
texturas a 1024 px o 2048 px y apuntá a **menos de 2 MB por modelo**. El visor
solo se descarga cuando el cliente toca "Ver en 3D", nunca en la carga inicial.

#### Realidad aumentada (el botón "Verlo en tu mesa")

- Requiere **HTTPS** — en Netlify ya lo tenés. En `localhost` el AR no arranca.
- **Android** (ARCore): usa el `.glb` directo.
- **iPhone** (ARKit): iOS solo hace AR con archivos `.usdz`, pero **no hace falta
  generarlos**: model-viewer lo convierte solo a partir del `.glb`. El campo
  `iosSrc` del visor queda disponible por si algún día querés entregar un `.usdz`
  hecho a mano, con mejor terminación.
- En celulares viejos sin ARCore/ARKit el botón no aparece, pero el 3D normal
  (girar con el dedo) igual funciona.

### 6. Deployar en Vercel

```bash
npm i -g vercel
vercel --prod
```

O conectá el repo en [vercel.com/new](https://vercel.com/new). **No hay
variables de entorno que configurar.**

### 7. Generar los QR de las mesas

Cada mesa apunta a su propia URL (`https://tu-demo.vercel.app/mesa/1`, `/mesa/2`,
...). Generá un QR por mesa e imprimilos. El número de mesa se toma directo de
la URL — el cliente nunca lo tipea.

---

## Qué incluye

- **Multi-idioma**: español, inglés y portugués (Brasil), seleccionable desde
  "⚙️ Preferencias". Todo el menú, la interfaz y el chat responden en el idioma
  activo.
- **Multi-moneda**: ARS, USD y BRL con conversión y formato automáticos
  (`Intl.NumberFormat`).
- **Badges/tags**: picante, frío, sin TACC, vegano, vegetariano, sin lactosa,
  dulce y con alcohol, visibles en la card y en la ficha del producto.
- **Vistas del menú**: Moderna (cards con video) y Compacta (lista densa sin
  video, para conexiones más lentas). Sin vista "clásica".
- **Chat de IA** (✨ flotante): responde preguntas sobre el menú (alergias,
  picante, precios, recomendaciones) matcheando keywords contra `menu.json` —
  sin ninguna API de IA real.
- **Wizard de pedido en 3 pasos** al tocar "Ver pedido": 1) revisar el carrito,
  2) sugerencia de maridaje con frase súper corta ("Buena combinación ✨") y
  botón para sumarla, 3) pago con propina simple (10%/15%/efectivo) y
  observaciones — sin pedir nombre, mesa, tipo de entrega ni factura.
- **Onboarding**: 3 slides de una frase cada uno, se ve una sola vez
  (`localStorage`), con botón "Saltar" siempre visible.
- **Footer**: solo íconos de redes sociales, nada de mapa ni dirección.
- **Vista 3D + AR**: en los productos que tengan modelo, el cliente puede girar
  el plato con el dedo y verlo **a tamaño real sobre su mesa** con realidad
  aumentada. Resuelve el "no sabía que la porción era tan chica". Ver el paso 5.

## Qué está simulado (y cómo)

- **Chat de IA** y **sugerencia del wizard**: reglas + keywords contra los datos
  de `menu.json` (`lib/asistente.ts`, `lib/sugerencias.ts`). Cero API externa.
- **Pago desde la mesa**: los inputs de tarjeta son decorativos, el
  "Procesando…" es un timeout de 1,5 s y la aprobación es siempre exitosa.
- **Llamar al mozo**: toast de confirmación. Solo visual.
- **Panel del dueño** (`/panel`): métricas hardcodeadas ilustrativas.
- **Sesión de mesa**: número de mesa por URL + carrito en `sessionStorage`. Sin
  login ni base de datos.

## Limitaciones conocidas

### Se pueden perder eventos simultáneos (mesa → cocina)

**Qué pasa**: si dos mesas generan un evento en el mismo segundo (por ejemplo,
las dos tocan la campana a la vez), uno de los dos avisos puede no llegar a la
pantalla de cocina.

**Por qué**: todos los eventos se guardan en **una sola clave** de Netlify
Blobs, como una lista. Cada escritura hace *leer la lista → agregar el evento →
guardar la lista entera*. Si dos peticiones se solapan, las dos leen la misma
versión y la segunda pisa lo que escribió la primera.

**Estado**: aceptado para la demo. Ya apareció una vez, cuando el pedido y el
pago se enviaban en paralelo al confirmar: se perdía el pedido. Eso se resolvió
enviándolos en secuencia (`avisarPedidoYPago` en `lib/integracion.ts`), pero el
problema de fondo sigue si el choque viene de dos clientes distintos.

**Cómo se arregla** cuando esto sea una app de verdad: guardar **un blob por
evento** (clave `evento-{id}`) en vez de una lista compartida. Ahí las
escrituras dejan de pisarse porque cada una toca su propia clave, y la lectura
pasa a ser un `list()`. También se puede resolver con escrituras condicionales
por ETag, o directamente con una base de datos.

## Stack

Next.js (App Router) + React + Tailwind CSS. Sin más dependencias.
