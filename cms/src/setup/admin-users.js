'use strict';

// Candado de usuarios del panel. En Strapi gratuito, quien tiene permiso de crear o editar
// usuarios puede asignar el rol Super Admin a cualquiera, incluso a sí mismo. El rol "Dirección"
// sí gestiona usuarios, así que aquí se limita en el servidor. Quien no es Super Admin:
// - solo puede asignar los roles Editor BAMX o Dirección;
// - no puede editar, desactivar ni borrar una cuenta de Super Admin;
// - en la lista de roles (selector al crear un usuario) solo ve esos dos;
// - no ve las cuentas de Super Admin (ni en la lista de usuarios ni abriendo su dirección).
// Revisar al actualizar Strapi: si los controladores cambian, se avisa en el log.
const SUPER_ADMIN = 'strapi-super-admin';
const ASSIGNABLE_ROLES = ['bamx-editor', 'bamx-direccion'];
const ROLE_ERROR = 'Solo puedes asignar los roles Editor BAMX o Dirección.';
const SUPER_ADMIN_ERROR = 'Las cuentas de Administrador solo las puede cambiar otro Administrador.';

const isSuperAdmin = (user) => Array.isArray(user?.roles) && user.roles.some((role) => role?.code === SUPER_ADMIN);
const roleId = (role) => Number(typeof role === 'object' && role !== null ? role.id : role);

/**
 * Decide si un cambio de usuario está permitido (regla pura, con prueba).
 * roles: ids que se quieren asignar (undefined si el cambio no toca los roles).
 */
function checkUserChange({ actorIsSuperAdmin, assignableIds, roles, targetIsSuperAdmin = false }) {
  if (actorIsSuperAdmin) return null;
  if (targetIsSuperAdmin) return SUPER_ADMIN_ERROR;
  if (roles !== undefined) {
    const ids = (Array.isArray(roles) ? roles : [roles]).map(roleId);
    if (ids.length === 0 || ids.some((id) => !assignableIds.includes(id))) return ROLE_ERROR;
  }
  return null;
}

/** Lista de usuarios sin las cuentas de Super Admin, con el total ajustado (regla pura, con prueba). */
function withoutSuperAdmins(page) {
  if (!Array.isArray(page?.results)) return page;
  const results = page.results.filter((user) => !isSuperAdmin(user));
  const hidden = page.results.length - results.length;
  if (!hidden || !page.pagination) return { ...page, results };
  const total = Math.max(0, (page.pagination.total ?? 0) - hidden);
  const pageSize = page.pagination.pageSize || 1;
  return { ...page, results, pagination: { ...page.pagination, total, pageCount: Math.max(1, Math.ceil(total / pageSize)) } };
}

async function assignableRoleIds(strapi) {
  const roles = await strapi.db.query('admin::role').findMany({ where: { code: { $in: ASSIGNABLE_ROLES } }, select: ['id'] });
  return roles.map((role) => role.id);
}

async function isSuperAdminUser(strapi, id) {
  const user = await strapi.db.query('admin::user').findOne({ where: { id }, populate: ['roles'] });
  return isSuperAdmin(user);
}

function wrap(strapi, uid, actions) {
  try {
    strapi.get('controllers').extend(uid, (controller) => {
      const wrapped = { ...controller };
      for (const [name, guard] of Object.entries(actions)) {
        if (typeof controller?.[name] !== 'function') throw new Error(`${uid}.${name} no existe`);
        const original = controller[name];
        wrapped[name] = async (ctx, ...rest) => {
          if (isSuperAdmin(ctx.state?.user)) return original.call(controller, ctx, ...rest);
          const error = await guard(ctx);
          if (error) return ctx.forbidden(error);
          const result = await original.call(controller, ctx, ...rest);
          return result;
        };
      }
      return wrapped;
    });
  } catch (error) {
    strapi.log.warn(`[admin-users] No se pudo proteger ${uid}: ${error?.message || error}`);
  }
}

function protectAdminUsers(strapi) {
  const check = async (ctx, { roles, targetIds = [] }) => checkUserChange({
    actorIsSuperAdmin: false,
    assignableIds: await assignableRoleIds(strapi),
    roles,
    targetIsSuperAdmin: (await Promise.all(targetIds.map((id) => isSuperAdminUser(strapi, id)))).some(Boolean),
  });

  wrap(strapi, 'admin::user', {
    create: (ctx) => check(ctx, { roles: ctx.request.body?.roles ?? [] }),
    update: (ctx) => check(ctx, { roles: ctx.request.body?.roles, targetIds: [ctx.params.id] }),
    deleteOne: (ctx) => check(ctx, { targetIds: [ctx.params.id] }),
    deleteMany: (ctx) => check(ctx, { targetIds: Array.isArray(ctx.request.body?.ids) ? ctx.request.body.ids : [] }),
  });

  // Cuentas de Super Admin: quien no lo es no las ve en la lista ni al abrir su dirección (404).
  try {
    strapi.get('controllers').extend('admin::user', (controller) => {
      for (const name of ['find', 'findOne']) if (typeof controller?.[name] !== 'function') throw new Error(`admin::user.${name} no existe`);
      const { find, findOne } = controller;
      return {
        ...controller,
        async find(ctx, ...rest) {
          await find.call(controller, ctx, ...rest);
          if (!isSuperAdmin(ctx.state?.user) && ctx.body?.data) ctx.body = { ...ctx.body, data: withoutSuperAdmins(ctx.body.data) };
        },
        async findOne(ctx, ...rest) {
          if (!isSuperAdmin(ctx.state?.user) && await isSuperAdminUser(strapi, ctx.params.id)) return ctx.notFound('User does not exist');
          return findOne.call(controller, ctx, ...rest);
        },
      };
    });
  } catch (error) {
    strapi.log.warn(`[admin-users] No se pudieron ocultar las cuentas de Super Admin: ${error?.message || error}`);
  }

  // Lista de roles: quien no es Super Admin solo ve los que puede asignar.
  try {
    strapi.get('controllers').extend('admin::role', (controller) => {
      if (typeof controller?.findAll !== 'function') throw new Error('admin::role.findAll no existe');
      const original = controller.findAll;
      return {
        ...controller,
        async findAll(ctx, ...rest) {
          await original.call(controller, ctx, ...rest);
          if (!isSuperAdmin(ctx.state?.user) && Array.isArray(ctx.body?.data)) {
            ctx.body = { ...ctx.body, data: ctx.body.data.filter((role) => ASSIGNABLE_ROLES.includes(role.code)) };
          }
        },
      };
    });
  } catch (error) {
    strapi.log.warn(`[admin-users] No se pudo filtrar la lista de roles: ${error?.message || error}`);
  }
}

module.exports = { protectAdminUsers, checkUserChange, withoutSuperAdmins, ASSIGNABLE_ROLES, ROLE_ERROR, SUPER_ADMIN_ERROR };
