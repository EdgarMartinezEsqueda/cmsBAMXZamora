/** Contrato de la colección Programas: una sola fuente para Programas, Inicio, Nosotros y el pie. */
import { mapImage, mapList, safeContentUrl, text } from "./core.js";
import { iconKey } from "./icons.js";
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DRIVE_PREVIEW = /^\/file\/d\/[\w-]+\/preview$/;
const YOUTUBE_EMBED = /^\/embed\/[\w-]+$/;

/**
 * Solo videos que se pueden insertar en un iframe sin riesgo: YouTube (/embed/ID) y
 * Google Drive (/file/d/ID/preview). Cualquier otra URL se descarta.
 */
export function embedVideoUrl(value) {
  const url = safeContentUrl(value);
  if (!url.startsWith("https://")) return "";
  const { hostname, pathname } = new URL(url);
  if (["www.youtube.com", "www.youtube-nocookie.com"].includes(hostname) && YOUTUBE_EMBED.test(pathname)) return url;
  if (hostname === "drive.google.com" && DRIVE_PREVIEW.test(pathname)) return url;
  return "";
}

export function mapStrapiPrograms(payload, { mediaOrigin } = {}) {
  const data = payload?.data;
  if (!Array.isArray(data)) throw new Error("Programas no disponibles en Strapi");
  const programs = data.map((item) => {
    for (const relation of ["image", "highlights", "keyPoints", "faqs"]) {
      if (!(relation in item)) throw new Error(`Falta populate de ${relation}`);
    }
    if (typeof item.slug !== "string" || !SLUG.test(item.slug)) throw new Error("Programa con slug inválido");
    return {
      slug: item.slug,
      title: text(item.title),
      shortTitle: text(item.shortTitle),
      category: item.category === "campana" ? "campana" : "programa",
      icon: iconKey(item.icon) ?? "",
      summary: text(item.summary),
      description: text(item.description),
      image: mapImage(item.image, mediaOrigin),
      videoUrl: embedVideoUrl(item.videoUrl),
      badge: text(item.badge),
      period: text(item.period),
      highlights: mapList(item.highlights),
      keyPoints: mapList(item.keyPoints),
      faqs: (item.faqs ?? []).map((faq) => ({ question: text(faq?.question), answer: text(faq?.answer) }))
        .filter((faq) => faq.question && faq.answer),
      order: Number.isInteger(item.order) ? item.order : 0,
      showOnHome: item.showOnHome === true,
      showOnAbout: item.showOnAbout === true,
      showOnProgramsPage: item.showOnProgramsPage === true,
    };
  });
  programs.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, "es"));
  return { programs };
}
