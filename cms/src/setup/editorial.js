'use strict';

const labels = {
  'api::home.home': {
    hero: ['Portada de Inicio', 'Edita las diapositivas y los botones de la portada.'],
    about: ['Sección: Sobre nosotros'], process: ['Sección: Nuestro proceso'], programsIntro: ['Sección: Programas', 'Las tarjetas salen de la colección Programas (casilla "Mostrar en Inicio").'],
    impactSection: ['Sección: Impacto', 'Las cifras salen de Datos del sitio → Cifras de impacto.'], instagram: ['Sección: Instagram'],
    newsletterIntro: ['Sección: Boletín', 'Los botones abren el boletín más reciente de la colección Boletines.'],
  },
  'shared.heading': {
    eyebrow: ['Etiqueta superior'], lead: ['Título'], highlight: ['Parte destacada del título', 'Se muestra resaltada después del título.'],
    tail: ['Texto final del título', 'Opcional. Va después de la parte destacada.'], intro: ['Texto introductorio'],
  },
  'api::about-page.about-page': {
    pageTitle: ['Título de la página'], pageSubtitle: ['Subtítulo de la página'],
    intro: ['Sección: Presentación'], history: ['Sección: Historia'], approach: ['Sección: Enfoque integral'],
    coverage: ['Sección: Cobertura', 'Textos del mapa y lista de municipios. El dibujo del mapa no es editable.'],
    programsIntro: ['Sección: Programas y campañas', 'Las tarjetas salen de la colección Programas (casilla "Mostrar en Nosotros").'],
    networks: ['Sección: Redes de apoyo', 'Las cifras salen de Datos del sitio → Cifras de impacto.'],
  },
  'api::faq-page.faq-page': {
    pageTitle: ['Título de la página'], pageSubtitle: ['Subtítulo de la página'], heading: ['Encabezado'],
    entries: ['Preguntas', 'La categoría decide el filtro y el icono de cada pregunta.'],
    ctaTitle: ['Título del cierre'], ctaText: ['Texto del cierre'], link: ['Botón'],
  },
  'api::donate-page.donate-page': {
    pageTitle: ['Título de la página'], pageSubtitle: ['Subtítulo de la página'], heading: ['Encabezado', 'Las cifras salen de Datos del sitio → Cifras de impacto.'],
    methodsTitle: ['Título de formas de donar'], methodsIntro: ['Texto de formas de donar'],
    onlineLinks: ['Donación en línea', 'Enlaces https (p. ej. PayPal). Sin enlaces se muestra el texto de abajo. La CLABE y la cuenta las edita un administrador en Datos bancarios.'],
    onlineEmptyText: ['Texto sin donación en línea'], missionTitle: ['Título de misión'], missionText: ['Texto de misión'], missionTextSecondary: ['Segundo párrafo de misión'],
    safetyTitle: ['Título de seguridad'], safetyPoints: ['Garantías'], closingTitle: ['Título del cierre'], closingText: ['Texto del cierre'], closingTaglines: ['Frases del cierre'],
  },
  'api::beneficiaries-page.beneficiaries-page': {
    pageTitle: ['Título de la página'], pageSubtitle: ['Subtítulo de la página'], heading: ['Encabezado'],
    documentsTitle: ['Título de documentos'], documents: ['Documentos necesarios'], stepsTitle: ['Título de pasos'],
    steps: ['Pasos del registro', 'Cada paso lleva su imagen del carrusel.'], galleryHeading: ['Encabezado de la galería'],
    gallery: ['Galería', 'Escribe un texto alternativo que describa cada foto.'],
  },
  'api::sponsorship-page.sponsorship-page': {
    pageTitle: ['Título de la página'], pageSubtitle: ['Subtítulo de la página'], heading: ['Encabezado'],
    includesTitle: ['Título de "qué incluye"'], includes: ['Qué incluye'], stepsTitle: ['Título de formas de apadrinar'],
    steps: ['Formas de apadrinar', 'Cada paso lleva su imagen del carrusel.'], objectivesTitle: ['Título de objetivos'], objectives: ['Objetivos'],
    catalogHeading: ['Encabezado del catálogo', 'Los casos se editan en la colección "Casos de apadrinamiento".'],
    catalogCtaTitle: ['Título del cierre'], catalogCtaText: ['Texto del cierre'], catalogLink: ['Botón del cierre'],
  },
  'api::sponsored-case.sponsored-case': {
    internalName: ['Nombre interno', 'Solo para identificar el caso en el panel. No aparece en la web.'],
    image: ['Imagen del caso'], alt: ['Texto alternativo', 'Describe la imagen sin diagnósticos ni datos sensibles que no estén ya en ella.'],
    consent: ['Consentimiento confirmado', 'Obligatorio para publicar: la persona (o su tutor) autorizó mostrar este caso.'],
    validUntil: ['Mostrar hasta', 'Al pasar esta fecha el caso deja de mostrarse solo. Obligatorio para publicar.'],
    order: ['Orden', 'Menor número = aparece primero.'],
  },
  'shared.step-image': { title: ['Título'], description: ['Descripción'], image: ['Imagen'] },
  'api::navigation.navigation': {
    menuLinks: ['Enlaces del menú', 'En este orden. La dirección puede ser una página del sitio (por ejemplo /nosotros o la de una página nueva) o un enlace https://.'],
    donateButton: ['Botón destacado del menú', 'El botón verde de la derecha. Si se deja vacío, no aparece.'],
    footerProgramsTitle: ['Pie: título de programas', 'Los programas de esa lista se eligen en cada Programa (casilla del pie de página).'],
    footerLinksTitle: ['Pie: título de enlaces'], footerLinks: ['Pie: enlaces'],
    footerLocationTitle: ['Pie: título de ubicación', 'Dirección, correo y teléfono se editan en Datos del sitio.'],
    footerContactLabel: ['Pie: etiqueta de contacto'], footerSocialText: ['Pie: texto de redes sociales', 'Las redes se editan en Datos del sitio.'],
    footerMembershipText: ['Pie: texto del distintivo'], footerCopyright: ['Pie: nombre en derechos reservados'],
  },
  'api::contact-page.contact-page': {
    pageTitle: ['Título de la página'], pageSubtitle: ['Subtítulo de la página'], heading: ['Encabezado', 'Teléfono, correo y mapa se editan en Datos del sitio.'],
    formTitle: ['Título del formulario'], formIntro: ['Texto del formulario'],
  },
  'api::programs-page.programs-page': {
    pageTitle: ['Título de la página'], pageSubtitle: ['Subtítulo de la página'], heading: ['Encabezado', 'Los programas se editan en la colección Programas.'],
    listTitle: ['Título de la lista'], listIntro: ['Texto de la lista'], helpTitle: ['Título del recuadro de ayuda'], helpText: ['Texto del recuadro de ayuda'],
    detailCtaTitle: ['Título del cierre de cada programa'], detailCtaText: ['Texto del cierre de cada programa'], detailLink: ['Botón del cierre'],
  },
  'api::page.page': {
    title: ['Título'], slug: ['Dirección de la página', 'La página se verá en /identificador. Minúsculas y guiones. Algunos están reservados por el sitio.'],
    subtitle: ['Subtítulo'], seoTitle: ['Título para buscadores', 'Opcional. Si queda vacío se usa el título.'], seoDescription: ['Descripción para buscadores'],
    body: ['Contenido', 'Agrega bloques en el orden en que deben aparecer.'],
  },
  'blocks.rich-text': { parts: ['Secciones de texto', 'Cada sección tiene su propia alineación y color. Arrastra para cambiar el orden.'] },
  'blocks.text-part': { body: ['Texto'], align: ['Alineación'], color: ['Color del texto', 'Colores de la marca.'] },
  'blocks.text-image': {
    title: ['Título'], body: ['Texto'], image: ['Imagen'], imagePosition: ['Lado de la imagen'],
    align: ['Alineación', 'Se aplica a todo el texto.'], color: ['Color del texto', 'Colores de la marca.'],
  },
  'blocks.gallery': { title: ['Título'], images: ['Imágenes', 'Escribe un texto alternativo para cada imagen.'] },
  'blocks.faq': { title: ['Título'], items: ['Preguntas'] },
  'blocks.cta': { title: ['Título'], text: ['Texto'], link: ['Botón'] },
  'blocks.programs-detail': { heading: ['Encabezado'], ctaTitle: ['Título del cierre'], ctaText: ['Texto del cierre'], primaryLink: ['Botón principal'], secondaryLink: ['Botón secundario'] },
  'blocks.social': { heading: ['Encabezado', 'Las redes se editan en Datos del sitio.'] },
  'blocks.site-cta': { note: ['Nota interna', 'Opcional. La banda se edita en Datos del sitio → Llamada a la acción.'] },
  'blocks.donate': { note: ['Nota interna', 'Opcional. Muestra lo mismo que la página Donar; los datos bancarios solo los cambia el administrador.'] },
  'blocks.partners': { note: ['Nota interna', 'Opcional. Los logos se editan en la colección Aliados.'] },
  'blocks.steps': {
    heading: ['Encabezado'], listTitle: ['Título de la lista', 'Opcional. Ejemplo: Documentos necesarios'], list: ['Lista', 'Opcional.'],
    stepsTitle: ['Título de los pasos'], steps: ['Pasos', 'Cada paso lleva su imagen.'],
  },
  'blocks.embed': {
    kind: ['Qué insertar'],
    url: ['Dirección', 'Video: enlace de YouTube que empieza con https://www.youtube.com/embed/ o de Drive que termina en /preview. Mapa: en Google Maps, Compartir → Insertar un mapa → copia la dirección de src="...".'],
    title: ['Título', 'Describe el video o el mapa (lo usan los lectores de pantalla).'],
  },
  'home.newsletter': { heading: ['Encabezado'], title: ['Subtítulo'], description: ['Descripción'], featuresTitle: ['Título de contenidos'], features: ['Qué contiene cada boletín'] },
  'api::newsletter.newsletter': {
    title: ['Título'], slug: ['Dirección', 'Se verá en /boletines/identificador.'], edition: ['Edición', 'Ejemplo: Edición #127'],
    period: ['Periodo', 'Fecha del mes que cubre el boletín. Se usa para ordenar y filtrar por año.'], summary: ['Resumen'],
    cover: ['Portada', 'Opcional.'], pdf: ['Archivo PDF', 'Obligatorio. Máximo 15 MB.'],
  },
  'api::partner.partner': {
    name: ['Nombre', 'También es el texto alternativo del logo.'], logo: ['Logo'],
    url: ['Sitio web', 'Opcional. Debe empezar con https://. Si se llena, el logo lleva a esa dirección.'],
    order: ['Orden', 'Menor número = aparece primero.'],
  },
  'faq.entry': { question: ['Pregunta'], answer: ['Respuesta'], category: ['Categoría'] },
  'shared.feature': { title: ['Título'], description: ['Descripción', 'Opcional.'], items: ['Viñetas'] },
  'about.intro': { heading: ['Encabezado'], tabs: ['Pestañas', 'Hasta 4.'], images: ['Imágenes', 'Dos imágenes del collage.'], videoImage: ['Portada del video'], videoUrl: ['Enlace del video'], videoLabel: ['Texto del video'] },
  'about.history': { heading: ['Encabezado'], milestones: ['Hitos'], ctaTitle: ['Título del cierre'], ctaText: ['Texto del cierre'], link: ['Botón'] },
  'about.milestone': { period: ['Periodo', 'Ejemplo: 2015-2018'], title: ['Título'], description: ['Descripción'] },
  'about.approach': { heading: ['Encabezado'], pillars: ['Pilares'], quote: ['Cita'], quoteAuthor: ['Autor de la cita'] },
  'about.coverage': {
    heading: ['Encabezado'], mapText: ['Texto junto al mapa'], mapTextSecondary: ['Segundo párrafo junto al mapa'],
    listIntro: ['Texto de la vista de lista'], closingText: ['Texto final de la lista'], municipalities: ['Municipios'],
  },
  'about.municipality': { name: ['Municipio'], state: ['Estado'], communities: ['Comunidades'], families: ['Familias'], isMain: ['Es la sede principal'] },
  'about.networks': {
    heading: ['Encabezado'], types: ['Tipos de aliado'], joinHeading: ['Encabezado de "Cómo unirse"'], joinSteps: ['Pasos para unirse'],
    impactTitle: ['Título del impacto'], impactText: ['Texto del impacto'], link: ['Botón'], linkHint: ['Texto bajo el botón'],
  },
  'shared.link': { label: ['Texto del botón'], url: ['Enlace', 'Ejemplo: /donar o https://...'] },
  'shared.card': { title: ['Título'], description: ['Descripción'] },
  'home.about': {
    heading: ['Encabezado'], features: ['Tarjetas', 'Hasta 2.'], achievementsTitle: ['Título de logros'], achievements: ['Logros'],
    primaryLink: ['Botón principal'], secondaryLink: ['Botón secundario'], image: ['Imagen'],
    videoUrl: ['Enlace del video', 'Se abre en una pestaña nueva (Facebook, YouTube...).'], videoLabel: ['Texto sobre la imagen'],
  },
  'home.process': { heading: ['Encabezado'], steps: ['Pasos', 'Hasta 8.'], summaryEyebrow: ['Etiqueta del resumen'], summaryTitle: ['Título del resumen'], summaryText: ['Texto del resumen'] },
  'home.process-step': {
    title: ['Título'], description: ['Descripción'],
    statSource: ['Cifra del paso', '"texto" usa el campo de abajo; las demás opciones toman la cifra de Datos del sitio → Cifras de impacto.'],
    statText: ['Texto de la cifra', 'Solo si la cifra del paso es "texto".'], link: ['Enlace', 'Opcional.'],
  },
  'home.programs-intro': { heading: ['Encabezado'], ctaTitle: ['Título del cierre'], ctaText: ['Texto del cierre'], primaryLink: ['Botón principal'], secondaryLink: ['Botón secundario'] },
  'home.impact': {
    heading: ['Encabezado'], helpTitle: ['Título de ayuda'], helpSubtitle: ['Subtítulo de ayuda'], statsTitle: ['Título de cifras'],
    statsSubtitle: ['Subtítulo de cifras'], closingText: ['Texto final'], primaryLink: ['Botón principal'], secondaryLink: ['Botón secundario'],
  },
  'site.call-to-action': { eyebrow: ['Etiqueta superior'], title: ['Título'], link: ['Botón'] },
  'site.partners': { heading: ['Encabezado', 'Los logos se editan en la colección Aliados.'] },
  'sections.hero': {
    slides: ['Diapositivas', 'Entre 1 y 6 imágenes. Arrastra para cambiar el orden.'],
    primaryLabel: ['Texto del botón principal'], primaryLink: ['Enlace del botón principal', 'Ejemplo: /nosotros'],
    secondaryLabel: ['Texto del botón secundario'], secondaryLink: ['Enlace del botón secundario', 'Ejemplo: /donar'],
    supportTitle: ['Título de ayuda'], supportDescription: ['Descripción de ayuda'],
    previousLabel: ['Etiqueta del botón anterior'], nextLabel: ['Etiqueta del botón siguiente'],
  },
  'sections.hero-slide': {
    image: ['Imagen de fondo'], badge: ['Texto de la etiqueta superior'], headingLead: ['Título principal'],
    headingHighlight: ['Parte destacada del título'], description: ['Descripción'], iconKey: ['Icono'],
    statNumber: ['Cifra destacada'], statLabel: ['Descripción de la cifra'],
  },
  'api::contact-setting.contact-setting': {
    enabled: ['Recibir mensajes', 'Activa el formulario cuando el envío esté configurado.'],
    recipients: ['Correos destinatarios', 'Entre 1 y 10 correos. Estos datos no aparecen en la web.'],
  },
  'contact.recipient': { email: ['Correo electrónico'] },
  'api::site.site': {
    phone: ['Teléfono', 'Se muestra en el encabezado, el pie de página y Contacto.'],
    email: ['Correo principal'], socialWorkEmail: ['Correo de trabajo social'],
    schedule: ['Horario de atención', 'Ejemplo: Lun–Vie 8:00–16:00 | Sáb 9:00–14:00'],
    address: ['Calle y número'], city: ['Ciudad y estado'],
    mapsLink: ['Enlace de Google Maps', 'El enlace para compartir la ubicación (maps.app.goo.gl/...).'],
    mapsEmbedUrl: ['Mapa insertado', 'En Google Maps: Compartir → Insertar un mapa → copia solo la dirección que va en src="...".'],
    linktreeUrl: ['Enlace de Linktree'],
    socialLinks: ['Redes sociales', 'Enlaces completos, empezando con https://.'],
    impact: ['Cifras de impacto', 'Se usan en todas las tarjetas de cifras del sitio.'],
    seo: ['Títulos para buscadores', 'Un título y una descripción por página.'],
    callToAction: ['Llamada a la acción', 'Banda que aparece en Inicio y Nosotros.'], partners: ['Encabezado de aliados', 'Título y texto de la sección. Los logos están en la colección Aliados.'],
  },
  'site.social-link': { network: ['Red social'], url: ['Enlace'] },
  'site.impact': {
    familiesPerMonth: ['Familias atendidas al mes'], foodKgPerMonth: ['Kilos de alimento entregados al mes'],
    municipalities: ['Municipios atendidos'], communityGroups: ['Grupos comunitarios'],
    deliveryPoints: ['Puntos de entrega'], foundedYear: ['Año de fundación'],
  },
  'site.seo-entry': { page: ['Página'], title: ['Título', 'Hasta 70 caracteres.'], description: ['Descripción', 'Hasta 170 caracteres.'] },
  'api::program.program': {
    title: ['Título'], slug: ['Identificador en la dirección', 'Aparece en /programas#identificador. Minúsculas y guiones; cambiarlo rompe los enlaces guardados.'],
    shortTitle: ['Título corto', 'Opcional. Se usa en el pie de página.'], category: ['Categoría'], icon: ['Icono'],
    summary: ['Resumen', 'Texto de las tarjetas de Inicio y Nosotros.'], description: ['Descripción completa', 'Se muestra en la página de Programas.'],
    image: ['Imagen'], videoUrl: ['Video', 'Opcional. Enlace de YouTube (/embed/...) o de Google Drive (/preview). Si hay video, reemplaza a la imagen en la página de Programas.'],
    badge: ['Etiqueta de la tarjeta', 'Opcional. Ejemplo: Gratuitos o costo simbólico'], period: ['Periodo', 'Para campañas. Ejemplo: Anual'],
    highlights: ['Rasgos (tarjeta de Nosotros)', 'Hasta 3.'], keyPoints: ['¿Por qué participar?'], faqs: ['Preguntas frecuentes'],
    order: ['Orden', 'Menor número = aparece primero.'],
    showOnHome: ['Mostrar en Inicio'], showOnAbout: ['Mostrar en Nosotros'], showOnProgramsPage: ['Mostrar en la página de Programas'], showInFooter: ['Mostrar en el pie de página'],
  },
  'shared.list-item': { text: ['Texto'] },
  'shared.faq': { question: ['Pregunta'], answer: ['Respuesta'] },
  'api::bank-account.bank-account': {
    bankName: ['Banco'], clabe: ['CLABE', '18 dígitos. Se valida el dígito de control antes de mostrarla.'],
    accountNumber: ['Número de cuenta', 'Solo dígitos.'],
  },
};

