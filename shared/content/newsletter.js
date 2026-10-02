/** Contrato de los boletines (colección Boletines): listado paginado y detalle con PDF. */
import { mapImage, resolveMediaUrl, text } from "./core.js";

export const NEWSLETTER_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const NEWSLETTERS_PAGE_SIZE = 12;

const isoDate = (value) => typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value) ? value.slice(0, 10) : "";

/** PDF del boletín: solo si el archivo es realmente un PDF. */
function mapPdf(media, mediaOrigin) {
  if (media?.mime !== "application/pdf") return null;
  const url = resolveMediaUrl(media, mediaOrigin);
  if (!url) return null;
  // Strapi guarda el tamaño en KB.
  return { url, name: text(media.name), sizeKb: Number.isFinite(media.size) ? Math.round(media.size) : 0 };
}

function mapSummary(item, mediaOrigin) {
  if (typeof item?.slug !== "string" || !NEWSLETTER_SLUG.test(item.slug)) throw new Error("Boletín con slug inválido");
  return {
    title: text(item.title),
    slug: item.slug,
    edition: text(item.edition),
    period: isoDate(item.period),
    summary: text(item.summary),
    cover: mapImage(item.cover, mediaOrigin),
    // Para "Descargar PDF" desde el listado o Inicio sin pedir el detalle.
    pdfUrl: mapPdf(item.pdf, mediaOrigin)?.url ?? "",
  };
}

export function mapStrapiNewsletterList(payload, { mediaOrigin, page = 1, pageCount = 1, total = 0, years = [], year = null } = {}) {
  const data = payload?.data;
  if (!Array.isArray(data)) throw new Error("Boletines no disponibles en Strapi");
  return {
    items: data.map((item) => mapSummary(item, mediaOrigin)),
    page, pageCount, total, year,
    years: [...new Set(years.filter((value) => Number.isInteger(value)))].sort((a, b) => b - a),
  };
}

export function mapStrapiNewsletter(payload, { mediaOrigin } = {}) {
  const data = payload?.data;
  if (!data || typeof data !== "object") throw new Error("Boletín no disponible en Strapi");
  if (!("pdf" in data) || !("cover" in data)) throw new Error("Falta populate de pdf o cover");
  const pdf = mapPdf(data.pdf, mediaOrigin);
  if (!pdf) throw new Error("El boletín no tiene un PDF válido");
  return { ...mapSummary(data, mediaOrigin), pdf };
}
