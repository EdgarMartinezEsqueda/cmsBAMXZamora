const path = require('node:path');
const { importInitial, uploadOnce } = require('./lib.cjs');

const toItems = (texts) => texts.map((text) => ({ text }));

// Si ya existe cualquier programa, no importa nada: el cliente pudo haber editado la colección.
module.exports = async function seedPrograms(strapi) {
  const existing = await strapi.documents('api::program.program').findFirst({ status: 'draft' });
  if (existing) return { created: false };
  const { programsDefaults } = await importInitial('programs');
  for (const program of programsDefaults) {
    const { image, published, highlights, keyPoints, ...fields } = program;
    let imageId = null;
    if (image) {
      const media = await uploadOnce(strapi, { name: `programa-${program.slug}${path.extname(image.src)}`, file: image.src, alt: image.alt });
      imageId = media.id;
    }
    await strapi.documents('api::program.program').create({
      data: { ...fields, image: imageId, highlights: toItems(highlights), keyPoints: toItems(keyPoints) },
      status: published ? 'published' : 'draft',
    });
  }
  return { created: true, count: programsDefaults.length };
};
