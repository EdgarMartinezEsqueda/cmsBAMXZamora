import { EVENT_CATEGORIES, mexicoDay } from "../../shared/content/events.js";
import { PAGE_SLUG, RESERVED_SLUGS } from "../../shared/content/page.js";
import { contentUrl, requestContent } from "./cmsStore.js";

// Lo que necesita cada página, para pedirlo en paralelo con los datos globales (en vez de
// esperar a que estos terminen). Mantener sincronizado con las claves que usa cada página.
export const GLOBAL_KEYS = ["site", "programs", "partners", "navigation"];
const FIXED = {
  "/": ["home", "newsletters"],
  "/nosotros": ["about"],
  "/programas": ["programsPage"],
  "/contacto": ["contactPage"],
  "/preguntas": ["faq"],
  "/donar": ["donate", "bank"],
  "/beneficiarios": ["beneficiaries"],
  "/apadrinamiento": ["sponsorship", "sponsoredCases"],
};
const NEWSLETTER = /^\/boletines\/([a-z0-9]+(?:-[a-z0-9]+)*)$/;
const EVENT = /^\/eventos\/([a-z0-9]+(?:-[a-z0-9]+)*)$/;

/**
 * Filtros de /eventos a partir de la dirección (?ver=realizados&categoria=bazares&pagina=2&mes=2026-10).
 * La página y la precarga usan estas mismas consultas, así la petición se comparte.
 */
export function eventsView(search = "", now = new Date()) {
  const params = new URLSearchParams(search);
  const scope = params.get("ver") === "realizados" ? "realizados" : "proximos";
  const category = Object.hasOwn(EVENT_CATEGORIES, params.get("categoria") ?? "") ? params.get("categoria") : undefined;
  const page = /^[1-9]\d{0,2}$/.test(params.get("pagina") ?? "") ? params.get("pagina") : undefined;
  const month = /^20\d{2}-(0[1-9]|1[0-2])$/.test(params.get("mes") ?? "") ? params.get("mes") : mexicoDay(now).slice(0, 7);
  return {
    scope, category, page, month,
    listQuery: { scope, category, page },
    calendarQuery: { month, category },
  };
}

/** [{ key, query? }] de una ruta del sitio; [] si no es una ruta con contenido. */
export function contentForPath(pathname, search = "") {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  if (Object.hasOwn(FIXED, path)) return FIXED[path].map((key) => ({ key }));
  if (path === "/boletines") {
    const params = new URLSearchParams(search);
    return [{ key: "newsletters", query: { year: params.get("year") ?? undefined, page: params.get("page") ?? undefined } }];
  }
  if (path === "/eventos") {
    const view = eventsView(search);
    return [{ key: "events", query: view.listQuery }, { key: "events", query: view.calendarQuery }];
  }
  const event = EVENT.exec(path);
  if (event) return [{ key: `events/${event[1]}` }];
  const newsletter = NEWSLETTER.exec(path);
  if (newsletter) return [{ key: `newsletters/${newsletter[1]}` }];
  const slug = path.slice(1);
  if (PAGE_SLUG.test(slug) && !RESERVED_SLUGS.includes(slug)) return [{ key: `pages/${slug}` }];
  return [];
}

/** Empieza a pedir los datos globales y los de la ruta. No espera: solo calienta la caché. */
export function prefetchPath(pathname, search, { globals = false } = {}) {
  const items = [...(globals ? GLOBAL_KEYS.map((key) => ({ key })) : []), ...contentForPath(pathname, search)];
  for (const { key, query } of items) requestContent(contentUrl(key, query));
}
