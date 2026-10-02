module.exports = ({ env }) => [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  // Permite mostrar los PDF de /uploads dentro del sitio (visor de boletines). Ver el archivo.
  { name: 'global::pdf-embed', config: { origins: env.array('PDF_EMBED_ORIGINS', ['http://localhost:5173', 'http://127.0.0.1:5173']) } },
  { name: 'strapi::cors', config: { origin: env.array('CORS_ORIGINS', ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://127.0.0.1:1337']) } },
  'strapi::poweredBy',
  'strapi::query',
  {
    name: 'strapi::body',
    config: {
      jsonLimit: '1mb',
      includeUnparsed: true,
      formLimit: '1mb',
      formidable: { maxFileSize: 15 * 1024 * 1024, maxTotalFileSize: 16 * 1024 * 1024, maxFiles: 1 },
    },
  },
  'global::contact-input',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