// Tipos que el rol Editor BAMX puede leer, crear, editar y publicar. Un tipo que no está aquí
// solo lo gestiona un administrador (p. ej. los datos bancarios): no agregarlo sin decidirlo.
const EDITORIAL_TYPES = ['api::home.home', 'api::contact-setting.contact-setting', 'api::site.site', 'api::program.program', 'api::about-page.about-page', 'api::faq-page.faq-page', 'api::donate-page.donate-page', 'api::beneficiaries-page.beneficiaries-page',
  'api::sponsorship-page.sponsorship-page', 'api::sponsored-case.sponsored-case',
  'api::contact-page.contact-page', 'api::programs-page.programs-page', 'api::page.page', 'api::newsletter.newsletter', 'api::partner.partner',
  'api::navigation.navigation'];
const CONTENT_ACTIONS = ['plugin::content-manager.explorer.read', 'plugin::content-manager.explorer.create',
  'plugin::content-manager.explorer.update', 'plugin::content-manager.explorer.publish'];
// Solo en las colecciones el editor puede además borrar entradas (una página nueva, un boletín,
// un programa, un caso). Las páginas fijas y Datos del sitio no se pueden borrar.
const DELETABLE_TYPES = ['api::page.page', 'api::newsletter.newsletter', 'api::program.program', 'api::sponsored-case.sponsored-case', 'api::partner.partner'];
const DELETE_ACTION = 'plugin::content-manager.explorer.delete';

