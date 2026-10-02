const fs = require('node:fs/promises');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const REPO_ROOT = path.resolve(__dirname, '../../..');
const PUBLIC_DIR = path.join(REPO_ROOT, 'public');
const MIME_TYPES = { '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.pdf': 'application/pdf' };

/** Importa los datos iniciales de src/content/<nombre>.initial.js. */
async function importInitial(name) {
  return import(pathToFileURL(path.join(REPO_ROOT, 'src/content', `${name}.initial.js`)).href);
}

/**
 * Sube un archivo de public/ a la biblioteca de medios, una sola vez por nombre.
 * Solo acepta rutas dentro de public/: nunca rutas externas ni de un cliente.
 */
async function uploadOnce(strapi, { name, file, alt = '' }) {
  const existing = await strapi.db.query('plugin::upload.file').findOne({ where: { name } });
  if (existing) return existing;
  const filepath = path.resolve(PUBLIC_DIR, `.${file}`);
  if (!filepath.startsWith(PUBLIC_DIR + path.sep)) throw new Error(`Ruta fuera de public/: ${file}`);
  const mimetype = MIME_TYPES[path.extname(filepath).toLowerCase()];
  if (!mimetype) throw new Error(`Tipo de archivo no permitido: ${file}`);
  const { size } = await fs.stat(filepath);
  const [media] = await strapi.plugin('upload').service('upload').upload({
    data: { fileInfo: { name, alternativeText: alt } },
    files: { filepath, originalFilename: name, mimetype, size },
  });
  return media;
}

/** ["a", "b"] → [{ text: "a" }, { text: "b" }] para componentes shared.list-item. */
const toItems = (texts) => texts.map((text) => ({ text }));

/**
 * Rellena en un single type existente solo los campos que están vacíos (null), sin tocar los
 * demás. `builders` es { campo: async () => valor }: solo se ejecutan (y suben medios) los que
 * faltan. Queda en borrador salvo que se pida publicar: publicar también publicaría cualquier
 * otro cambio del borrador que el cliente aún no quisiera mostrar.
 */
async function fillMissing(strapi, uid, builders, { publish = false } = {}) {
  const keys = Object.keys(builders);
  const draft = await strapi.documents(uid).findFirst({ status: 'draft', populate: keys });
  const missing = keys.filter((key) => draft[key] == null);
  if (missing.length === 0) return { created: false, filled: [] };
  const data = {};
  for (const key of missing) data[key] = await builders[key]();
  await strapi.documents(uid).update({ documentId: draft.documentId, data });
  if (publish) await strapi.documents(uid).publish({ documentId: draft.documentId });
  return { created: false, filled: missing, published: publish };
}

module.exports = { fillMissing, importInitial, toItems, uploadOnce };
