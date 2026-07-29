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
  emoji: string;
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
  emoji: string;
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
  i18n: Record<Idioma, ProductoTexto>;
};

export type Brand = {
  nombre: string;
  logo: string;
  colorPrimario: string;
  colorSecundario: string;
  tipografia: {
    titulos: string;
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
