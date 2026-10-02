const { importInitial } = require('./lib.cjs');

const createOnce = (uid, exportName) => async (strapi) => {
  if (await strapi.documents(uid).findFirst({ status: 'draft' })) return { created: false };
  const initial = await importInitial('pages');
  const page = await strapi.documents(uid).create({ data: initial[exportName], status: 'published' });
  return { created: true, documentId: page.documentId };
};

module.exports = {
  seedContactPage: createOnce('api::contact-page.contact-page', 'contactPageDefaults'),
  seedProgramsPage: createOnce('api::programs-page.programs-page', 'programsPageDefaults'),
};
