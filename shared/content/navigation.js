/** Contrato del menú principal y del pie de página (single type "Menú y pie de página"). */
import { mapLink, requireDocument, text } from "./core.js";

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// mapLink descarta enlaces sin texto o con dirección insegura: solo rutas internas y https.
const links = (items) => (Array.isArray(items) ? items : []).map(mapLink).filter(Boolean);

export function mapStrapiNavigation(payload) {
  const data = requireDocument(payload, "Menú y pie de página");
  for (const key of ["menuLinks", "footerLinks", "footerPrograms"]) {
    if (!(key in data)) throw new Error(`Falta populate de ${key}`);
  }
  return {
    menu: { links: links(data.menuLinks), donateButton: mapLink(data.donateButton) },
    footer: {
      programsTitle: text(data.footerProgramsTitle),
      // Programas elegidos en el panel, en su orden; enlazan a su ficha en /programas.
      programs: (Array.isArray(data.footerPrograms) ? data.footerPrograms : [])
        .filter((program) => typeof program?.slug === "string" && SLUG.test(program.slug))
        .map((program) => ({ label: text(program.shortTitle) || text(program.title), url: `/programas#${program.slug}` }))
        .filter((program) => program.label),
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
