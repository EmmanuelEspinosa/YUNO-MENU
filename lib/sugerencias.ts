import type { Idioma, ItemCarrito, Producto } from "./tipos";
import { buscarProducto } from "./datos";

// Frases ultra cortas para el paso 2 del wizard: nada de explicaciones largas.
const frases: Record<Idioma, string[]> = {
  es: [
    "Buena combinación ✨",
    "Un final dulce 🍰",
    "Combo perfecto",
    "Se completa con esto",
    "El clásico de la casa",
    "Nunca falla",
  ],
  en: [
    "Great combo ✨",
    "A sweet finish 🍰",
    "Perfect pairing",
    "Completes the order",
    "House classic",
    "Never fails",
  ],
  pt: [
    "Ótima combinação ✨",
    "Um final doce 🍰",
    "Combo perfeito",
    "Completa o pedido",
    "Clássico da casa",
    "Nunca falha",
  ],
};

let contador = 0;

export function elegirMaridaje(
  producto: Producto,
  carrito: ItemCarrito[]
): Producto | null {
  const enCarrito = new Set(carrito.map((i) => i.id));
  for (const id of producto.maridajes) {
    if (!enCarrito.has(id)) {
      const maridaje = buscarProducto(id);
      if (maridaje) return maridaje;
    }
  }
  return null;
}

/** Elige un maridaje para el primer producto del carrito que todavía no tenga su par sumado. */
export function elegirSugerenciaParaCarrito(
  carrito: ItemCarrito[]
): { base: Producto; maridaje: Producto } | null {
  for (const item of carrito) {
    const base = buscarProducto(item.id);
    if (!base) continue;
    const maridaje = elegirMaridaje(base, carrito);
    if (maridaje) return { base, maridaje };
  }
  return null;
}

export function generarFraseCorta(idioma: Idioma): string {
  const lista = frases[idioma];
  const frase = lista[contador % lista.length];
  contador += 1;
  return frase;
}
