import type { Idioma, Producto } from "./tipos";
import { productos } from "./datos";

/**
 * Motor de chat 100% simulado: matching por keywords contra los datos del
 * menú. No llama a ninguna API externa, así se mantiene el principio de
 * "todo lo que parece IA está simulado en el cliente" del resto de la demo.
 */

type Respuesta = {
  texto: string;
  productos: Producto[];
};

function normalizar(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

const algunaCoincide = (mensaje: string, palabras: string[]) =>
  palabras.some((p) => mensaje.includes(normalizar(p)));

const tagKeywords: Record<string, string[]> = {
  picante: ["picante", "picantes", "spicy", "apimentado", "picância"],
  frio: ["frio", "helado", "cold", "iced", "gelado", "gelada"],
  sinTacc: [
    "sin tacc",
    "sin gluten",
    "gluten free",
    "celiaco",
    "celiaca",
    "sem gluten",
  ],
  vegano: ["vegano", "vegana", "vegan"],
  vegetariano: ["vegetariano", "vegetariana", "vegetarian"],
  sinLactosa: ["sin lactosa", "lactose free", "dairy free", "sem lactose"],
  dulce: ["dulce", "sweet", "doce"],
  conAlcohol: ["alcohol", "alcoholic", "alcool"],
};

const categoriaKeywords: Record<string, string[]> = {
  cafes: ["cafe", "coffee"],
  frias: ["bebida fria", "bebidas frias", "cold drink", "bebida gelada", "trago"],
  pasteleria: ["postre", "pastel", "dessert", "pastry", "sobremesa", "torta", "cake"],
  salados: ["salado", "savory", "salgado", "sandwich", "tostado", "toast"],
};

const preguntaPrecio = [
  "precio",
  "cuanto sale",
  "cuanto cuesta",
  "cuanto vale",
  "price",
  "cost",
  "preco",
  "quanto custa",
];

const preguntaRecomendacion = [
  "recomend",
  "sugeri",
  "sugerencia",
  "recommend",
  "suggest",
  "sugestao",
  "que me das",
  "que pido",
];

const saludo = ["hola", "buenas", "hi", "hello", "oi", "ola"];

const textosFijos = {
  saludo: {
    es: "¡Hola! Contame qué se te antoja o preguntame por alergias, picante o precios.",
    en: "Hi! Tell me what you're craving, or ask about allergies, spice level or prices.",
    pt: "Olá! Me conta o que você quer, ou pergunte sobre alergias, picância ou preços.",
  },
  sinResultados: {
    es: "No encontré nada así en la carta. Probá preguntando por una categoría, un ingrediente o \"sin gluten\", \"picante\", \"vegano\"…",
    en: "I couldn't find anything like that on the menu. Try asking about a category, an ingredient, or \"gluten free\", \"spicy\", \"vegan\"…",
    pt: "Não encontrei nada assim no cardápio. Tenta perguntar por uma categoria, um ingrediente, ou \"sem glúten\", \"picante\", \"vegano\"…",
  },
  recomendacion: {
    es: "Mi combo favorito de la casa:",
    en: "My favorite house combo:",
    pt: "Minha combinação favorita da casa:",
  },
  tagEncontrado: {
    es: "Estas opciones te van a servir:",
    en: "These options should work for you:",
    pt: "Estas opções devem servir:",
  },
  categoriaEncontrada: {
    es: "Mirá lo que tenemos:",
    en: "Here's what we've got:",
    pt: "Olha o que temos:",
  },
  precio: {
    es: "Acá tenés los precios:",
    en: "Here are the prices:",
    pt: "Aqui estão os preços:",
  },
} satisfies Record<string, Record<Idioma, string>>;

export function responderAsistente(mensaje: string, idioma: Idioma): Respuesta {
  const m = normalizar(mensaje);

  if (algunaCoincide(m, saludo) && m.length < 20) {
    return { texto: textosFijos.saludo[idioma], productos: [] };
  }

  for (const [tagId, palabras] of Object.entries(tagKeywords)) {
    if (algunaCoincide(m, palabras)) {
      const coincidencias = productos.filter((p) => p.tags.includes(tagId));
      if (coincidencias.length > 0) {
        return {
          texto: textosFijos.tagEncontrado[idioma],
          productos: coincidencias.slice(0, 4),
        };
      }
    }
  }

  for (const [catId, palabras] of Object.entries(categoriaKeywords)) {
    if (algunaCoincide(m, palabras)) {
      const coincidencias = productos.filter((p) => p.categoria === catId);
      if (coincidencias.length > 0) {
        return {
          texto: textosFijos.categoriaEncontrada[idioma],
          productos: coincidencias.slice(0, 4),
        };
      }
    }
  }

  const porNombre = productos.filter((p) =>
    Object.values(p.i18n).some((t) => m.includes(normalizar(t.nombre)))
  );
  if (porNombre.length > 0) {
    return { texto: textosFijos.precio[idioma], productos: porNombre };
  }

  if (algunaCoincide(m, preguntaRecomendacion)) {
    const top = productos.filter((p) => p.maridajes.length > 0)[0];
    return {
      texto: textosFijos.recomendacion[idioma],
      productos: top ? [top] : [],
    };
  }

  if (algunaCoincide(m, preguntaPrecio)) {
    return {
      texto: textosFijos.precio[idioma],
      productos: productos.slice(0, 3),
    };
  }

  return { texto: textosFijos.sinResultados[idioma], productos: [] };
}
