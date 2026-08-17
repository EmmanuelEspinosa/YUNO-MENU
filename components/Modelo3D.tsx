"use client";

import { useEffect, useRef, useState, type ComponentType, type Ref } from "react";
import { useT } from "@/lib/i18n";
import Icono from "./Icono";

/**
 * <model-viewer> es un web component, no un componente de React.
 *
 * Ojo con esto: React setea los props como PROPIEDADES del elemento, no como
 * atributos. Con model-viewer eso rompe (`src` no dispara la carga y `ar=""`
 * queda falsy, desactivando la realidad aumentada). Por eso el elemento se
 * renderiza vacío y toda la configuración se aplica con setAttribute.
 */
const ModelViewer = "model-viewer" as unknown as ComponentType<{
  ref?: Ref<HTMLElement>;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}>;

type Props = {
  src: string;
  /** Modelo .usdz: iOS solo hace AR con ese formato (ver README). */
  iosSrc?: string;
  poster: string;
  alt: string;
  /** Ancho real en cm: se usa para escalar el modelo a tamaño real. */
  anchoCm?: number;
};

/** El elemento del web component, con los métodos que usamos. */
type ElementoModelViewer = HTMLElement & {
  getDimensions?: () => { x: number; y: number; z: number };
};

export default function Modelo3D({
  src,
  iosSrc,
  poster,
  alt,
  anchoCm,
}: Props) {
  const t = useT();
  const ref = useRef<ElementoModelViewer>(null);
  const escalaAplicada = useRef(false);
  const [estado, setEstado] = useState<"cargando" | "listo" | "error">(
    "cargando"
  );

  // La librería pesa ~300 KB: se descarga recién acá, cuando el cliente
  // efectivamente pidió ver el 3D. Nunca en la carga inicial del menú.
  useEffect(() => {
    let cancelado = false;
    import("@google/model-viewer")
      .then(() => customElements.whenDefined("model-viewer"))
      .then(() => !cancelado && setEstado("listo"))
      .catch(() => !cancelado && setEstado("error"));
    return () => {
      cancelado = true;
    };
  }, []);

  useEffect(() => {
    if (estado !== "listo") return;
    const el = ref.current;
    if (!el) return;

    const atributos: Record<string, string> = {
      src,
      poster,
      alt,
      // Por defecto model-viewer espera a que el elemento entre en viewport.
      // Acá el cliente ya pidió el 3D explícitamente, así que cargamos ya.
      loading: "eager",
      "camera-controls": "",
      "auto-rotate": "",
      "shadow-intensity": "1",
      ar: "",
      "ar-modes": "webxr scene-viewer quick-look",
      "ar-scale": "fixed",
      // pan-y deja que la ficha siga scrolleando en vertical
      "touch-action": "pan-y",
    };
    if (iosSrc) atributos["ios-src"] = iosSrc;
    for (const [k, v] of Object.entries(atributos)) el.setAttribute(k, v);

    /**
     * Los .glb no vienen con una escala confiable: este modelo de prueba mide
     * 112 "metros" de ancho. Sin corregirlo, el AR mostraría un plato gigante
     * sobre la mesa y la función perdería todo sentido. Lo normalizamos al
     * ancho real declarado en el menú.
     */
    let frame = 0;
    let respaldo: ReturnType<typeof setTimeout>;

    const aplicarEscala = () => {
      if (!anchoCm || escalaAplicada.current) return;
      const d = el.getDimensions?.();
      if (!d?.x) return;
      const factor = anchoCm / 100 / d.x;
      el.setAttribute("scale", `${factor} ${factor} ${factor}`);
      escalaAplicada.current = true;
    };

    const alCargar = () => {
      // Preferimos el próximo frame: cambiar la escala dispara un re-render
      // interno de model-viewer y su renderer puede no estar listo todavía.
      frame = requestAnimationFrame(aplicarEscala);
      // Red de seguridad: si no hay frames (pestaña oculta, WebGL trabado), la
      // escala igual se aplica. Sin esto el AR mostraría el plato gigante.
      respaldo = setTimeout(aplicarEscala, 600);
    };

    const alFallar = () => setEstado("error");
    el.addEventListener("load", alCargar);
    el.addEventListener("error", alFallar);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(respaldo);
      el.removeEventListener("load", alCargar);
      el.removeEventListener("error", alFallar);
    };
  }, [estado, src, iosSrc, poster, alt, anchoCm]);

  if (estado === "error") {
    return (
      <div className="flex aspect-video w-full items-center justify-center bg-card-2 px-6 text-center text-sm text-muted">
        {t("error3d")}
      </div>
    );
  }

  return (
    <div className="relative aspect-video w-full bg-card-2">
      {estado === "cargando" && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-card-2">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          <span className="text-xs text-muted">{t("cargando3d")}</span>
        </div>
      )}

      {estado === "listo" && (
        <ModelViewer
          ref={ref}
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "transparent",
          }}
        >
          <button
            slot="ar-button"
            className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-brand px-3.5 py-2 text-xs font-semibold text-on-brand shadow-lg shadow-black/30"
          >
            <Icono nombre="scan" size={14} />
            {t("verEnTuMesa")}
          </button>
        </ModelViewer>
      )}

      {/* La medida real es lo que resuelve el "no sabía que era tan chico" */}
      {anchoCm && estado === "listo" && (
        <span className="pointer-events-none absolute bottom-3 left-3 z-10 rounded-full border border-line bg-bg/80 px-3 py-1.5 text-xs font-medium backdrop-blur">
          {t("tamanoReal")}: {anchoCm} cm
        </span>
      )}
    </div>
  );
}
