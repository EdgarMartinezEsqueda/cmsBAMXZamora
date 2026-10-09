import bamxFavicon from './extensions/favicon.png';
import { setupTour } from './tour';
import bamxLogo from './extensions/bamx-logo.png';

// Preferencia inicial para este panel; se respeta la elección posterior de cada usuario.
try {
  if (typeof window !== 'undefined' && !window.localStorage.getItem('strapi-admin-language')) {
    window.localStorage.setItem('strapi-admin-language', 'es');
  }
  // Modo claro salvo que el usuario haya elegido otro en su perfil.
  if (typeof window !== 'undefined' && !window.localStorage.getItem('STRAPI_THEME')) {
    window.localStorage.setItem('STRAPI_THEME', 'light');
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
      if (url.pathname.endsWith('/admin/logout')) {
        setRole(null);
        // El recorrido guiado (./tour) deja de mostrar su botón al cerrar sesión.
        window.__bamxAdminUser = null;
        window.dispatchEvent(new Event('bamx:admin-user'));
      } else if (method === 'GET' && url.pathname.endsWith('/admin/users/me') && response.ok) {
        const data = (await response.clone().json())?.data;
        const roles = data?.roles;
        if (Array.isArray(roles)) {
          const isSuperAdmin = roles.some((item) => item?.code === SUPER_ADMIN);
          setRole(isSuperAdmin ? 'super' : 'editor');
          // Solo el id y si es Super Admin: el recorrido guiado recuerda por usuario si ya lo vio.
          window.__bamxAdminUser = { id: data.id, isSuperAdmin };
          window.dispatchEvent(new Event('bamx:admin-user'));
        }
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

// Título de la pestaña: Strapi lo fija como "… | Strapi" (y "Strapi Admin" al cargar).
function brandDocumentTitle() {
  if (typeof document === 'undefined' || window.__bamxTitle) return;
  window.__bamxTitle = true;
  const fix = () => {
    const title = document.title.replace(/\s*\|\s*Strapi$/, ' | BAMX Zamora').replace(/^Strapi Admin$/, 'BAMX Zamora');
    if (title !== document.title) document.title = title;
  };
  fix();
  new MutationObserver(fix).observe(document.head, { subtree: true, childList: true, characterData: true });
}

brandDocumentTitle();

export default {
  config: {
    locales: ['es'],
    tutorials: false,
    notifications: { releases: false },
    // Marca del banco en el login y en el menú (en vez del logo de Strapi).
    head: { favicon: bamxFavicon },
    auth: { logo: bamxLogo },
    menu: { logo: bamxLogo },
    translations: {
      es: {
        'Auth.form.welcome.title': 'Administración de BAMX Zamora',
        'Auth.form.welcome.subtitle': 'Accede para editar y publicar el contenido del sitio.',
        'app.components.LeftMenu.navbrand.title': 'BAMX Zamora',
        // Grupos del selector de bloques de "Páginas nuevas" (carpetas de src/components).
        blocks: 'Bloques generales',
        home: 'Secciones como en Inicio',
        about: 'Secciones como en Nosotros',
        sections: 'Portada',
        'app.components.LeftMenu.navbrand.workplace': 'Contenido del sitio',
        // "Mi perfil": el texto original enlaza a la documentación técnica de Strapi.
        'Settings.profile.form.section.experience.interfaceLanguageHelp': 'El idioma y el modo que elijas solo cambian el panel para ti.',
      },
    },
  },
  // Campo "Icono" con selector visual (components/IconPicker.jsx). En el servidor se registra en
  // src/index.js; se guarda la clave del icono como texto.
  register(app) {
    // "Estadísticas del proyecto" (API tokens, webhooks, administradores…): Strapi la marca solo
    // para el Super Admin, pero su página de inicio ignora esa marca y solo filtra por permisos.
    // Se le exige un permiso de Configuración que el rol de editora no tiene. El servidor también
    // la niega (src/setup/admin-homepage.js).
    app.widgets.register((widgets) => widgets.map((widget) => (
      widget.id === 'key-statistics' && widget.pluginId === 'admin'
        ? { ...widget, permissions: [{ action: 'admin::webhooks.read' }] }
        : widget
    )));
    app.customFields.register({
      name: 'icon',
      type: 'string',
      intlLabel: { id: 'bamx.icon.label', defaultMessage: 'Icono' },
      intlDescription: { id: 'bamx.icon.description', defaultMessage: 'Icono elegido de una galería. Vacío: automático.' },
      components: { Input: async () => import('./components/IconPicker') },
    });
  },
  // Recorrido guiado para las editoras (./tour): arranca solo la primera vez y con el botón "?".
  bootstrap() {
    setupTour();
  },
};
