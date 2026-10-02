const test = require('node:test');
const assert = require('node:assert/strict');
const { createContactHandler } = require('../src/lib/contact');
const env = { NODE_ENV: 'test', RESEND_API_KEY: 're_fake', CONTACT_FROM: 'web@example.org' };
const valid = { nombre: '<Ana>', correo: 'ana@example.org', mensaje: 'Quiero información de programas.' };
const settings = { enabled: true, recipients: [{ email: 'contacto@example.org' }] };
const factory = (extra = {}) => createContactHandler({ env, getSettings: async () => settings, sendEmail: async () => ({ data: { id: 'test' } }), ...extra });

test('destinatarios internos actualizados sin caché ni selección del visitante', async () => {
  let to = 'primero@example.org';
  const sent = [];
  const handler = factory({ getSettings: async () => ({ enabled: true, recipients: [{ email: to }] }), sendEmail: async (mail) => { sent.push(mail); return { data: { id: 'test' } }; } });
  assert.equal((await handler({ body: valid, ip: '1' })).status, 200);
  to = 'segundo@example.org';
  assert.equal((await handler({ body: valid, ip: '1' })).status, 200);
  assert.deepEqual(sent.map((mail) => mail.to[0]), ['primero@example.org', 'segundo@example.org']);
  assert.match(sent[0].html, /&lt;Ana&gt;/);
  assert.equal((await handler({ body: { ...valid, to: 'attacker@example.org' }, ip: '1' })).status, 400);
});

test('desactivado, destinatarios inválidos o fallo de lectura no envían correo', async () => {
  for (const getSettings of [async () => null, async () => ({ ...settings, enabled: false }), async () => ({ enabled: true, recipients: [{ email: 'no' }] }), async () => { throw new Error('DB'); }]) {
    const handler = factory({ getSettings, sendEmail: async () => assert.fail('No debe enviar') });
    assert.equal((await handler({ body: valid, ip: '1' })).status, 503);
  }
});

test('Resend con error devuelto o excepción no informa éxito', async () => {
  for (const sendEmail of [async () => ({ error: { message: 'failed' } }), async () => { throw new Error('network'); }]) {
    assert.equal((await factory({ sendEmail })({ body: valid, ip: '1' })).status, 502);
  }
});

test('CAPTCHA exige éxito, action y hostname; producción nunca lo omite', async () => {
  assert.equal((await factory({ env: { ...env, NODE_ENV: 'production' } })({ body: valid, ip: '1' })).status, 503);
  for (const [result, expected] of [
    [{ success: false }, 400], [{ success: true, action: 'other', hostname: 'example.org' }, 400],
    [{ success: true, action: 'contact', hostname: 'other.org' }, 400],
    [{ success: true, action: 'contact', hostname: 'example.org' }, 200],
  ]) {
    const handler = factory({ env: { ...env, TURNSTILE_SECRET_KEY: 'fake', TURNSTILE_HOSTNAME: 'example.org' }, fetchImpl: async () => ({ ok: true, json: async () => result }) });
    assert.equal((await handler({ body: { ...valid, captchaToken: 'token' }, ip: '1' })).status, expected);
  }
});

test('honeypot no envía; límite de solicitudes expira', async () => {
  let time = 0;
  const handler = factory({ now: () => time, sendEmail: async () => assert.fail('No debe enviar') });
  for (let i = 0; i < 5; i++) assert.equal((await handler({ body: { ...valid, website: 'bot' }, ip: '1' })).status, 200);
  assert.equal((await handler({ body: valid, ip: '1' })).status, 429);
  time = 600001;
  assert.equal((await handler({ body: {}, ip: '1' })).status, 400);
});
