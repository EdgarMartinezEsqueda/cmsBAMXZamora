/** Contrato de la página Preguntas frecuentes. */
import { mapHeading, mapLink, requireDocument, text } from "./core.js";

export const FAQ_CATEGORIES = ["general", "donacion", "beneficiario", "voluntario"];

export function mapStrapiFaq(payload) {
  const data = requireDocument(payload, "Preguntas frecuentes");
  for (const key of ["heading", "entries", "link"]) {
    if (!(key in data)) throw new Error(`Falta populate de ${key}`);
  }
  return {
    pageTitle: text(data.pageTitle),
    pageSubtitle: text(data.pageSubtitle),
    heading: mapHeading(data.heading),
    entries: (Array.isArray(data.entries) ? data.entries : [])
      .map((entry) => ({
        question: text(entry?.question),
        answer: text(entry?.answer),
        category: FAQ_CATEGORIES.includes(entry?.category) ? entry.category : "general",
      }))
      .filter((entry) => entry.question && entry.answer),
    ctaTitle: text(data.ctaTitle),
    ctaText: text(data.ctaText),
    link: mapLink(data.link),
  };
}
