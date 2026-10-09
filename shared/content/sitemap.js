/** sitemap.xml del sitio: rutas fijas, páginas nuevas y boletines publicados. Sin dependencias. */

// Rutas fijas del sitio (src/App.jsx). Las de contenido llegan publicadas desde Strapi.
export const STATIC_PATHS = ["/", "/nosotros", "/programas", "/beneficiarios", "/apadrinamiento",
  "/donar", "/preguntas", "/contacto", "/boletines", "/eventos"];
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const escapeXml = (value) => value.replace(/[<>&'"]/g, (char) =>
  ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[char]);
const day = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
};

/** pages / newsletters / events: [{ slug, updatedAt }] ya publicados. Un slug inválido se omite. */
export function buildSitemap({ siteUrl, pages = [], newsletters = [], events = [] }) {
  const origin = new URL(siteUrl).origin;
  if (!/^https?:$/.test(new URL(origin).protocol)) throw new Error("SITE_URL inválido");
  const entries = [
    ...STATIC_PATHS.map((path) => ({ path })),
    ...pages.filter((item) => SLUG.test(item?.slug ?? "")).map((item) => ({ path: `/${item.slug}`, lastmod: day(item.updatedAt) })),
    ...newsletters.filter((item) => SLUG.test(item?.slug ?? "")).map((item) => ({ path: `/boletines/${item.slug}`, lastmod: day(item.updatedAt) })),
    ...events.filter((item) => SLUG.test(item?.slug ?? "")).map((item) => ({ path: `/eventos/${item.slug}`, lastmod: day(item.updatedAt) })),
  ];
  const urls = entries.map(({ path, lastmod }) =>
    `  <url><loc>${escapeXml(origin + path)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
}
