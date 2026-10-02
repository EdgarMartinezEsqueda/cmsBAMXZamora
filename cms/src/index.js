'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }) {
    // Un caso de apadrinamiento no se publica sin consentimiento ni vencido.
    require('./setup/sponsored-cases').registerPublishGuard(strapi);
    // Una página creada desde el panel no puede usar el slug de una ruta del sitio.
    require('./setup/pages').registerSlugGuard(strapi);
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
  },
};
