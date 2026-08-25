"use client";

import { config } from "@/lib/datos";
import { useIdioma, useT } from "@/lib/i18n";
import { useMoneda } from "@/lib/moneda";
import { useState } from "react";
import type { Vista } from "@/lib/tipos";
import Icono from "./Icono";

type Props = {
  vista: Vista;
  onCambiarVista: (v: Vista) => void;
  onVerTutorial: () => void;
  onCerrar: () => void;
};

export default function SettingsSheet({
  vista,
  onCambiarVista,
  onVerTutorial,
  onCerrar,
}: Props) {
  const { idioma, setIdioma } = useIdioma();
  const { moneda, setMoneda } = useMoneda();
  const t = useT();
  const [confirmandoReinicio, setConfirmandoReinicio] = useState(false);

  /**
   * Deja la demo como recién instalada, para arrancar limpio con cada
   * prospecto. Va discreto abajo de todo: es una herramienta de quien muestra
   * la demo, no una función para el cliente de la mesa.
   */
  async function reiniciarDemo() {
    if (!confirmandoReinicio) {
      setConfirmandoReinicio(true);
      setTimeout(() => setConfirmandoReinicio(false), 4000);
      return;
    }
    try {
      sessionStorage.clear(); // carrito y tutorial
      localStorage.clear(); // idioma, moneda y vista
    } catch {}
    // Pantalla de cocina: los llamados y pedidos viven en el servidor.
    await fetch("/api/eventos", { method: "DELETE" }).catch(() => {});
    window.location.reload();
  }

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

        {/* Reabrir el tutorial: red de seguridad si el cliente lo salteó */}
        <button
          onClick={onVerTutorial}
          className="mt-6 flex w-full items-center gap-3 rounded-2xl border border-line bg-card-2 px-4 py-3.5 text-left transition-transform active:scale-[0.98]"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand">
            <Icono nombre="help-circle" size={18} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold">
              {t("comoFunciona")}
            </span>
            <span className="block text-xs text-muted">
              {t("comoFuncionaDetalle")}
            </span>
          </span>
        </button>

        {/* Deliberadamente discreto: es para quien muestra la demo, no para
            el cliente sentado en la mesa. */}
        <button
          onClick={reiniciarDemo}
          className={`mx-auto mt-6 block px-3 py-2 text-[11px] transition-colors ${
            confirmandoReinicio
              ? "font-semibold text-brand"
              : "text-muted/45 hover:text-muted"
          }`}
        >
          {confirmandoReinicio
            ? t("reiniciarConfirmar")
            : t("reiniciarDemo")}
        </button>
      </div>
    </div>
  );
}
