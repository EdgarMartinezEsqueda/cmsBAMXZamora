'use strict';
module.exports = { routes: [
  // Antes que /content/:key: si no, "newsletters" se tomaría como una clave del registro.
  { method: 'GET', path: '/content/newsletters', handler: 'public-site.newsletters', config: { auth: false } },
  { method: 'GET', path: '/content/newsletters/:slug', handler: 'public-site.newsletter', config: { auth: false } },
  // :key se valida contra content-registry.js; cualquier otra clave responde 404.
  { method: 'GET', path: '/content/:key', handler: 'public-site.content', config: { auth: false } },
  // Páginas creadas desde el panel; el slug se valida en el servicio (sin reservados).
  { method: 'GET', path: '/content/pages/:slug', handler: 'public-site.page', config: { auth: false } },
  // Nginx sirve /sitemap.xml del sitio desde aquí (deploy/nginx/site-locations.conf).
  { method: 'GET', path: '/sitemap.xml', handler: 'public-site.sitemap', config: { auth: false } },
  { method: 'POST', path: '/contact', handler: 'public-site.contact', config: { auth: false } },
] };
