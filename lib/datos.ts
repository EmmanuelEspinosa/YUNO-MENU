import menuJson from "@/data/menu.json";
import brandJson from "@/data/brand.json";
import configJson from "@/data/config.json";
import type {
  Brand,
  Categoria,
  Config,
  ConfigTag,
  Idioma,
  Producto,
  ProductoTexto,
} from "./tipos";

export const brand: Brand = brandJson;
export const config: Config = configJson as Config;
export const categorias: Categoria[] = menuJson.categorias as Categoria[];
export const productos: Producto[] = menuJson.productos as Producto[];

const porId = new Map(productos.map((p) => [p.id, p]));
const tagPorId = new Map(config.tags.map((t) => [t.id, t]));

export function buscarProducto(id: string): Producto | undefined {
  return porId.get(id);
}

export function buscarTag(id: string): ConfigTag | undefined {
  return tagPorId.get(id);
}

export function textoProducto(producto: Producto, idioma: Idioma): ProductoTexto {
  return producto.i18n[idioma];
}

export function textoCategoria(categoria: Categoria, idioma: Idioma): string {
  return categoria.nombre[idioma];
}

const PESOS = [400, 500, 600, 700];

export function urlGoogleFonts(): string {
  const familias = [
    { nombre: brand.tipografia.titulos, italic: !!brand.tipografia.titulosItalic },
    { nombre: brand.tipografia.cuerpo, italic: false },
  ]
    .map(({ nombre, italic }) => {
      const familia = nombre.trim().replace(/ /g, "+");
      // Con itálica solo pedimos ese eje (ital=1): los títulos nunca van en redonda.
      const ejes = italic
        ? `ital,wght@${PESOS.map((p) => `1,${p}`).join(";")}`
        : `wght@${PESOS.join(";")}`;
      return `family=${familia}:${ejes}`;
    })
    .join("&");
  return `https://fonts.googleapis.com/css2?${familias}&display=swap`;
}
