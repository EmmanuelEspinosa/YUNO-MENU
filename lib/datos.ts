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

export function urlGoogleFonts(): string {
  const familias = [brand.tipografia.titulos, brand.tipografia.cuerpo]
    .map((f) => `family=${f.trim().replace(/ /g, "+")}:wght@400;500;600;700`)
    .join("&");
  return `https://fonts.googleapis.com/css2?${familias}&display=swap`;
}
