"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Promedios } from "./valoraciones";

/**
 * Valoraciones del lado del cliente.
 *
 * No hay cuentas: lo que este dispositivo ya votó se guarda en localStorage.
 * Alcanza para que una persona no vote dos veces la misma milanesa sin querer,
 * pero no es una barrera real (borrando los datos del navegador se puede votar
 * de nuevo). La barrera de verdad es que al terminar el pedido se le ofrece
 * puntuar solo lo que consumió.
 */

const CLAVE_VOTOS = "yuno-mis-votos";

type Contexto = {
  promedios: Promedios;
  misVotos: Record<string, number>;
  votar: (productoId: string, puntaje: number) => void;
};

const ValoracionesContext = createContext<Contexto | null>(null);

export function ValoracionesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [promedios, setPromedios] = useState<Promedios>({});
  const [misVotos, setMisVotos] = useState<Record<string, number>>({});

  useEffect(() => {
    try {
      const guardado = localStorage.getItem(CLAVE_VOTOS);
      if (guardado) setMisVotos(JSON.parse(guardado));
    } catch {}

    fetch("/api/valoraciones", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setPromedios(d.promedios ?? {}))
      .catch(() => {});
  }, []);

  const votar = useCallback((productoId: string, puntaje: number) => {
    // Optimista: la estrella se pinta al toque y el servidor confirma después.
    setMisVotos((prev) => {
      const siguiente = { ...prev, [productoId]: puntaje };
      try {
        localStorage.setItem(CLAVE_VOTOS, JSON.stringify(siguiente));
      } catch {}
      return siguiente;
    });

    fetch("/api/valoraciones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productoId, puntaje }),
    })
      .then((r) => r.json())
      .then((d) => d.promedios && setPromedios(d.promedios))
      .catch(() => {});
  }, []);

  const value = useMemo(
    () => ({ promedios, misVotos, votar }),
    [promedios, misVotos, votar]
  );

  return (
    <ValoracionesContext.Provider value={value}>
      {children}
    </ValoracionesContext.Provider>
  );
}

export function useValoraciones() {
  const ctx = useContext(ValoracionesContext);
  if (!ctx)
    throw new Error("useValoraciones debe usarse dentro de ValoracionesProvider");
  return ctx;
}
