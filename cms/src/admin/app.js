// Preferencia inicial para este panel; se respeta la elección posterior de cada usuario.
try {
  if (typeof window !== 'undefined' && !window.localStorage.getItem('strapi-admin-language')) {
    window.localStorage.setItem('strapi-admin-language', 'es');
  }
} catch { /* El panel sigue funcionando si el navegador bloquea el almacenamiento. */ }

export default {
  config: {
    locales: ['es'],
    tutorials: false,
    notifications: { releases: false },
    translations: {
      es: {
        'Auth.form.welcome.title': 'Administración de BAMX Zamora',
        'Auth.form.welcome.subtitle': 'Accede para editar y publicar el contenido del sitio.',
      },
    },
  },
  bootstrap() {},
};
