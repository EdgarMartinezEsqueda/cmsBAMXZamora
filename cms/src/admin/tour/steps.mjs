// Pasos del recorrido guiado del panel. Para cambiar textos u orden, se edita SOLO este archivo.
// Cada paso: { find, title, text, optional }.
//   find: cómo encontrar el elemento a señalar (ver `finders` abajo). Sin `find`, o si el elemento
//         no aparece, el paso se muestra centrado: el recorrido nunca se rompe.
//   optional: si el elemento no existe (p. ej. ese tipo no está en el menú), el paso se salta.
// Los elementos se buscan por enlaces (href) o por el texto en español de los botones del panel.

export const TOUR_VERSION = 'v1';

/** Cómo encontrar elementos del panel sin depender de clases internas de Strapi. */
export const finders = {
  /** Enlace cuyo href termina en (o contiene) el texto dado. */
  link: (fragment) => ({ type: 'link', fragment }),
  /** Botón o enlace cuyo texto visible empieza con el texto dado. */
  button: (label) => ({ type: 'button', label }),
  /** Botón del perfil (avatar) al pie del menú lateral. */
  profile: () => ({ type: 'profile' }),
};

// Contenido del menú del Administrador de contenido, en el orden en que se explica.
export const CONTENT_TYPES = [
  { uid: 'api::site.site', title: 'Datos del sitio', text: 'Teléfono, correos, dirección, redes sociales, logos, cifras de impacto y la pantalla de carga. Lo que cambies aquí se ve en todo el sitio.' },
  { uid: 'api::navigation.navigation', title: 'Menú y pie de página', text: 'Los enlaces del menú de arriba, el botón verde, y los enlaces, programas y distintivos del pie de página.' },
  { uid: 'api::home.home', title: 'Las páginas fijas', text: 'Todo lo que empieza con "Página:" (Inicio, Nosotros, Donar, Contacto…) son las páginas que ya existen en el sitio. Aquí cambias sus textos e imágenes.' },
  { uid: 'api::page.page', title: 'Páginas nuevas', text: 'Para crear páginas propias (por ejemplo, Bolsa de trabajo) armándolas con bloques: texto, imágenes, tarjetas, preguntas, videos…' },
  { uid: 'api::event.event', title: 'Eventos', text: 'Entregas, bazares, campañas y más. Pasan solos de "Próximos" a "Realizados"; después del evento puedes agregar cifras y fotos.' },
  { uid: 'api::newsletter.newsletter', title: 'Boletines', text: 'Sube el PDF de cada boletín con su portada y resumen.' },
  { uid: 'api::program.program', title: 'Programas', text: 'Cada programa y campaña, con casillas para decidir en qué páginas aparece.' },
  { uid: 'api::partner.partner', title: 'Aliados', text: 'Los logos de empresas y organizaciones aliadas. Despublicar uno lo oculta sin borrarlo.' },
  { uid: 'api::sponsored-case.sponsored-case', title: 'Casos de apadrinamiento', text: 'Son datos personales y de salud: un caso solo se publica con consentimiento firmado y fecha de vigencia.' },
];

/** Parte 1: el menú lateral (está en todas las pantallas del panel). */
export const GENERAL_STEPS = [
  { title: '¡Bienvenida al panel de BAMX Zamora!', text: 'Aquí editas todo lo que se ve en el sitio. Te mostramos lo principal en un minuto. Tranquila: nada de lo que hagas se ve en el sitio hasta que pulses "Publicar".' },
  { find: finders.link('/content-manager'), title: 'Administrador de Contenido', text: 'Aquí está todo el contenido del sitio: páginas, eventos, boletines, programas y más.' },
  { find: finders.link('/plugins/upload'), title: 'Biblioteca Multimedia', text: 'Todas las fotos y PDF que subes. Escribe siempre el texto alternativo de cada imagen: lo leen las personas con discapacidad visual y Google.' },
  { title: 'Veamos qué hay adentro', text: 'Al pulsar "Siguiente" abrimos el Administrador de Contenido para mostrarte cada sección.', opensContentManager: true },
];

/** Parte 2: dentro del Administrador de contenido (después de abrirlo). */
export const CONTENT_STEPS = [
  ...CONTENT_TYPES.map(({ uid, title, text }) => ({ find: finders.link(`/${uid}`), title, text, optional: true })),
  { find: finders.profile(), title: 'Tu perfil', text: 'Desde tu nombre puedes cambiar tu contraseña y cerrar sesión.', optional: true },
  { title: '¡Listo!', text: 'Cuando entres a editar algo te mostraremos cómo guardar, ver la vista previa y publicar. Puedes volver a ver este recorrido cuando quieras con el botón "?" de abajo a la derecha.' },
];

/** Recorrido de edición: la primera vez que se abre un contenido para editar. */
export const EDIT_STEPS = [
  { title: 'Editar un contenido', text: 'Cada campo tiene una ayuda debajo que explica qué poner. Te mostramos los botones importantes.' },
  { find: finders.button('Guardar'), title: 'Guardar', text: 'Guarda tus cambios como borrador. Todavía no se ven en el sitio.', optional: true },
  { find: finders.button('Abrir previsualización'), title: 'Vista previa', text: 'Mira cómo queda en el sitio antes de publicar (primero guarda).', optional: true },
  { find: finders.button('Publicar'), title: 'Publicar', text: 'Hace visible el cambio en el sitio, al instante.', optional: true },
  { find: finders.button('Agregue un componente'), title: 'Bloques', text: 'En las páginas nuevas agregas bloques aquí y los arrastras para cambiar el orden.', optional: true },
  { find: finders.button('Elegir icono'), title: 'Iconos', text: 'En tarjetas y pasos puedes elegir el icono de una galería con buscador. Si no eliges, se pone uno automático.', optional: true },
];

/** Comprueba que un paso esté bien escrito (lo usan las pruebas). */
export function isValidStep(step) {
  if (!step || typeof step.title !== 'string' || !step.title.trim() || typeof step.text !== 'string' || !step.text.trim()) return false;
  if (step.find === undefined) return true;
  const { type } = step.find;
  if (type === 'link') return typeof step.find.fragment === 'string' && step.find.fragment.startsWith('/');
  if (type === 'button') return typeof step.find.label === 'string' && step.find.label.length > 0;
  return type === 'profile';
}
