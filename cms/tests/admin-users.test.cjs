const test = require('node:test');
const assert = require('node:assert/strict');
const { checkUserChange, withoutSuperAdmins, ROLE_ERROR, SUPER_ADMIN_ERROR } = require('../src/setup/admin-users');

test('candado de usuarios: Dirección solo asigna Editor BAMX o Dirección y no toca al Administrador', () => {
  const base = { actorIsSuperAdmin: false, assignableIds: [3, 4] };
  assert.equal(checkUserChange({ ...base, roles: [3] }), null, 'crear un Editor BAMX');
  assert.equal(checkUserChange({ ...base, roles: ['4'] }), null, 'ids como texto también');
  assert.equal(checkUserChange({ ...base, roles: [{ id: 3 }, { id: 4 }] }), null);
  assert.equal(checkUserChange({ ...base, roles: [1] }), ROLE_ERROR, 'nunca Super Admin');
  assert.equal(checkUserChange({ ...base, roles: [3, 1] }), ROLE_ERROR, 'ni mezclado con otro');
  assert.equal(checkUserChange({ ...base, roles: [] }), ROLE_ERROR, 'una cuenta necesita un rol');
  assert.equal(checkUserChange({ ...base, roles: undefined }), null, 'editar sin tocar los roles');
  assert.equal(checkUserChange({ ...base, targetIsSuperAdmin: true }), SUPER_ADMIN_ERROR, 'no edita ni borra al Administrador');
  assert.equal(checkUserChange({ ...base, actorIsSuperAdmin: true, roles: [1], targetIsSuperAdmin: true }), null, 'el Administrador puede todo');
});

test('rol Dirección: sin tokens, webhooks, marketplace, roles editables ni Content-Type Builder', () => {
  const { ROLES, DIRECCION_ACTIONS } = require('../src/setup/editorial');
  const settings = ROLES['bamx-direccion'].settings(new Set(['plugin::i18n.locale.create', 'admin::webhooks.read']));
  for (const forbidden of ['api-tokens', 'transfer', 'webhooks', 'marketplace', 'roles.create', 'roles.update', 'roles.delete', 'content-type-builder']) {
    assert.equal(settings.some((action) => action.includes(forbidden)), false, `Dirección no debe tener ${forbidden}`);
  }
  assert.ok(settings.includes('plugin::i18n.locale.create'), 'idiomas si el plugin existe');
  assert.ok(DIRECCION_ACTIONS.includes('admin::users.create'));
  assert.ok(ROLES['bamx-direccion'].contentTypes.includes('api::bank-account.bank-account'), 'Dirección edita los datos bancarios');
  assert.equal(ROLES['bamx-editor'].contentTypes.includes('api::bank-account.bank-account'), false, 'la editora no');
});

test('lista de usuarios: sin cuentas de Super Admin y con el total ajustado', () => {
  const page = withoutSuperAdmins({
    results: [
      { id: 1, roles: [{ code: 'strapi-super-admin' }] },
      { id: 2, roles: [{ code: 'bamx-direccion' }] },
      { id: 3, roles: [{ code: 'bamx-editor' }] },
    ],
    pagination: { page: 1, pageSize: 2, total: 3, pageCount: 2 },
  });
  assert.deepEqual(page.results.map((user) => user.id), [2, 3]);
  assert.deepEqual(page.pagination, { page: 1, pageSize: 2, total: 2, pageCount: 1 });
  const untouched = { results: [{ id: 2, roles: [{ code: 'bamx-editor' }] }], pagination: { total: 1, pageSize: 10 } };
  assert.deepEqual(withoutSuperAdmins(untouched), untouched, 'sin Super Admin en la página: igual');
});
