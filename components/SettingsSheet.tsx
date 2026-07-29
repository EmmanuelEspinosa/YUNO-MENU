"use client";

import { config } from "@/lib/datos";
import { useIdioma, useT } from "@/lib/i18n";
import { useMoneda } from "@/lib/moneda";
import type { Vista } from "@/lib/tipos";

type Props = {
  vista: Vista;
  onCambiarVista: (v: Vista) => void;
  onCerrar: () => void;
};

export default function SettingsSheet({ vista, onCambiarVista, onCerrar }: Props) {
  const { idioma, setIdioma } = useIdioma();
  const { moneda, setMoneda } = useMoneda();
  const t = useT();

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="anim-fade-in absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCerrar}
      />
      <div className="anim-slide-up absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-3xl border-t border-line bg-card p-5 pb-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">
            {t("configuracion")}
          </h2>
          <button
            aria-label={t("cerrar")}
            className="px-1 text-sm text-muted"
            onClick={onCerrar}
          >
            ✕
          </button>
        </div>

        <section className="mt-5">
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted">
            {t("idioma")}
          </p>
          <div className="grid grid-cols-3 gap-2">
            {config.idiomas.map((op) => (
              <button
                key={op.id}
                onClick={() => setIdioma(op.id)}
                className={`flex flex-col items-center gap-1 rounded-2xl border px-2 py-3 text-sm font-medium transition-colors ${
                  idioma === op.id
                    ? "border-brand bg-brand text-on-brand"
                    : "border-line bg-card-2 text-muted"
                }`}
              >
                <span className="text-xl leading-none">{op.bandera}</span>
                {op.label}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-6">
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted">
            {t("moneda")}
          </p>
          <div className="grid grid-cols-3 gap-2">
            {config.monedas.map((op) => (
              <button
                key={op.id}
                onClick={() => setMoneda(op.id)}
                className={`rounded-2xl border px-2 py-3 text-sm font-semibold transition-colors ${
                  moneda === op.id
                    ? "border-brand bg-brand text-on-brand"
                    : "border-line bg-card-2 text-muted"
                }`}
              >
                {op.simbolo} {op.id}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-6">
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted">
            {t("vistaMenu")}
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onCambiarVista("moderno")}
              className={`rounded-2xl border px-3 py-3 text-sm font-semibold transition-colors ${
                vista === "moderno"
                  ? "border-brand bg-brand text-on-brand"
                  : "border-line bg-card-2 text-muted"
              }`}
            >
              {t("vistaModerna")}
            </button>
            <button
              onClick={() => onCambiarVista("compacto")}
              className={`rounded-2xl border px-3 py-3 text-sm font-semibold transition-colors ${
                vista === "compacto"
                  ? "border-brand bg-brand text-on-brand"
                  : "border-line bg-card-2 text-muted"
              }`}
            >
              {t("vistaCompacta")}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
