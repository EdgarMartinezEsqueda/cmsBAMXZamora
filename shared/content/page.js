/** Contrato de las páginas creadas desde el panel (colección Páginas, ruta /:slug). */
import { mapAboutSection } from "./about.js";
import { mapHeading, mapImage, mapLink, mapList, requireDocument, safeContentUrl, text } from "./core.js";
import { mapHero, mapHomeSection } from "./hero.js";
import { embedVideoUrl } from "./programs.js";
import { mapsEmbedUrl } from "./site.js";
import { mapSteps } from "./sponsorship.js";

// Mantener sincronizado con RESERVED_SLUGS de cms/src/setup/pages.js (una prueba lo verifica).
export const RESERVED_SLUGS = [
  "inicio", "programas", "contacto", "nosotros", "donar", "preguntas", "beneficiarios", "apadrinamiento",
  "boletines", "paginas", "gestion-bamx", "admin", "api", "uploads", "assets",
];
export const PAGE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const MARKS = ["bold", "italic", "underline", "strikethrough", "code"];

// Opciones de presentación de los bloques de texto: listas cerradas, nunca estilos libres.
export const TEXT_ALIGNS = ["izquierda", "centro", "justificado"];
export const TEXT_COLORS = ["predeterminado", "verde", "amarillo", "rojo", "gris"];
const textStyle = (block) => ({
  align: TEXT_ALIGNS.includes(block?.align) ? block.align : "izquierda",
  color: TEXT_COLORS.includes(block?.color) ? block.color : "predeterminado",
});

/** Texto e hipervínculos permitidos dentro de un bloque. Un enlace inseguro conserva su texto. */
function sanitizeInlines(nodes) {
  return (Array.isArray(nodes) ? nodes : []).flatMap((node) => {
    if (node?.type === "text") {
      const marks = Object.fromEntries(MARKS.filter((mark) => node[mark] === true).map((mark) => [mark, true]));
      return [{ type: "text", text: text(node.text), ...marks }];
    }
    if (node?.type === "link") {
      const children = sanitizeInlines(node.children);
      const url = safeContentUrl(node.url);
      return url ? [{ type: "link", url, children }] : children;
    }
    return [];
  });
}

/**
 * Texto enriquecido de Strapi (campo "blocks") reducido a una lista cerrada de nodos:
 * párrafos, títulos 2–4 (el 1 es el título de la página), listas, citas, formato y enlaces.
 * Todo lo demás (imágenes sueltas, código, nodos desconocidos) se descarta. Nunca HTML.
 */
export function sanitizeRichText(blocks) {
  return (Array.isArray(blocks) ? blocks : []).flatMap((block) => {
    switch (block?.type) {
      case "paragraph":
      case "quote":
        return [{ type: block.type, children: sanitizeInlines(block.children) }];
      case "heading":
        return [{ type: "heading", level: Math.min(4, Math.max(2, Number(block.level) || 2)), children: sanitizeInlines(block.children) }];
      case "list":
        return [{
          type: "list",
          format: block.format === "ordered" ? "ordered" : "unordered",
          children: (Array.isArray(block.children) ? block.children : [])
            .filter((item) => item?.type === "list-item")
            .map((item) => ({ type: "list-item", children: sanitizeInlines(item.children) })),
        }];
      default:
        return [];
    }
  });
}