// Campo que identifica cada elemento en las listas del panel (en vez de un número).
const MAIN_FIELDS = {
  'api::program.program': 'title', 'api::page.page': 'title', 'api::newsletter.newsletter': 'title', 'api::partner.partner': 'name',
  'api::sponsored-case.sponsored-case': 'internalName',
  'shared.card': 'title', 'shared.faq': 'question', 'shared.list-item': 'text', 'shared.feature': 'title',
  'shared.link': 'label', 'shared.step-image': 'title', 'faq.entry': 'question', 'contact.recipient': 'email',
  'site.social-link': 'network', 'site.seo-entry': 'page',
  'home.process-step': 'title', 'about.milestone': 'title', 'about.municipality': 'name',
  'sections.hero-slide': 'headingLead',
};
const UPLOAD_ACTIONS = ['plugin::upload.read', 'plugin::upload.assets.create', 'plugin::upload.assets.update',
  'plugin::upload.assets.download', 'plugin::upload.assets.copy-link'];

// Aplica las etiquetas de cada tipo cuando cambian en este archivo; si no cambian, respeta
// los ajustes de vista hechos desde el panel.
async function syncLabels(strapi, store) {
  for (const uid of new Set([...Object.keys(labels), ...Object.keys(MAIN_FIELDS)])) {
    const fields = labels[uid] ?? {};
    const mainField = MAIN_FIELDS[uid];
    const key = `labels:${uid}`;
    const signature = JSON.stringify({ fields, mainField });
    if (await store.get({ key }) === signature) continue;
    const service = strapi.plugin('content-manager').service(uid.startsWith('api::') ? 'content-types' : 'components');
    const model = uid.startsWith('api::') ? service.findContentType(uid) : service.findComponent(uid);
    if (!model) continue;
    const configuration = await service.findConfiguration(model);
    for (const [field, [label, description = '']] of Object.entries(fields)) {
      const metadata = configuration.metadatas[field];
      if (!metadata) continue;
      metadata.edit = { ...metadata.edit, label, description };
      metadata.list = { ...metadata.list, label };
    }
    if (mainField && model.attributes?.[mainField]) configuration.settings = { ...configuration.settings, mainField };
    await service.updateConfiguration(model, configuration);
    await store.set({ key, value: signature });
  }
}

