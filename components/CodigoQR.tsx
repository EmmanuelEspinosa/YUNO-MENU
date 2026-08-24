"use client";

import { useEffect, useState } from "react";

/**
 * Genera el QR como SVG en el navegador. Se hace del lado del cliente a
 * propósito: necesitamos `window.location.origin` para que el código apunte al
 * dominio real. Si se generara en el servidor, en local quedaría apuntando a
 * localhost y el celular del prospecto no podría abrirlo.
 */
export default function CodigoQR({
  ruta,
  tamano = 240,
}: {
  ruta: string;
  tamano?: number;
}) {
  const [svg, setSvg] = useState<string | null>(null);
  const [url, setUrl] = useState("");

  useEffect(() => {
    let cancelado = false;
    const destino = `${window.location.origin}${ruta}`;
    setUrl(destino);

    import("qrcode")
      .then((QR) =>
        QR.toString(destino, {
          type: "svg",
          margin: 1,
          width: tamano,
          color: { dark: "#000000", light: "#ffffff" },
        })
      )
      .then((codigo) => !cancelado && setSvg(codigo))
      .catch(() => !cancelado && setSvg(null));

    return () => {
      cancelado = true;
    };
  }, [ruta, tamano]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="flex items-center justify-center rounded-3xl bg-white p-4 shadow-xl shadow-black/30"
        style={{ width: tamano + 32, height: tamano + 32 }}
      >
        {svg ? (
          <div
            className="h-full w-full [&>svg]:h-full [&>svg]:w-full"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        ) : (
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-black/30 border-t-transparent" />
        )}
      </div>
      {url && (
        <p className="max-w-[280px] break-all text-center text-xs text-muted">
          {url}
        </p>
      )}
    </div>
  );
}
