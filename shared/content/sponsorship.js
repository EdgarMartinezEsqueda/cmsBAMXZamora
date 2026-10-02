/** Contratos de Beneficiarios, Apadrinamiento y el catálogo de casos. */
import { mapCards, mapHeading, mapImage, mapLink, mapList, requireDocument, text } from "./core.js";

function requirePopulate(data, keys) {
  for (const key of keys) {
    if (!(key in data)) throw new Error(`Falta populate de ${key}`);
  }
}

/** Pasos con imagen (shared.step-image): un paso sin imagen no entra al carrusel. */
export const mapSteps = (steps, mediaOrigin) => (Array.isArray(steps) ? steps : [])
  .map((step) => ({ title: text(step?.title), description: text(step?.description), image: mapImage(step?.image, mediaOrigin) }))
  .filter((step) => step.title && step.image);

export function mapStrapiBeneficiaries(payload, { mediaOrigin } = {}) {
  const data = requireDocument(payload, "Beneficiarios");
  requirePopulate(data, ["heading", "documents", "steps", "galleryHeading", "gallery"]);
  return {
    pageTitle: text(data.pageTitle),
    pageSubtitle: text(data.pageSubtitle),
    heading: mapHeading(data.heading),
    documentsTitle: text(data.documentsTitle),
    documents: mapList(data.documents),
    stepsTitle: text(data.stepsTitle),
    steps: mapSteps(data.steps, mediaOrigin),
    galleryHeading: mapHeading(data.galleryHeading),
    gallery: (Array.isArray(data.gallery) ? data.gallery : []).map((image) => mapImage(image, mediaOrigin)).filter(Boolean),
  };
}

export function mapStrapiSponsorship(payload, { mediaOrigin } = {}) {
  const data = requireDocument(payload, "Apadrinamiento");
  requirePopulate(data, ["heading", "includes", "steps", "objectives", "catalogHeading", "catalogLink"]);
  return {
    pageTitle: text(data.pageTitle),
    pageSubtitle: text(data.pageSubtitle),
    heading: mapHeading(data.heading),
    includesTitle: text(data.includesTitle),
    includes: mapList(data.includes),
    stepsTitle: text(data.stepsTitle),
    steps: mapSteps(data.steps, mediaOrigin),
    objectivesTitle: text(data.objectivesTitle),
    objectives: mapCards(data.objectives),
    catalogHeading: mapHeading(data.catalogHeading),
    catalogCtaTitle: text(data.catalogCtaTitle),
    catalogCtaText: text(data.catalogCtaText),
    catalogLink: mapLink(data.catalogLink),
  };
}

/**
 * Catálogo de casos: solo imagen y texto alternativo. Nada más sale a la web (ni nombre interno
 * ni fechas). El servidor ya filtra; aquí se vuelve a exigir consentimiento y vigencia.
 */
export function mapStrapiSponsoredCases(payload, { mediaOrigin, today } = {}) {
  const data = payload?.data;
  if (!Array.isArray(data)) throw new Error("Casos de apadrinamiento no disponibles en Strapi");
  if (typeof today !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(today)) throw new Error("Falta la fecha de hoy");
  const cases = data
    .filter((item) => item?.consent === true && typeof item.validUntil === "string" && item.validUntil.slice(0, 10) >= today)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((item) => {
      const image = mapImage(item.image, mediaOrigin);
      return image ? { src: image.src, alt: text(item.alt) } : null;
    })
    .filter(Boolean);
  return { cases };
}
