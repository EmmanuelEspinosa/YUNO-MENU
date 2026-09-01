# Yuno Menu — Qué es y qué cubre

> Documento de referencia para armar el speech de venta.
> Describe **funciones y valor**, no implementación.

---

## Qué es

Menú digital para cafeterías y restaurantes al que el cliente entra **escaneando un QR desde su mesa**, con su propio celular. No requiere que se descargue ninguna app.

Reemplaza al menú de papel y al típico "menú QR" que abre un PDF ilegible.

**Demo online:** https://yuno-menu-demo.netlify.app

---

## El problema que resuelve

| Dolor del local | Cómo lo resuelve |
| --- | --- |
| El menú QR actual es un PDF que hay que agrandar con los dedos | Menú nativo para celular, con video de cada plato |
| **El cliente se decepciona cuando llega el plato** (era más chico de lo que imaginaba) | **Vista 3D y realidad aumentada a tamaño real** |
| Ticket promedio bajo, nadie pide postre ni acompañamiento | La IA sugiere el maridaje al confirmar el pedido |
| El mozo pierde tiempo contestando "¿esto lleva gluten?" | Etiquetas visibles + chat que responde solo |
| Turistas que no entienden la carta | Tres idiomas y tres monedas |
| Levantar la mano y que nadie te vea | Botón para llamar al mozo desde la mesa |
| Cambiar un precio implica reimprimir cartas | Se edita y queda actualizado al instante |
| Cocina se entera tarde de lo que pasa en el salón | Pantalla en vivo con pedidos y llamados |

---

## Funciones para el cliente (el que se sienta a comer)

### Entrada y navegación
- **Acceso por QR** con número de mesa incluido: escanea y ya sabe en qué mesa está
- **Tutorial de bienvenida** de 5 pasos, muy breve, que explica qué hace cada botón (se puede volver a ver cuando quiera)
- **Menú por categorías** con navegación rápida
- **Dos formas de ver la carta:** moderna (con video grande) o compacta (lista densa, para el que ya sabe qué quiere)

### Los productos
- **Video en loop de cada plato** en lugar de foto fija
- **Ficha ampliada** con descripción completa, precio y categoría
- **Etiquetas visuales** de: picante, frío, sin TACC, vegano, vegetariano, sin lactosa, dulce, con alcohol
- **Vista 3D:** gira el plato con el dedo
- **Realidad aumentada:** ve el plato **a tamaño real sobre su propia mesa**, con la medida en centímetros

### La IA
- **Chat con contexto del menú completo:** responde sobre ingredientes, alergias, opciones veganas, precios y recomendaciones
- **Preguntas sugeridas** para que sepa qué puede consultar
- **Sugerencia de maridaje** al confirmar el pedido, con opción de sumarlo en un toque

### El pedido y el pago
- **Carrito** con control de cantidades
- **Proceso en 3 pasos:** revisar pedido → sugerencia de la IA → pago
- **Dos formas de pagar:**
  - **Pagar al final** (opción por defecto): consume y arregla con el mozo al terminar, como toda la vida
  - **Pagar ahora:** con tarjeta desde la mesa, sin esperar la cuenta
- **Propina simple:** sin propina, 10%, 15% o en efectivo
- **Solicitudes especiales:** campo libre para "sin cebolla", "para llevar", etc.
- **Llamar al mozo** con un botón, sin levantar la mano

### Idiomas y monedas
- **Español, inglés y portugués** — todo el menú, la interfaz y el chat
- **Pesos argentinos, dólares y reales** — conversión automática

> Especialmente valioso en zonas turísticas: Bariloche, Iguazú, Mendoza, Costa Atlántica, ciudades de frontera.

---

## Funciones para el personal (mozos, cocina, barra)

Pantalla aparte pensada para una tablet o notebook detrás del mostrador. **Se actualiza sola, sin recargar.**

- **Llamados de mesa en tiempo real:** aparece "Mesa 3 está llamando al mozo"
- **Alerta sonora** cuando entra algo nuevo
- **Pedidos completos** con los ítems, cantidades y las observaciones del cliente
- **Cuentas abiertas:** panel con las mesas que eligieron pagar al final, cuánto debe cada una y el **total adeudado sumado**
- **Cerrar acciones:** botones para "Marcar como cobrada" y "Ya lo atendí", así la pantalla no se llena de avisos viejos
- **Registro de pagos:** qué mesa pagó, con qué método y cuánto dejó de propina

> Este es el momento más fuerte de la demostración: se le da el celular al prospecto, toca la campana, y **suena en la notebook del vendedor**.

