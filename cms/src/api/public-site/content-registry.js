'use strict';

const sponsoredCases = require('../../setup/sponsored-cases');

/**
 * Lista blanca de contenidos públicos: GET /api/content/:key solo responde claves de aquí.
 * - uid: tipo de Strapi que se consulta (siempre solo lo publicado).
 * - collection / limit: la clave lee una colección completa (con tope) en vez de un single type.
 * - filters / mapperOptions: funciones que se evalúan en cada petición (p. ej. la fecha de hoy).
 * - populate: relaciones y medios que el mapper necesita; nada más.
 * - module / mapper: función pura en shared/content/ que convierte el documento al contrato
 *   de props de React. Es el filtro de salida: lo que no copia, no se publica.
 * - mediaUrls: URLs de medios del resultado, para exigir que salgan del origen público.
 */
module.exports = {
  home: {
    uid: 'api::home.home',
    populate: {
      hero: { populate: { slides: { populate: ['image'] } } },
      about: { populate: ['heading', 'features', 'achievements', 'primaryLink', 'secondaryLink', 'image'] },
      process: { populate: ['heading', 'steps'] },
      programsIntro: { populate: ['heading', 'primaryLink', 'secondaryLink'] },
      impactSection: { populate: ['heading', 'primaryLink', 'secondaryLink'] },
      instagram: true,
      newsletterIntro: { populate: ['heading', 'title', 'features'] },
    },
    module: 'hero.js',
    mapper: 'mapStrapiHome',
    mediaUrls: (content) => [...(content.hero?.slides.map((slide) => slide.image) ?? []), content.about?.image?.src].filter(Boolean),
  },
  site: {
    uid: 'api::site.site',
    populate: {
      socialLinks: true, impact: true, seo: true,
      callToAction: { populate: ['link', 'image'] },
      pageHeaderImage: true,
      loadingScreen: { populate: ['image'] },
      partners: { populate: ['heading'] },
    },
    module: 'site.js',
    mapper: 'mapStrapiSite',
    mediaUrls: (content) => [content.pageHeaderImage?.src, content.callToAction?.image?.src, content.loadingScreen?.image?.src].filter(Boolean),
  },
  about: {
    uid: 'api::about-page.about-page',
    populate: {
      intro: { populate: { heading: true, tabs: { populate: ['items'] }, images: true, videoImage: true } },
      history: { populate: ['heading', 'milestones', 'link'] },
      approach: { populate: { heading: true, pillars: { populate: ['items'] } } },
      coverage: { populate: ['heading', 'municipalities'] },
      programsIntro: { populate: ['heading', 'primaryLink', 'secondaryLink'] },
      networks: { populate: { heading: true, types: { populate: ['items'] }, joinHeading: true, joinSteps: true, link: true } },
    },
    module: 'about.js',
    mapper: 'mapStrapiAbout',
    mediaUrls: (content) => [...(content.intro?.images ?? []).map((image) => image.src), content.intro?.videoImage?.src].filter(Boolean),
  },
  faq: {
    uid: 'api::faq-page.faq-page',
    populate: ['heading', 'entries', 'link'],
    module: 'faq.js',
    mapper: 'mapStrapiFaq',
    mediaUrls: () => [],
  },
  donate: {
    uid: 'api::donate-page.donate-page',
    populate: ['heading', 'onlineLinks', 'safetyPoints', 'closingTaglines'],
    module: 'donate.js',
    mapper: 'mapStrapiDonate',
    mediaUrls: () => [],
  },
  beneficiaries: {
    uid: 'api::beneficiaries-page.beneficiaries-page',
    populate: { heading: true, documents: true, steps: { populate: ['image'] }, galleryHeading: true, gallery: true },
    module: 'sponsorship.js',
    mapper: 'mapStrapiBeneficiaries',
    mediaUrls: (content) => [...content.steps.map((step) => step.image.src), ...content.gallery.map((image) => image.src)],
  },
  sponsorship: {
    uid: 'api::sponsorship-page.sponsorship-page',
    populate: { heading: true, includes: true, steps: { populate: ['image'] }, objectives: true, catalogHeading: true, catalogLink: true },
    module: 'sponsorship.js',
    mapper: 'mapStrapiSponsorship',
    mediaUrls: (content) => content.steps.map((step) => step.image.src),
  },
  // Datos personales y de salud: solo casos con consentimiento y vigentes (src/setup/sponsored-cases.js).
  sponsoredCases: {
    uid: sponsoredCases.UID,
    collection: true,
    limit: 50,
    filters: sponsoredCases.publicFilters,
    populate: ['image'],
    module: 'sponsorship.js',
    mapper: 'mapStrapiSponsoredCases',
    mapperOptions: () => ({ today: sponsoredCases.todayInMexico() }),
    mediaUrls: (content) => content.cases.map((item) => item.src),
  },
  contactPage: {
    uid: 'api::contact-page.contact-page',
    populate: ['heading'],
    module: 'pages.js',
    mapper: 'mapStrapiContactPage',
    mediaUrls: () => [],
  },
  programsPage: {
    uid: 'api::programs-page.programs-page',
    populate: ['heading', 'detailLink'],
    module: 'pages.js',
    mapper: 'mapStrapiProgramsPage',
    mediaUrls: () => [],
  },
  navigation: {
    uid: 'api::navigation.navigation',
    // Programas del pie: solo los campos que se publican (los relacionados salen ya publicados).
    populate: { menuLinks: true, donateButton: true, footerLinks: true, footerPrograms: { fields: ['title', 'shortTitle', 'slug'] } },
    module: 'navigation.js',
    mapper: 'mapStrapiNavigation',
    mediaUrls: () => [],
  },
  partners: {
    uid: 'api::partner.partner',
    collection: true,
    limit: 100,
    populate: ['logo'],
    module: 'site.js',
    mapper: 'mapStrapiPartners',
    mediaUrls: (content) => content.partners.map((partner) => partner.logo.src),
  },
  programs: {
    uid: 'api::program.program',
    collection: true,
    limit: 100,
    populate: ['image', 'highlights', 'keyPoints', 'faqs'],
    module: 'programs.js',
    mapper: 'mapStrapiPrograms',
    mediaUrls: (content) => content.programs.flatMap((program) => program.image ? [program.image.src] : []),
  },
  // Solo lo edita un administrador (no está en EDITORIAL_TYPES de setup/editorial.js).
  bank: {
    uid: 'api::bank-account.bank-account',
    populate: [],
    module: 'bank.js',
    mapper: 'mapStrapiBank',
    mediaUrls: () => [],
  },
};
