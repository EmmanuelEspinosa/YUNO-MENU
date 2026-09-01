"use client";

import type { Producto } from "@/lib/tipos";
import { textoProducto } from "@/lib/datos";
import { useIdioma, useT } from "@/lib/i18n";
import { useFormatoPrecio } from "@/lib/moneda";
import LazyVideo from "./LazyVideo";
import TagBadges from "./TagBadges";
import Estrellas from "./Estrellas";
import { useValoraciones } from "@/lib/usarValoraciones";

type Props = {
  producto: Producto;
  onAbrir: (producto: Producto) => void;
  onAgregar: (producto: Producto) => void;
};

export default function ProductCard({ producto, onAbrir, onAgregar }: Props) {
  const { idioma } = useIdioma();
  const t = useT();
  const formatear = useFormatoPrecio();
  const texto = textoProducto(producto, idioma);
  const { promedios } = useValoraciones();
  const valoracion = promedios[producto.id];

  return (
    <article
      className="anim-fade-up cursor-pointer overflow-hidden rounded-3xl border border-line bg-card shadow-lg shadow-black/20 transition-transform active:scale-[0.985]"
      onClick={() => onAbrir(producto)}
    >
      <LazyVideo
        src={producto.video}
        poster={producto.poster}
        className="aspect-[16/10] w-full bg-card-2"
      />
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-semibold leading-snug">
            {texto.nombre}
          </h3>
          {valoracion && (
            <span className="mt-1 flex shrink-0 items-center gap-1 text-xs font-medium">
              <Estrellas valor={valoracion.promedio} size={12} />
              {valoracion.promedio.toFixed(1)}
            </span>
          )}
        </div>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          {texto.descripcionCorta}
        </p>
        <TagBadges tags={producto.tags} className="mt-2" />
        <div className="mt-3 flex items-center justify-between">
          <span className="text-base font-semibold text-brand">
            {formatear(producto.precioArs)}
          </span>
          <button
            className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-on-brand transition-transform active:scale-90"
            onClick={(e) => {
              e.stopPropagation();
              onAgregar(producto);
            }}
          >
            {t("agregar")}
          </button>
        </div>
      </div>
    </article>
  );
}
