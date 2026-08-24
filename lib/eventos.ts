/**
 * Almacén de eventos mesa → cocina. SOLO SERVIDOR.
 *
 * Es la única parte de la demo con backend real: el resto (IA, pagos,
 * sugerencias) sigue simulado en el navegador. Existe porque dos dispositivos
 * distintos (el celular del cliente y la pantalla de cocina) no pueden hablarse
 * sin algo en el medio que guarde el mensaje.
 *
 * En Netlify usa Blobs (sin configuración). En local cae a memoria, así que
 * `npm run dev` sigue funcionando sin depender de Netlify.
 */

export type TipoEvento = "mozo" | "pedido" | "pago";

export type ItemEvento = {
  id: string;
  nombre: string;
  cantidad: number;
  precioArs: number;
};

export type Evento = {
  id: string;
  tipo: TipoEvento;
  mesa: string;
  momento: string;
  items?: ItemEvento[];
  observaciones?: string;
  totalArs?: number;
  propinaArs?: number;
  metodo?: string;
  atendido?: boolean;
};

const CLAVE = "eventos";
const MAX_EVENTOS = 50;

/** Fallback para desarrollo local, donde no existe el entorno de Netlify. */
let memoria: Evento[] = [];

type Store = {
  get: (k: string, o: { type: "json" }) => Promise<unknown>;
  setJSON: (k: string, v: unknown) => Promise<unknown>;
};

async function abrirStore(): Promise<Store | null> {
  try {
    const { getStore } = await import("@netlify/blobs");
    return getStore("yuno-eventos") as unknown as Store;
  } catch {
    // Sin entorno de Netlify (local): usamos memoria.
    return null;
  }
}

export async function leerEventos(): Promise<Evento[]> {
  const store = await abrirStore();
  if (!store) return memoria;
  try {
    const datos = (await store.get(CLAVE, { type: "json" })) as Evento[] | null;
    return datos ?? [];
  } catch {
    return [];
  }
}

export async function agregarEvento(
  evento: Omit<Evento, "id" | "momento">
): Promise<Evento> {
  const completo: Evento = {
    ...evento,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    momento: new Date().toISOString(),
  };

  const previos = await leerEventos();
  // Los más nuevos primero, y recortamos para que el blob no crezca sin control.
  const actualizados = [completo, ...previos].slice(0, MAX_EVENTOS);

  const store = await abrirStore();
  if (!store) {
    memoria = actualizados;
    return completo;
  }
  try {
    await store.setJSON(CLAVE, actualizados);
  } catch {
    memoria = actualizados;
  }
  return completo;
}

export async function limpiarEventos(): Promise<void> {
  memoria = [];
  const store = await abrirStore();
  if (store) {
    try {
      await store.setJSON(CLAVE, []);
    } catch {}
  }
}
