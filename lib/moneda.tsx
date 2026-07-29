"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { config } from "./datos";
import { useIdioma } from "./i18n";
import type { Idioma, MonedaId } from "./tipos";

const CLAVE = "yuno-moneda";

const localePorIdioma: Record<Idioma, string> = {
  es: "es-AR",
  en: "en-US",
  pt: "pt-BR",
};

const monedaPorId = new Map(config.monedas.map((m) => [m.id, m]));

const MonedaContext = createContext<{
  moneda: MonedaId;
  setMoneda: (m: MonedaId) => void;
} | null>(null);

export function MonedaProvider({ children }: { children: React.ReactNode }) {
  const [moneda, setMonedaState] = useState<MonedaId>(config.monedaPorDefecto);

  useEffect(() => {
    try {
      const guardada = localStorage.getItem(CLAVE) as MonedaId | null;
      if (guardada && config.monedas.some((m) => m.id === guardada)) {
        setMonedaState(guardada);
      }
    } catch {}
  }, []);

  const setMoneda = useCallback((m: MonedaId) => {
    setMonedaState(m);
    try {
      localStorage.setItem(CLAVE, m);
    } catch {}
  }, []);

  const value = useMemo(() => ({ moneda, setMoneda }), [moneda, setMoneda]);

  return (
    <MonedaContext.Provider value={value}>{children}</MonedaContext.Provider>
  );
}

export function useMoneda() {
  const ctx = useContext(MonedaContext);
  if (!ctx) throw new Error("useMoneda debe usarse dentro de MonedaProvider");
  return ctx;
}

export function convertirDesdeArs(precioArs: number, moneda: MonedaId): number {
  const tasa = monedaPorId.get(moneda)?.tasaVsArs ?? 1;
  return precioArs / tasa;
}

/** Hook: formatea un precio en ARS a la moneda e idioma activos. */
export function useFormatoPrecio() {
  const { moneda } = useMoneda();
  const { idioma } = useIdioma();
  return useCallback(
    (precioArs: number) => {
      const valor = convertirDesdeArs(precioArs, moneda);
      const decimales = moneda === "ARS" ? 0 : 2;
      return new Intl.NumberFormat(localePorIdioma[idioma], {
        style: "currency",
        currency: moneda,
        minimumFractionDigits: decimales,
        maximumFractionDigits: decimales,
      }).format(valor);
    },
    [moneda, idioma]
  );
}
