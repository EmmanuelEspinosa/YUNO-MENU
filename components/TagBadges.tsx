"use client";

import { buscarTag } from "@/lib/datos";
import { useIdioma } from "@/lib/i18n";
import Icono from "./Icono";

export default function TagBadges({
  tags,
  className,
}: {
  tags: string[];
  className?: string;
}) {
  const { idioma } = useIdioma();
  if (tags.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-1.5 ${className ?? ""}`}>
      {tags.map((id) => {
        const tag = buscarTag(id);
        if (!tag) return null;
        return (
          <span
            key={id}
            className="inline-flex items-center gap-1 rounded-full border border-line bg-card-2 px-2 py-0.5 text-[11px] font-medium text-muted"
          >
            <Icono nombre={tag.icono} size={12} />
            {tag.label[idioma]}
          </span>
        );
      })}
    </div>
  );
}
