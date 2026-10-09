'use strict';

const { errors } = require('@strapi/utils');

// Páginas creadas desde el panel se sirven en /:slug. Estos slugs chocarían con rutas del sitio,
// del panel o de Nginx. Mantener sincronizado con RESERVED_SLUGS de shared/content/page.js (una
// prueba lo verifica).
const UID = 'api::page.page';
const RESERVED_SLUGS = [
  'inicio', 'programas', 'contacto', 'nosotros', 'donar', 'preguntas', 'beneficiarios', 'apadrinamiento',
  'boletines', 'eventos', 'paginas', 'gestion-bamx', 'admin', 'api', 'uploads', 'assets',
];
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function slugBlocker(slug) {
  if (slug === undefined) return null;
  if (typeof slug !== 'string' || !SLUG.test(slug)) return 'El identificador solo admite minúsculas, números y guiones.';
  if (RESERVED_SLUGS.includes(slug)) return `"${slug}" ya lo usa el sitio: elige otro identificador.`;
  return null;
}

/** Rechaza slugs reservados al crear o editar una página, desde el panel o la API. */
function registerSlugGuard(strapi) {
  strapi.documents.use(async (context, next) => {
    if (context.uid !== UID || !['create', 'update'].includes(context.action)) return next();
    const blocker = slugBlocker(context.params?.data?.slug);
    if (blocker) throw new errors.ValidationError(blocker);
    return next();
  });
}

module.exports = { UID, RESERVED_SLUGS, SLUG, slugBlocker, registerSlugGuard };
