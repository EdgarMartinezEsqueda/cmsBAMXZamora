import { CMS_URL, PREVIEW_TOKEN } from './cms.js';

// Peticiones a /api/content compartidas durante la visita: la misma dirección se pide una sola
// vez aunque la usen varios componentes, y una página ya vista se pinta al instante al volver.
// Caduca a los 5 minutos: lo publicado después se ve al volver a pedirlo (o al recargar).
const MAX_AGE_MS = 5 * 60 * 1000;
const TIMEOUT_MS = 10000;
const entries = new Map();

/** Dirección de un contenido; query opcional ({ year, page }), vacíos se omiten. */
export function contentUrl(key, query) {
  const search = new URLSearchParams(Object.entries({ ...query, preview: PREVIEW_TOKEN })
    .filter(([, value]) => value !== undefined && value !== null && value !== '')).toString();
  // La clave puede tener segmentos ("pages/mi-pagina"): se codifica cada uno por separado.
  const path = key.split('/').map(encodeURIComponent).join('/');
  return `${CMS_URL}/api/content/${path}${search ? `?${search}` : ''}`;
}

async function load(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (response.status === 404) return { status: 'unpublished' };
    if (!response.ok) return { status: 'error' };
    const content = await response.json();
    return content && typeof content === 'object' ? { status: 'ready', content } : { status: 'error' };
  } catch {
    return { status: 'error' };
  } finally {
    clearTimeout(timeout);
  }
}

/** Pide (o reutiliza) un contenido. Los errores no se guardan: el siguiente intento vuelve a pedir. */
export function requestContent(url) {
  const cached = entries.get(url);
  if (cached && Date.now() - cached.at < MAX_AGE_MS) return cached.promise;
  const entry = { at: Date.now(), result: null };
  entry.promise = load(url).then((result) => {
    if (result.status === 'error') entries.delete(url);
    else entry.result = result;
    return result;
  });
  entries.set(url, entry);
  return entry.promise;
}

/** Resultado ya disponible (sin esperar), o null. */
export function peekContent(url) {
  const cached = entries.get(url);
  return cached?.result && Date.now() - cached.at < MAX_AGE_MS ? cached.result : null;
}

/** Guarda un resultado ya conocido (prueba de humo en Node, sin red). */
export function primeContent(url, result) {
  entries.set(url, { at: Date.now(), result, promise: Promise.resolve(result) });
}

/** Olvida un contenido (botón "Reintentar"). */
export function forgetContent(url) {
  entries.delete(url);
}
