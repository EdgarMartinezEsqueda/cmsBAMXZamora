'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }) {
    // Campo "Icono" (global::icon): guarda la clave de un icono del catálogo. El selector visual
    // del panel está en src/admin/components/IconPicker.jsx.
    strapi.customFields.register({ name: 'icon', type: 'string' });
    // Un caso de apadrinamiento no se publica sin consentimiento ni vencido.
    require('./setup/sponsored-cases').registerPublishGuard(strapi);
    // Una página creada desde el panel no puede usar el slug de una ruta del sitio.
    require('./setup/pages').registerSlugGuard(strapi);
    // Archivos de boletines, casos, programas y aliados que quedan sin uso se borran.
    require('./setup/orphan-media').registerOrphanMediaCleanup(strapi);
    // "Estadísticas del proyecto" del panel (tokens, webhooks…): solo para el Super Admin.
    require('./setup/admin-homepage').restrictKeyStatistics(strapi);
    // Correos (recuperar contraseña…) con el diseño de BAMX: se rehacen al publicar Datos del sitio.
    require('./setup/email-templates').registerEmailTemplateRefresh(strapi);
    // Cualquier cambio de contenido vacía la caché del sitio público.
    require('./setup/content-cache').registerContentCacheInvalidation(strapi);
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    await require('./setup/editorial')(strapi);
    require('./setup/content-cache').subscribeMediaChanges(strapi);
    await require('./setup/email-templates').applyEmailTemplates(strapi);
  },
};
