import type { ItemEvento, TipoEvento } from "./eventos";

/**
 * Punto único de salida del menú hacia el mundo exterior.
 *
 * Hoy le pega a /api/eventos, que alimenta la pantalla /cocina. El día que
 * exista el sistema de gestión, se cambia la URL de destino acá y nada más:
 * el resto del menú no sabe ni le importa a dónde van los eventos.
 *
 * Regla de oro: si esto falla, el cliente no se entera. Un problema de red no
 * puede romperle el pedido a alguien que está sentado en la mesa.
 */

const DESTINO = "/api/eventos";

type Carga = {
  tipo: TipoEvento;
  mesa: string;
  items?: ItemEvento[];
  observaciones?: string;
  totalArs?: number;
  propinaArs?: number;
  metodo?: string;
  pagoPendiente?: boolean;
};

function emitir(carga: Carga): Promise<void> {
  return fetch(DESTINO, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(carga),
    keepalive: true,
  })
    .then(() => undefined)
    .catch(() => undefined);
}

export function avisarMozo(mesa: string): void {
  void emitir({ tipo: "mozo", mesa });
}

/**
 * Pedido y pago se disparan por la misma acción del cliente, así que se envían
 * EN SECUENCIA, no en paralelo. Si salen juntos, los dos leen la misma lista de
 * eventos y el segundo pisa al primero al guardar: se perdía el pedido, que es
 * justo lo que cocina necesita ver.
 */
export function avisarPedidoYPago(
  mesa: string,
  items: ItemEvento[],
  subtotalArs: number,
  totalArs: number,
  propinaArs: number,
  metodo: string,
  observaciones?: string
): void {
  void (async () => {
    await emitir({
      tipo: "pedido",
      mesa,
      items,
      totalArs: subtotalArs,
      observaciones,
    });
    await emitir({ tipo: "pago", mesa, totalArs, propinaArs, metodo });
  })();
}

/**
 * El cliente consume ahora y paga al final. Solo se emite el pedido, marcado
 * como pendiente: la mesa le queda debiendo al local hasta que el mozo cobre.
 */
export function avisarPedidoSinPagar(
  mesa: string,
  items: ItemEvento[],
  totalArs: number,
  observaciones?: string
): void {
  void emitir({
    tipo: "pedido",
    mesa,
    items,
    totalArs,
    observaciones,
    pagoPendiente: true,
  });
}
