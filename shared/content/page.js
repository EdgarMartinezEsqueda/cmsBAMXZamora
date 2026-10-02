/** Contrato de las páginas creadas desde el panel (colección Páginas, ruta /:slug). */
import { mapImage, mapLink, requireDocument, safeContentUrl, text } from "./core.js";

// Mantener sincronizado con RESERVED_SLUGS de cms/src/setup/pages.js (una prueba lo verifica).
export const RESERVED_SLUGS = [
  "inicio", "programas", "contacto", "nosotros", "donar", "preguntas", "beneficiarios", "apadrinamiento",
  "boletines", "paginas", "gestion-bamx", "admin", "api", "uploads", "assets",
];
export const PAGE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const MARKS = ["bold", "italic", "underline", "strikethrough", "code"];

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
  "blocks.rich-text": (block) => ({ type: "rich-text", body: sanitizeRichText(block.body) }),
  "blocks.text-image": (block, mediaOrigin) => ({
    type: "text-image",
    title: text(block.title),
    body: sanitizeRichText(block.body),
    image: mapImage(block.image, mediaOrigin),
    imagePosition: block.imagePosition === "izquierda" ? "izquierda" : "derecha",
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
      .map((block) => mapBlock[block.__component](block, mediaOrigin)),
  };
}

/** URLs de medios del resultado, para validar su origen en el servidor. */
export const pageMediaUrls = (content) => content.blocks.flatMap((block) =>
  block.type === "text-image" ? (block.image ? [block.image.src] : [])
    : block.type === "gallery" ? block.images.map((image) => image.src) : []);
