const test = require('node:test');
const assert = require('node:assert/strict');
const { uploadOnce } = require('../scripts/seeders/lib.cjs');

const fakeStrapi = (uploads) => ({
  db: { query: () => ({ findOne: async () => null }) },
  plugin: () => ({ service: () => ({ upload: async (input) => { uploads.push(input); return [{ id: 1 }]; } }) }),
});

test('la carga inicial solo sube archivos de public/ con tipos permitidos', async () => {
  const uploads = [];
  const strapi = fakeStrapi(uploads);
  for (const file of ['/../cms/.env', '/../../etc/passwd', '/assets/../../package.json']) {
    await assert.rejects(uploadOnce(strapi, { name: 'x', file }), /fuera de public/);
  }
  await assert.rejects(uploadOnce(strapi, { name: 'x', file: '/assets/images/arrow1.svg' }), /no permitido/);
  await uploadOnce(strapi, { name: 'logo.png', file: '/assets/images/logo.png', alt: 'Logo' });
  assert.equal(uploads.length, 1);
  assert.equal(uploads[0].files.mimetype, 'image/png');
  assert.equal(uploads[0].data.fileInfo.alternativeText, 'Logo');
});
