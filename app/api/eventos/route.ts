import { NextResponse } from "next/server";
import { agregarEvento, leerEventos, limpiarEventos } from "@/lib/eventos";
import type { Evento } from "@/lib/eventos";

// La vista de cocina consulta cada 2 segundos: nada de esto puede cachearse.
export const dynamic = "force-dynamic";
export const revalidate = 0;

const SIN_CACHE = {
  "Cache-Control": "no-store, max-age=0",
};

export async function GET() {
  const eventos = await leerEventos();
  return NextResponse.json({ eventos }, { headers: SIN_CACHE });
}

export async function POST(request: Request) {
  let cuerpo: Partial<Evento>;
  try {
    cuerpo = await request.json();
  } catch {
    return NextResponse.json(
      { error: "cuerpo inválido" },
      { status: 400, headers: SIN_CACHE }
    );
  }

  if (!cuerpo.tipo || !cuerpo.mesa) {
    return NextResponse.json(
      { error: "faltan tipo y mesa" },
      { status: 400, headers: SIN_CACHE }
    );
  }

  const evento = await agregarEvento({
    tipo: cuerpo.tipo,
    mesa: String(cuerpo.mesa),
    items: cuerpo.items,
    observaciones: cuerpo.observaciones,
    totalArs: cuerpo.totalArs,
    propinaArs: cuerpo.propinaArs,
    metodo: cuerpo.metodo,
  });

  return NextResponse.json({ evento }, { headers: SIN_CACHE });
}

/** Para dejar la pantalla limpia antes de una reunión con un prospecto. */
export async function DELETE() {
  await limpiarEventos();
  return NextResponse.json({ ok: true }, { headers: SIN_CACHE });
}
