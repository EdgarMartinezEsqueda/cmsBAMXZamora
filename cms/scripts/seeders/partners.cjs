const { importInitial, uploadOnce } = require('./lib.cjs');

const UID = 'api::partner.partner';

// Si la colección ya tiene algo, no se toca (el banco pudo haberla editado). En una base nueva se
// cargan los aliados del contenido inicial; cada logo se sube una sola vez.
module.exports = async function seedPartners(strapi) {
  if (await strapi.documents(UID).findFirst({ status: 'draft' })) return { created: false };
  const { partnersDefaults } = await importInitial('site');
  for (const [index, partner] of partnersDefaults.entries()) {
    const media = await uploadOnce(strapi, { name: `aliado-${index + 1}.webp`, file: partner.logo.src, alt: partner.logo.alt });
    await strapi.documents(UID).create({ data: { name: partner.name, logo: media.id, order: (index + 1) * 10 }, status: 'published' });
  }
  return { created: true, count: partnersDefaults.length };
};
