'use strict';
const { createContactHandler } = require('../../../lib/contact');
const registry = require('../content-registry');
const pages = require('../../../setup/pages');
const { createPreview } = require('../../../lib/preview');
const { contentCache } = require('../../../lib/content-cache');
const { pathToFileURL } = require('node:url');
const path = require('node:path');

module.exports = ({ strapi }) => {
  const contact = createContactHandler({
    getSettings: () => strapi.documents('api::contact-setting.contact-setting').findFirst({ populate: ['recipients'] }),
  });

  // Permiso de vista previa (?preview=): undefined si no viene, null si no es válido o caducó.
  const readPreviewToken = (token) => {
    if (token === undefined) return undefined;
    return createPreview({ secret: strapi.config.get('admin.auth.secret') }).verify(token);
  };

  const hasContent = (key) => typeof key === 'string' && Object.hasOwn(registry, key);

  // Sin caché: despublicar o editar surte efecto en la siguiente lectura.
  // Con un permiso de vista previa de ESTE tipo se lee el borrador; nunca en las claves con
  // filtros propios (casos de apadrinamiento).
  async function readContent(key, preview) {
    if (!hasContent(key)) return null;
    const entry = registry[key];
    const draft = Boolean(preview) && preview.uid === entry.uid && !entry.filters;
    const query = { status: draft ? 'draft' : 'published', populate: entry.populate, ...(entry.filters ? { filters: entry.filters() } : {}) };
    // Una colección siempre responde (una lista vacía es un estado válido); un single type
    // sin publicar responde null → 404.
    const data = entry.collection
      ? await strapi.documents(entry.uid).findMany({ ...query, limit: entry.limit })
      : await strapi.documents(entry.uid).findFirst(query);
    if (!data) return null;
    if (!draft && (Array.isArray(data) ? data : [data]).some((item) => !item.publishedAt)) throw new Error('Contenido no publicado');
    const mediaOrigin = process.env.MEDIA_PUBLIC_ORIGIN;
    if (!mediaOrigin) throw new Error('Falta MEDIA_PUBLIC_ORIGIN');
    const shared = await import(pathToFileURL(path.resolve(strapi.dirs.app.root, '../shared/content', entry.module)).href);
    const content = shared[entry.mapper]({ data }, { mediaOrigin, ...(entry.mapperOptions?.() ?? {}) });
    const allowedOrigin = new URL(mediaOrigin).origin;
    if (entry.mediaUrls(content).some((url) => new URL(url).origin !== allowedOrigin)) throw new Error('Origen de medios inválido');
    return content;
  }

  // Páginas creadas desde el panel. El slug se valida antes de consultar: nunca llega a la base
  // un valor arbitrario ni un slug reservado.
  const isPageSlug = (slug) => typeof slug === 'string' && pages.SLUG.test(slug) && !pages.RESERVED_SLUGS.includes(slug);

  async function readPage(slug, preview) {
    if (!isPageSlug(slug)) return null;
    // Vista previa: solo el borrador del documento para el que se emitió el permiso.
    const draft = Boolean(preview) && preview.uid === pages.UID;
    const data = await strapi.documents(pages.UID).findFirst({
      status: draft ? 'draft' : 'published',
      filters: draft ? { slug, documentId: preview.documentId } : { slug },
      populate: {
        headerImage: true,
        body: {
          on: {
            'blocks.rich-text': { populate: ['parts'] },
            'blocks.text-image': { populate: ['image'] },
            'blocks.gallery': { populate: ['images'] },
            'blocks.faq': { populate: ['items'] },
            'blocks.cta': { populate: ['link'] },
            // Secciones del sitio reutilizadas como bloques.
            'sections.hero': { populate: { slides: { populate: ['image'] } } },
            'home.about': { populate: ['heading', 'features', 'achievements', 'primaryLink', 'secondaryLink', 'image'] },
            'home.process': { populate: ['heading', 'steps'] },
            'home.impact': { populate: ['heading', 'primaryLink', 'secondaryLink'] },
            'home.programs-intro': { populate: ['heading', 'primaryLink', 'secondaryLink'] },
            'home.newsletter': { populate: ['heading', 'title', 'features'] },
            'about.history': { populate: ['heading', 'milestones', 'link'] },
            'about.approach': { populate: { heading: true, pillars: { populate: ['items'] } } },
            'blocks.partners': true,
            'blocks.steps': { populate: { heading: true, list: true, steps: { populate: ['image'] } } },
            'blocks.embed': true,
            'about.intro': { populate: { heading: true, tabs: { populate: ['items'] }, images: true, videoImage: true } },
            'about.networks': { populate: { heading: true, types: { populate: ['items'] }, joinHeading: true, joinSteps: true, link: true } },
            'about.coverage': { populate: ['heading', 'municipalities'] },
            'blocks.programs-detail': { populate: ['heading', 'primaryLink', 'secondaryLink'] },
            'blocks.social': { populate: ['heading'] },
            'blocks.site-cta': true,
            'blocks.donate': true,
          },
        },
      },
    });
    if (!data) return null;
    if (!draft && !data.publishedAt) throw new Error('Contenido no publicado');
    const mediaOrigin = process.env.MEDIA_PUBLIC_ORIGIN;
    if (!mediaOrigin) throw new Error('Falta MEDIA_PUBLIC_ORIGIN');
    const shared = await import(pathToFileURL(path.resolve(strapi.dirs.app.root, '../shared/content', 'page.js')).href);
    const content = shared.mapStrapiPage({ data }, { mediaOrigin });
    const allowedOrigin = new URL(mediaOrigin).origin;
    if (shared.pageMediaUrls(content).some((url) => new URL(url).origin !== allowedOrigin)) throw new Error('Origen de medios inválido');
    return content;
  }

  // Boletines: año y página se validan aquí; el tamaño de página lo fija el servidor.
  const NEWSLETTER_UID = 'api::newsletter.newsletter';
  const PAGE_SIZE = 12;
  const toInt = (value, min, max) => {
    const number = Number(value);
    return Number.isInteger(number) && number >= min && number <= max ? number : null;
  };
  const loadShared = async (file) => import(pathToFileURL(path.resolve(strapi.dirs.app.root, '../shared/content', file)).href);
  const requireMediaOrigin = () => {
    const mediaOrigin = process.env.MEDIA_PUBLIC_ORIGIN;
    if (!mediaOrigin) throw new Error('Falta MEDIA_PUBLIC_ORIGIN');
    return mediaOrigin;
  };
  const assertMediaOrigin = (urls, mediaOrigin) => {
    const allowedOrigin = new URL(mediaOrigin).origin;
    if (urls.some((url) => new URL(url).origin !== allowedOrigin)) throw new Error('Origen de medios inválido');
  };

  async function listNewsletters({ year, page } = {}) {
    const mediaOrigin = requireMediaOrigin();
    const validYear = year === undefined || year === '' ? null : toInt(year, 2000, 2100);
    if (year !== undefined && year !== '' && validYear === null) return null;
    const currentPage = page === undefined || page === '' ? 1 : toInt(page, 1, 1000);
    if (currentPage === null) return null;
    const filters = validYear ? { period: { $gte: `${validYear}-01-01`, $lte: `${validYear}-12-31` } } : {};
    const [items, total, periods] = await Promise.all([
      strapi.documents(NEWSLETTER_UID).findMany({
        status: 'published', filters, sort: ['period:desc', 'id:desc'],
        limit: PAGE_SIZE, start: (currentPage - 1) * PAGE_SIZE, populate: ['cover', 'pdf'],
      }),
      strapi.documents(NEWSLETTER_UID).count({ status: 'published', filters }),
      strapi.documents(NEWSLETTER_UID).findMany({ status: 'published', fields: ['period'], limit: 1000 }),
    ]);
    const years = periods.map((item) => Number(String(item.period).slice(0, 4)));
    const { mapStrapiNewsletterList } = await loadShared('newsletter.js');
    const content = mapStrapiNewsletterList({ data: items }, {
      mediaOrigin, page: currentPage, pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)), total, years, year: validYear,
    });
    assertMediaOrigin(content.items.flatMap((item) => [item.cover?.src, item.pdfUrl].filter(Boolean)), mediaOrigin);
    return content;
  }

  async function readNewsletter(slug, preview) {
    const { mapStrapiNewsletter, NEWSLETTER_SLUG } = await loadShared('newsletter.js');
    if (typeof slug !== 'string' || !NEWSLETTER_SLUG.test(slug)) return null;
    const mediaOrigin = requireMediaOrigin();
    const draft = Boolean(preview) && preview.uid === NEWSLETTER_UID;
    const data = await strapi.documents(NEWSLETTER_UID).findFirst({
      status: draft ? 'draft' : 'published', filters: draft ? { slug, documentId: preview.documentId } : { slug }, populate: ['cover', 'pdf'],
    });
    if (!data) return null;
    const content = mapStrapiNewsletter({ data }, { mediaOrigin });
    assertMediaOrigin([content.pdf.url, ...(content.cover ? [content.cover.src] : [])], mediaOrigin);
    return content;
  }

  // Solo lo publicado: páginas nuevas (sin reservadas) y boletines.
  async function sitemap() {
    // En desarrollo, el mismo valor por defecto que la vista previa (config/admin.js); en
    // producción es obligatorio: un sitemap con localhost sería peor que ninguno.
    const siteUrl = process.env.SITE_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5173');
    if (!siteUrl) throw new Error('Falta SITE_URL');
    const fields = ['slug', 'updatedAt'];
    const [pageList, newsletterList] = await Promise.all([
      strapi.documents(pages.UID).findMany({ status: 'published', fields, limit: 1000 }),
      strapi.documents(NEWSLETTER_UID).findMany({ status: 'published', fields, limit: 1000 }),
    ]);
    const { buildSitemap } = await loadShared('sitemap.js');
    return buildSitemap({ siteUrl, pages: pageList.filter((page) => isPageSlug(page.slug)), newsletters: newsletterList });
  }

  // Con caché (lib/content-cache.js); la vista previa de borradores nunca pasa por ella. Las claves
  // con filtros por fecha (casos vigentes) llevan los filtros del día en la clave.
  const cached = {
    readContent: (key, preview) => {
      if (preview || !hasContent(key)) return readContent(key, preview);
      const filters = registry[key].filters ? JSON.stringify(registry[key].filters()) : '';
      return contentCache.get(`content:${key}:${filters}`, () => readContent(key));
    },
    readPage: (slug, preview) => (preview || !isPageSlug(slug) ? readPage(slug, preview) : contentCache.get(`page:${slug}`, () => readPage(slug))),
    listNewsletters: (params = {}) => contentCache.get(`newsletters:${JSON.stringify([params.year ?? '', params.page ?? ''])}`, () => listNewsletters(params)),
    readNewsletter: (slug, preview) => (preview || typeof slug !== 'string' ? readNewsletter(slug, preview) : contentCache.get(`newsletter:${slug}`, () => readNewsletter(slug))),
    sitemap: () => contentCache.get('sitemap', sitemap),
  };

  return { contact, readPreviewToken, hasContent, isPageSlug, ...cached, readHome: () => cached.readContent('home') };
};
