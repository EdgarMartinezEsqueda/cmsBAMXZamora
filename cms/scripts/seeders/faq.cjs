const { importInitial } = require('./lib.cjs');

module.exports = async function seedFaq(strapi) {
  const existing = await strapi.documents('api::faq-page.faq-page').findFirst({ status: 'draft' });
  if (existing) return { created: false };
  const { faqDefaults } = await importInitial('faq');
  const page = await strapi.documents('api::faq-page.faq-page').create({ data: faqDefaults, status: 'published' });
  return { created: true, documentId: page.documentId };
};