---

## Funciones para el dueño

Panel con métricas del negocio:

- **Venta adicional generada por las sugerencias de la IA** en el mes
- **Ticket promedio con IA vs. sin IA**, con el porcentaje de mejora
- **Evolución semanal** del ticket promedio
- **Top 5 combos más pedidos**
- **Tasa de aceptación** de las sugerencias

> El argumento central: el menú no es un gasto, **se paga solo** con el aumento del ticket promedio.

---

## Diferenciales frente a la competencia

1. **La vista 3D con realidad aumentada.** Ningún menú QR del mercado lo tiene. Es lo que hace que el prospecto saque el celular y lo pruebe.
2. **Video en vez de foto.** El plato se ve vivo.
3. **Es un canal de venta, no un catálogo.** Sugiere, recomienda y aumenta el ticket.
4. **Conecta salón con cocina.** No es solo una carta: mueve información dentro del local.
5. **Multi-idioma real,** no un traductor automático mal pegado.
6. **Respeta al cliente tradicional:** pagar al final es la opción por defecto. No se le impone nada a la clientela del local.

---

## Personalización para cada cliente

- El menú completo se arma editando **dos archivos de datos**: uno con la marca, otro con los productos
- Se cambia nombre, logo, colores y tipografía del local
- **Un local nuevo queda listo en menos de una hora** (sin contar los modelos 3D)
- Cada mesa tiene su propio QR

---

## Qué está funcionando de verdad y qué es demostración

**Importante para no prometer de más en una reunión.**

### Funciona de verdad
- Todo el menú, navegación, carrito y el proceso de pedido
- Los idiomas y las monedas
- La vista 3D y la realidad aumentada
- **El canal mesa → cocina:** los llamados y pedidos viajan de verdad entre dispositivos distintos
- Las cuentas abiertas y el cierre de las mismas

### Es simulado (por ahora)
- **El cobro con tarjeta:** no hay pasarela de pago conectada. Los campos son decorativos
- **El chat de IA:** responde por coincidencia de palabras clave, no es un modelo de lenguaje. Entiende bien lo que está en las preguntas sugeridas (gluten, vegano, frío, recomendaciones); fuera de eso puede fallar
- **Las métricas del panel del dueño:** son números ilustrativos, no reales
- **Los modelos 3D actuales:** son placeholders de estilo caricatura. Los definitivos se hacen escaneando los platos reales del local

### Todavía no existe
- **La conexión con un sistema de gestión externo.** El menú ya emite toda la información necesaria (llamados, pedidos, pagos) y está preparado para enviarla, pero falta el sistema del otro lado

---

## Cómo se hacen los modelos 3D de un cliente

- Se **escanean los platos reales** con un celular, usando apps gratuitas
- Toma unos **20 a 30 minutos por plato**, incluido el retoque
- Con **3 a 5 platos estrella alcanza**; el resto de la carta sigue con video
- Funciona muy bien con comida argentina: milanesas, empanadas, sándwiches, tortas y panificados escanean excelente
- Las bebidas en vaso no escanean bien (el vidrio y los reflejos confunden al escáner): conviene dejarlas en video
- **Es un servicio que se cobra aparte,** no un costo a absorber

---

## Guion sugerido para la demostración

1. Abrir la **pantalla de acceso** en la notebook (muestra el QR) y la **pantalla de cocina** en otra pestaña, con el sonido activado
2. El prospecto **escanea el QR con su propio celular**
3. Dejarlo navegar: que vea los videos y toque un plato
4. Pedirle que abra **"Ver en 3D"** y después **"Verlo en tu mesa"** → el plato aparece sobre la mesa real, a tamaño real
5. Pedirle que **toque la campana** → suena en la notebook del vendedor
6. Que arme un pedido: aparece la **sugerencia de la IA**
7. Que elija **"Pagar al final"** y confirme → en la notebook aparece la **cuenta abierta con el monto**
8. Cerrar mostrando el **panel del dueño** con el aumento del ticket promedio

> Hay un botón discreto de **"Reiniciar demo"** dentro de Preferencias para dejar todo limpio antes de cada reunión.

---

## Rutas de la demo

| Para qué | Dirección |
| --- | --- |
| Pantalla de acceso con QR | https://yuno-menu-demo.netlify.app |
| Menú de una mesa | https://yuno-menu-demo.netlify.app/mesa/3 |
| Pantalla de cocina y barra | https://yuno-menu-demo.netlify.app/cocina |
| Panel del dueño | https://yuno-menu-demo.netlify.app/panel |
