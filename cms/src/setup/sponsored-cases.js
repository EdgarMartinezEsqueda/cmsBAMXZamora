'use strict';

const { errors } = require('@strapi/utils');

// Casos de apadrinamiento: imágenes con datos personales y de salud (incluidos menores). Solo se
// publican con consentimiento confirmado y una fecha de vencimiento; vencidos, dejan de mostrarse.
const UID = 'api::sponsored-case.sponsored-case';

/** Fecha de hoy en México como 'AAAA-MM-DD' (comparable como texto con los campos date). */
const todayInMexico = (now = new Date()) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Mexico_City' }).format(now);

/** Motivo por el que un caso no puede publicarse, o null si puede. */
function publishBlocker(item, today = todayInMexico()) {
  if (item?.consent !== true) return 'Confirma el consentimiento antes de publicar este caso.';
  if (!item?.validUntil) return 'Indica hasta qué fecha puede mostrarse este caso.';
  if (String(item.validUntil).slice(0, 10) < today) return 'La fecha de vencimiento ya pasó: actualízala o deja el caso sin publicar.';
  return null;
}

/** Filtro público: solo casos con consentimiento y vigentes hoy. */
const publicFilters = () => ({ consent: true, validUntil: { $gte: todayInMexico() } });

/** Bloquea cualquier publicación que no cumpla, venga del panel o de la API. */
function registerPublishGuard(strapi) {
  strapi.documents.use(async (context, next) => {
    if (context.uid !== UID) return next();
    const { action, params = {} } = context;
    const publishing = action === 'publish' || ((action === 'create' || action === 'update') && params.status === 'published');
    if (publishing) {
      const draft = params.documentId
        ? await strapi.db.query(UID).findOne({ where: { documentId: params.documentId, publishedAt: null } })
        : {};
      const blocker = publishBlocker({ ...draft, ...(params.data ?? {}) });
      if (blocker) throw new errors.ValidationError(blocker);
    }
    return next();
  });
}

module.exports = { UID, todayInMexico, publishBlocker, publicFilters, registerPublishGuard };
