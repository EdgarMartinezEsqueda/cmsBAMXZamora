'use strict';
const { createContactHandler } = require('../../../lib/contact');
const registry = require('../content-registry');
const pages = require('../../../setup/pages');
const { pathToFileURL } = require('node:url');
const path = require('node:path');

module.exports = ({ strapi }) => {
  const contact = createContactHandler({
    getSettings: () => strapi.documents('api::contact-setting.contact-setting').findFirst({ populate: ['recipients'] }),
  });

  const hasContent = (key) => typeof key === 'string' && Object.hasOwn(registry, key);

  // Sin caché: despublicar o editar surte efecto en la siguiente lectura.
  async function readContent(key) {
    if (!hasContent(key)) return null;
    const entry = registry[key];
    const query = { status: 'published', populate: entry.populate, ...(entry.filters ? { filters: entry.filters() } : {}) };
    // Una colección siempre responde (una lista vacía es un estado válido); un single type
    // sin publicar responde null → 404.
    const data = entry.collection
      ? await strapi.documents(entry.uid).findMany({ ...query, limit: entry.limit })
      : await strapi.documents(entry.uid).findFirst(query);
    if (!data) return null;
    if ((Array.isArray(data) ? data : [data]).some((item) => !item.publishedAt)) throw new Error('Contenido no publicado');
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

  async function readPage(slug) {
    if (!isPageSlug(slug)) return null;
    const data = await strapi.documents(pages.UID).findFirst({
      status: 'published',
      filters: { slug },
      populate: {
        body: {
          on: {
            'blocks.rich-text': true,
            'blocks.text-image': { populate: ['image'] },
            'blocks.gallery': { populate: ['images'] },
            'blocks.faq': { populate: ['items'] },
            'blocks.cta': { populate: ['link'] },
          },
        },
      },
    });
    if (!data) return null;
    if (!data.publishedAt) throw new Error('Contenido no publicado');
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

  async function readNewsletter(slug) {
    const { mapStrapiNewsletter, NEWSLETTER_SLUG } = await loadShared('newsletter.js');
    if (typeof slug !== 'string' || !NEWSLETTER_SLUG.test(slug)) return null;
    const mediaOrigin = requireMediaOrigin();
    const data = await strapi.documents(NEWSLETTER_UID).findFirst({ status: 'published', filters: { slug }, populate: ['cover', 'pdf'] });
    if (!data) return null;
    const content = mapStrapiNewsletter({ data }, { mediaOrigin });
    assertMediaOrigin([content.pdf.url, ...(content.cover ? [content.cover.src] : [])], mediaOrigin);
    return content;
  }

  return { contact, hasContent, readContent, readPage, isPageSlug, listNewsletters, readNewsletter, readHome: () => readContent('home') };
};
