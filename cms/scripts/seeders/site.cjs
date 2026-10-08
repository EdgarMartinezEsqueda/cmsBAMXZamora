const { fillMissing, importInitial, uploadOnce } = require('./lib.cjs');

const UID = 'api::site.site';
const upload = (strapi, name, image) => uploadOnce(strapi, { name, file: image.src, alt: image.alt });

// Los logos de aliados van en su propia colección (seeders/partners.cjs); aquí solo el encabezado.
function builders(strapi, siteDefaults) {
  const { image, ...callToAction } = siteDefaults.callToAction;
  return {
    callToAction: async () => ({ ...callToAction, image: (await upload(strapi, 'fondo-llamada-a-la-accion.webp', image)).id }),
    partners: async () => siteDefaults.partners,
    pageHeaderImage: async () => (await upload(strapi, 'fondo-cabecera-paginas.webp', siteDefaults.pageHeaderImage)).id,
  };
}

// Bases anteriores a la imagen de la banda: la llamada a la acción ya existe pero sin fondo.
async function fillCallToActionImage(strapi, siteDefaults) {
  const draft = await strapi.documents(UID).findFirst({ status: 'draft', populate: { callToAction: { populate: ['link', 'image'] } } });
  const current = draft?.callToAction;
  if (!current || current.image) return false;
  const media = await upload(strapi, 'fondo-llamada-a-la-accion.webp', siteDefaults.callToAction.image);
  await strapi.documents(UID).update({
    documentId: draft.documentId,
    data: { callToAction: {
      eyebrow: current.eyebrow, title: current.title,
      link: current.link ? { label: current.link.label, url: current.link.url } : null,
      image: media.id,
    } },
  });
  return true;
}

module.exports = async function seedSite(strapi, options = {}) {
  const { siteDefaults } = await importInitial('site');
  const existing = await strapi.documents(UID).findFirst({ status: 'draft' });
  if (existing) {
    const result = await fillMissing(strapi, UID, builders(strapi, siteDefaults), options);
    if (await fillCallToActionImage(strapi, siteDefaults)) {
      result.filled = [...result.filled, 'callToAction.image'];
      if (options.publish) {
        await strapi.documents(UID).publish({ documentId: existing.documentId });
        result.published = true;
      }
    }
    return result;
  }
  const extra = {};
  for (const [key, build] of Object.entries(builders(strapi, siteDefaults))) extra[key] = await build();
  const site = await strapi.documents(UID).create({
    data: {
      ...siteDefaults.contact,
      socialLinks: siteDefaults.social,
      impact: siteDefaults.impact,
      seo: Object.entries(siteDefaults.seo).map(([page, entry]) => ({ page, ...entry })),
      ...extra,
    },
    status: 'published',
  });
  return { created: true, documentId: site.documentId };
};
