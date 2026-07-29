"use client";

import type { Producto } from "@/lib/tipos";
import { textoProducto } from "@/lib/datos";
import { useIdioma, useT } from "@/lib/i18n";
import { useFormatoPrecio } from "@/lib/moneda";
import TagBadges from "./TagBadges";

type Props = {
  producto: Producto;
  onAbrir: (producto: Producto) => void;
  onAgregar: (producto: Producto) => void;
};

export default function CompactRow({ producto, onAbrir, onAgregar }: Props) {
  const { idioma } = useIdioma();
  const t = useT();
  const formatear = useFormatoPrecio();
  const texto = textoProducto(producto, idioma);

  return (
    <article
      className="anim-fade-up flex cursor-pointer items-center gap-3 border-b border-line py-3 last:border-b-0"
      onClick={() => onAbrir(producto)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={producto.poster}
        alt=""
        loading="lazy"
        className="h-16 w-16 shrink-0 rounded-2xl border border-line object-cover"
      />
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold leading-snug">
          {texto.nombre}
        </h3>
        <p className="truncate text-xs text-muted">{texto.descripcionCorta}</p>
        <div className="mt-1 flex items-center justify-between gap-2">
          <TagBadges tags={producto.tags} />
          <span className="shrink-0 text-sm font-semibold text-brand">
            {formatear(producto.precioArs)}
          </span>
        </div>
      </div>
      <button
        aria-label={t("agregar")}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-lg font-semibold text-on-brand transition-transform active:scale-90"
        onClick={(e) => {
          e.stopPropagation();
          onAgregar(producto);
        }}
      >
        +
      </button>
    </article>
  );
}
