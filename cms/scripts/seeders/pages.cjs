const { importInitial, uploadOnce } = require('./lib.cjs');

const createOnce = (uid, exportName) => async (strapi) => {
  if (await strapi.documents(uid).findFirst({ status: 'draft' })) return { created: false };
  const initial = await importInitial('pages');
  const page = await strapi.documents(uid).create({ data: initial[exportName], status: 'published' });
  return { created: true, documentId: page.documentId };
};

// Menú y pie: los programas del pie se guardan como relación; se buscan por slug ya publicados
// (por eso la carga de Programas va antes en seed.cjs).
async function seedNavigation(strapi) {
  const uid = 'api::navigation.navigation';
  if (await strapi.documents(uid).findFirst({ status: 'draft' })) return { created: false };
  const { navigationDefaults } = await importInitial('pages');
  const { footerProgramSlugs, footerBadges, ...data } = navigationDefaults;
  const badges = [];
  for (const badge of footerBadges) {
    const media = await uploadOnce(strapi, { name: badge.image.src.split('/').pop(), file: badge.image.src, alt: badge.image.alt });
    badges.push({ image: media.id, label: badge.label, url: badge.url });
  }
  const footerPrograms = [];
  for (const slug of footerProgramSlugs) {
    const program = await strapi.documents('api::program.program').findFirst({ status: 'published', filters: { slug }, fields: ['slug'] });
    if (program) footerPrograms.push(program.documentId);
  }
  const navigation = await strapi.documents(uid).create({ data: { ...data, footerPrograms, footerBadges: badges }, status: 'published' });
  return { created: true, documentId: navigation.documentId };
}

module.exports = {
  seedContactPage: createOnce('api::contact-page.contact-page', 'contactPageDefaults'),
  seedNavigation,
  seedProgramsPage: createOnce('api::programs-page.programs-page', 'programsPageDefaults'),
};