// El rol lo gestiona el código: los permisos se recalculan en cada arranque (incluidos los
// campos anidados, que cambian al editar un esquema) y se reasignan solo si difieren.
async function syncEditorRole(strapi, store) {
  const roles = strapi.service('admin::role');
  const role = await roles.findOne({ code: 'bamx-editor' })
    || await roles.create({ name: 'Editor BAMX', code: 'bamx-editor', description: 'Edita contenido y destinatarios. Sin acceso a tokens, usuarios o estructura.' });
  const subjects = new Set(EDITORIAL_TYPES);
  const allowed = new Set(CONTENT_ACTIONS);
  const deletable = new Set(DELETABLE_TYPES);
  const actions = strapi.service('admin::permission').actionProvider.values().filter((action) => action.section === 'contentTypes');
  const permissions = strapi.service('admin::content-type').getPermissionsWithNestedFields(actions)
    .filter((permission) => subjects.has(permission.subject)
      && (allowed.has(permission.action) || (permission.action === DELETE_ACTION && deletable.has(permission.subject))));
  for (const action of UPLOAD_ACTIONS) permissions.push({ action, conditions: [] });
  const signature = JSON.stringify(permissions);
  if (await store.get({ key: 'editor-permissions' }) === signature) return;
  await roles.assignPermissions(role.id, permissions);
  await store.set({ key: 'editor-permissions', value: signature });
}

module.exports = async function prepareEditorial(strapi) {
  const store = strapi.store({ type: 'core', name: 'bamx' });
  await syncLabels(strapi, store);
  await syncEditorRole(strapi, store);
};

module.exports.EDITORIAL_TYPES = EDITORIAL_TYPES;
module.exports.DELETABLE_TYPES = DELETABLE_TYPES;
