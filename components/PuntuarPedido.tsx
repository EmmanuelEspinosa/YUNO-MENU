"use client";

import type { ItemCarrito } from "@/lib/tipos";
import { buscarProducto, textoProducto } from "@/lib/datos";
import { useIdioma, useT } from "@/lib/i18n";
import { useValoraciones } from "@/lib/usarValoraciones";
import Estrellas from "./Estrellas";

/**
 * Puntuar solo lo que la mesa efectivamente consumió.
 *
 * Es la valoración que vale: no se puede inflar puntuando platos que nunca se
 * pidieron, y al local le da información real de qué salió bien y qué no.
 */
export default function PuntuarPedido({ carrito }: { carrito: ItemCarrito[] }) {
  const { idioma } = useIdioma();
  const t = useT();
  const { misVotos, votar } = useValoraciones();

  const items = carrito
    .map((i) => buscarProducto(i.id))
    .filter((p) => p !== undefined);

  if (items.length === 0) return null;

  return (
    <div className="mt-7 rounded-2xl border border-line bg-card px-4 py-4">
      <p className="text-xs font-medium uppercase tracking-widest text-muted">
        {t("puntuaTuPedido")}
      </p>
      <ul className="mt-3 divide-y divide-line">
        {items.map((p) => {
          const nombre = textoProducto(p, idioma).nombre;
          const miVoto = misVotos[p.id];
          return (
            <li
              key={p.id}
              className="flex items-center justify-between gap-3 py-2.5"
            >
              <span className="min-w-0 flex-1 truncate text-sm">{nombre}</span>
              <Estrellas
                valor={miVoto ?? 0}
                size={22}
                onVotar={(n) => votar(p.id, n)}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
