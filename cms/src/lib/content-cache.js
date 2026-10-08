'use strict';

// Caché en memoria de lo que responde /api/content (ya convertido por los mappers). Cualquier
// cambio de contenido o de la biblioteca de medios la vacía entera (setup/content-cache.js), así
// que lo publicado se ve en la siguiente petición. La caducidad es solo una red de seguridad para
// cambios hechos fuera de este proceso (p. ej. `pnpm run seed` con Strapi encendido).
// No se guardan errores ni respuestas vacías (404), y hay un tope de entradas: un slug
// inventado no ocupa memoria.
function createContentCache({ maxAgeMs = 5 * 60 * 1000, maxEntries = 300, now = () => Date.now() } = {}) {
  const entries = new Map();

  function get(key, load) {
    const cached = entries.get(key);
    if (cached && now() - cached.at < maxAgeMs) return cached.promise;
    const entry = { at: now() };
    entry.promise = Promise.resolve().then(load).then(
      (value) => {
        if (value == null && entries.get(key) === entry) entries.delete(key);
        return value;
      },
      (error) => {
        if (entries.get(key) === entry) entries.delete(key);
        throw error;
      },
    );
    entries.delete(key);
    entries.set(key, entry);
    // Tope: se descarta la entrada más antigua (orden de inserción del Map).
    while (entries.size > maxEntries) entries.delete(entries.keys().next().value);
    return entry.promise;
  }

  return { get, clear: () => entries.clear(), get size() { return entries.size; } };
}

// Una sola caché por proceso: la comparten el servicio público y la invalidación.
module.exports = { createContentCache, contentCache: createContentCache() };
