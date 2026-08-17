"use client";

import { useState } from "react";
import { useIdioma } from "@/lib/i18n";
import type { Idioma } from "@/lib/tipos";
import Icono from "./Icono";

/**
 * Se guarda en sessionStorage (no localStorage): así cada visita nueva ve el
 * tutorial, pero no reaparece si el cliente recarga la página mientras come.
 */
const CLAVE = "yuno-onboarding-visto";

/**
 * "borde" y "solido" replican el estilo exacto de los botones flotantes reales
 * (campana y chat) para que el cliente reconozca el ícono cuando lo vea en
 * pantalla. Los íconos minimalistas no se explican solos: el tutorial los enseña.
 */
type Variante = "suave" | "borde" | "solido";

type Slide = {
  icono: string;
  variante: Variante;
  titulo: string;
  texto: string;
};

const slides: Record<Idioma, Slide[]> = {
  es: [
    {
      icono: "pointer",
      variante: "suave",
      titulo: "Explorá la carta",
      texto: "Tocá cualquier plato para ver su descripción, el video y el precio.",
    },
    {
      icono: "bell",
      variante: "borde",
      titulo: "Llamá al mozo",
      texto: "Con este botón le avisás al mozo desde la mesa, sin levantar la mano.",
    },
    {
      icono: "wand-sparkles",
      variante: "solido",
      titulo: "Preguntale a la IA",
      texto: "Consultá por ingredientes, alergias o pedile una recomendación.",
    },
    {
      icono: "credit-card",
      variante: "suave",
      titulo: "Pedí y pagá acá mismo",
      texto: "Sumá productos y pagá desde la mesa, sin esperar la cuenta.",
    },
  ],
  en: [
    {
      icono: "pointer",
      variante: "suave",
      titulo: "Explore the menu",
      texto: "Tap any dish to see its description, video and price.",
    },
    {
      icono: "bell",
      variante: "borde",
      titulo: "Call the waiter",
      texto: "This button lets the waiter know, right from your table.",
    },
    {
      icono: "wand-sparkles",
      variante: "solido",
      titulo: "Ask the AI",
      texto: "Ask about ingredients, allergies, or get a recommendation.",
    },
    {
      icono: "credit-card",
      variante: "suave",
      titulo: "Order and pay here",
      texto: "Add items and pay from your table, without waiting for the bill.",
    },
  ],
  pt: [
    {
      icono: "pointer",
      variante: "suave",
      titulo: "Explore o cardápio",
      texto: "Toque em qualquer prato para ver a descrição, o vídeo e o preço.",
    },
    {
      icono: "bell",
      variante: "borde",
      titulo: "Chame o garçom",
      texto: "Com este botão você avisa o garçom direto da mesa.",
    },
    {
      icono: "wand-sparkles",
      variante: "solido",
      titulo: "Pergunte à IA",
      texto: "Tire dúvidas sobre ingredientes, alergias ou peça uma recomendação.",
    },
    {
      icono: "credit-card",
      variante: "suave",
      titulo: "Peça e pague aqui",
      texto: "Adicione itens e pague da mesa, sem esperar a conta.",
    },
  ],
};

const ui: Record<Idioma, { saltar: string; siguiente: string; listo: string }> = {
  es: { saltar: "Saltar", siguiente: "Siguiente", listo: "Entendido" },
  en: { saltar: "Skip", siguiente: "Next", listo: "Got it" },
  pt: { saltar: "Pular", siguiente: "Próximo", listo: "Entendi" },
};

const estilosCirculo: Record<Variante, string> = {
  suave: "bg-brand/15 text-brand",
  borde: "border border-line bg-card-2 text-ink",
  solido: "bg-brand text-on-brand",
};

export default function OnboardingTutorial({
  onTerminar,
}: {
  onTerminar: () => void;
}) {
  const { idioma } = useIdioma();
  const [paso, setPaso] = useState(0);
  const items = slides[idioma];
  const textos = ui[idioma];
  const actual = items[paso];
  const esUltimo = paso === items.length - 1;

  function cerrar() {
    try {
      sessionStorage.setItem(CLAVE, "1");
    } catch {}
    onTerminar();
  }

  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-bg">
      <button
        className="absolute right-5 top-5 z-10 text-sm text-muted"
        onClick={cerrar}
      >
        {textos.saltar}
      </button>

      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        <div
          key={paso}
          className={`anim-pop-in flex h-20 w-20 items-center justify-center rounded-full shadow-xl shadow-black/20 ${estilosCirculo[actual.variante]}`}
        >
          <Icono nombre={actual.icono} size={34} />
        </div>
        <h2 className="font-display anim-fade-up mt-6 text-2xl font-semibold">
          {actual.titulo}
        </h2>
        <p className="anim-fade-up mt-2 max-w-xs leading-relaxed text-muted">
          {actual.texto}
        </p>
      </div>

      <div className="flex flex-col items-center gap-5 px-8 pb-10">
        <div className="flex gap-2">
          {items.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === paso ? "w-6 bg-brand" : "w-1.5 bg-line"
              }`}
            />
          ))}
        </div>
        <button
          className="w-full rounded-2xl bg-brand py-4 text-base font-semibold text-on-brand transition-transform active:scale-95"
          onClick={() => (esUltimo ? cerrar() : setPaso((p) => p + 1))}
        >
          {esUltimo ? textos.listo : textos.siguiente}
        </button>
      </div>
    </div>
  );
}

export function onboardingYaVisto(): boolean {
  try {
    // Antes esto se guardaba en localStorage, que es permanente: por eso el
    // tutorial dejaba de aparecer para siempre. Limpiamos esa clave vieja.
    localStorage.removeItem(CLAVE);
    return sessionStorage.getItem(CLAVE) === "1";
  } catch {
    return false;
  }
}
