'use strict';
module.exports = {
  async content(ctx) {
    const { key } = ctx.params;
    const service = strapi.service('api::public-site.public-site');
    ctx.set('Cache-Control', 'no-store');
    if (!service.hasContent(key)) { ctx.status = 404; ctx.body = { error: 'Contenido no encontrado.' }; return; }
    try {
      const content = await service.readContent(key);
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
    try {
      const content = await service.readPage(slug);
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
    ctx.set('Cache-Control', 'no-store');
    try {
      const content = await strapi.service('api::public-site.public-site').readNewsletter(slug);
      if (!content) { ctx.status = 404; ctx.body = { error: 'Boletín no encontrado.' }; return; }
      ctx.body = content;
    } catch (error) {
      strapi.log.error(`[content/newsletters/${slug}] ${error?.stack || error}`);
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
