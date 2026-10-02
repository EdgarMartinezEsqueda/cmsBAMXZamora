module.exports = ({ env }) => ({
  url: '/gestion-bamx',
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
    cookie: { path: '/gestion-bamx' },
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  secrets: {
    encryptionKey: env('ENCRYPTION_KEY'),
  },
  // Botón "Vista previa" del panel: abre la página del sitio con el borrador (src/lib/preview.js).
  preview: {
    enabled: true,
    config: {
      allowedOrigins: [env('SITE_URL', 'http://localhost:5173')],
      handler: (uid, params) => require('../src/lib/preview').previewUrl(strapi, env('SITE_URL', 'http://localhost:5173'), uid, params),
    },
  },
  flags: {
    nps: env.bool('FLAG_NPS', false),
    promoteEE: env.bool('FLAG_PROMOTE_EE', false),
    docLinks: env.bool('FLAG_DOC_LINKS', true),
  },
});
