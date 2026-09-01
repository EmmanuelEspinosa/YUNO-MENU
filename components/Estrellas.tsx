"use client";

import { Star } from "lucide-react";

/**
 * Estrellas de valoración. Dos modos:
 *  - solo lectura: muestra el promedio (con media estrella si corresponde)
 *  - interactivo: el cliente toca para puntuar
 *
 * Usa el ícono de lucide directo y no el componente Icono porque acá hace falta
 * controlar el relleno de cada estrella por separado.
 */
export default function Estrellas({
  valor,
  onVotar,
  size = 16,
  className,
}: {
  valor: number;
  onVotar?: (puntaje: number) => void;
  size?: number;
  className?: string;
}) {
  const interactivo = Boolean(onVotar);

  return (
    <span className={`inline-flex items-center gap-0.5 ${className ?? ""}`}>
      {[1, 2, 3, 4, 5].map((n) => {
        // Relleno parcial para promedios (ej: 4.5 pinta media quinta estrella)
        const llenado = Math.max(0, Math.min(1, valor - (n - 1)));
        const estrella = (
          <span
            className="relative inline-block"
            style={{ width: size, height: size }}
          >
            <Star
              size={size}
              strokeWidth={1.75}
              className="absolute inset-0 text-brand/35"
            />
            {llenado > 0 && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${llenado * 100}%` }}
              >
                <Star
                  size={size}
                  strokeWidth={1.75}
                  className="text-brand"
                  fill="currentColor"
                />
              </span>
            )}
          </span>
        );

        if (!interactivo) return <span key={n}>{estrella}</span>;

        return (
          <button
            key={n}
            type="button"
            aria-label={`${n} de 5`}
            onClick={(e) => {
              e.stopPropagation();
              onVotar?.(n);
            }}
            className="p-0.5 transition-transform active:scale-90"
          >
            {estrella}
          </button>
        );
      })}
    </span>
  );
}
