const { fillMissing, importInitial, uploadOnce } = require('./lib.cjs');

function builders(strapi, siteDefaults) {
  return {
    callToAction: async () => siteDefaults.callToAction,
    partners: async () => {
      const logos = [];
      for (const [index, partner] of siteDefaults.partners.logos.entries()) {
        const media = await uploadOnce(strapi, { name: `aliado-${index + 1}.webp`, file: partner.logo.src, alt: partner.logo.alt });
        logos.push({ name: partner.name, logo: media.id });
      }
      return { heading: siteDefaults.partners.heading, logos };
    },
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
