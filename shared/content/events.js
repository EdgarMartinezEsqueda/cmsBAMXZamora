/** Contrato de los eventos (colección Eventos): listado, calendario del mes y detalle. */
import { mapImage, mapList, safeContentUrl, text } from "./core.js";
import { sanitizeRichText } from "./page.js";
import { httpsUrl } from "./site.js";

export const EVENT_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const EVENTS_PAGE_SIZE = 12;

// Listas cerradas (las mismas del esquema en Strapi) con su texto para el sitio.
export const EVENT_CATEGORIES = {
  entregas: "Entregas y jornadas comunitarias",
  bazares: "Bazares y ventas solidarias",
  campanas: "Campañas y voluntariado",
  institucionales: "Eventos institucionales",
  talleres: "Capacitación y talleres",
  especiales: "Actividades especiales",
};
export const EVENT_AUDIENCES = {
  publico: "Público general",
  beneficiarios: "Beneficiarios registrados",
  voluntarios: "Voluntarios",
  invitados: "Invitados",
};
export const EVENT_STATUSES = ["programado", "pospuesto", "cancelado"];
export const EVENT_COSTS = { gratuito: "Gratuito", cuota: "Cuota de recuperación", variable: "Precios variables" };
// Campos que solo aplican a ciertas categorías (en el panel se ocultan en las demás).
export const COST_CATEGORIES = ["bazares", "talleres", "especiales"];
export const REQUIREMENT_CATEGORIES = ["entregas", "talleres", "campanas"];

// México no tiene horario de verano desde 2022: la hora del centro es UTC−6 todo el año.
export const MEXICO_OFFSET = "-06:00";
const MEXICO_OFFSET_MS = -6 * 60 * 60 * 1000;

/** "AAAA-MM-DD" del día en México de una fecha. */
export function mexicoDay(date) {
  return new Date(new Date(date).getTime() + MEXICO_OFFSET_MS).toISOString().slice(0, 10);
}

/** Inicio del día (en México) como instante UTC. */
export const startOfMexicoDay = (day) => new Date(`${day}T00:00:00${MEXICO_OFFSET}`);

const validDate = (value) => {
  if (typeof value !== "string") return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

/**
 * En qué momento está el evento: "proximo", "en-curso" o "realizado". Sin hora de término, el
 * evento dura hasta el final de su día (en México).
 */
export function eventTiming({ startDate, endDate }, now = new Date()) {
  const start = validDate(startDate);
  if (!start) return "proximo";
  const end = validDate(endDate) ?? new Date(startOfMexicoDay(mexicoDay(start)).getTime() + 24 * 60 * 60 * 1000 - 1);
  if (now < start) return "proximo";
  return now <= end ? "en-curso" : "realizado";
}

function eventTags(item) {
  const tags = [];
  if (COST_CATEGORIES.includes(item.category) && item.costType === "gratuito") tags.push("Gratuito");
  if (item.audience === "publico") tags.push("Abierto al público");
  if (item.limitedCapacity === true) tags.push("Cupo limitado");
  if (httpsUrl(item.registrationUrl)) tags.push("Registro necesario");
  return tags;
}

/** Cifras de resultados (cifra + etiqueta), sin vacías. */
const mapResults = (results) => (Array.isArray(results) ? results : [])
  .map((result) => ({ value: text(result?.value), label: text(result?.label) }))
  .filter((result) => result.value && result.label);

function mapSummary(item, { mediaOrigin, now }) {
  if (typeof item?.slug !== "string" || !EVENT_SLUG.test(item.slug)) throw new Error("Evento con slug inválido");
  const start = validDate(item.startDate);
  if (!start) throw new Error("Evento sin fecha de inicio válida");
  const end = validDate(item.endDate);
  const category = Object.hasOwn(EVENT_CATEGORIES, item.category) ? item.category : "especiales";
  const timing = eventTiming({ startDate: item.startDate, endDate: item.endDate }, now);
  return {
    title: text(item.title),
    slug: item.slug,
    category,
    audience: Object.hasOwn(EVENT_AUDIENCES, item.audience) ? item.audience : "publico",
    startDate: start.toISOString(),
    endDate: end && end > start ? end.toISOString() : "",
    status: EVENT_STATUSES.includes(item.eventStatus) ? item.eventStatus : "programado",
    statusNote: text(item.statusNote),
    featured: item.featured === true,
    summary: text(item.summary),
    locationName: text(item.locationName),
    coverImage: mapImage(item.coverImage, mediaOrigin),
    tags: eventTags({ ...item, category }),
    timing,
    // La primera cifra se muestra en la tarjeta de un evento ya realizado.
    highlight: timing === "realizado" ? mapResults(item.results)[0] ?? null : null,
  };
}

export function mapStrapiEventList(payload, { mediaOrigin, now = new Date(), scope = "proximos", category = null, month = null, page = 1, pageCount = 1, total = 0 } = {}) {
  const data = payload?.data;
  if (!Array.isArray(data)) throw new Error("Eventos no disponibles en Strapi");
  return { items: data.map((item) => mapSummary(item, { mediaOrigin, now })), scope, category, month, page, pageCount, total };
}

export function mapStrapiEvent(payload, { mediaOrigin, now = new Date() } = {}) {
  const data = payload?.data;
  if (!data || typeof data !== "object") throw new Error("Evento no disponible en Strapi");
  for (const key of ["coverImage", "gallery", "requirements", "results"]) {
    if (!(key in data)) throw new Error(`Falta populate de ${key}`);
  }
  const summary = mapSummary(data, { mediaOrigin, now });
  const withCost = COST_CATEGORIES.includes(summary.category);
  const done = summary.timing === "realizado";
  return {
    ...summary,
    address: text(data.address),
    // Solo enlaces https a Google Maps.
    mapsUrl: /^https:\/\/(www\.)?(google\.[a-z.]+\/maps|maps\.google\.[a-z.]+|maps\.app\.goo\.gl|goo\.gl\/maps)/.test(httpsUrl(data.mapsUrl)) ? httpsUrl(data.mapsUrl) : "",
    description: sanitizeRichText(Array.isArray(data.description) ? data.description : []),
    organizers: text(data.organizers),
    registrationUrl: httpsUrl(data.registrationUrl),
    contactPhone: text(data.contactPhone).replace(/[^\d+ ]/g, ""),
    cost: withCost && Object.hasOwn(EVENT_COSTS, data.costType) ? { type: data.costType, details: text(data.priceDetails) } : null,
    requirements: REQUIREMENT_CATEGORIES.includes(summary.category) ? mapList(data.requirements) : [],
    // Resultados, reseña y fotos: solo cuando el evento ya pasó.
    results: done ? mapResults(data.results) : [],
    resultsSummary: done ? text(data.resultsSummary) : "",
    gallery: done ? (Array.isArray(data.gallery) ? data.gallery : []).map((image) => mapImage(image, mediaOrigin, { size: "large" })).filter(Boolean) : [],
  };
}

/** URLs de medios del resultado, para validar su origen en el servidor. */
export const eventMediaUrls = (content) => [
  ...(content.items ?? [content]).map((item) => item.coverImage?.src),
  ...(content.gallery ?? []).map((image) => image.src),
].filter(Boolean);

export { safeContentUrl };
