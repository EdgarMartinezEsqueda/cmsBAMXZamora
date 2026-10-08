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

/** [{ key, query? }] de una ruta del sitio; [] si no es una ruta con contenido. */
export function contentForPath(pathname, search = "") {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  if (Object.hasOwn(FIXED, path)) return FIXED[path].map((key) => ({ key }));
  if (path === "/boletines") {
    const params = new URLSearchParams(search);
    return [{ key: "newsletters", query: { year: params.get("year") ?? undefined, page: params.get("page") ?? undefined } }];
  }
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
