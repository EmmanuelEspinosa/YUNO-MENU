"use client";

import {
  BadgeCheck,
  BeefOff,
  Bell,
  CakeSlice,
  Candy,
  Check,
  Clock,
  Coffee,
  Cog,
  CreditCard,
  Flame,
  HandCoins,
  Hamburger,
  HelpCircle,
  MilkOff,
  Pointer,
  QrCode,
  Rotate3d,
  Scan,
  Volume2,
  VolumeX,
  ScrollText,
  Snowflake,
  Sparkles,
  Vegan,
  WandSparkles,
  WheatOff,
  Wine,
  type LucideProps,
} from "lucide-react";
import type { ComponentType } from "react";

/**
 * Registro de íconos de lucide.dev.
 *
 * Las claves son los nombres en kebab-case tal cual figuran en lucide.dev,
 * que es lo que se guarda en data/menu.json (categorías) y data/config.json
 * (tags). Para sumar un ícono nuevo: importalo arriba y agregalo a este mapa.
 */
const registro: Record<string, ComponentType<LucideProps>> = {
  "badge-check": BadgeCheck,
  "beef-off": BeefOff,
  bell: Bell,
  "cake-slice": CakeSlice,
  candy: Candy,
  check: Check,
  clock: Clock,
  coffee: Coffee,
  cog: Cog,
  "credit-card": CreditCard,
  flame: Flame,
  "hand-coins": HandCoins,
  hamburger: Hamburger,
  "help-circle": HelpCircle,
  "milk-off": MilkOff,
  pointer: Pointer,
  "qr-code": QrCode,
  "rotate-3d": Rotate3d,
  scan: Scan,
  "volume-2": Volume2,
  "volume-x": VolumeX,
  "scroll-text": ScrollText,
  snowflake: Snowflake,
  sparkles: Sparkles,
  vegan: Vegan,
  "wand-sparkles": WandSparkles,
  "wheat-off": WheatOff,
  wine: Wine,
};

export default function Icono({
  nombre,
  className,
  size = 18,
}: {
  nombre: string;
  className?: string;
  size?: number;
}) {
  const Componente = registro[nombre];
  if (!Componente) return null;
  return (
    <Componente
      size={size}
      strokeWidth={1.75}
      className={className}
      aria-hidden
    />
  );
}
