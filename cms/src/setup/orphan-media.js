'use strict';

// Archivos que quedan sin uso. Strapi no borra los archivos de una entrada al borrarla o al
// reemplazarlos: el PDF de un boletín borrado o la foto de un caso de apadrinamiento seguirían en
// línea para quien tenga el enlace (y las editoras no pueden borrar en la biblioteca de medios).
// En estos tipos, tras borrar, editar o publicar, se borran los archivos que el documento usaba
// y que ya no usa ningún otro contenido. Las Páginas nuevas no se incluyen: sus imágenes van en
// bloques y suelen reutilizarse; esas las limpia el administrador (scripts/orphan-media.cjs).
const UIDS = ['api::newsletter.newsletter', 'api::sponsored-case.sponsored-case', 'api::program.program', 'api::partner.partner'];
const ACTIONS = ['delete', 'update', 'publish', 'unpublish', 'discardDraft'];

/** Campos de archivo de primer nivel del tipo (leídos del esquema). */
const mediaFields = (strapi, uid) => Object.entries(strapi.getModel(uid).attributes)
  .filter(([, attribute]) => attribute.type === 'media').map(([name]) => name);

/** Ids de archivo de un documento ya consultado. */
function fileIdsOf(document, fields) {
  return fields.flatMap((field) => {
    const value = document?.[field];
    return (Array.isArray(value) ? value : [value]).map((file) => file?.id).filter(Number.isInteger);
  });
}

/** Candidatos que ya no aparecen entre los usados (función pura, con prueba). */
const unusedFiles = (candidates, used) => [...new Set(candidates)].filter((id) => !used.has(id));

/** Tabla y columna que enlazan archivos con contenidos (files_related_mph / file_id). */
function relationTable(strapi) {
  const joinTable = strapi.db.metadata.get('plugin::upload.file').attributes.related?.joinTable;
  return { table: joinTable?.name ?? 'files_related_mph', column: joinTable?.joinColumn?.name ?? 'file_id' };
}

async function usedFileIds(strapi, ids) {
  if (ids.length === 0) return new Set();
  const { table, column } = relationTable(strapi);
  const rows = await strapi.db.connection(table).whereIn(column, ids).distinct(column);
  return new Set(rows.map((row) => row[column]));
}

async function filesOfDocument(strapi, uid, documentId) {
  const fields = mediaFields(strapi, uid);
  if (fields.length === 0 || !documentId) return [];
  const ids = [];
  for (const status of ['draft', 'published']) {
    const document = await strapi.documents(uid).findOne({ documentId, status, fields: ['id'], populate: fields });
    ids.push(...fileIdsOf(document, fields));
  }
  return ids;
}

/** Borra de la biblioteca los archivos que ya no usa nadie. Devuelve cuántos borró. */
async function removeUnused(strapi, candidates) {
  const orphans = unusedFiles(candidates, await usedFileIds(strapi, [...new Set(candidates)]));
  let removed = 0;
  for (const id of orphans) {
    try {
      const file = await strapi.db.query('plugin::upload.file').findOne({ where: { id } });
      if (!file) continue;
      await strapi.plugin('upload').service('upload').remove(file);
      removed += 1;
    } catch (error) {
      // La acción de la editora ya se hizo: un archivo que no se pudo borrar solo se registra.
      strapi.log.error(`[orphan-media] No se pudo borrar el archivo ${id}: ${error?.message || error}`);
    }
  }
  if (removed) strapi.log.info(`[orphan-media] ${removed} archivo(s) sin uso borrados`);
  return removed;
}

function registerOrphanMediaCleanup(strapi) {
  strapi.documents.use(async (context, next) => {
    if (!UIDS.includes(context.uid) || !ACTIONS.includes(context.action)) return next();
    const documentId = context.params?.documentId;
    let before = [];
    try {
      before = await filesOfDocument(strapi, context.uid, documentId);
    } catch (error) {
      strapi.log.error(`[orphan-media] ${error?.message || error}`);
    }
    const result = await next();
    if (before.length) await removeUnused(strapi, before);
    return result;
  });
}

module.exports = { UIDS, unusedFiles, fileIdsOf, relationTable, registerOrphanMediaCleanup };
