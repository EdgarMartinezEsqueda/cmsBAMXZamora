'use strict';

// strapi::security prohíbe que cualquier archivo se muestre dentro de otra página
// (X-Frame-Options: SAMEORIGIN y frame-ancestors 'self'). El sitio vive en otro origen, así que
// el visor de boletines no podía mostrar el PDF. Solo para PDF de /uploads se permite ese
// marco a los orígenes del sitio; el panel, la API y los demás archivos siguen protegidos.

/** Solo orígenes exactos http(s) (sin comodines ni rutas): nada que pueda inyectar la cabecera. */
function toOrigins(values) {
  return (values ?? []).flatMap((value) => {
    try {
      const url = new URL(String(value).trim());
      return ['http:', 'https:'].includes(url.protocol) && url.origin === String(value).trim().replace(/\/$/, '') ? [url.origin] : [];
    } catch {
      return [];
    }
  });
}

module.exports = (config = {}) => {
  const origins = toOrigins(config.origins);
  const frameAncestors = `frame-ancestors 'self'${origins.map((origin) => ` ${origin}`).join('')}`;

  return async (ctx, next) => {
    await next();
    if (!ctx.path.startsWith('/uploads/') || !ctx.path.toLowerCase().endsWith('.pdf') || ctx.status !== 200) return;
    const csp = ctx.response.get('Content-Security-Policy');
    ctx.remove('X-Frame-Options');
    ctx.set('Content-Security-Policy', csp
      ? csp.replace(/frame-ancestors[^;]*/, frameAncestors)
      : frameAncestors);
  };
};

module.exports.toOrigins = toOrigins;
