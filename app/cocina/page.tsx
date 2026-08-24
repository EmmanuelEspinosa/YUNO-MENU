"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { brand } from "@/lib/datos";
import type { Evento } from "@/lib/eventos";
import Icono from "@/components/Icono";

/**
 * Pantalla de cocina / barra. Pensada para una tablet o notebook detrás del
 * mostrador, no para el celular del cliente.
 *
 * Consulta el servidor cada 2 segundos. Es "polling", que para este volumen
 * (unos pocos eventos por hora) es más simple y más robusto que mantener una
 * conexión abierta, y no requiere infraestructura extra.
 */

const INTERVALO_MS = 2000;

const estilos: Record<
  Evento["tipo"],
  { icono: string; titulo: string; color: string }
> = {
  mozo: {
    icono: "bell",
    titulo: "Llaman al mozo",
    color: "border-brand bg-brand/10",
  },
  pedido: {
    icono: "scroll-text",
    titulo: "Pedido nuevo",
    color: "border-line bg-card",
  },
  pago: {
    icono: "credit-card",
    titulo: "Pago registrado",
    color: "border-line bg-card",
  },
};

function formatearPesos(n: number): string {
  return "$ " + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function haceCuanto(iso: string): string {
  const seg = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seg < 10) return "recién";
  if (seg < 60) return `hace ${seg}s`;
  const min = Math.floor(seg / 60);
  if (min < 60) return `hace ${min} min`;
  return new Date(iso).toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function CocinaPage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [conectado, setConectado] = useState<boolean | null>(null);
  const [, forzarRefresco] = useState(0);
  const vistos = useRef<Set<string>>(new Set());
  const primeraCarga = useRef(true);
  const [destacados, setDestacados] = useState<Set<string>>(new Set());

  const consultar = useCallback(async () => {
    try {
      const r = await fetch("/api/eventos", { cache: "no-store" });
      if (!r.ok) throw new Error("respuesta no ok");
      const { eventos: nuevos } = (await r.json()) as { eventos: Evento[] };
      setConectado(true);

      // Destacamos solo lo que llegó mientras la pantalla estaba abierta.
      const recienLlegados = nuevos
        .filter((e) => !vistos.current.has(e.id))
        .map((e) => e.id);
      nuevos.forEach((e) => vistos.current.add(e.id));

      if (!primeraCarga.current && recienLlegados.length > 0) {
        setDestacados((prev) => new Set([...prev, ...recienLlegados]));
        setTimeout(() => {
          setDestacados((prev) => {
            const copia = new Set(prev);
            recienLlegados.forEach((id) => copia.delete(id));
            return copia;
          });
        }, 6000);
      }
      primeraCarga.current = false;
      setEventos(nuevos);
    } catch {
      setConectado(false);
    }
  }, []);

  useEffect(() => {
    consultar();
    const t = setInterval(consultar, INTERVALO_MS);
    // Refresca los "hace X min" aunque no lleguen eventos nuevos.
    const reloj = setInterval(() => forzarRefresco((n) => n + 1), 15000);
    return () => {
      clearInterval(t);
      clearInterval(reloj);
    };
  }, [consultar]);

  async function limpiar() {
    await fetch("/api/eventos", { method: "DELETE" });
    vistos.current.clear();
    primeraCarga.current = true;
    setEventos([]);
  }

  const pendientes = eventos.filter((e) => e.tipo === "mozo").length;

  return (
    <main className="mx-auto min-h-dvh max-w-3xl px-5 py-6">
      <header className="flex items-center gap-3 border-b border-line pb-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={brand.logo} alt="" className="h-9 w-9" />
        <div className="flex-1">
          <h1 className="font-display text-xl font-semibold leading-tight">
            Cocina y barra
          </h1>
          <p className="text-xs text-muted">
            {brand.nombre} · actualiza solo
          </p>
        </div>

        <span
          className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${
            conectado === false
              ? "border-line bg-card text-muted"
              : "border-brand/40 bg-brand/10 text-brand"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              conectado === false ? "bg-muted" : "animate-pulse bg-brand"
            }`}
          />
          {conectado === false ? "sin conexión" : "en vivo"}
        </span>

        <button
          onClick={limpiar}
          className="rounded-full border border-line bg-card px-3 py-1.5 text-xs text-muted transition-transform active:scale-95"
        >
          Limpiar
        </button>
      </header>

      {pendientes > 0 && (
        <p className="anim-fade-up mt-4 rounded-2xl border border-brand/40 bg-brand/10 px-4 py-3 text-sm font-medium text-brand">
          {pendientes === 1
            ? "1 mesa está llamando al mozo"
            : `${pendientes} mesas están llamando al mozo`}
        </p>
      )}

      {eventos.length === 0 ? (
        <div className="flex min-h-[55dvh] flex-col items-center justify-center gap-3 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-card-2 text-muted">
            <Icono nombre="bell" size={28} />
          </span>
          <p className="text-muted">Esperando movimientos de las mesas…</p>
          <p className="max-w-xs text-xs text-muted">
            Abrí el menú en otro dispositivo y tocá la campana para verlo
            aparecer acá.
          </p>
        </div>
      ) : (
        <ul className="mt-5 space-y-3">
          {eventos.map((e) => {
            const est = estilos[e.tipo];
            const nuevo = destacados.has(e.id);
            return (
              <li
                key={e.id}
                className={`rounded-2xl border p-4 transition-shadow ${est.color} ${
                  nuevo ? "anim-fade-up shadow-lg shadow-brand/20 ring-2 ring-brand" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      e.tipo === "mozo"
                        ? "bg-brand text-on-brand"
                        : "bg-card-2 text-brand"
                    }`}
                  >
                    <Icono nombre={est.icono} size={19} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="font-display text-lg font-semibold leading-tight">
                      Mesa {e.mesa}
                    </p>
                    <p className="text-sm text-muted">{est.titulo}</p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-xs text-muted">{haceCuanto(e.momento)}</p>
                    {e.totalArs != null && (
                      <p className="text-sm font-semibold text-brand">
                        {formatearPesos(e.totalArs)}
                      </p>
                    )}
                  </div>
                </div>

                {e.items && e.items.length > 0 && (
                  <ul className="mt-3 space-y-1 border-t border-line pt-3">
                    {e.items.map((it) => (
                      <li
                        key={it.id}
                        className="flex justify-between gap-3 text-sm"
                      >
                        <span>
                          <span className="font-semibold text-brand">
                            {it.cantidad}×
                          </span>{" "}
                          {it.nombre}
                        </span>
                        <span className="shrink-0 text-muted">
                          {formatearPesos(it.precioArs * it.cantidad)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                {e.observaciones && (
                  <p className="mt-3 rounded-xl border border-line bg-card-2 px-3 py-2 text-sm">
                    <span className="text-muted">Observaciones: </span>
                    {e.observaciones}
                  </p>
                )}

                {e.tipo === "pago" && (
                  <p className="mt-3 text-xs text-muted">
                    {e.metodo === "efectivo"
                      ? "Paga en efectivo en la mesa"
                      : "Pagado con tarjeta desde la mesa"}
                    {e.propinaArs
                      ? ` · propina ${formatearPesos(e.propinaArs)}`
                      : ""}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <p className="mt-8 text-center text-xs text-muted">
        Demo · esta pantalla anticipa la conexión con el sistema de gestión
      </p>
    </main>
  );
}
