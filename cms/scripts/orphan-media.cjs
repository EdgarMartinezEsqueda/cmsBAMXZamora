const { createStrapi } = require('@strapi/strapi');
const path = require('node:path');
const { relationTable } = require('../src/setup/orphan-media');

// Solo lectura: lista los archivos de la biblioteca de medios que no usa ningún contenido
// (borradores incluidos). No borra nada: el administrador decide en la biblioteca.
// Uso: pnpm run media:huerfanos
process.env.STRAPI_TELEMETRY_DISABLED = 'true';
async function main() {
  const root = path.resolve(__dirname, '..');
  const app = createStrapi({ appDir: root, distDir: root });
  await app.load();
  try {
    const { table, column } = relationTable(app);
    const used = new Set((await app.db.connection(table).distinct(column)).map((row) => row[column]));
    const files = await app.db.query('plugin::upload.file').findMany({ select: ['id', 'name', 'url', 'size', 'createdAt'], orderBy: { createdAt: 'asc' } });
    const orphans = files.filter((file) => !used.has(file.id));
    for (const file of orphans) {
      console.log(`${String(file.createdAt).slice(0, 10)}  ${String(Math.round(file.size)).padStart(6)} KB  ${file.name}  (${file.url})`);
    }
    console.log(`${orphans.length} de ${files.length} archivos no los usa ningún contenido.`);
  } finally {
    await app.destroy().catch(() => {});
  }
}

main().then(() => process.exit(0)).catch((error) => { console.error(error.message); process.exit(1); });
