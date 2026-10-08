/** Contrato de los datos globales del sitio (contacto, redes, cifras, SEO). */
import { mapHeading, mapImage, mapLink, requireDocument, safeContentUrl, text } from "./core.js";

export const LOADING_BAR_COLORS = ["marca", "verde", "amarillo", "rojo"];
export const SOCIAL_NETWORKS = ["facebook", "instagram", "youtube", "tiktok", "x", "whatsapp", "linkedin"];
export const SEO_PAGES = ["inicio", "programas", "contacto", "nosotros", "donar", "preguntas", "beneficiarios", "apadrinamiento"];
const IMPACT_FIELDS = ["familiesPerMonth", "foodKgPerMonth", "municipalities", "communityGroups", "deliveryPoints", "foundedYear"];

/** Solo URLs absolutas https: un enlace externo nunca debe ser relativo ni otro protocolo. */
export function httpsUrl(value) {
  const url = safeContentUrl(value);
  return url.startsWith("https://") ? url : "";
}

/** Solo el mapa embebido de Google: es lo único que se permite dentro del iframe. */
export function mapsEmbedUrl(value) {
  const url = httpsUrl(value);
  if (!url) return "";
  const parsed = new URL(url);
  return parsed.origin === "https://www.google.com" && parsed.pathname.startsWith("/maps/embed") ? url : "";
}

/** Aliados (colección): logo, nombre y enlace opcional, en el orden que fija el editor. */
export function mapStrapiPartners(payload, { mediaOrigin } = {}) {
  const data = payload?.data;
  if (!Array.isArray(data)) throw new Error("Aliados no disponibles en Strapi");
  const partners = data
    .map((item) => ({ name: text(item?.name), logo: mapImage(item?.logo, mediaOrigin), url: httpsUrl(item?.url),
      order: Number.isInteger(item?.order) ? item.order : 0 }))
    .filter((partner) => partner.logo)
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name, "es"))
    .map((partner) => ({ name: partner.name, logo: partner.logo, url: partner.url }));
  return { partners };
}

export function mapStrapiSite(payload, { mediaOrigin } = {}) {
  const data = requireDocument(payload, "Datos del sitio");
  for (const relation of ["socialLinks", "impact", "seo", "callToAction", "partners", "pageHeaderImage"]) {
    if (!(relation in data)) throw new Error(`Falta populate de ${relation}`);
  }
  const impact = data.impact;
  if (!impact || IMPACT_FIELDS.some((key) => !Number.isInteger(impact[key]) || impact[key] < 0)) {
    throw new Error("Cifras de impacto incompletas");
  }
  return {
    contact: {
      phone: text(data.phone),
      email: text(data.email),
      socialWorkEmail: text(data.socialWorkEmail),
      schedule: text(data.schedule),
      address: text(data.address),
      city: text(data.city),
      mapsLink: httpsUrl(data.mapsLink),
      mapsEmbedUrl: mapsEmbedUrl(data.mapsEmbedUrl),
      linktreeUrl: httpsUrl(data.linktreeUrl),
    },
    social: (data.socialLinks ?? [])
      .filter((link) => SOCIAL_NETWORKS.includes(link?.network) && httpsUrl(link.url))
      .map((link) => ({ network: link.network, url: httpsUrl(link.url) })),
    impact: Object.fromEntries(IMPACT_FIELDS.map((key) => [key, impact[key]])),
    callToAction: data.callToAction ? {
      eyebrow: text(data.callToAction.eyebrow),
      title: text(data.callToAction.title),
      link: mapLink(data.callToAction.link),
      image: mapImage(data.callToAction.image, mediaOrigin, { size: "large" }),
    } : null,
    // Fondo del título de las páginas internas (Breadcrumb).
    pageHeaderImage: mapImage(data.pageHeaderImage, mediaOrigin, { size: "large" }),
    // Pantalla de carga: el sitio la recuerda en el navegador para la siguiente visita.
    loadingScreen: {
      image: mapImage(data.loadingScreen?.image, mediaOrigin, { size: "medium" }),
      barColors: LOADING_BAR_COLORS.includes(data.loadingScreen?.barColors) ? data.loadingScreen.barColors : "marca",
    },
    // Encabezado de la sección de aliados; los logos viven en la colección "Aliados".
    partners: data.partners ? { heading: mapHeading(data.partners.heading) } : null,
    seo: Object.fromEntries((data.seo ?? [])
      .filter((entry) => SEO_PAGES.includes(entry?.page))
      .map((entry) => [entry.page, { title: text(entry.title), description: text(entry.description) }])),
  };
}
