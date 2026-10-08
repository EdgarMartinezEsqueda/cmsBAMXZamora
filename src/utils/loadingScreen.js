import { LOADING_BAR_COLORS } from "../../shared/content/site.js";

// La pantalla de carga se muestra antes de que llegue Strapi, así que no puede pedirle nada:
// usa la última elección del panel guardada en este navegador (llega con "Datos del sitio").
// Sin nada guardado, o si lo guardado no es válido, se usa la de siempre (el logo con el pez).
const STORAGE_KEY = "bamx-loading-screen";
export const DEFAULT_LOADING_SCREEN = { image: null, barColors: "marca" };

// Solo archivos de la biblioteca de medios (/uploads/archivo.ext) por http(s).
function safeImage(image) {
  if (!image || typeof image.src !== "string") return null;
  try {
    const url = new URL(image.src);
    if (!/^https?:$/.test(url.protocol) || !/^\/uploads\/[\w.-]+$/.test(url.pathname)) return null;
    return { src: url.href, alt: "" };
  } catch {
    return null;
  }
}

/** Valida una pantalla de carga (del CMS o del almacenamiento). */
export function normalizeLoadingScreen(value) {
  return {
    image: safeImage(value?.image),
    barColors: LOADING_BAR_COLORS.includes(value?.barColors) ? value.barColors : "marca",
  };
}

export function readLoadingScreen() {
  try {
    const stored = globalThis.localStorage?.getItem(STORAGE_KEY);
    return stored ? normalizeLoadingScreen(JSON.parse(stored)) : DEFAULT_LOADING_SCREEN;
  } catch {
    return DEFAULT_LOADING_SCREEN;
  }
}

export function saveLoadingScreen(value) {
  try {
    globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(normalizeLoadingScreen(value)));
  } catch { /* Sin almacenamiento: la próxima visita usa la pantalla de siempre. */ }
}
