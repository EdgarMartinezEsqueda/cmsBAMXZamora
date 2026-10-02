const test = require('node:test');
const assert = require('node:assert/strict');
const { publishBlocker, todayInMexico, registerPublishGuard, UID } = require('../src/setup/sponsored-cases');

test('un caso no se publica sin consentimiento, sin fecha o vencido', () => {
  const today = '2026-09-28';
  assert.match(publishBlocker({ consent: false, validUntil: '2027-01-01' }, today), /consentimiento/);
  assert.match(publishBlocker({ consent: 'true', validUntil: '2027-01-01' }, today), /consentimiento/);
  assert.match(publishBlocker({ consent: true }, today), /fecha/);
  assert.match(publishBlocker({ consent: true, validUntil: '2026-09-27' }, today), /pasó/);
  assert.equal(publishBlocker({ consent: true, validUntil: '2026-09-28' }, today), null);
});

test('la fecha de hoy se calcula en la zona horaria de México', () => {
  // 2026-09-29 03:00 UTC es todavía 28 de septiembre en México (UTC-6).
  assert.equal(todayInMexico(new Date('2026-09-29T03:00:00Z')), '2026-09-28');
});

test('el guardián bloquea publicar desde el panel y deja pasar borradores y otros tipos', async () => {
  let middleware;
  let draft = { consent: false, validUntil: '2099-01-01' };
  registerPublishGuard({
    documents: { use: (fn) => { middleware = fn; } },
    db: { query: () => ({ findOne: async () => draft }) },
  });
  const next = async () => 'ok';
  await assert.rejects(middleware({ uid: UID, action: 'publish', params: { documentId: 'x' } }, next), /consentimiento/);
  await assert.rejects(middleware({ uid: UID, action: 'update', params: { documentId: 'x', status: 'published', data: { validUntil: '2000-01-01' } } }, next), /consentimiento/);
  assert.equal(await middleware({ uid: UID, action: 'update', params: { documentId: 'x', data: { alt: 'x' } } }, next), 'ok');
  assert.equal(await middleware({ uid: 'api::home.home', action: 'publish', params: {} }, next), 'ok');
  draft = { consent: true, validUntil: '2099-01-01' };
  assert.equal(await middleware({ uid: UID, action: 'publish', params: { documentId: 'x' } }, next), 'ok');
});
