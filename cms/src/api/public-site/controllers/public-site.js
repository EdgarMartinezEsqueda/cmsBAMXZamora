'use strict';

// ?preview= con un permiso inválido o caducado: 403 (nunca se sirve un borrador por error ni se
// hace pasar lo publicado por vista previa). Devuelve false si ya respondió.
function previewOf(ctx, service) {
  const preview = service.readPreviewToken(ctx.query.preview);
  if (preview !== null) return { preview };
  ctx.status = 403;
  ctx.body = { error: 'La vista previa caducó. Ábrela de nuevo desde el panel.' };
  return false;
}

module.exports = {
  async content(ctx) {
    const { key } = ctx.params;
    const service = strapi.service('api::public-site.public-site');
    ctx.set('Cache-Control', 'no-store');
    if (!service.hasContent(key)) { ctx.status = 404; ctx.body = { error: 'Contenido no encontrado.' }; return; }
    const access = previewOf(ctx, service);
    if (!access) return;
    try {
      const content = await service.readContent(key, access.preview);
      if (!content) { ctx.status = 404; ctx.body = { error: 'Este contenido no está publicado.' }; return; }
      ctx.body = content;
    } catch (error) {
      // El visitante recibe un mensaje genérico; la causa queda en el log del servidor.
      strapi.log.error(`[content/${key}] ${error?.stack || error}`);
      ctx.status = 503;
      ctx.body = { error: 'No se pudo consultar el contenido. Intenta de nuevo.' };
    }
  },
  async page(ctx) {
    const { slug } = ctx.params;
    const service = strapi.service('api::public-site.public-site');
    ctx.set('Cache-Control', 'no-store');
    if (!service.isPageSlug(slug)) { ctx.status = 404; ctx.body = { error: 'Página no encontrada.' }; return; }
    const access = previewOf(ctx, service);
    if (!access) return;
    try {
      const content = await service.readPage(slug, access.preview);
      if (!content) { ctx.status = 404; ctx.body = { error: 'Página no encontrada.' }; return; }
      ctx.body = content;
    } catch (error) {
      strapi.log.error(`[content/pages/${slug}] ${error?.stack || error}`);
      ctx.status = 503;
      ctx.body = { error: 'No se pudo consultar el contenido. Intenta de nuevo.' };
    }
  },
  async newsletters(ctx) {
    ctx.set('Cache-Control', 'no-store');
    try {
      const content = await strapi.service('api::public-site.public-site').listNewsletters({ year: ctx.query.year, page: ctx.query.page });
      if (!content) { ctx.status = 400; ctx.body = { error: 'Año o página inválidos.' }; return; }
      ctx.body = content;
    } catch (error) {
      strapi.log.error(`[content/newsletters] ${error?.stack || error}`);
      ctx.status = 503;
      ctx.body = { error: 'No se pudo consultar el contenido. Intenta de nuevo.' };
    }
  },
  async newsletter(ctx) {
    const { slug } = ctx.params;
    const service = strapi.service('api::public-site.public-site');
    ctx.set('Cache-Control', 'no-store');
    const access = previewOf(ctx, service);
    if (!access) return;
    try {
      const content = await service.readNewsletter(slug, access.preview);
      if (!content) { ctx.status = 404; ctx.body = { error: 'Boletín no encontrado.' }; return; }
      ctx.body = content;
    } catch (error) {
      strapi.log.error(`[content/newsletters/${slug}] ${error?.stack || error}`);
      ctx.status = 503;
      ctx.body = { error: 'No se pudo consultar el contenido. Intenta de nuevo.' };
    }
  },
  async sitemap(ctx) {
    try {
      const xml = await strapi.service('api::public-site.public-site').sitemap();
      ctx.set('Cache-Control', 'public, max-age=3600');
      ctx.type = 'application/xml; charset=utf-8';
      ctx.body = xml;
    } catch (error) {
      strapi.log.error(`[sitemap] ${error?.stack || error}`);
      ctx.status = 503;
      ctx.body = { error: 'No se pudo generar el mapa del sitio.' };
    }
  },
  async events(ctx) {
    ctx.set('Cache-Control', 'no-store');
    try {
      const { scope, category, month, page } = ctx.query;
      const content = await strapi.service('api::public-site.public-site').listEvents({ scope, category, month, page });
      if (!content) { ctx.status = 400; ctx.body = { error: 'Filtros inválidos.' }; return; }
      ctx.body = content;
    } catch (error) {
      strapi.log.error(`[content/events] ${error?.stack || error}`);
      ctx.status = 503;
      ctx.body = { error: 'No se pudo consultar el contenido. Intenta de nuevo.' };
    }
  },
  async event(ctx) {
    const { slug } = ctx.params;
    const service = strapi.service('api::public-site.public-site');
    ctx.set('Cache-Control', 'no-store');
    const access = previewOf(ctx, service);
    if (!access) return;
    try {
      const content = await service.readEvent(slug, access.preview);
      if (!content) { ctx.status = 404; ctx.body = { error: 'Evento no encontrado.' }; return; }
      ctx.body = content;
    } catch (error) {
      strapi.log.error(`[content/events/${slug}] ${error?.stack || error}`);
      ctx.status = 503;
      ctx.body = { error: 'No se pudo consultar el contenido. Intenta de nuevo.' };
    }
  },
  async contact(ctx) {
    const result = await strapi.service('api::public-site.public-site').contact({ body: ctx.request.body, ip: ctx.ip });
    ctx.status = result.status;
    if (result.retryAfter) ctx.set('Retry-After', String(result.retryAfter));
    ctx.body = result.body;
  },
};
