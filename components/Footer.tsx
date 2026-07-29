import { brand } from "@/lib/datos";

const redesIconos: { key: keyof typeof brand.redes; emoji: string; label: string }[] = [
  { key: "instagram", emoji: "📷", label: "Instagram" },
  { key: "whatsapp", emoji: "💬", label: "WhatsApp" },
  { key: "facebook", emoji: "👍", label: "Facebook" },
];

export default function Footer() {
  const enlaces = redesIconos.filter((r) => brand.redes[r.key]);
  if (enlaces.length === 0) return null;

  return (
    <footer className="mt-10 border-t border-line px-5 py-6 text-center">
      <div className="flex justify-center gap-3">
        {enlaces.map((r) => (
          <a
            key={r.key}
            href={brand.redes[r.key]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={r.label}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-card-2 text-lg transition-transform active:scale-90"
          >
            {r.emoji}
          </a>
        ))}
      </div>
      <p className="mt-4 text-xs text-muted">
        Hecho con Yuno Menu · Menús digitales que venden más
      </p>
    </footer>
  );
}
