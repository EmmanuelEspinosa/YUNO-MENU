"use client";

import type { Categoria, Producto } from "@/lib/tipos";
import { textoCategoria, textoProducto } from "@/lib/datos";
import { useIdioma, useT } from "@/lib/i18n";
import { useFormatoPrecio } from "@/lib/moneda";
import LazyVideo from "./LazyVideo";
import TagBadges from "./TagBadges";

type Props = {
  producto: Producto;
  categoria?: Categoria;
  onAgregar: (producto: Producto) => void;
  onCerrar: () => void;
};

export default function ProductSheet({
  producto,
  categoria,
  onAgregar,
  onCerrar,
}: Props) {
  const { idioma } = useIdioma();
  const t = useT();
  const formatear = useFormatoPrecio();
  const texto = textoProducto(producto, idioma);

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="anim-fade-in absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCerrar}
      />
      <div className="anim-slide-up absolute inset-x-0 bottom-0 max-h-[88dvh] overflow-y-auto rounded-t-3xl border-t border-line bg-card">
        <div className="relative">
          <LazyVideo
            src={producto.video}
            poster={producto.poster}
            className="aspect-video w-full bg-card-2"
          />
          <button
            aria-label={t("cerrar")}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-lg text-white backdrop-blur"
            onClick={onCerrar}
          >
            ✕
          </button>
        </div>
        <div className="p-5 pb-8">
          {categoria && (
            <span className="inline-flex items-center gap-1 rounded-full border border-line bg-card-2 px-3 py-1 text-xs font-medium text-muted">
              {categoria.emoji} {textoCategoria(categoria, idioma)}
            </span>
          )}
          <h2 className="font-display mt-3 text-2xl font-semibold leading-tight">
            {texto.nombre}
          </h2>
          <TagBadges tags={producto.tags} className="mt-3" />
          <p className="mt-3 leading-relaxed text-muted">
            {texto.descripcionLarga}
          </p>
          <div className="mt-6 flex items-center justify-between gap-4">
            <span className="font-display text-2xl font-semibold text-brand">
              {formatear(producto.precioArs)}
            </span>
            <button
              className="flex-1 rounded-2xl bg-brand py-3.5 text-base font-semibold text-on-brand transition-transform active:scale-95"
              onClick={() => onAgregar(producto)}
            >
              {t("agregarAlPedido")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
