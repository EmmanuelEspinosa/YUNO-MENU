import Link from "next/link";
import { brand, config } from "@/lib/datos";

export default function Home() {
  const mesas = ["1", "2", "3", "4", "5", "6"];
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-6 py-10 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={brand.logo}
        alt={brand.nombre}
        className="anim-pop-in h-20 w-20"
      />
      <h1 className="font-display anim-fade-up mt-5 text-3xl font-semibold">
        {brand.nombre}
      </h1>
      <p className="anim-fade-up mt-3 text-sm leading-relaxed text-muted">
        {brand.mensajeBienvenida[config.idiomaPorDefecto]}
      </p>

      <div className="anim-fade-up mt-8 w-full">
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted">
          Demo · Simulá escanear el QR de una mesa
        </p>
        <div className="grid grid-cols-3 gap-3">
          {mesas.map((mesa) => (
            <Link
              key={mesa}
              href={`/mesa/${mesa}`}
              className="rounded-2xl border border-line bg-card py-4 font-semibold transition-transform active:scale-95"
            >
              Mesa {mesa}
            </Link>
          ))}
        </div>
      </div>

      <Link
        href="/panel"
        className="mt-8 text-sm text-brand underline underline-offset-4"
      >
        Ver panel del dueño →
      </Link>
    </main>
  );
}
