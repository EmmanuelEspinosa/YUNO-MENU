"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ItemCarrito, Producto, Vista } from "@/lib/tipos";
import {
  brand,
  buscarProducto,
  categorias,
  productos,
  textoCategoria,
} from "@/lib/datos";
import { useIdioma, useT } from "@/lib/i18n";
import { useFormatoPrecio } from "@/lib/moneda";
import ProductCard from "./ProductCard";
import CompactRow from "./CompactRow";
import ProductSheet from "./ProductSheet";
import OrderWizard from "./OrderWizard";
import SettingsSheet from "./SettingsSheet";
import OnboardingTutorial, { onboardingYaVisto } from "./OnboardingTutorial";
import ChatAssistant from "./ChatAssistant";
import Footer from "./Footer";
import Icono from "./Icono";

const CLAVE_VISTA = "yuno-vista";

export default function MesaClient({ mesaId }: { mesaId: string }) {
  const { idioma } = useIdioma();
  const t = useT();
  const formatear = useFormatoPrecio();

  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [cargado, setCargado] = useState(false);
  const [seleccionado, setSeleccionado] = useState<Producto | null>(null);
  const [wizardAbierto, setWizardAbierto] = useState(false);
  const [settingsAbierto, setSettingsAbierto] = useState(false);
  const [onboardingVisible, setOnboardingVisible] = useState<boolean | null>(null);
  const [toast, setToast] = useState<{ texto: string; icono?: string } | null>(
    null
  );
  const [categoriaActiva, setCategoriaActiva] = useState(categorias[0]?.id);
  const [vista, setVista] = useState<Vista>("moderno");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const claveSesion = `yuno-carrito-mesa-${mesaId}`;

  useEffect(() => {
    setOnboardingVisible(!onboardingYaVisto());
    try {
      const guardado = sessionStorage.getItem(claveSesion);
      if (guardado) setCarrito(JSON.parse(guardado));
      const vistaGuardada = localStorage.getItem(CLAVE_VISTA) as Vista | null;
      if (vistaGuardada) setVista(vistaGuardada);
    } catch {}
    setCargado(true);
  }, [claveSesion]);

  useEffect(() => {
    if (!cargado) return;
    try {
      sessionStorage.setItem(claveSesion, JSON.stringify(carrito));
    } catch {}
  }, [carrito, cargado, claveSesion]);

  function cambiarVista(v: Vista) {
    setVista(v);
    try {
      localStorage.setItem(CLAVE_VISTA, v);
    } catch {}
  }

  const total = useMemo(
    () =>
      carrito.reduce((suma, item) => {
        const producto = buscarProducto(item.id);
        return suma + (producto ? producto.precioArs * item.cantidad : 0);
      }, 0),
    [carrito]
  );
  const cantidadItems = carrito.reduce((n, item) => n + item.cantidad, 0);
  const barraCarritoVisible = cantidadItems > 0 && !wizardAbierto;

  function mostrarToast(texto: string, icono?: string) {
    setToast({ texto, icono });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }

  function sumarAlCarrito(id: string, delta: number) {
    setCarrito((prev) => {
      const existente = prev.find((item) => item.id === id);
      if (!existente) {
        return delta > 0 ? [...prev, { id, cantidad: delta }] : prev;
      }
      return prev
        .map((item) =>
          item.id === id ? { ...item, cantidad: item.cantidad + delta } : item
        )
        .filter((item) => item.cantidad > 0);
    });
  }

  function agregarProducto(producto: Producto) {
    sumarAlCarrito(producto.id, 1);
    setSeleccionado(null);
    const nombre = producto.i18n[idioma].nombre;
    mostrarToast(`✓ ${nombre} ${t("agregadoAlPedido")}`);
  }

  function irACategoria(id: string) {
    setCategoriaActiva(id);
    document
      .getElementById(`cat-${id}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function pagoCompletado() {
    setCarrito([]);
    setWizardAbierto(false);
    mostrarToast(t("pedidoRecibido"));
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col pb-32">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-line bg-bg/85 backdrop-blur-md">
        <div className="flex items-center gap-3 px-5 py-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={brand.logo} alt={brand.nombre} className="h-9 w-9" />
          <div className="min-w-0 flex-1">
            <p className="font-display truncate text-lg font-semibold leading-tight">
              {brand.nombre}
            </p>
            <p className="text-xs text-muted">Menú digital con IA</p>
          </div>
          <span className="rounded-full border border-brand/40 bg-brand/10 px-3 py-1.5 text-xs font-semibold text-brand">
            {t("mesa")} {mesaId}
          </span>
          <button
            aria-label={t("configuracion")}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line bg-card-2 text-muted"
            onClick={() => setSettingsAbierto(true)}
          >
            <Icono nombre="cog" size={16} />
          </button>
        </div>

        {/* Navegación de categorías */}
        <nav className="no-scrollbar flex gap-2 overflow-x-auto px-5 pb-3">
          {categorias.map((cat) => (
            <button
              key={cat.id}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                categoriaActiva === cat.id
                  ? "border-brand bg-brand text-on-brand"
                  : "border-line bg-card text-muted"
              }`}
              onClick={() => irACategoria(cat.id)}
            >
              <Icono nombre={cat.icono} size={15} />
              {textoCategoria(cat, idioma)}
            </button>
          ))}
        </nav>
      </header>

      {/* Bienvenida */}
      <section className="anim-fade-up px-5 pt-6">
        <h1 className="font-display text-2xl font-semibold leading-snug">
          {t("tituloBienvenida")}
        </h1>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">
          {brand.mensajeBienvenida[idioma]}
        </p>
      </section>

      {/* Categorías y productos */}
      {categorias.map((cat) => (
        <section
          key={cat.id}
          id={`cat-${cat.id}`}
          className="scroll-mt-32 px-5 pt-8"
        >
          <h2 className="font-display flex items-center gap-2 text-xl font-semibold">
            <Icono nombre={cat.icono} size={20} className="text-brand" />
            {textoCategoria(cat, idioma)}
          </h2>

          {vista === "moderno" ? (
            <div className="mt-4 grid gap-5">
              {productos
                .filter((p) => p.categoria === cat.id)
                .map((producto) => (
                  <ProductCard
                    key={producto.id}
                    producto={producto}
                    onAbrir={setSeleccionado}
                    onAgregar={agregarProducto}
                  />
                ))}
            </div>
          ) : (
            <div className="mt-2">
              {productos
                .filter((p) => p.categoria === cat.id)
                .map((producto) => (
                  <CompactRow
                    key={producto.id}
                    producto={producto}
                    onAbrir={setSeleccionado}
                    onAgregar={agregarProducto}
                  />
                ))}
            </div>
          )}
        </section>
      ))}

      <div className="flex-1" />
      <Footer />

      {/* Botón llamar al mozo — sube solo cuando aparece la barra del carrito */}
      <button
        aria-label={t("llamarMozo")}
        className="fixed right-4 z-30 flex h-13 w-13 items-center justify-center rounded-full border border-line bg-card-2 shadow-xl shadow-black/30 transition-all duration-300 active:scale-90"
        style={{ bottom: barraCarritoVisible ? 80 : 24 }}
        onClick={() => mostrarToast(`${t("mozoNotificado")} ${mesaId}`, "bell")}
      >
        <Icono nombre="bell" size={22} />
      </button>

      {/* Chat asistente */}
      <ChatAssistant
        onVerProducto={setSeleccionado}
        carritoVisible={barraCarritoVisible}
      />

      {/* Barra de carrito */}
      {barraCarritoVisible && (
        <div className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-md bg-gradient-to-t from-bg via-bg/95 to-transparent p-4 pt-8">
          <button
            className="anim-fade-up flex w-full items-center justify-between rounded-2xl bg-brand px-5 py-4 text-base font-semibold text-on-brand shadow-lg shadow-black/30 transition-transform active:scale-[0.97]"
            onClick={() => setWizardAbierto(true)}
          >
            <span>
              {t("verPedido")}{" "}
              <span className="ml-1 rounded-full bg-on-brand/15 px-2 py-0.5 text-sm">
                {cantidadItems}
              </span>
            </span>
            <span>{formatear(total)}</span>
          </button>
        </div>
      )}

      {/* Capas */}
      {seleccionado && (
        <ProductSheet
          producto={seleccionado}
          categoria={categorias.find((c) => c.id === seleccionado.categoria)}
          onAgregar={agregarProducto}
          onCerrar={() => setSeleccionado(null)}
        />
      )}

      {settingsAbierto && (
        <SettingsSheet
          vista={vista}
          onCambiarVista={cambiarVista}
          onVerTutorial={() => {
            setSettingsAbierto(false);
            setOnboardingVisible(true);
          }}
          onCerrar={() => setSettingsAbierto(false)}
        />
      )}

      {wizardAbierto && (
        <OrderWizard
          mesaId={mesaId}
          carrito={carrito}
          onCambiarCantidad={sumarAlCarrito}
          onCerrar={() => setWizardAbierto(false)}
          onPagoCompletado={pagoCompletado}
        />
      )}

      {onboardingVisible && (
        <OnboardingTutorial onTerminar={() => setOnboardingVisible(false)} />
      )}

      {/* Toast */}
      {toast && (
        <div className="anim-fade-up fixed inset-x-4 top-4 z-[70] mx-auto max-w-md">
          <div className="flex items-center justify-center gap-2 rounded-2xl border border-line bg-card-2 px-4 py-3 text-center text-sm font-medium shadow-2xl shadow-black/40">
            {toast.icono && (
              <Icono
                nombre={toast.icono}
                size={16}
                className="shrink-0 text-brand"
              />
            )}
            {toast.texto}
          </div>
        </div>
      )}
    </div>
  );
}
