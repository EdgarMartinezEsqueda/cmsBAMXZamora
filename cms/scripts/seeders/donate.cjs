const { importInitial, toItems } = require('./lib.cjs');

module.exports = async function seedDonate(strapi) {
  const existing = await strapi.documents('api::donate-page.donate-page').findFirst({ status: 'draft' });
  if (existing) return { created: false };
  const { donateDefaults } = await importInitial('donate');
  const page = await strapi.documents('api::donate-page.donate-page').create({
    data: { ...donateDefaults, closingTaglines: toItems(donateDefaults.closingTaglines) },
    status: 'published',
  });
  return { created: true, documentId: page.documentId };
};
