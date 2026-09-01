import { NextResponse } from "next/server";
import {
  leerPromedios,
  limpiarValoraciones,
  votar,
} from "@/lib/valoraciones";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SIN_CACHE = { "Cache-Control": "no-store, max-age=0" };

export async function GET() {
  const promedios = await leerPromedios();
  return NextResponse.json({ promedios }, { headers: SIN_CACHE });
}

export async function POST(request: Request) {
  let cuerpo: { productoId?: string; puntaje?: number };
  try {
    cuerpo = await request.json();
  } catch {
    return NextResponse.json(
      { error: "cuerpo inválido" },
      { status: 400, headers: SIN_CACHE }
    );
  }

  const { productoId, puntaje } = cuerpo;
  if (!productoId || typeof puntaje !== "number") {
    return NextResponse.json(
      { error: "faltan productoId y puntaje" },
      { status: 400, headers: SIN_CACHE }
    );
  }

  const promedios = await votar(productoId, puntaje);
  return NextResponse.json({ promedios }, { headers: SIN_CACHE });
}

/** Para dejar la demo limpia antes de una reunión. */
export async function DELETE() {
  await limpiarValoraciones();
  return NextResponse.json({ ok: true }, { headers: SIN_CACHE });
}
