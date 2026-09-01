/**
 * Valoraciones de los platos. SOLO SERVIDOR.
 *
 * Mismo almacenamiento que los eventos de cocina: Netlify Blobs en producción,
 * memoria en desarrollo.
 *
 * Se guardan como agregado (suma y cantidad de votos) y no voto por voto: para
 * mostrar el promedio en las 22 cards del menú hace falta una sola lectura, no
 * una por plato. La contrapartida está anotada en el README.
 */

export type Agregado = { suma: number; votos: number };
export type MapaValoraciones = Record<string, Agregado>;

/** Lo que consume la interfaz: promedio ya calculado. */
export type Promedios = Record<string, { promedio: number; votos: number }>;

const CLAVE = "valoraciones";

let memoria: MapaValoraciones = {};

type Store = {
  get: (k: string, o: { type: "json" }) => Promise<unknown>;
  setJSON: (k: string, v: unknown) => Promise<unknown>;
};

async function abrirStore(): Promise<Store | null> {
  try {
    const { getStore } = await import("@netlify/blobs");
    return getStore("yuno-valoraciones") as unknown as Store;
  } catch {
    return null;
  }
}

async function leerCrudo(): Promise<MapaValoraciones> {
  const store = await abrirStore();
  if (!store) return memoria;
  try {
    const datos = (await store.get(CLAVE, { type: "json" })) as MapaValoraciones | null;
    return datos ?? {};
  } catch {
    return {};
  }
}

export async function leerPromedios(): Promise<Promedios> {
  const crudo = await leerCrudo();
  const salida: Promedios = {};
  for (const [id, a] of Object.entries(crudo)) {
    if (!a || a.votos <= 0) continue;
    salida[id] = {
      promedio: Math.round((a.suma / a.votos) * 10) / 10,
      votos: a.votos,
    };
  }
  return salida;
}

export async function votar(
  productoId: string,
  puntaje: number
): Promise<Promedios> {
  const limpio = Math.max(1, Math.min(5, Math.round(puntaje)));
  const crudo = await leerCrudo();
  const previo = crudo[productoId] ?? { suma: 0, votos: 0 };
  const actualizado: MapaValoraciones = {
    ...crudo,
    [productoId]: { suma: previo.suma + limpio, votos: previo.votos + 1 },
  };

  const store = await abrirStore();
  if (!store) {
    memoria = actualizado;
  } else {
    try {
      await store.setJSON(CLAVE, actualizado);
    } catch {
      memoria = actualizado;
    }
  }
  return leerPromedios();
}

export async function limpiarValoraciones(): Promise<void> {
  memoria = {};
  const store = await abrirStore();
  if (store) {
    try {
      await store.setJSON(CLAVE, {});
    } catch {}
  }
}
