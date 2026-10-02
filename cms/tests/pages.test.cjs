const test = require('node:test');
const assert = require('node:assert/strict');
const { slugBlocker, registerSlugGuard, UID } = require('../src/setup/pages');

test('una página no puede usar el slug de una ruta del sitio ni caracteres extraños', () => {
  for (const slug of ['donar', 'api', 'gestion-bamx', 'uploads']) assert.match(slugBlocker(slug), /ya lo usa/);
  for (const slug of ['Mayúsculas', 'con espacio', '../admin', '', 'a--b']) assert.match(slugBlocker(slug), /minúsculas/);
  assert.equal(slugBlocker('voluntariado-escolar'), null);
  assert.equal(slugBlocker(undefined), null, 'editar otros campos no exige slug');
});

test('el guardián actúa al crear y editar páginas, y solo en páginas', async () => {
  let middleware;
  registerSlugGuard({ documents: { use: (fn) => { middleware = fn; } } });
  const next = async () => 'ok';
  await assert.rejects(middleware({ uid: UID, action: 'create', params: { data: { slug: 'donar' } } }, next), /ya lo usa/);
  await assert.rejects(middleware({ uid: UID, action: 'update', params: { data: { slug: 'api' } } }, next), /ya lo usa/);
  assert.equal(await middleware({ uid: UID, action: 'create', params: { data: { slug: 'nueva' } } }, next), 'ok');
  assert.equal(await middleware({ uid: 'api::program.program', action: 'create', params: { data: { slug: 'donar' } } }, next), 'ok');
});
