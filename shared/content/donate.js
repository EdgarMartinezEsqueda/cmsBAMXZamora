/** Contrato de la página Donar (textos). Los datos bancarios van aparte: shared/content/bank.js. */
import { externalUrl, mapCards, mapHeading, mapList, requireDocument, text } from "./core.js";

export function mapStrapiDonate(payload) {
  const data = requireDocument(payload, "Donar");
  for (const key of ["heading", "onlineLinks", "safetyPoints", "closingTaglines"]) {
    if (!(key in data)) throw new Error(`Falta populate de ${key}`);
  }
  return {
    pageTitle: text(data.pageTitle),
    pageSubtitle: text(data.pageSubtitle),
    heading: mapHeading(data.heading),
    methodsTitle: text(data.methodsTitle),
    methodsIntro: text(data.methodsIntro),
    // Donaciones en línea: solo enlaces externos https (PayPal, etc.), nunca rutas internas.
    onlineLinks: (Array.isArray(data.onlineLinks) ? data.onlineLinks : [])
      .map((link) => ({ label: text(link?.label), url: externalUrl(link?.url) }))
      .filter((link) => link.label && link.url),
    onlineEmptyText: text(data.onlineEmptyText),
    missionTitle: text(data.missionTitle),
    missionText: text(data.missionText),
    missionTextSecondary: text(data.missionTextSecondary),
    safetyTitle: text(data.safetyTitle),
    safetyPoints: mapCards(data.safetyPoints),
    closingTitle: text(data.closingTitle),
    closingText: text(data.closingText),
    closingTaglines: mapList(data.closingTaglines),
  };
}