const mapBlock = {
  // Un bloque de texto son varias secciones, cada una con su alineación y color.
  "blocks.rich-text": (block) => {
    const parts = (Array.isArray(block.parts) ? block.parts : [])
      .map((part) => ({ body: sanitizeRichText(Array.isArray(part?.body) ? part.body : []), ...textStyle(part) }))
      .filter((part) => part.body.length > 0);
    return parts.length > 0 ? { type: "rich-text", parts } : null;
  },
  "blocks.text-image": (block, mediaOrigin) => ({
    type: "text-image",
    title: text(block.title),
    body: sanitizeRichText(block.body),
    image: mapImage(block.image, mediaOrigin),
    imagePosition: block.imagePosition === "izquierda" ? "izquierda" : "derecha",
    ...textStyle(block),
  }),
  "blocks.gallery": (block, mediaOrigin) => ({
    type: "gallery",
    title: text(block.title),
    images: (Array.isArray(block.images) ? block.images : []).map((image) => mapImage(image, mediaOrigin)).filter(Boolean),
  }),
  "blocks.faq": (block) => ({
    type: "faq",
    title: text(block.title),
    items: (Array.isArray(block.items) ? block.items : [])
      .map((item) => ({ question: text(item?.question), answer: text(item?.answer) }))
      .filter((item) => item.question && item.answer),
  }),
  "blocks.cta": (block) => ({ type: "cta", title: text(block.title), text: text(block.text), link: mapLink(block.link) }),

  // Secciones del sitio reutilizadas como bloques: mismo componente de Strapi, mismo mapper.
  "sections.hero": (block, mediaOrigin) => ({ type: "hero", ...mapHero(block, { mediaOrigin }) }),
  "home.about": (block, mediaOrigin) => ({ type: "presentation", ...mapHomeSection.about(block, { mediaOrigin }) }),
  "home.process": (block) => ({ type: "process", ...mapHomeSection.process(block) }),
  "home.impact": (block) => ({ type: "impact", ...mapHomeSection.impactSection(block) }),
  "home.programs-intro": (block) => ({ type: "programs", ...mapHomeSection.programsIntro(block) }),
  "home.newsletter": (block) => ({ type: "newsletter", ...mapHomeSection.newsletterIntro(block) }),
  "about.history": (block) => ({ type: "timeline", ...mapAboutSection.history(block) }),
  "about.approach": (block) => ({ type: "pillars", ...mapAboutSection.approach(block) }),
  "about.intro": (block, mediaOrigin) => ({ type: "tabs", ...mapAboutSection.intro(block, mediaOrigin) }),
  "about.networks": (block) => ({ type: "join", ...mapAboutSection.networks(block) }),
  "about.coverage": (block) => ({ type: "coverage", ...mapAboutSection.coverage(block) }),
  "blocks.programs-detail": (block) => ({ type: "programs-detail", ...mapAboutSection.programsIntro(block) }),
  "blocks.social": (block) => ({ type: "social", heading: mapHeading(block.heading) }),
  // Sin datos propios: la banda global y lo mismo que la página Donar.
  "blocks.site-cta": () => ({ type: "site-cta" }),
  "blocks.donate": () => ({ type: "donate" }),

  // Aliados: sin datos propios, usa los de "Datos del sitio".
  "blocks.partners": () => ({ type: "partners" }),
  "blocks.steps": (block, mediaOrigin) => ({
    type: "steps",
    heading: mapHeading(block.heading),
    listTitle: text(block.listTitle),
    list: mapList(block.list),
    stepsTitle: text(block.stepsTitle),
    steps: mapSteps(block.steps, mediaOrigin),
  }),
  // Video o mapa: solo direcciones de la lista blanca (YouTube /embed/, Drive /preview, Google
  // Maps /maps/embed). Cualquier otra → el bloque no se pinta (null).
  "blocks.embed": (block) => {
    const kind = block.kind === "mapa" ? "mapa" : "video";
    const url = kind === "mapa" ? mapsEmbedUrl(block.url) : embedVideoUrl(block.url);
    return url ? { type: "embed", kind, url, title: text(block.title) } : null;
  },
};

export function mapStrapiPage(payload, { mediaOrigin } = {}) {
  const data = requireDocument(payload, "Página");
  if (!("body" in data)) throw new Error("Falta populate de body");
  if (typeof data.slug !== "string" || !PAGE_SLUG.test(data.slug)) throw new Error("Página con slug inválido");
  return {
    pageTitle: text(data.title),
    pageSubtitle: text(data.subtitle),
    slug: data.slug,
    seo: { title: text(data.seoTitle) || text(data.title), description: text(data.seoDescription) },
    blocks: (Array.isArray(data.body) ? data.body : [])
      .filter((block) => Object.hasOwn(mapBlock, block?.__component))
      .map((block) => mapBlock[block.__component](block, mediaOrigin))
      .filter(Boolean),
  };
}

/** URLs de medios del resultado, para validar su origen en el servidor. */
export const pageMediaUrls = (content) => content.blocks.flatMap((block) => {
  switch (block.type) {
    case "text-image":
    case "presentation": return block.image ? [block.image.src] : [];
    case "gallery": return block.images.map((image) => image.src);
    case "hero": return block.slides.map((slide) => slide.image);
    case "tabs": return [...block.images.map((image) => image.src), block.videoImage?.src].filter(Boolean);
    case "steps": return block.steps.map((step) => step.image.src);
    default: return [];
  }
});
