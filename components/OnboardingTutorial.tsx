"use client";

import { useEffect, useState } from "react";
import { useIdioma, useT } from "@/lib/i18n";
import type { Idioma } from "@/lib/tipos";

const CLAVE = "yuno-onboarding-visto";

const slides: Record<Idioma, { emoji: string; titulo: string; texto: string }[]> = {
  es: [
    { emoji: "👀", titulo: "Mirá y tocá", texto: "Deslizá el menú, tocá una card para ver más." },
    { emoji: "✨", titulo: "Sumá con la IA", texto: "Al pedir, la IA te tira el combo ideal." },
    { emoji: "💳", titulo: "Pagá desde la mesa", texto: "Sin esperar al mozo. Así de simple." },
  ],
  en: [
    { emoji: "👀", titulo: "Browse & tap", texto: "Scroll the menu, tap a card for details." },
    { emoji: "✨", titulo: "AI-powered combos", texto: "When you order, the AI suggests the perfect match." },
    { emoji: "💳", titulo: "Pay from your table", texto: "No waiting for the waiter. That simple." },
  ],
  pt: [
    { emoji: "👀", titulo: "Veja e toque", texto: "Deslize o cardápio, toque num card para ver mais." },
    { emoji: "✨", titulo: "Combos com IA", texto: "Ao pedir, a IA sugere a combinação ideal." },
    { emoji: "💳", titulo: "Pague da mesa", texto: "Sem esperar o garçom. Assim, simples." },
  ],
};

export default function OnboardingTutorial({ onTerminar }: { onTerminar: () => void }) {
  const { idioma } = useIdioma();
  const t = useT();
  const [paso, setPaso] = useState(0);
  const items = slides[idioma];

  function cerrar() {
    try {
      localStorage.setItem(CLAVE, "1");
    } catch {}
    onTerminar();
  }

  function siguiente() {
    if (paso < items.length - 1) {
      setPaso((p) => p + 1);
    } else {
      cerrar();
    }
  }

  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-bg">
      <button
        className="absolute right-5 top-5 z-10 text-sm text-muted"
        onClick={cerrar}
      >
        {idioma === "en" ? "Skip" : idioma === "pt" ? "Pular" : "Saltar"}
      </button>

      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        <div key={paso} className="anim-pop-in text-7xl">
          {items[paso].emoji}
        </div>
        <h2 className="font-display anim-fade-up mt-6 text-2xl font-semibold">
          {items[paso].titulo}
        </h2>
        <p className="anim-fade-up mt-2 max-w-xs text-muted">{items[paso].texto}</p>
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
          onClick={siguiente}
        >
          {paso < items.length - 1 ? t("continuar") : "OK"}
        </button>
      </div>
    </div>
  );
}

export function onboardingYaVisto(): boolean {
  try {
    return localStorage.getItem(CLAVE) === "1";
  } catch {
    return false;
  }
}
