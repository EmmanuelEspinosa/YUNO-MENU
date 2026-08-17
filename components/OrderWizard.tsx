"use client";

import { useMemo, useState } from "react";
import type { ItemCarrito } from "@/lib/tipos";
import { brand, buscarProducto, textoProducto } from "@/lib/datos";
import { useIdioma, useT } from "@/lib/i18n";
import { useFormatoPrecio } from "@/lib/moneda";
import { elegirSugerenciaParaCarrito, generarFraseCorta } from "@/lib/sugerencias";
import SuggestionStep from "./SuggestionStep";
import Icono from "./Icono";

type Props = {
  mesaId: string;
  carrito: ItemCarrito[];
  onCambiarCantidad: (id: string, delta: number) => void;
  onCerrar: () => void;
  onPagoCompletado: () => void;
};

type Paso = 0 | 1 | 2;
type EtapaPago = "formulario" | "procesando" | "aprobado";
type Propina = "sin" | "10" | "15" | "efectivo";

export default function OrderWizard({
  mesaId,
  carrito,
  onCambiarCantidad,
  onCerrar,
  onPagoCompletado,
}: Props) {
  const { idioma } = useIdioma();
  const t = useT();
  const formatear = useFormatoPrecio();
  const [paso, setPaso] = useState<Paso>(0);
  const [propina, setPropina] = useState<Propina>("sin");
  const [observaciones, setObservaciones] = useState("");
  const [etapaPago, setEtapaPago] = useState<EtapaPago>("formulario");
  const [operacion, setOperacion] = useState("");

  const subtotal = useMemo(
    () =>
      carrito.reduce((suma, item) => {
        const producto = buscarProducto(item.id);
        return suma + (producto ? producto.precioArs * item.cantidad : 0);
      }, 0),
    [carrito]
  );

  const montoPropina =
    propina === "10" ? Math.round(subtotal * 0.1) : propina === "15" ? Math.round(subtotal * 0.15) : 0;
  const total = subtotal + montoPropina;

  // Se capturan una sola vez al abrir el wizard: agregar el maridaje sugerido
  // no debe hacer que la sugerencia cambie debajo del usuario en el paso 2.
  const [sugerencia] = useState(() => elegirSugerenciaParaCarrito(carrito));
  const [fraseSugerencia] = useState(() => generarFraseCorta(idioma));

  const pasos = [
    { label: t("pasoProductos"), icono: "scroll-text" },
    { label: t("pasoSugerencia"), icono: "wand-sparkles" },
    { label: t("pasoPago"), icono: "credit-card" },
  ];

  function confirmarPago() {
    setEtapaPago("procesando");
    setTimeout(() => {
      setOperacion(`YU-${Math.floor(10000 + Math.random() * 89999)}`);
      setEtapaPago("aprobado");
    }, 1500);
  }

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-bg">
      <div className="mx-auto min-h-dvh max-w-md px-5 py-6">
        {/* Indicador de pasos */}
        {etapaPago === "formulario" && (
          <div className="mb-5 flex items-center justify-between">
            <button
              className="-ml-1 py-1 pr-3 text-sm text-muted"
              onClick={() => (paso === 0 ? onCerrar() : setPaso((p) => (p - 1) as Paso))}
            >
              ← {t("volver")}
            </button>
            <span className="rounded-full border border-line bg-card px-3 py-1 text-xs font-medium text-muted">
              {t("mesa")} {mesaId}
            </span>
          </div>
        )}

        {etapaPago === "formulario" && (
          <div className="mb-6 flex gap-2">
            {pasos.map((p, i) => (
              <div
                key={i}
                className={`flex flex-1 flex-col items-center gap-1.5 rounded-2xl border py-2.5 text-xs font-medium transition-colors ${
                  i === paso
                    ? "border-brand bg-brand/10 text-brand"
                    : i < paso
                      ? "border-line bg-card-2 text-ink"
                      : "border-line bg-card-2 text-muted"
                }`}
              >
                <Icono nombre={p.icono} size={17} />
                {p.label}
              </div>
            ))}
          </div>
        )}

        {/* Paso 1: carrito */}
        {paso === 0 && (
          <div className="anim-fade-up">
            <ul className="divide-y divide-line rounded-2xl border border-line bg-card px-4">
              {carrito.map((item) => {
                const producto = buscarProducto(item.id);
                if (!producto) return null;
                const texto = textoProducto(producto, idioma);
                return (
                  <li key={item.id} className="flex items-center gap-3 py-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={producto.poster}
                      alt=""
                      className="h-12 w-12 shrink-0 rounded-xl border border-line object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{texto.nombre}</p>
                      <p className="text-sm text-muted">
                        {formatear(producto.precioArs * item.cantidad)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        aria-label="-"
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-lg leading-none active:scale-90"
                        onClick={() => onCambiarCantidad(item.id, -1)}
                      >
                        −
                      </button>
                      <span className="w-5 text-center text-sm font-semibold">
                        {item.cantidad}
                      </span>
                      <button
                        aria-label="+"
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-lg leading-none active:scale-90"
                        onClick={() => onCambiarCantidad(item.id, 1)}
                      >
                        +
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="mt-4 flex items-center justify-between px-1">
              <span className="text-muted">{t("total")}</span>
              <span className="text-2xl font-semibold text-brand">
                {formatear(subtotal)}
              </span>
            </div>

            <button
              className="mt-5 w-full rounded-2xl bg-brand py-4 text-base font-semibold text-on-brand transition-transform active:scale-95"
              onClick={() => setPaso(1)}
            >
              {t("continuar")}
            </button>
          </div>
        )}

        {/* Paso 2: sugerencia IA */}
        {paso === 1 && (
          <SuggestionStep
            sugerencia={sugerencia}
            frase={fraseSugerencia}
            onAgregar={(id) => onCambiarCantidad(id, 1)}
            onContinuar={() => setPaso(2)}
          />
        )}

        {/* Paso 3: pago */}
        {paso === 2 && (
          <div className="anim-fade-up">
            {etapaPago === "formulario" && (
              <>
                <h1 className="font-display text-2xl font-semibold">
                  {t("pasoPago")}
                </h1>

                <div className="mt-4">
                  <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted">
                    {t("propina")}
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {(["sin", "10", "15", "efectivo"] as Propina[]).map((op) => (
                      <button
                        key={op}
                        onClick={() => setPropina(op)}
                        className={`rounded-xl border px-2 py-2.5 text-xs font-semibold transition-colors ${
                          propina === op
                            ? "border-brand bg-brand text-on-brand"
                            : "border-line bg-card-2 text-muted"
                        }`}
                      >
                        {op === "sin"
                          ? t("sinPropina")
                          : op === "efectivo"
                            ? t("efectivo")
                            : `${op}%`}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">
                      {t("observaciones")}
                    </span>
                    <textarea
                      value={observaciones}
                      onChange={(e) => setObservaciones(e.target.value)}
                      placeholder={t("observacionesPlaceholder")}
                      rows={2}
                      className="w-full resize-none rounded-xl border border-line bg-card px-4 py-3 text-sm outline-none placeholder:text-muted/60 focus:border-brand"
                    />
                  </label>
                </div>

                <ul className="mt-4 divide-y divide-line rounded-2xl border border-line bg-card px-4">
                  <li className="flex justify-between py-2.5 text-sm text-muted">
                    <span>{t("total")}</span>
                    <span>{formatear(subtotal)}</span>
                  </li>
                  {montoPropina > 0 && (
                    <li className="flex justify-between py-2.5 text-sm text-muted">
                      <span>{t("propina")}</span>
                      <span>{formatear(montoPropina)}</span>
                    </li>
                  )}
                  <li className="flex justify-between py-2.5 font-semibold">
                    <span>{t("total")}</span>
                    <span className="text-brand">
                      {formatear(propina === "efectivo" ? subtotal : total)}
                    </span>
                  </li>
                </ul>

                <div className="mt-5 space-y-3">
                  <input
                    type="text"
                    placeholder="4509 •••• •••• ••••"
                    className="w-full rounded-xl border border-line bg-card px-4 py-3 text-sm outline-none placeholder:text-muted/60 focus:border-brand"
                  />
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="MM/AA"
                      className="w-1/2 rounded-xl border border-line bg-card px-4 py-3 text-sm outline-none placeholder:text-muted/60 focus:border-brand"
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      className="w-1/2 rounded-xl border border-line bg-card px-4 py-3 text-sm outline-none placeholder:text-muted/60 focus:border-brand"
                    />
                  </div>
                </div>

                <p className="mt-4 text-center text-xs text-muted">
                  🔒 Demo: no ingreses datos reales, no se envían a ningún lado.
                </p>

                <button
                  className="mt-4 w-full rounded-2xl bg-brand py-4 text-base font-semibold text-on-brand transition-transform active:scale-95"
                  onClick={confirmarPago}
                >
                  {t("confirmarPago")} ·{" "}
                  {formatear(propina === "efectivo" ? subtotal : total)}
                </button>
              </>
            )}

            {etapaPago === "procesando" && (
              <div className="anim-fade-in flex min-h-[75dvh] flex-col items-center justify-center gap-5">
                <span className="h-12 w-12 animate-spin rounded-full border-4 border-brand border-t-transparent" />
                <p className="text-muted">{t("procesando")}</p>
              </div>
            )}

            {etapaPago === "aprobado" && (
              <div className="anim-fade-up flex min-h-[85dvh] flex-col justify-center">
                <div className="text-center">
                  <div className="anim-pop-in mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand/15 text-brand">
                    <Icono nombre="badge-check" size={40} />
                  </div>
                  <h1 className="font-display mt-5 text-3xl font-semibold">
                    {t("pagoAprobado")}
                  </h1>
                  <p className="mt-2 text-sm text-muted">
                    {t("mesa")} {mesaId} · #{operacion}
                  </p>
                </div>

                <p className="mt-7 text-center text-sm text-muted">
                  {t("gracias")}. {brand.nombre} 💛
                </p>

                <button
                  className="mt-6 w-full rounded-2xl bg-brand py-4 text-base font-semibold text-on-brand transition-transform active:scale-95"
                  onClick={onPagoCompletado}
                >
                  {t("volverAlMenu")}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
