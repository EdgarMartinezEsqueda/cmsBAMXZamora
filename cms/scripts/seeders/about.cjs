const path = require('node:path');
const { fillMissing, importInitial, toItems, uploadOnce } = require('./lib.cjs');

const toFeatures = (features) => features.map(({ items, ...feature }) => ({ ...feature, items: toItems(items) }));
const upload = async (strapi, prefix, image) =>
  (await uploadOnce(strapi, { name: `${prefix}${path.extname(image.src)}`, file: image.src, alt: image.alt })).id;

function builders(strapi, about) {
  return {
    intro: async () => {
      const { tabs, images, videoImage, ...fields } = about.intro;
      const imageIds = [];
      for (const [index, image] of images.entries()) imageIds.push(await upload(strapi, `nosotros-${index + 1}`, image));
      return { ...fields, tabs: toFeatures(tabs), images: imageIds, videoImage: await upload(strapi, 'nosotros-video', videoImage) };
    },
    history: async () => about.history,
    approach: async () => ({ ...about.approach, pillars: toFeatures(about.approach.pillars) }),
    coverage: async () => about.coverage,
    programsIntro: async () => about.programsIntro,
    networks: async () => ({ ...about.networks, types: toFeatures(about.networks.types) }),
  };
}

module.exports = async function seedAbout(strapi, options = {}) {
  const { aboutDefaults: about } = await importInitial('about');
  const existing = await strapi.documents('api::about-page.about-page').findFirst({ status: 'draft' });
  if (existing) return fillMissing(strapi, 'api::about-page.about-page', builders(strapi, about), options);
  const sections = {};
  for (const [key, build] of Object.entries(builders(strapi, about))) sections[key] = await build();
  const page = await strapi.documents('api::about-page.about-page').create({
    data: { pageTitle: about.pageTitle, pageSubtitle: about.pageSubtitle, ...sections },
    status: 'published',
  });
  return { created: true, documentId: page.documentId };
};
