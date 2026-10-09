/** Contrato de Inicio compartido entre Strapi y React. Sin dependencias del navegador. */
import { externalUrl, mapCards, mapHeading, mapImage, mapLink, mapList, pickImageFormat, requireDocument, resolveMediaUrl, safeContentUrl, text } from "./core.js";
import { iconKey } from "./icons.js";

export const STAT_SOURCES = ["texto", "familias", "kilos", "grupos", "municipios"];
// Secciones de Inicio además del Hero. Cada una es opcional: null → la sección no se pinta.
const SECTIONS = ["about", "process", "programsIntro", "impactSection", "instagram", "newsletterIntro"];

const mapSection = {
  about: (section, { mediaOrigin }) => ({
    heading: mapHeading(section.heading),
    features: mapCards(section.features),
    achievementsTitle: text(section.achievementsTitle),
    achievements: mapList(section.achievements),
    primaryLink: mapLink(section.primaryLink),
    secondaryLink: mapLink(section.secondaryLink),
    image: mapImage(section.image, mediaOrigin),
    videoUrl: externalUrl(section.videoUrl),
    videoLabel: text(section.videoLabel),
  }),
  process: (section) => ({
    heading: mapHeading(section.heading),
    steps: (Array.isArray(section.steps) ? section.steps : []).map((step) => ({
      title: text(step?.title),
      description: text(step?.description),
      statSource: STAT_SOURCES.includes(step?.statSource) ? step.statSource : "texto",
      statText: text(step?.statText),
      link: safeContentUrl(step?.link),
      icon: iconKey(step?.icon),
    })).filter((step) => step.title),
    summaryEyebrow: text(section.summaryEyebrow),
    summaryTitle: text(section.summaryTitle),
    summaryText: text(section.summaryText),
  }),
  programsIntro: (section) => ({
    heading: mapHeading(section.heading),
    ctaTitle: text(section.ctaTitle),
    ctaText: text(section.ctaText),
    primaryLink: mapLink(section.primaryLink),
    secondaryLink: mapLink(section.secondaryLink),
  }),
  impactSection: (section) => ({
    heading: mapHeading(section.heading),
    helpTitle: text(section.helpTitle),
    helpSubtitle: text(section.helpSubtitle),
    statsTitle: text(section.statsTitle),
    statsSubtitle: text(section.statsSubtitle),
    closingText: text(section.closingText),
    primaryLink: mapLink(section.primaryLink),
    secondaryLink: mapLink(section.secondaryLink),
  }),
  instagram: (section) => mapHeading(section),
  newsletterIntro: (section) => ({
    heading: mapHeading(section.heading),
    title: mapHeading(section.title),
    description: text(section.description),
    featuresTitle: text(section.featuresTitle),
    features: mapList(section.features),
  }),
};

export { safeContentUrl };

/** Mappers de las secciones de Inicio, reutilizados como bloques de las Páginas. */
export const mapHomeSection = mapSection;

/** Portada con diapositivas (sections.hero): la usan Inicio y el bloque de Páginas. */
export function mapHero(hero, { mediaOrigin } = {}) {
  if (!Array.isArray(hero?.slides)) throw new Error("Falta populate de hero.slides");
  // El teléfono de ayuda no es del Hero: sale de "Datos del sitio" (una sola fuente).
  const textFields = ["primaryLabel", "secondaryLabel", "supportTitle", "supportDescription",
    "previousLabel", "nextLabel"];
  const mapped = Object.fromEntries(textFields.map((key) => [key, text(hero[key])]));
  mapped.primaryLink = safeContentUrl(hero.primaryLink);
  mapped.secondaryLink = safeContentUrl(hero.secondaryLink);
  mapped.slides = hero.slides.map((slide) => {
    if (!safeContentUrl(slide.image?.url)) {
      throw new Error("Diapositiva sin imagen válida: revisar populate y publicación");
    }
    return {
      id: slide.id,
      // Portada a todo lo ancho: la versión más grande.
      image: resolveMediaUrl(pickImageFormat(slide.image, "large"), mediaOrigin),
      ...Object.fromEntries(["badge", "headingLead", "headingHighlight", "description",
        "statNumber", "statLabel"].map((key) => [key, text(slide[key])])),
      iconKey: iconKey(slide.iconKey) ?? "",
    };
  });
  return mapped;
}

/** Convierte la respuesta REST de Strapi 5 al contrato visual, sin defaults editoriales. */
export function mapStrapiHome(payload, { mediaOrigin } = {}) {
  const data = requireDocument(payload, "Inicio");
  for (const key of ["hero", ...SECTIONS]) {
    if (!(key in data)) throw new Error(`Falta populate de ${key}`);
  }
  const sections = Object.fromEntries(SECTIONS.map((key) =>
    [key, data[key] ? mapSection[key](data[key], { mediaOrigin }) : null]));
  if (data.hero === null) return { hero: null, ...sections };
  return { hero: mapHero(data.hero, { mediaOrigin }), ...sections };
}
