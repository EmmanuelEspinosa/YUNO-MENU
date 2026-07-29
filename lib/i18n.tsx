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
import type { Idioma } from "./tipos";

const CLAVE = "yuno-idioma";

const strings = {
  hola: { es: "Hola 👋", en: "Hi there 👋", pt: "Olá 👋" },
  mesa: { es: "Mesa", en: "Table", pt: "Mesa" },
  verPedido: { es: "Ver pedido", en: "View order", pt: "Ver pedido" },
  agregar: { es: "Agregar", en: "Add", pt: "Adicionar" },
  agregarAlPedido: {
    es: "Agregar al pedido",
    en: "Add to order",
    pt: "Adicionar ao pedido",
  },
  llamarMozo: { es: "Llamar al mozo", en: "Call the waiter", pt: "Chamar o garçom" },
  mozoNotificado: {
    es: "🔔 El mozo fue notificado — Mesa",
    en: "🔔 The waiter has been notified — Table",
    pt: "🔔 O garçom foi avisado — Mesa",
  },
  agregadoAlPedido: {
    es: "agregado al pedido",
    en: "added to your order",
    pt: "adicionado ao pedido",
  },
  tuPedido: { es: "Tu pedido", en: "Your order", pt: "Seu pedido" },
  pasoProductos: { es: "Tu pedido", en: "Your order", pt: "Seu pedido" },
  pasoSugerencia: { es: "Sugerencia IA", en: "AI pick", pt: "Sugestão IA" },
  pasoPago: { es: "Pago", en: "Payment", pt: "Pagamento" },
  continuar: { es: "Continuar", en: "Continue", pt: "Continuar" },
  volver: { es: "Volver", en: "Back", pt: "Voltar" },
  ahoraNo: { es: "Ahora no", en: "Not now", pt: "Agora não" },
  total: { es: "Total", en: "Total", pt: "Total" },
  carritoVacio: {
    es: "Todavía no agregaste nada. ¡El menú te espera!",
    en: "You haven't added anything yet. The menu's waiting!",
    pt: "Você ainda não adicionou nada. O cardápio te espera!",
  },
  propina: { es: "Propina", en: "Tip", pt: "Gorjeta" },
  sinPropina: { es: "Sin propina", en: "No tip", pt: "Sem gorjeta" },
  efectivo: { es: "Efectivo en mesa", en: "Cash at table", pt: "Dinheiro na mesa" },
  observaciones: {
    es: "Solicitudes especiales",
    en: "Special requests",
    pt: "Pedidos especiais",
  },
  observacionesPlaceholder: {
    es: "Ej: sin cebolla, café para llevar…",
    en: "E.g. no onion, coffee to go…",
    pt: "Ex: sem cebola, café para levar…",
  },
  confirmarPago: { es: "Confirmar pago", en: "Confirm payment", pt: "Confirmar pagamento" },
  procesando: { es: "Procesando el pago…", en: "Processing payment…", pt: "Processando o pagamento…" },
  pagoAprobado: { es: "¡Pago aprobado!", en: "Payment approved!", pt: "Pagamento aprovado!" },
  volverAlMenu: { es: "Volver al menú", en: "Back to menu", pt: "Voltar ao cardápio" },
  gracias: {
    es: "Gracias por tu visita",
    en: "Thanks for visiting",
    pt: "Obrigado pela visita",
  },
  configuracion: { es: "Preferencias", en: "Preferences", pt: "Preferências" },
  idioma: { es: "Idioma", en: "Language", pt: "Idioma" },
  moneda: { es: "Moneda", en: "Currency", pt: "Moeda" },
  vistaMenu: { es: "Vista del menú", en: "Menu view", pt: "Visualização do cardápio" },
  vistaModerna: { es: "Moderna", en: "Modern", pt: "Moderna" },
  vistaCompacta: { es: "Compacta", en: "Compact", pt: "Compacta" },
  cerrar: { es: "Cerrar", en: "Close", pt: "Fechar" },
  asistente: { es: "Preguntale a la IA", en: "Ask the AI", pt: "Pergunte à IA" },
  asistentePlaceholder: {
    es: "Preguntá algo del menú…",
    en: "Ask something about the menu…",
    pt: "Pergunte algo do cardápio…",
  },
  asistenteBienvenida: {
    es: "¡Hola! Preguntame sobre ingredientes, alergias, precios o pedime una recomendación.",
    en: "Hi! Ask me about ingredients, allergies, prices, or ask for a recommendation.",
    pt: "Olá! Pergunte sobre ingredientes, alergias, preços ou peça uma recomendação.",
  },
  panelDueno: { es: "Ver panel del dueño", en: "View owner dashboard", pt: "Ver painel do dono" },
} as const;

export type ClaveTexto = keyof typeof strings;

const IdiomaContext = createContext<{
  idioma: Idioma;
  setIdioma: (i: Idioma) => void;
} | null>(null);

export function IdiomaProvider({ children }: { children: React.ReactNode }) {
  const [idioma, setIdiomaState] = useState<Idioma>(config.idiomaPorDefecto);

  useEffect(() => {
    try {
      const guardado = localStorage.getItem(CLAVE) as Idioma | null;
      if (guardado && config.idiomas.some((i) => i.id === guardado)) {
        setIdiomaState(guardado);
      }
    } catch {}
  }, []);

  const setIdioma = useCallback((i: Idioma) => {
    setIdiomaState(i);
    try {
      localStorage.setItem(CLAVE, i);
    } catch {}
  }, []);

  const value = useMemo(() => ({ idioma, setIdioma }), [idioma, setIdioma]);

  return (
    <IdiomaContext.Provider value={value}>{children}</IdiomaContext.Provider>
  );
}

export function useIdioma() {
  const ctx = useContext(IdiomaContext);
  if (!ctx) throw new Error("useIdioma debe usarse dentro de IdiomaProvider");
  return ctx;
}

export function useT() {
  const { idioma } = useIdioma();
  return useCallback(
    (clave: ClaveTexto) => strings[clave][idioma],
    [idioma]
  );
}
