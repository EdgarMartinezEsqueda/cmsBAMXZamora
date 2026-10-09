/** Contrato de la página Nosotros. Cada sección es opcional: null → no se pinta. */
import { externalUrl, mapCards, mapFeatures, mapHeading, mapImage, mapLink, requireDocument, text } from "./core.js";
import { iconKey } from "./icons.js";

const SECTIONS = ["intro", "history", "approach", "coverage", "programsIntro", "networks"];
const count = (value) => Number.isInteger(value) && value >= 0 ? value : 0;

const mapSection = {
  intro: (section, mediaOrigin) => ({
    heading: mapHeading(section.heading),
    tabs: mapFeatures(section.tabs),
    images: (Array.isArray(section.images) ? section.images : []).map((image) => mapImage(image, mediaOrigin)).filter(Boolean),
    videoImage: mapImage(section.videoImage, mediaOrigin),
    videoUrl: externalUrl(section.videoUrl),
    videoLabel: text(section.videoLabel),
  }),
  history: (section) => ({
    heading: mapHeading(section.heading),
    milestones: (Array.isArray(section.milestones) ? section.milestones : [])
      .map((item) => ({ period: text(item?.period), title: text(item?.title), description: text(item?.description), icon: iconKey(item?.icon) }))
      .filter((item) => item.title),
    ctaTitle: text(section.ctaTitle),
    ctaText: text(section.ctaText),
    link: mapLink(section.link),
  }),
  approach: (section) => ({
    heading: mapHeading(section.heading),
    pillars: mapFeatures(section.pillars),
    quote: text(section.quote),
    quoteAuthor: text(section.quoteAuthor),
  }),
  coverage: (section) => ({
    heading: mapHeading(section.heading),
    mapText: text(section.mapText),
    mapTextSecondary: text(section.mapTextSecondary),
    listIntro: text(section.listIntro),
    closingText: text(section.closingText),
    municipalities: (Array.isArray(section.municipalities) ? section.municipalities : [])
      .map((item) => ({ name: text(item?.name), state: text(item?.state), communities: count(item?.communities),
        families: count(item?.families), isMain: item?.isMain === true }))
      .filter((item) => item.name),
  }),
  programsIntro: (section) => ({
    heading: mapHeading(section.heading),
    ctaTitle: text(section.ctaTitle),
    ctaText: text(section.ctaText),
    primaryLink: mapLink(section.primaryLink),
    secondaryLink: mapLink(section.secondaryLink),
  }),
  networks: (section) => ({
    heading: mapHeading(section.heading),
    types: mapFeatures(section.types),
    joinHeading: mapHeading(section.joinHeading),
    joinSteps: mapCards(section.joinSteps),
    impactTitle: text(section.impactTitle),
    impactText: text(section.impactText),
    link: mapLink(section.link),
    linkHint: text(section.linkHint),
  }),
};

/** Mappers de las secciones de Nosotros, reutilizados como bloques de las Páginas. */
export const mapAboutSection = mapSection;

export function mapStrapiAbout(payload, { mediaOrigin } = {}) {
  const data = requireDocument(payload, "Nosotros");
  for (const key of SECTIONS) {
    if (!(key in data)) throw new Error(`Falta populate de ${key}`);
  }
  return {
    pageTitle: text(data.pageTitle),
    pageSubtitle: text(data.pageSubtitle),
    ...Object.fromEntries(SECTIONS.map((key) => [key, data[key] ? mapSection[key](data[key], mediaOrigin) : null])),
  };
}

/** URLs de medios del resultado, para validar su origen en el servidor. */
export const aboutMediaUrls = (content) => [
  ...(content.intro?.images ?? []).map((image) => image.src),
  content.intro?.videoImage?.src,
].filter(Boolean);
