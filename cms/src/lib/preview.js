'use strict';
const crypto = require('node:crypto');

// Vista previa de borradores. El panel pide una dirección del sitio con un permiso firmado y de
// corta duración; con él, GET /api/content/... devuelve el BORRADOR de ese único documento o tipo.
// Sin permiso (o con uno de otro tipo) todo sigue respondiendo solo lo publicado.
const TTL_SECONDS = 60 * 60;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Tipos con vista previa y la página del sitio donde se ven. Los que no están aquí no tienen
// vista previa: datos bancarios, destinatarios de contacto y casos de apadrinamiento (datos
// personales y de salud: solo se ven publicados, con consentimiento).
const ROUTES = {
  'api::home.home': { path: () => '/' },
  'api::site.site': { path: () => '/' },
  'api::navigation.navigation': { path: () => '/' },
  'api::partner.partner': { path: () => '/' },
  'api::about-page.about-page': { path: () => '/nosotros' },
  'api::faq-page.faq-page': { path: () => '/preguntas' },
  'api::donate-page.donate-page': { path: () => '/donar' },
  'api::beneficiaries-page.beneficiaries-page': { path: () => '/beneficiarios' },
  'api::sponsorship-page.sponsorship-page': { path: () => '/apadrinamiento' },
  'api::contact-page.contact-page': { path: () => '/contacto' },
  'api::programs-page.programs-page': { path: () => '/programas' },
  'api::program.program': { slug: true, path: () => '/programas', hash: (slug) => `#${slug}` },
  'api::page.page': { slug: true, path: (slug) => `/${slug}` },
  'api::newsletter.newsletter': { slug: true, path: (slug) => `/boletines/${slug}` },
  'api::event.event': { slug: true, path: (slug) => `/eventos/${slug}` },
};

const encode = (value) => Buffer.from(value).toString('base64url');

function createPreview({ secret, now = () => Date.now() }) {
  if (typeof secret !== 'string' || secret.length < 16) throw new Error('Falta el secreto para la vista previa');
  // Clave propia derivada del secreto del panel: el permiso no sirve para nada más.
  const key = crypto.createHmac('sha256', secret).update('bamx-preview-v1').digest();
  const signature = (payload) => crypto.createHmac('sha256', key).update(payload).digest('base64url');
  return {
    sign(uid, documentId) {
      const payload = encode(JSON.stringify({ u: uid, d: documentId, e: Math.floor(now() / 1000) + TTL_SECONDS }));
      return `${payload}.${signature(payload)}`;
    },
    /** { uid, documentId } si el permiso es auténtico y vigente; null en cualquier otro caso. */
    verify(token) {
      if (typeof token !== 'string' || token.length > 600) return null;
      const [payload, mac, extra] = token.split('.');
      if (!payload || !mac || extra !== undefined) return null;
      const expected = Buffer.from(signature(payload));
      const received = Buffer.from(mac);
      if (expected.length !== received.length || !crypto.timingSafeEqual(expected, received)) return null;
      try {
        const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
        if (!Object.hasOwn(ROUTES, data.u) || typeof data.d !== 'string' || !Number.isInteger(data.e)) return null;
        if (data.e < Math.floor(now() / 1000)) return null;
        return { uid: data.u, documentId: data.d };
      } catch {
        return null;
      }
    },
  };
}

/** Dirección del sitio para el botón "Vista previa" del panel; null si el tipo no tiene. */
async function previewUrl(strapi, siteUrl, uid, { documentId, status } = {}) {
  if (!Object.hasOwn(ROUTES, uid) || !documentId) return null;
  const route = ROUTES[uid];
  const published = status === 'published';
  let slug;
  if (route.slug) {
    const document = await strapi.documents(uid).findOne({ documentId, status: published ? 'published' : 'draft', fields: ['slug'] });
    slug = document?.slug;
    if (typeof slug !== 'string' || !SLUG.test(slug)) return null;
  }
  const base = `${siteUrl.replace(/\/$/, '')}${route.path(slug)}`;
  const hash = route.hash ? route.hash(slug) : '';
  if (published) return `${base}${hash}`;
  const token = createPreview({ secret: strapi.config.get('admin.auth.secret') }).sign(uid, documentId);
  return `${base}?preview=${token}${hash}`;
}

module.exports = { createPreview, previewUrl, ROUTES, TTL_SECONDS };
