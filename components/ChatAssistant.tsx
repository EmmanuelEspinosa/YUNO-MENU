"use client";

import { useEffect, useRef, useState } from "react";
import type { Producto } from "@/lib/tipos";
import { textoProducto } from "@/lib/datos";
import { useIdioma, useT } from "@/lib/i18n";
import { useFormatoPrecio } from "@/lib/moneda";
import { responderAsistente } from "@/lib/asistente";
import Icono from "./Icono";

type Mensaje = {
  rol: "usuario" | "ia";
  texto: string;
  productos?: Producto[];
};

export default function ChatAssistant({
  onVerProducto,
  carritoVisible,
}: {
  onVerProducto: (producto: Producto) => void;
  carritoVisible: boolean;
}) {
  const { idioma } = useIdioma();
  const t = useT();
  const formatear = useFormatoPrecio();
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [input, setInput] = useState("");
  const finRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (abierto && mensajes.length === 0) {
      setMensajes([{ rol: "ia", texto: t("asistenteBienvenida") }]);
    }
  }, [abierto, mensajes.length, t]);

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes, abierto]);

  function enviar() {
    const texto = input.trim();
    if (!texto) return;
    const respuesta = responderAsistente(texto, idioma);
    setMensajes((prev) => [
      ...prev,
      { rol: "usuario", texto },
      { rol: "ia", texto: respuesta.texto, productos: respuesta.productos },
    ]);
    setInput("");
  }

  return (
    <>
      <button
        aria-label={t("asistente")}
        className="fixed right-4 z-30 flex h-13 w-13 items-center justify-center rounded-full bg-brand text-on-brand shadow-xl shadow-black/30 transition-all duration-300 active:scale-90"
        style={{ bottom: carritoVisible ? 148 : 92 }}
        onClick={() => setAbierto(true)}
      >
        <Icono nombre="wand-sparkles" size={22} />
      </button>

      {abierto && (
        <div className="fixed inset-0 z-[65]">
          <div
            className="anim-fade-in absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setAbierto(false)}
          />
          <div className="anim-slide-up absolute inset-x-0 bottom-0 flex h-[80dvh] flex-col rounded-t-3xl border-t border-line bg-card">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="font-display flex items-center gap-2 text-lg font-semibold">
                <Icono nombre="wand-sparkles" size={18} className="text-brand" />
                {t("asistente")}
              </h2>
              <button
                aria-label={t("cerrar")}
                className="px-1 text-sm text-muted"
                onClick={() => setAbierto(false)}
              >
                ✕
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
              {mensajes.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.rol === "usuario" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      m.rol === "usuario"
                        ? "bg-brand text-on-brand"
                        : "border border-line bg-card-2"
                    }`}
                  >
                    <p>{m.texto}</p>
                    {m.productos && m.productos.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {m.productos.map((p) => {
                          const texto = textoProducto(p, idioma);
                          return (
                            <button
                              key={p.id}
                              onClick={() => {
                                setAbierto(false);
                                onVerProducto(p);
                              }}
                              className="flex w-full items-center gap-2 rounded-xl border border-line bg-bg px-2.5 py-2 text-left"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={p.poster}
                                alt=""
                                className="h-10 w-10 shrink-0 rounded-lg object-cover"
                              />
                              <span className="min-w-0 flex-1 truncate text-xs font-medium text-ink">
                                {texto.nombre}
                              </span>
                              <span className="shrink-0 text-xs font-semibold text-brand">
                                {formatear(p.precioArs)}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={finRef} />
            </div>

            <div className="flex items-center gap-2 border-t border-line p-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && enviar()}
                placeholder={t("asistentePlaceholder")}
                className="flex-1 rounded-full border border-line bg-card-2 px-4 py-2.5 text-sm outline-none placeholder:text-muted/60 focus:border-brand"
              />
              <button
                aria-label={t("continuar")}
                onClick={enviar}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-lg text-on-brand transition-transform active:scale-90"
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
