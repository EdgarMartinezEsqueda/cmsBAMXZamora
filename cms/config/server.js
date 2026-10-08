module.exports = ({ env }) => ({
  host: env('HOST', '127.0.0.1'),
  port: env.int('PORT', 1337),
  // Dirección pública del panel: la usan los enlaces de los correos (recuperar contraseña).
  url: env('PUBLIC_URL', ''),
  // Solo activar detrás de un proxy controlado que sobrescriba X-Forwarded-For.
  proxy: { koa: env.bool('TRUST_NGINX_PROXY', false), ipHeader: 'X-Forwarded-For', maxIpsCount: 1 },
  app: {
    keys: env.array('APP_KEYS'),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});
