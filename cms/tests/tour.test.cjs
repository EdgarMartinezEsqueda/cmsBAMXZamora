const test = require('node:test');
const assert = require('node:assert/strict');

test('recorrido guiado: pasos bien escritos y tipos del menú existentes', async () => {
  const { GENERAL_STEPS, CONTENT_STEPS, EDIT_STEPS, CONTENT_TYPES, isValidStep } = await import('../src/admin/tour/steps.mjs');
  for (const step of [...GENERAL_STEPS, ...CONTENT_STEPS, ...EDIT_STEPS]) {
    assert.ok(isValidStep(step), `Paso inválido: ${step?.title}`);
  }
  assert.equal(GENERAL_STEPS.filter((step) => step.opensContentManager).length, 1, 'Un solo paso abre el Administrador de contenido');
  assert.ok(GENERAL_STEPS[0].find === undefined, 'La bienvenida va centrada');
  assert.ok(CONTENT_STEPS.at(-1).find === undefined, 'El cierre va centrado');
  const fs = require('node:fs');
  const path = require('node:path');
  // Cada tipo que explica el recorrido existe en el proyecto (si se renombra uno, la prueba avisa).
  for (const { uid } of CONTENT_TYPES) {
    const name = uid.split('.').pop();
    assert.ok(fs.existsSync(path.join(__dirname, '..', 'src', 'api', name, 'content-types', name, 'schema.json')), `No existe ${uid}`);
  }
  assert.equal(isValidStep({ title: 'x', text: 'y', find: { type: 'link', fragment: 'sin-barra' } }), false);
  assert.equal(isValidStep({ title: '', text: 'y' }), false);
});
