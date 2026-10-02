const test = require('node:test');
const assert = require('node:assert/strict');
const pdfEmbed = require('../src/middlewares/pdf-embed');

const run = async (path, { status = 200, csp = "default-src 'self';frame-ancestors 'self';object-src 'none'" } = {}) => {
  const headers = { 'Content-Security-Policy': csp, 'X-Frame-Options': 'SAMEORIGIN' };
  const ctx = {
    path, status,
    response: { get: (name) => headers[name] },
    remove: (name) => { delete headers[name]; },
    set: (name, value) => { headers[name] = value; },
  };
  await pdfEmbed({ origins: ['https://bamxzamora.org', 'http://localhost:5173'] })(ctx, async () => {});
  return headers;
};

test('solo los PDF de /uploads pueden mostrarse dentro del sitio', async () => {
  const pdf = await run('/uploads/boletin_abc.pdf');
  assert.equal(pdf['X-Frame-Options'], undefined);
  assert.match(pdf['Content-Security-Policy'], /frame-ancestors 'self' https:\/\/bamxzamora\.org http:\/\/localhost:5173/);
  assert.match(pdf['Content-Security-Policy'], /object-src 'none'/, 'el resto de la política se conserva');
  for (const path of ['/uploads/foto.webp', '/gestion-bamx', '/api/content/home', '/uploads/x.pdf.html']) {
    assert.equal((await run(path))['X-Frame-Options'], 'SAMEORIGIN', path);
  }
  assert.equal((await run('/uploads/no-existe.pdf', { status: 404 }))['X-Frame-Options'], 'SAMEORIGIN');
});

test('los orígenes permitidos no admiten comodines, rutas ni texto que inyecte la cabecera', () => {
  assert.deepEqual(pdfEmbed.toOrigins(['https://bamxzamora.org', '*', 'https://x.org/ruta', "https://x.org; script-src *", 'javascript:alert(1)', 'http://localhost:5173/']),
    ['https://bamxzamora.org', 'http://localhost:5173']);
});
