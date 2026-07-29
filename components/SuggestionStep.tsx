"use client";

import { useEffect, useState } from "react";
import type { Producto } from "@/lib/tipos";
import { textoProducto } from "@/lib/datos";
import { useIdioma, useT } from "@/lib/i18n";
import { useFormatoPrecio } from "@/lib/moneda";

type Props = {
  sugerencia: { base: Producto; maridaje: Producto } | null;
  frase: string;
  onAgregar: (id: string) => void;
  onContinuar: () => void;
};

const sinSugerencia = {
  es: "Tu pedido ya está completo 🙌",
  en: "Your order already looks great 🙌",
  pt: "Seu pedido já está completo 🙌",
};

export default function SuggestionStep({
  sugerencia,
  frase,
  onAgregar,
  onContinuar,
}: Props) {
  const { idioma } = useIdioma();
  const t = useT();
  const formatear = useFormatoPrecio();
  const [pensando, setPensando] = useState(true);
  const [agregado, setAgregado] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setPensando(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const texto = sugerencia ? textoProducto(sugerencia.maridaje, idioma) : null;

  return (
    <div className="anim-fade-up flex min-h-[70dvh] flex-col items-center justify-center px-2 text-center">
      <span className="text-xs font-semibold uppercase tracking-widest text-brand">
        ✨ {t("pasoSugerencia")}
      </span>

      {pensando ? (
        <div className="mt-8 flex flex-col items-center gap-3 text-muted">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
        </div>
      ) : !sugerencia || !texto ? (
        <p className="anim-fade-up mt-8 text-lg font-medium">
          {sinSugerencia[idioma]}
        </p>
      ) : (
        <div className="anim-fade-up mt-6 w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={sugerencia.maridaje.poster}
            alt=""
            className="mx-auto h-32 w-32 rounded-3xl border border-line object-cover shadow-lg shadow-black/20"
          />
          <p className="font-display mt-4 text-xl font-semibold">{frase}</p>
          <p className="mt-1 text-sm text-muted">{texto.nombre}</p>

          {agregado ? (
            <p className="mt-4 text-sm font-medium text-brand">
              ✓ {texto.nombre} {t("agregadoAlPedido")}
            </p>
          ) : (
            <button
              className="mt-4 w-full rounded-2xl bg-brand py-3.5 text-base font-semibold text-on-brand transition-transform active:scale-95"
              onClick={() => {
                onAgregar(sugerencia.maridaje.id);
                setAgregado(true);
              }}
            >
              {t("agregar")} · {formatear(sugerencia.maridaje.precioArs)}
            </button>
          )}
        </div>
      )}

      <button
        className="mt-8 w-full rounded-2xl border border-line py-3.5 text-sm font-semibold text-muted transition-transform active:scale-95 disabled:opacity-0"
        disabled={pensando}
        onClick={onContinuar}
      >
        {t("continuar")}
      </button>
    </div>
  );
}
