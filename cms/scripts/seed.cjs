const { createStrapi } = require('@strapi/strapi');
const path = require('node:path');

// Carga inicial desde src/content/*.initial.js. Nunca sobrescribe lo que ya tiene contenido: en
// un single type existente solo rellena las secciones vacías, en borrador (--publish para publicar).
// Uso: npm run seed [clave] [-- --publish]
const seeders = {
  home: require('./seeders/home.cjs'),
  site: require('./seeders/site.cjs'),
  bank: require('./seeders/bank.cjs'),
  programs: require('./seeders/programs.cjs'),
  partners: require('./seeders/partners.cjs'),
  about: require('./seeders/about.cjs'),
  faq: require('./seeders/faq.cjs'),
  donate: require('./seeders/donate.cjs'),
  beneficiaries: require('./seeders/sponsorship.cjs').seedBeneficiaries,
  sponsorship: require('./seeders/sponsorship.cjs').seedSponsorship,
  sponsoredCases: require('./seeders/sponsorship.cjs').seedSponsoredCases,
  contactPage: require('./seeders/pages.cjs').seedContactPage,
  programsPage: require('./seeders/pages.cjs').seedProgramsPage,
  navigation: require('./seeders/pages.cjs').seedNavigation,
};

process.env.STRAPI_TELEMETRY_DISABLED = 'true';
async function main() {
  const args = process.argv.slice(2);
  // En producción solo con una bandera explícita (primera carga del VPS, deploy/README.md).
  if (process.env.NODE_ENV === 'production' && !args.includes('--allow-production')) {
    throw new Error('Ejecuta la importación inicial en desarrollo (o usa --allow-production una sola vez).');
  }
  const publish = args.includes('--publish');
  const requested = args.find((arg) => !arg.startsWith('--')) || 'all';
  if (requested !== 'all' && !Object.hasOwn(seeders, requested)) {
    throw new Error(`Clave desconocida: ${requested}. Usa: all, ${Object.keys(seeders).join(', ')}.`);
  }
  const keys = requested === 'all' ? Object.keys(seeders) : [requested];
  const root = path.resolve(__dirname, '..');
  const app = createStrapi({ appDir: root, distDir: root });
  let finished = false;
  // Al cerrar contra MySQL remoto, tareas pendientes de Strapi (p. ej. las de la biblioteca de
  // medios tras subir archivos) pueden fallar al perder el pool ("aborted", KnexTimeoutError).
  // Llegan como promesa rechazada o como excepción no capturada. Si la carga ya terminó, no la
  // invalidan: se avisa sin marcar el script como fallido. Antes de terminar, son un fallo.
  // No correr la carga mientras `strapi develop` se reinicia: ambos sincronizan el esquema.
  const onTeardownError = (error) => {
    if (finished) { console.warn(`Aviso al cerrar: ${error?.message || error}`); return; }
    console.error(error);
    process.exit(1);
  };
  process.on('unhandledRejection', onTeardownError);
  process.on('uncaughtException', onTeardownError);
  try {
    await app.load();
    for (const key of keys) {
      const result = await seeders[key](app, { publish });
      if (result.created && result.drafts) console.log(`${key}: ${result.drafts} creados como BORRADOR (falta confirmar consentimiento y vigencia en el panel).`);
      else if (result.created) console.log(`${key}: creado y publicado.`);
      else if (result.filled?.length) console.log(`${key}: se rellenaron ${result.filled.join(', ')} ${result.published ? 'y se publicó' : 'en borrador (publícalo en el panel o usa --publish)'}.`);
      else console.log(`${key}: ya existe y está completo, no se sobrescribió.`);
    }
    finished = true;
  } finally {
    try {
      await app.destroy();
    } catch (error) {
      if (!finished) throw error;
      console.warn(`Aviso al cerrar: ${error?.message || error}`);
    }
    // Strapi.destroy() cierra la base y luego llama a process.removeAllListeners(): borra estos
    // manejadores justo antes de que el pool rechace las conexiones abortadas. Se registran de nuevo.
    process.on('unhandledRejection', onTeardownError);
    process.on('uncaughtException', onTeardownError);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
