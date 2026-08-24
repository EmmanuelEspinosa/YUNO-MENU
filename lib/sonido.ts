/**
 * Campanilla para la pantalla de cocina.
 *
 * Se genera con Web Audio en vez de reproducir un archivo: no suma peso, no
 * depende de la red y no hay que buscar un mp3 con licencia libre.
 *
 * Los navegadores bloquean el audio hasta que la persona interactúa con la
 * página, así que hay que llamar a `activarSonido()` desde un click.
 */

let contexto: AudioContext | null = null;

type ConstructorAudio = typeof AudioContext;

function obtenerConstructor(): ConstructorAudio | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    AudioContext?: ConstructorAudio;
    webkitAudioContext?: ConstructorAudio;
  };
  return w.AudioContext ?? w.webkitAudioContext ?? null;
}

/** Llamar desde un click. Devuelve true si el audio quedó habilitado. */
export async function activarSonido(): Promise<boolean> {
  const Ctor = obtenerConstructor();
  if (!Ctor) return false;
  try {
    contexto = contexto ?? new Ctor();
    if (contexto.state === "suspended") await contexto.resume();
    return contexto.state === "running";
  } catch {
    return false;
  }
}

export function sonidoActivo(): boolean {
  return contexto?.state === "running";
}

function tono(inicio: number, frecuencia: number, duracion: number): void {
  if (!contexto) return;
  const osc = contexto.createOscillator();
  const vol = contexto.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(frecuencia, inicio);

  // Ataque corto y caída suave: suena a campanilla, no a bocina.
  vol.gain.setValueAtTime(0, inicio);
  vol.gain.linearRampToValueAtTime(0.28, inicio + 0.015);
  vol.gain.exponentialRampToValueAtTime(0.0001, inicio + duracion);

  osc.connect(vol);
  vol.connect(contexto.destination);
  osc.start(inicio);
  osc.stop(inicio + duracion);
}

/** Dos notas ascendentes, como el timbre de un mostrador. */
export function sonarCampanilla(): void {
  if (!contexto || contexto.state !== "running") return;
  const ahora = contexto.currentTime;
  tono(ahora, 880, 0.35);
  tono(ahora + 0.13, 1318.5, 0.45);
}
