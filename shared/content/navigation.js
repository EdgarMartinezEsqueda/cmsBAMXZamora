/** Contrato del menú principal y del pie de página (single type "Menú y pie de página"). */
import { mapLink, requireDocument, text } from "./core.js";

// mapLink descarta enlaces sin texto o con dirección insegura: solo rutas internas y https.
const links = (items) => (Array.isArray(items) ? items : []).map(mapLink).filter(Boolean);

export function mapStrapiNavigation(payload) {
  const data = requireDocument(payload, "Menú y pie de página");
  for (const key of ["menuLinks", "footerLinks"]) {
    if (!(key in data)) throw new Error(`Falta populate de ${key}`);
  }
  return {
    menu: { links: links(data.menuLinks), donateButton: mapLink(data.donateButton) },
    footer: {
      programsTitle: text(data.footerProgramsTitle),
      linksTitle: text(data.footerLinksTitle),
      links: links(data.footerLinks),
      locationTitle: text(data.footerLocationTitle),
      contactLabel: text(data.footerContactLabel),
      socialText: text(data.footerSocialText),
      membershipText: text(data.footerMembershipText),
      copyright: text(data.footerCopyright),
    },
  };
}
