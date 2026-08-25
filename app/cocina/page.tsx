"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { brand } from "@/lib/datos";
import type { Evento } from "@/lib/eventos";
import { activarSonido, sonarCampanilla } from "@/lib/sonido";
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
  const [conSonido, setConSonido] = useState(false);
  // En una ref además del estado: lo lee el intervalo, que no se recrea.
  const sonidoRef = useRef(false);

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
        if (sonidoRef.current) sonarCampanilla();
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

  async function alternarSonido() {
    if (conSonido) {
      sonidoRef.current = false;
      setConSonido(false);
      return;
    }
    // El navegador solo permite audio a partir de un gesto de la persona.
    const ok = await activarSonido();
    sonidoRef.current = ok;
    setConSonido(ok);
    if (ok) sonarCampanilla();
  }

  async function limpiar() {
    await fetch("/api/eventos", { method: "DELETE" });
    vistos.current.clear();
    primeraCarga.current = true;
    setEventos([]);
  }

  async function marcarAtendido(id: string) {
    // Optimista: la pantalla responde al toque y después se sincroniza sola.
    setEventos((prev) =>
      prev.map((e) => (e.id === id ? { ...e, atendido: true } : e))
    );
    await fetch("/api/eventos", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    }).catch(() => {});
  }

  const llamandoMozo = eventos.filter((e) => e.tipo === "mozo" && !e.atendido);
  const mesasDebiendo = eventos.filter((e) => e.pagoPendiente && !e.atendido);
  const totalAdeudado = mesasDebiendo.reduce(
    (suma, e) => suma + (e.totalArs ?? 0),
    0
  );

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
          onClick={alternarSonido}
          aria-pressed={conSonido}
          title={conSonido ? "Silenciar" : "Activar sonido"}
          className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-transform active:scale-95 ${
            conSonido
              ? "border-brand bg-brand text-on-brand"
              : "border-line bg-card text-muted"
          }`}
        >
          <Icono nombre={conSonido ? "volume-2" : "volume-x"} size={14} />
          {conSonido ? "Sonido" : "Sin sonido"}
        </button>

        <button
          onClick={limpiar}
          className="rounded-full border border-line bg-card px-3 py-1.5 text-xs text-muted transition-transform active:scale-95"
        >
          Limpiar
        </button>
      </header>

      {llamandoMozo.length > 0 && (
        <p className="anim-fade-up mt-4 flex items-center gap-2 rounded-2xl border border-brand/40 bg-brand/10 px-4 py-3 text-sm font-medium text-brand">
          <Icono nombre="bell" size={16} />
          {llamandoMozo.length === 1
            ? `Mesa ${llamandoMozo[0].mesa} está llamando al mozo`
            : `${llamandoMozo.length} mesas están llamando al mozo`}
        </p>
      )}

      {/* Cuentas abiertas: el mozo tiene que ver de un vistazo quién debe */}
      {mesasDebiendo.length > 0 && (
        <div className="anim-fade-up mt-3 rounded-2xl border border-line bg-card-2 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <Icono nombre="hand-coins" size={16} className="text-brand" />
              Cuentas abiertas
            </p>
            <span className="font-semibold text-brand">
              {formatearPesos(totalAdeudado)}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {mesasDebiendo.map((e) => (
              <span
                key={e.id}
                className="rounded-full border border-brand/40 bg-brand/10 px-2.5 py-1 text-xs font-medium text-brand"
              >
                Mesa {e.mesa} · {formatearPesos(e.totalArs ?? 0)}
              </span>
            ))}
          </div>
        </div>
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
                className={`rounded-2xl border p-4 transition-all ${
                  e.atendido ? "border-line bg-card opacity-55" : est.color
                } ${
                  nuevo ? "anim-fade-up shadow-lg shadow-brand/20 ring-2 ring-brand" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      e.tipo === "mozo" && !e.atendido
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
                    <p className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
                      {est.titulo}
                      {e.pagoPendiente && !e.atendido && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-brand px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-on-brand">
                          <Icono nombre="clock" size={11} />
                          Pago pendiente
                        </span>
                      )}
                      {e.atendido && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-line px-2 py-0.5 text-[11px] font-medium text-muted">
                          <Icono nombre="check" size={11} />
                          Resuelto
                        </span>
                      )}
                    </p>
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

                {/* Cerrar la acción: cobrar la mesa o dar por atendido el llamado */}
                {!e.atendido && (e.pagoPendiente || e.tipo === "mozo") && (
                  <button
                    onClick={() => marcarAtendido(e.id)}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-card-2 py-2.5 text-sm font-semibold transition-transform active:scale-[0.98]"
                  >
                    <Icono nombre="check" size={15} />
                    {e.pagoPendiente ? "Marcar como cobrada" : "Ya lo atendí"}
                  </button>
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
