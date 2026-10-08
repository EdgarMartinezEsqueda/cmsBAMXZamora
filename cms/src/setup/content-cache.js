'use strict';
const { contentCache } = require('../lib/content-cache');

// Vacía la caché del contenido público (lib/content-cache.js) en cuanto cambia algo: guardar,
// publicar, despublicar o borrar cualquier contenido, y subir, editar (p. ej. el texto
// alternativo) o borrar un archivo de la biblioteca de medios.
const WRITE_ACTIONS = ['create', 'update', 'delete', 'publish', 'unpublish', 'discardDraft'];

function registerContentCacheInvalidation(strapi) {
  strapi.documents.use(async (context, next) => {
    const result = await next();
    if (WRITE_ACTIONS.includes(context.action) && String(context.uid).startsWith('api::')) contentCache.clear();
    return result;
  });
}

function subscribeMediaChanges(strapi) {
  const clear = () => contentCache.clear();
  strapi.db.lifecycles.subscribe({
    models: ['plugin::upload.file'],
    afterCreate: clear, afterUpdate: clear, afterDelete: clear, afterUpdateMany: clear, afterDeleteMany: clear,
  });
}

module.exports = { registerContentCacheInvalidation, subscribeMediaChanges };
