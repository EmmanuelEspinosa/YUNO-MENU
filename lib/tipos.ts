export type Idioma = "es" | "en" | "pt";
export type MonedaId = "ARS" | "USD" | "BRL";

export type TextoI18n = Record<Idioma, string>;

export type ConfigIdioma = {
  id: Idioma;
  label: string;
  bandera: string;
};

export type ConfigMoneda = {
  id: MonedaId;
  label: string;
  simbolo: string;
  tasaVsArs: number;
};

export type ConfigTag = {
  id: string;
  /** Nombre del ícono en lucide.dev, en kebab-case (ej: "wheat-off"). */
  icono: string;
  label: TextoI18n;
};

export type Config = {
  idiomas: ConfigIdioma[];
  idiomaPorDefecto: Idioma;
  monedas: ConfigMoneda[];
  monedaPorDefecto: MonedaId;
  tags: ConfigTag[];
};

export type Categoria = {
  id: string;
  /** Nombre del ícono en lucide.dev, en kebab-case (ej: "cake-slice"). */
  icono: string;
  nombre: TextoI18n;
};

export type ProductoTexto = {
  nombre: string;
  descripcionCorta: string;
  descripcionLarga: string;
};

export type Producto = {
  id: string;
  categoria: string;
  precioArs: number;
  video: string;
  poster: string;
  maridajes: string[];
  tags: string[];
  /** Ruta al modelo .glb. Si falta, el producto simplemente no ofrece vista 3D. */
  modelo3d?: string;
  /**
   * Ancho real del plato en centímetros. Cumple dos funciones: se muestra al
   * cliente y se usa para escalar el modelo a tamaño real, que es lo que hace
   * que el AR sirva para dimensionar la porción.
   */
  anchoCm?: number;
  i18n: Record<Idioma, ProductoTexto>;
};

export type Brand = {
  nombre: string;
  logo: string;
  colorPrimario: string;
  colorSecundario: string;
  tipografia: {
    titulos: string;
    /** Si es true, los títulos se renderizan en itálica y solo se cargan esas variantes. */
    titulosItalic?: boolean;
    cuerpo: string;
  };
  mensajeBienvenida: TextoI18n;
  redes: {
    instagram: string;
    whatsapp: string;
    facebook: string;
  };
};

export type ItemCarrito = {
  id: string;
  cantidad: number;
};

export type Vista = "moderno" | "compacto";
