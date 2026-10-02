const path = require('node:path');
const { importInitial, toItems, uploadOnce } = require('./lib.cjs');

async function uploadSteps(strapi, steps, prefix) {
  const result = [];
  for (const [index, { image, ...step }] of steps.entries()) {
    const media = await uploadOnce(strapi, { name: `${prefix}-${index + 1}${path.extname(image.src)}`, file: image.src, alt: image.alt });
    result.push({ ...step, image: media.id });
  }
  return result;
}

async function seedBeneficiaries(strapi) {
  const uid = 'api::beneficiaries-page.beneficiaries-page';
  if (await strapi.documents(uid).findFirst({ status: 'draft' })) return { created: false };
  const { beneficiariesDefaults: page } = await importInitial('sponsorship');
  const gallery = [];
  for (const [index, image] of page.gallery.entries()) {
    gallery.push((await uploadOnce(strapi, { name: `galeria-beneficiarios-${index + 1}.webp`, file: image.src, alt: image.alt })).id);
  }
  const created = await strapi.documents(uid).create({
    data: { ...page, documents: toItems(page.documents), steps: await uploadSteps(strapi, page.steps, 'beneficiarios-paso'), gallery },
    status: 'published',
  });
  return { created: true, documentId: created.documentId };
}

async function seedSponsorship(strapi) {
  const uid = 'api::sponsorship-page.sponsorship-page';
  if (await strapi.documents(uid).findFirst({ status: 'draft' })) return { created: false };
  const { sponsorshipDefaults: page } = await importInitial('sponsorship');
  const created = await strapi.documents(uid).create({
    data: { ...page, includes: toItems(page.includes), steps: await uploadSteps(strapi, page.steps, 'apadrinamiento-paso') },
    status: 'published',
  });
  return { created: true, documentId: created.documentId };
}

// Datos personales y de salud: se importan como BORRADORES sin consentimiento ni vigencia. No
// corresponde a este script afirmar un consentimiento; alguien del banco lo confirma y publica.
async function seedSponsoredCases(strapi) {
  const uid = 'api::sponsored-case.sponsored-case';
  if (await strapi.documents(uid).findFirst({ status: 'draft' })) return { created: false };
  const { sponsoredCasesDefaults: cases } = await importInitial('sponsorship');
  for (const [index, item] of cases.entries()) {
    const media = await uploadOnce(strapi, { name: `caso-apadrinamiento-${index + 1}.webp`, file: item.src, alt: item.alt });
    await strapi.documents(uid).create({
      data: { internalName: `Caso ${index + 1} (importado del sitio)`, image: media.id, alt: item.alt, consent: false, order: (index + 1) * 10 },
    });
  }
  return { created: true, drafts: cases.length };
}

module.exports = { seedBeneficiaries, seedSponsorship, seedSponsoredCases };
