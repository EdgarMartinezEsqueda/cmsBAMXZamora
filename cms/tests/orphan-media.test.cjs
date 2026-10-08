const test = require('node:test');
const assert = require('node:assert/strict');
const { fileIdsOf, unusedFiles, UIDS } = require('../src/setup/orphan-media');

test('archivos sin uso: solo los que ya no usa ningún contenido', () => {
  assert.deepEqual(unusedFiles([1, 2, 2, 3], new Set([2])), [1, 3], 'un archivo usado en otro lugar no se borra');
  assert.deepEqual(unusedFiles([], new Set()), []);
  assert.deepEqual(fileIdsOf({ pdf: { id: 4 }, cover: null, gallery: [{ id: 5 }, { id: 'x' }] }, ['pdf', 'cover', 'gallery']), [4, 5]);
  assert.deepEqual(fileIdsOf(null, ['pdf']), []);
  assert.ok(UIDS.includes('api::sponsored-case.sponsored-case'), 'las fotos de casos se borran con el caso');
  assert.equal(UIDS.includes('api::page.page'), false, 'las imágenes de las páginas no se tocan');
});
