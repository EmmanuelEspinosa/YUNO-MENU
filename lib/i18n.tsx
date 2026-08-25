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
  tituloBienvenida: {
    es: "Bienvenido a la carta",
    en: "Welcome to the menu",
    pt: "Bem-vindo ao cardápio",
  },
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
    es: "El mozo fue notificado — Mesa",
    en: "The waiter has been notified — Table",
    pt: "O garçom foi avisado — Mesa",
  },
  pedidoRecibido: {
    es: "Pedido recibido",
    en: "Order received",
    pt: "Pedido recebido",
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
  comoPagas: { es: "¿Cómo querés pagar?", en: "How would you like to pay?", pt: "Como quer pagar?" },
  pagarAhora: { es: "Pagar ahora", en: "Pay now", pt: "Pagar agora" },
  pagarAlFinal: { es: "Pagar al final", en: "Pay later", pt: "Pagar no final" },
  pagarAhoraDetalle: {
    es: "Con tarjeta, desde la mesa",
    en: "By card, from your table",
    pt: "Com cartão, da sua mesa",
  },
  pagarAlFinalDetalle: {
    es: "Consumí y arreglás cuando terminás",
    en: "Order now, settle up when you finish",
    pt: "Consuma e acerte quando terminar",
  },
  avisoPagarAlFinal: {
    es: "Tu pedido va directo a la cocina y queda anotado en la mesa. Cuando termines, pedile la cuenta al mozo.",
    en: "Your order goes straight to the kitchen and stays open on your table. When you're done, ask the waiter for the bill.",
    pt: "Seu pedido vai direto para a cozinha e fica anotado na mesa. Quando terminar, peça a conta ao garçom.",
  },
  confirmarPedido: { es: "Confirmar pedido", en: "Confirm order", pt: "Confirmar pedido" },
  pedidoConfirmado: { es: "¡Pedido confirmado!", en: "Order confirmed!", pt: "Pedido confirmado!" },
  pagoAlFinalResumen: {
    es: "Pagás al final",
    en: "You'll pay at the end",
    pt: "Você paga no final",
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
  ver3d: { es: "Ver en 3D", en: "View in 3D", pt: "Ver em 3D" },
  verVideo: { es: "Ver video", en: "Watch video", pt: "Ver vídeo" },
  cargando3d: { es: "Cargando 3D…", en: "Loading 3D…", pt: "Carregando 3D…" },
  error3d: {
    es: "No pudimos cargar la vista 3D.",
    en: "We couldn't load the 3D view.",
    pt: "Não conseguimos carregar a vista 3D.",
  },
  verEnTuMesa: {
    es: "Verlo en tu mesa",
    en: "View on your table",
    pt: "Ver na sua mesa",
  },
  tamanoReal: { es: "Tamaño real", en: "Actual size", pt: "Tamanho real" },
  comoFunciona: {
    es: "¿Cómo funciona?",
    en: "How it works",
    pt: "Como funciona",
  },
  comoFuncionaDetalle: {
    es: "Volvé a ver el tutorial",
    en: "See the tutorial again",
    pt: "Ver o tutorial de novo",
  },
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
  probaPreguntando: {
    es: "Probá preguntando:",
    en: "Try asking:",
    pt: "Experimente perguntar:",
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
