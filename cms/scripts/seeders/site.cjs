const { fillMissing, importInitial } = require('./lib.cjs');

// Los logos de aliados van en su propia colección (seeders/partners.cjs); aquí solo el encabezado.
function builders(strapi, siteDefaults) {
  return {
    callToAction: async () => siteDefaults.callToAction,
    partners: async () => siteDefaults.partners,
  };
}

module.exports = async function seedSite(strapi, options = {}) {
  const { siteDefaults } = await importInitial('site');
  const existing = await strapi.documents('api::site.site').findFirst({ status: 'draft' });
  if (existing) return fillMissing(strapi, 'api::site.site', builders(strapi, siteDefaults), options);
  const extra = {};
  for (const [key, build] of Object.entries(builders(strapi, siteDefaults))) extra[key] = await build();
  const site = await strapi.documents('api::site.site').create({
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
