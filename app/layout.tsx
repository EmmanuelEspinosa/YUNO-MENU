import type { Metadata, Viewport } from "next";
import { brand, config, urlGoogleFonts } from "@/lib/datos";
import { IdiomaProvider } from "@/lib/i18n";
import { MonedaProvider } from "@/lib/moneda";
import "./globals.css";

export const metadata: Metadata = {
  title: brand.nombre,
  description: brand.mensajeBienvenida[config.idiomaPorDefecto],
  icons: { icon: brand.logo },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: brand.colorSecundario,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const vars = {
    "--brand": brand.colorPrimario,
    "--brand-2": brand.colorSecundario,
    "--font-titulos": `"${brand.tipografia.titulos}", serif`,
    "--font-titulos-style": brand.tipografia.titulosItalic ? "italic" : "normal",
    "--font-cuerpo": `"${brand.tipografia.cuerpo}", system-ui, sans-serif`,
  } as React.CSSProperties;

  return (
    <html lang="es" style={vars}>
      <body className="min-h-dvh antialiased">
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href={urlGoogleFonts()} precedence="default" />
        <IdiomaProvider>
          <MonedaProvider>{children}</MonedaProvider>
        </IdiomaProvider>
      </body>
    </html>
  );
}
