const test = require('node:test');
const assert = require('node:assert/strict');
const { createContentCache } = require('../src/lib/content-cache');

test('caché del contenido público: una consulta por clave, sin guardar errores ni vacíos', async () => {
  let clock = 0;
  const cache = createContentCache({ maxAgeMs: 1000, maxEntries: 2, now: () => clock });
  let calls = 0;
  const load = async () => { calls += 1; return { n: calls }; };

  const [a, b] = await Promise.all([cache.get('k', load), cache.get('k', load)]);
  assert.equal(calls, 1, 'dos peticiones a la vez: una sola consulta');
  assert.equal(a, b);
  assert.equal(await cache.get('k', load), a, 'la siguiente sale de la caché');

  cache.clear();
  assert.deepEqual(await cache.get('k', load), { n: 2 }, 'tras un cambio se vuelve a consultar');
  clock = 1500;
  assert.deepEqual(await cache.get('k', load), { n: 3 }, 'caduca como red de seguridad');

  await assert.rejects(cache.get('error', async () => { throw new Error('caída'); }));
  assert.deepEqual(await cache.get('error', async () => 'ok'), 'ok', 'un error no se guarda');
  assert.equal(await cache.get('vacio', async () => null), null);
  assert.equal(await cache.get('vacio', async () => 'ya existe'), 'ya existe', 'un 404 no se guarda');

  for (const key of ['x', 'y', 'z']) await cache.get(key, async () => key);
  assert.equal(cache.size <= 2, true, 'tope de entradas: un slug inventado no ocupa memoria');
});
