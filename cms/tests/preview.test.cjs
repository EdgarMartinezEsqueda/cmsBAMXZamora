const test = require('node:test');
const assert = require('node:assert/strict');
const { createPreview, previewUrl, TTL_SECONDS } = require('../src/lib/preview');

const secret = 'secreto-de-prueba-suficientemente-largo';

test('permiso de vista previa: firmado, con caducidad y solo para tipos con vista previa', () => {
  let now = 1_000_000_000_000;
  const preview = createPreview({ secret, now: () => now });
  const token = preview.sign('api::page.page', 'doc1');
  assert.deepEqual(preview.verify(token), { uid: 'api::page.page', documentId: 'doc1' });
  const [payload, mac] = token.split('.');
  const forged = Buffer.from(JSON.stringify({ u: 'api::home.home', d: 'doc1', e: 9999999999 })).toString('base64url');
  for (const bad of [undefined, '', 'x', `${forged}.${mac}`, `${payload}.${mac}x`, `${payload}.${mac}.extra`, 'a'.repeat(700)]) {
    assert.equal(preview.verify(bad), null, `permiso inválido: ${String(bad).slice(0, 20)}`);
  }
  assert.equal(createPreview({ secret: `${secret}-otro` }).verify(token), null, 'otro secreto no lo valida');
  now += (TTL_SECONDS + 1) * 1000;
  assert.equal(preview.verify(token), null, 'caduca');
  for (const uid of ['api::sponsored-case.sponsored-case', 'api::bank-account.bank-account', 'api::contact-setting.contact-setting']) {
    assert.equal(createPreview({ secret }).verify(createPreview({ secret }).sign(uid, 'doc1')), null, `sin vista previa: ${uid}`);
  }
  assert.throws(() => createPreview({ secret: '' }), /secreto/);
});

test('dirección de vista previa: solo tipos permitidos y slugs válidos', async () => {
  const strapi = (slug) => ({
    config: { get: () => secret },
    documents: () => ({ findOne: async () => (slug === null ? null : { slug }) }),
  });
  const site = 'https://sitio.example/';
  assert.equal(await previewUrl(strapi(), site, 'api::sponsored-case.sponsored-case', { documentId: 'd', status: 'draft' }), null);
  assert.equal(await previewUrl(strapi(), site, 'api::bank-account.bank-account', { documentId: 'd', status: 'draft' }), null);
  assert.equal(await previewUrl(strapi(), site, 'api::home.home', { documentId: 'd', status: 'published' }), 'https://sitio.example/');
  assert.match(await previewUrl(strapi(), site, 'api::about-page.about-page', { documentId: 'd', status: 'draft' }), /^https:\/\/sitio\.example\/nosotros\?preview=[\w-]+\.[\w-]+$/);
  assert.match(await previewUrl(strapi('mi-pagina'), site, 'api::page.page', { documentId: 'd', status: 'draft' }), /^https:\/\/sitio\.example\/mi-pagina\?preview=/);
  assert.match(await previewUrl(strapi('despensas'), site, 'api::program.program', { documentId: 'd', status: 'draft' }), /\/programas\?preview=[\w.-]+#despensas$/);
  assert.equal(await previewUrl(strapi('../admin'), site, 'api::page.page', { documentId: 'd', status: 'draft' }), null);
  assert.equal(await previewUrl(strapi(null), site, 'api::newsletter.newsletter', { documentId: 'd', status: 'draft' }), null);
});
