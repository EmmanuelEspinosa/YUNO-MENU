"use client";

import Link from "next/link";
import { useState } from "react";
import { brand, config } from "@/lib/datos";
import CodigoQR from "@/components/CodigoQR";
import Icono from "@/components/Icono";

const MESAS = ["1", "2", "3", "4", "5", "6"];

/**
 * Pantalla de acceso para la reunión con el prospecto: se muestra en la
 * notebook, el prospecto escanea con su celular y entra al menú. Abajo quedan
 * los accesos que usa quien hace la demo (cocina y panel).
 */
export default function Home() {
  const [mesa, setMesa] = useState("3");

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center px-6 py-10 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={brand.logo}
        alt={brand.nombre}
        className="anim-pop-in h-16 w-16"
      />
      <h1 className="font-display anim-fade-up mt-4 text-3xl font-semibold">
        {brand.nombre}
      </h1>
      <p className="anim-fade-up mt-2 text-sm leading-relaxed text-muted">
        {brand.mensajeBienvenida[config.idiomaPorDefecto]}
      </p>

      <div className="anim-fade-up mt-8">
        <p className="mb-4 flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-widest text-brand">
          <Icono nombre="qr-code" size={15} />
          Escaneá para abrir la carta
        </p>
        <CodigoQR ruta={`/mesa/${mesa}`} />
      </div>

      <div className="anim-fade-up mt-7 w-full">
        <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted">
          Mesa
        </p>
        <div className="flex justify-center gap-2">
          {MESAS.map((m) => (
            <button
              key={m}
              onClick={() => setMesa(m)}
              className={`h-10 w-10 rounded-full border text-sm font-semibold transition-colors ${
                mesa === m
                  ? "border-brand bg-brand text-on-brand"
                  : "border-line bg-card text-muted"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <Link
        href={`/mesa/${mesa}`}
        className="anim-fade-up mt-6 w-full rounded-2xl border border-line bg-card py-3.5 text-sm font-semibold transition-transform active:scale-95"
      >
        Abrir en esta pantalla
      </Link>

      <div className="mt-auto flex w-full gap-3 pt-10">
        <Link
          href="/cocina"
          className="flex-1 rounded-2xl border border-line bg-card-2 py-3 text-xs font-medium text-muted transition-transform active:scale-95"
        >
          Pantalla de cocina
        </Link>
        <Link
          href="/panel"
          className="flex-1 rounded-2xl border border-line bg-card-2 py-3 text-xs font-medium text-muted transition-transform active:scale-95"
        >
          Panel del dueño
        </Link>
      </div>
    </main>
  );
}
