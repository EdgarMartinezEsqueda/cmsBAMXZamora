const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const createService = require('../src/api/public-site/services/public-site');

test('Inicio exige publicación, no conserva contenido retirado y filtra campos privados', async () => {
  const previousOrigin = process.env.MEDIA_PUBLIC_ORIGIN;
  process.env.MEDIA_PUBLIC_ORIGIN = 'https://media.example.org';
  const sections = { about: null, process: null, programsIntro: null, impactSection: null, instagram: null, newsletterIntro: null };
  let document = { publishedAt: '2026-09-16', privateField: 'secret', ...sections, hero: { slides: [{ id: 1, image: { url: '/uploads/test.webp' }, headingLead: 'Inicio', privateField: 'secret' }] } };
  const service = createService({ strapi: {
    dirs: { app: { root: path.resolve(__dirname, '..') } },
    documents(uid) {
      assert.equal(uid, 'api::home.home');
      return { async findFirst(query) { assert.equal(query.status, 'published'); return document; } };
    },
  } });
  try {
    const result = await service.readHome();
    assert.equal(result.hero.slides[0].image, 'https://media.example.org/uploads/test.webp');
    assert.equal(JSON.stringify(result).includes('secret'), false);
    document = null;
    assert.equal(await service.readHome(), null);
    document = { publishedAt: null, hero: null };
    await assert.rejects(service.readHome(), /no publicado/);
    document = { publishedAt: '2026-09-16', ...sections, hero: { slides: [{ image: { url: 'https://other.example.org/image.webp' } }] } };
    await assert.rejects(service.readHome(), /Origen de medios/);
  } finally {
    if (previousOrigin === undefined) delete process.env.MEDIA_PUBLIC_ORIGIN;
    else process.env.MEDIA_PUBLIC_ORIGIN = previousOrigin;
  }
});

test('solo responde claves de la lista blanca y nunca consulta las demás', async () => {
  const service = createService({ strapi: {
    dirs: { app: { root: path.resolve(__dirname, '..') } },
    documents() { throw new Error('No debe consultar una clave desconocida'); },
  } });
  for (const key of ['nope', '__proto__', 'constructor', 'toString', '', undefined, ['home']]) {
    assert.equal(service.hasContent(key), false, `clave aceptada: ${String(key)}`);
    assert.equal(await service.readContent(key), null);
  }
  assert.equal(service.hasContent('home'), true);
});
