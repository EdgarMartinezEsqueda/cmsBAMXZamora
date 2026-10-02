const { fillMissing, importInitial, toItems, uploadOnce } = require('./lib.cjs');

async function sectionBuilders(strapi) {
  const { homeSectionsDefaults: sections } = await importInitial('home');
  return {
    about: async () => {
      const { image, achievements, ...fields } = sections.about;
      const media = await uploadOnce(strapi, { name: 'inicio-sobre-nosotros.webp', file: image.src, alt: image.alt });
      return { ...fields, achievements: toItems(achievements), image: media.id };
    },
    process: async () => sections.process,
    programsIntro: async () => sections.programsIntro,
    impactSection: async () => sections.impactSection,
    instagram: async () => sections.instagram,
    newsletterIntro: async () => ({ ...sections.newsletterIntro, features: toItems(sections.newsletterIntro.features) }),
  };
}

module.exports = async function seedHome(strapi, options = {}) {
  const builders = await sectionBuilders(strapi);
  const existing = await strapi.documents('api::home.home').findFirst({ status: 'draft' });
  if (existing) return fillMissing(strapi, 'api::home.home', builders, options);
  const { heroDefaults } = await importInitial('home');
  const slides = [];
  for (const [index, slide] of heroDefaults.slides.entries()) {
    const media = await uploadOnce(strapi, { name: `inicio-hero-${index + 1}.webp`, file: slide.image });
    slides.push({ ...slide, image: media.id });
  }
  const sections = {};
  for (const [key, build] of Object.entries(builders)) sections[key] = await build();
  const home = await strapi.documents('api::home.home').create({
    data: { hero: { ...heroDefaults, slides }, ...sections },
    status: 'published',
  });
  return { created: true, documentId: home.documentId };
};
