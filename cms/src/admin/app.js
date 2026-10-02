import bamxLogo from './extensions/bamx-logo.png';

// Preferencia inicial para este panel; se respeta la elección posterior de cada usuario.
try {
  if (typeof window !== 'undefined' && !window.localStorage.getItem('strapi-admin-language')) {
    window.localStorage.setItem('strapi-admin-language', 'es');
  }
} catch { /* El panel sigue funcionando si el navegador bloquea el almacenamiento. */ }

// "Configuraciones" solo para el Super Admin. Strapi muestra ese enlace a cualquier usuario (ahí
// están la versión y los planes de Strapi) y no hay permiso que lo quite, así que se oculta aquí.
// Es comodidad para las editoras, no seguridad: lo que cada rol puede hacer lo decide el servidor
// (src/setup/editorial.js). Depende del HTML del panel: revisar al actualizar Strapi.
const SUPER_ADMIN = 'strapi-super-admin';
const SETTINGS_PATH = /\/settings(\/|$)/;

function hideSettingsForEditors() {
  if (typeof window === 'undefined' || window.__bamxSettingsGuard) return;
  window.__bamxSettingsGuard = true;
  const root = document.documentElement;
  let role = null; // null: aún no se sabe · 'super' · 'editor'

  // Oculto por defecto: el enlace solo aparece cuando se confirma que es Super Admin.
  const style = document.createElement('style');
  style.textContent = 'html:not([data-bamx-super-admin]) a[href$="/settings"] { display: none !important; }';
  document.head.appendChild(style);

  const leaveSettings = () => {
    const { pathname } = window.location;
    if (role !== 'editor' || !SETTINGS_PATH.test(pathname)) return;
    window.location.replace(`${pathname.slice(0, pathname.search(SETTINGS_PATH))}/`);
  };
  const setRole = (next) => {
    role = next;
    if (role === 'super') root.dataset.bamxSuperAdmin = '1';
    else delete root.dataset.bamxSuperAdmin;
    leaveSettings();
  };

  // El rol se lee de la respuesta que el propio panel pide al entrar (GET /admin/users/me):
  // no se guarda ni se toca ninguna credencial.
  const nativeFetch = window.fetch.bind(window);
  window.fetch = async (input, init) => {
    const response = await nativeFetch(input, init);
    try {
      const url = new URL(typeof input === 'string' ? input : input.url, window.location.href);
      const method = (init?.method || (typeof input === 'string' ? 'GET' : input.method) || 'GET').toUpperCase();
      if (url.pathname.endsWith('/admin/logout')) setRole(null);
      else if (method === 'GET' && url.pathname.endsWith('/admin/users/me') && response.ok) {
        const roles = (await response.clone().json())?.data?.roles;
        if (Array.isArray(roles)) setRole(roles.some((item) => item?.code === SUPER_ADMIN) ? 'super' : 'editor');
      }
    } catch { /* Si no se puede leer, el enlace se queda oculto. */ }
    return response;
  };

  // Quien no es Super Admin y llega a Configuraciones por la dirección o el historial vuelve al inicio.
  for (const method of ['pushState', 'replaceState']) {
    const original = window.history[method].bind(window.history);
    window.history[method] = (...args) => { original(...args); leaveSettings(); };
  }
  window.addEventListener('popstate', leaveSettings);
}

hideSettingsForEditors();

export default {
  config: {
    locales: ['es'],
    tutorials: false,
    notifications: { releases: false },
    // Marca del banco en el login y en el menú (en vez del logo de Strapi).
    auth: { logo: bamxLogo },
    menu: { logo: bamxLogo },
    translations: {
      es: {
        'Auth.form.welcome.title': 'Administración de BAMX Zamora',
        'Auth.form.welcome.subtitle': 'Accede para editar y publicar el contenido del sitio.',
        'app.components.LeftMenu.navbrand.title': 'BAMX Zamora',
        'app.components.LeftMenu.navbrand.workplace': 'Contenido del sitio',
      },
    },
  },
  bootstrap() {},
};
