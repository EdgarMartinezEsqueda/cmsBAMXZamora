/** Contratos de páginas con pocos textos: Contacto y Programas (los programas van aparte). */
import { mapHeading, mapLink, requireDocument, text } from "./core.js";

export function mapStrapiContactPage(payload) {
  const data = requireDocument(payload, "Contacto");
  if (!("heading" in data)) throw new Error("Falta populate de heading");
  return {
    pageTitle: text(data.pageTitle),
    pageSubtitle: text(data.pageSubtitle),
    heading: mapHeading(data.heading),
    formTitle: text(data.formTitle),
    formIntro: text(data.formIntro),
  };
}

export function mapStrapiProgramsPage(payload) {
  const data = requireDocument(payload, "Programas");
  for (const key of ["heading", "detailLink"]) {
    if (!(key in data)) throw new Error(`Falta populate de ${key}`);
  }
  return {
    pageTitle: text(data.pageTitle),
    pageSubtitle: text(data.pageSubtitle),
    heading: mapHeading(data.heading),
    listTitle: text(data.listTitle),
    listIntro: text(data.listIntro),
    helpTitle: text(data.helpTitle),
    helpText: text(data.helpText),
    detailCtaTitle: text(data.detailCtaTitle),
    detailCtaText: text(data.detailCtaText),
    detailLink: mapLink(data.detailLink),
  };
}
