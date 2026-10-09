const test = require('node:test');
const assert = require('node:assert/strict');
const { adminResetPassword, usersPermissionsTemplates, parseFrom, MARKER } = require('../src/setup/email-templates');

const site = {
  address: 'Av. Valladolid 328 <b>', city: 'Zamora <% process.exit() %>',
  linktreeUrl: 'https://linktr.ee/bamx',
  socialLinks: [
    { network: 'facebook', url: 'https://facebook.com/bamx' },
    { network: 'instagram', url: 'javascript:alert(1)' },
    { network: 'myspace', url: 'https://myspace.com/x' },
  ],
};

test('correo del panel: diseño de BAMX, variables de Strapi y datos del sitio escapados', () => {
  const { subject, html, text } = adminResetPassword('https://ejemplo.dominio.org/ruta', site);
  assert.match(subject, /Restablece tu contraseña/);
  assert.ok(html.startsWith(MARKER));
  // Solo las variables previstas por Strapi; un "<%" del panel queda escapado (no se ejecuta).
  assert.deepEqual([...new Set(html.match(/<%=?[^%]*%>/g))].sort(), ['<%= url %>', '<%= user.firstname %>']);
  assert.equal(html.includes('process.exit'), true, 'el texto se muestra…');
  assert.equal(html.includes('<% process.exit'), false, '…pero escapado');
  assert.ok(html.includes('Av. Valladolid 328 &lt;b&gt;'), 'el HTML del panel se muestra como texto');
  assert.match(html, /https:\/\/ejemplo\.dominio\.org\/assets\/images\/logo\.png/);
  assert.match(html, /href="https:\/\/facebook\.com\/bamx"/);
  assert.equal(html.includes('javascript:'), false, 'solo enlaces https');
  assert.equal(html.includes('myspace'), false, 'solo redes conocidas');
  assert.match(html, /assets\/email\/linktree\.png/, 'el Linktree de Datos del sitio también');
  assert.match(text, /<%= url %>/);
});

test('plantillas de Usuarios y permisos con sus variables y remitente legible', () => {
  const templates = usersPermissionsTemplates('https://ejemplo.dominio.org', null);
  assert.match(templates.reset_password.message, /<%= URL %>\?code=<%= TOKEN %>/);
  assert.match(templates.email_confirmation.message, /<%= URL %>\?confirmation=<%= CODE %>/);
  assert.deepEqual(parseFrom('BAMX Zamora <no-responder@bamx.org>'), { name: 'BAMX Zamora', email: 'no-responder@bamx.org' });
  assert.equal(parseFrom(''), null);
});
