/** Utilidades comunes a todos los mappers de contenido. Sin dependencias del navegador. */

/** Devuelve la URL solo si es relativa al sitio o http(s) sin credenciales; si no, "". */
export function safeContentUrl(value) {
  if (typeof value !== "string") return "";
  const url = value.trim();
  if (!url || [...url].some((char) => char === "\\" || char.charCodeAt(0) <= 32 || char.charCodeAt(0) === 127)) return "";
  if (url.startsWith("/") && !url.startsWith("//")) return url;
  try {
    const parsed = new URL(url);
    return ["https:", "http:"].includes(parsed.protocol) && !parsed.username && !parsed.password
      ? parsed.href : "";
  } catch {
    return "";
  }
}

/** Texto del CMS o "" si el campo falta o no es texto. Sin defaults editoriales. */
export const text = (value) => typeof value === "string" ? value : "";

/**
 * URL absoluta de un medio de Strapi, o "" si no hay medio válido. Las rutas relativas
 * (/uploads/...) se resuelven contra el origen público de medios, que es obligatorio.
 */
export function resolveMediaUrl(media, mediaOrigin) {
  const url = safeContentUrl(media?.url);
  if (!url || !url.startsWith("/")) return url;
  const origin = safeContentUrl(mediaOrigin);
  if (!origin || origin.startsWith("/")) throw new Error("Falta el origen público de medios");
  return new URL(url, origin).href;
}

/** Extrae `data` de una respuesta de Strapi y exige que sea un documento. */
export function requireDocument(payload, name) {
  const data = payload?.data;
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error(`${name} no disponible en Strapi`);
  }
  return data;
}

/** Encabezado de sección (shared.heading). null si la sección no tiene encabezado. */
export function mapHeading(heading) {
  if (!heading || typeof heading !== "object") return null;
  return { eyebrow: text(heading.eyebrow), lead: text(heading.lead), highlight: text(heading.highlight),
    tail: text(heading.tail), intro: text(heading.intro) };
}

/** Botón o enlace (shared.link). null si falta el texto o la URL no es segura: no se pinta. */
export function mapLink(link) {
  const label = text(link?.label);
  const url = safeContentUrl(link?.url);
  return label && url ? { label, url } : null;
}

/** Tarjetas (shared.card) completas, en su orden. */
export const mapCards = (cards) => Array.isArray(cards)
  ? cards.map((card) => ({ title: text(card?.title), description: text(card?.description) })).filter((card) => card.title)
  : [];

/** Elementos de lista (shared.list-item) no vacíos, en su orden. */
export const mapList = (items) => Array.isArray(items) ? items.map((item) => text(item?.text)).filter(Boolean) : [];

// Versiones que genera Strapi al subir una foto (cms/config/plugins.js, breakpoints), de menor a mayor.
const IMAGE_SIZES = ["small", "medium", "large"];

/**
 * Elige la versión reducida pedida de una foto; si no existe (foto más pequeña o subida antes de
 * esa versión), la siguiente más grande; si no hay ninguna, el original.
 */
export function pickImageFormat(media, size = "medium") {
  const formats = media?.formats && typeof media.formats === "object" ? media.formats : {};
  const start = Math.max(0, IMAGE_SIZES.indexOf(size));
  const found = IMAGE_SIZES.slice(start).find((name) => typeof formats[name]?.url === "string");
  return found ? { ...media, url: formats[found].url } : media;
}

/** Imagen con su texto alternativo, o null. size: versión reducida preferida (ver pickImageFormat). */
export function mapImage(media, mediaOrigin, { size = "medium" } = {}) {
  const src = resolveMediaUrl(pickImageFormat(media, size), mediaOrigin);
  return src ? { src, alt: text(media?.alternativeText) } : null;
}

/** Bloques con lista (shared.feature): título, descripción opcional y viñetas. */
export const mapFeatures = (features) => Array.isArray(features)
  ? features.map((feature) => ({ title: text(feature?.title), description: text(feature?.description), items: mapList(feature?.items) }))
    .filter((feature) => feature.title)
  : [];

/** Solo enlaces externos https (videos, redes): nunca rutas internas ni otros protocolos. */
export function externalUrl(value) {
  const url = safeContentUrl(value);
  return url.startsWith("https://") ? url : "";
}
