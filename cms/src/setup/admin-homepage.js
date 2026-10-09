'use strict';

// "Estadísticas del proyecto" de la página de inicio del panel (cuántos API tokens, webhooks,
// administradores… hay). Strapi la declara solo para el Super Admin, pero en la 5.53 no lo
// cumple: la página de inicio ignora esa restricción y GET /admin/homepage/key-statistics solo
// exige haber iniciado sesión. Aquí el servidor responde 403 a quien no es Super Admin; el widget
// se oculta en src/admin/app.js. Revisar al actualizar Strapi.
const SUPER_ADMIN = 'strapi-super-admin';
const CONTROLLER = 'admin::homepage';
const ACTION = 'getKeyStatistics';

const isSuperAdmin = (user) => Array.isArray(user?.roles) && user.roles.some((role) => role?.code === SUPER_ADMIN);

function restrictKeyStatistics(strapi) {
  try {
    strapi.get('controllers').extend(CONTROLLER, (controller) => {
      if (typeof controller?.[ACTION] !== 'function') throw new Error(`${CONTROLLER}.${ACTION} no existe`);
      const original = controller[ACTION];
      return {
        ...controller,
        async [ACTION](ctx, ...rest) {
          if (!isSuperAdmin(ctx.state?.user)) return ctx.forbidden();
          return original.call(controller, ctx, ...rest);
        },
      };
    });
  } catch (error) {
    // Si una actualización de Strapi cambia el nombre, que se note en el log en vez de fallar callado.
    strapi.log.warn(`[admin-homepage] No se pudo restringir las estadísticas del panel: ${error?.message || error}`);
  }
}

module.exports = { restrictKeyStatistics, isSuperAdmin };
