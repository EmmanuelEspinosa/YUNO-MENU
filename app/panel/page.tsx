"use client";

import Link from "next/link";
import { brand, buscarProducto, textoProducto } from "@/lib/datos";
import { useIdioma } from "@/lib/i18n";
import { useFormatoPrecio } from "@/lib/moneda";

// Dashboard del dueño: datos 100% ficticios, hardcodeados para la demo.
const ventaAdicionalMes = 1284500;
const ticketConIA = 14850;
const ticketSinIA = 11200;
const tasaAceptacion = 41;

const semanas = [
  { nombre: "Sem 1", sinIA: 10800, conIA: 13900 },
  { nombre: "Sem 2", sinIA: 11150, conIA: 14600 },
  { nombre: "Sem 3", sinIA: 11300, conIA: 14950 },
  { nombre: "Sem 4", sinIA: 11550, conIA: 15200 },
];

const topCombos = [
  { base: "espresso", maridaje: "medialunas", pedidos: 214 },
  { base: "cappuccino", maridaje: "croissant", pedidos: 189 },
  { base: "tostado", maridaje: "limonada", pedidos: 162 },
  { base: "cold-brew", maridaje: "cheesecake", pedidos: 141 },
  { base: "iced-caramel", maridaje: "torta-chocolate", pedidos: 118 },
];

const maxTicket = Math.max(...semanas.map((s) => s.conIA));
const maxPedidos = Math.max(...topCombos.map((c) => c.pedidos));
const mejora = Math.round((ticketConIA / ticketSinIA - 1) * 100);

export default function PanelPage() {
  const { idioma } = useIdioma();
  const formatearPrecio = useFormatoPrecio();

  return (
    <main className="mx-auto max-w-md px-5 py-6 pb-16">
      <header className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={brand.logo} alt={brand.nombre} className="h-10 w-10" />
        <div className="flex-1">
          <h1 className="font-display text-xl font-semibold leading-tight">
            Panel de {brand.nombre}
          </h1>
          <p className="text-xs text-muted">Julio 2026 · Datos de demo</p>
        </div>
        <Link
          href="/"
          className="rounded-full border border-line bg-card px-3 py-1.5 text-xs text-muted"
        >
          ← Salir
        </Link>
      </header>

      {/* KPI principal */}
      <section className="anim-fade-up mt-6 rounded-3xl border border-brand/40 bg-card p-5">
        <p className="text-xs font-medium uppercase tracking-widest text-muted">
          ✨ Venta adicional generada por sugerencias de la IA
        </p>
        <p className="font-display mt-2 text-4xl font-semibold text-brand">
          {formatearPrecio(ventaAdicionalMes)}
        </p>
        <p className="mt-1 text-sm text-muted">
          este mes · {tasaAceptacion}% de las sugerencias se aceptan
        </p>
      </section>

      {/* Ticket promedio */}
      <section className="anim-fade-up mt-4 grid grid-cols-2 gap-4">
        <div className="rounded-3xl border border-line bg-card p-4">
          <p className="text-xs text-muted">Ticket promedio sin IA</p>
          <p className="font-display mt-1 text-2xl font-semibold">
            {formatearPrecio(ticketSinIA)}
          </p>
        </div>
        <div className="rounded-3xl border border-brand/40 bg-card p-4">
          <p className="text-xs text-muted">Ticket promedio con IA</p>
          <p className="font-display mt-1 text-2xl font-semibold text-brand">
            {formatearPrecio(ticketConIA)}
          </p>
          <p className="mt-1 text-xs font-semibold text-brand">
            ▲ +{mejora}% vs sin IA
          </p>
        </div>
      </section>

      {/* Evolución semanal */}
      <section className="anim-fade-up mt-4 rounded-3xl border border-line bg-card p-5">
        <h2 className="font-display text-lg font-semibold">
          Ticket promedio por semana
        </h2>
        <div className="mt-4 space-y-4">
          {semanas.map((semana) => (
            <div key={semana.nombre}>
              <p className="mb-1.5 text-xs font-medium text-muted">
                {semana.nombre}
              </p>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 rounded-full bg-brand"
                    style={{ width: `${(semana.conIA / maxTicket) * 100}%` }}
                  />
                  <span className="shrink-0 text-xs font-medium">
                    {formatearPrecio(semana.conIA)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 rounded-full bg-line"
                    style={{ width: `${(semana.sinIA / maxTicket) * 100}%` }}
                  />
                  <span className="shrink-0 text-xs text-muted">
                    {formatearPrecio(semana.sinIA)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-4 text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-brand" /> Con
            sugerencias de IA
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-line" /> Sin IA
          </span>
        </div>
      </section>

      {/* Top combos */}
      <section className="anim-fade-up mt-4 rounded-3xl border border-line bg-card p-5">
        <h2 className="font-display text-lg font-semibold">
          Top 5 combos más pedidos
        </h2>
        <ul className="mt-4 space-y-4">
          {topCombos.map((combo, i) => {
            const base = buscarProducto(combo.base);
            const maridaje = buscarProducto(combo.maridaje);
            if (!base || !maridaje) return null;
            return (
              <li key={`${combo.base}-${combo.maridaje}`}>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-sm font-medium">
                    <span className="mr-1.5 text-muted">{i + 1}.</span>
                    {textoProducto(base, idioma).nombre} +{" "}
                    {textoProducto(maridaje, idioma).nombre}
                  </p>
                  <span className="shrink-0 text-xs text-muted">
                    {combo.pedidos} pedidos
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-card-2">
                  <div
                    className="h-full rounded-full bg-brand"
                    style={{ width: `${(combo.pedidos / maxPedidos) * 100}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <p className="mt-6 text-center text-xs text-muted">
        Yuno Menu · Panel del dueño (datos ilustrativos de la demo)
      </p>
    </main>
  );
}
