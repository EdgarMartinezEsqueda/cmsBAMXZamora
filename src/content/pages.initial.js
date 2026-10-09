// Contenido inicial de migración de Contacto y Programas. No usar como fallback de errores de Strapi.

export const contactPageDefaults = {
  pageTitle: "Contáctanos",
  pageSubtitle: "Juntos, hacemos más",
  heading: {
    eyebrow: "",
    lead: "",
    highlight: "Contáctanos",
    tail: "",
    intro: "Si tienes alguna duda o necesitas más información sobre nuestros programas y servicios, por favor escríbenos o visítanos. Estamos aquí para ayudarte.",
  },
  formTitle: "Envía un mensaje",
  formIntro: "Tu información está segura con nosotros. Todos los campos son obligatorios.",
};

export const programsPageDefaults = {
  pageTitle: "Nuestros programas",
  pageSubtitle: "Juntos movemos esperanza",
  heading: {
    eyebrow: "Formas de participar",
    lead: "Nuestros",
    highlight: "Programas",
    tail: "",
    intro: "Descubre las diferentes formas en que puedes contribuir a nuestra misión de combatir el hambre y fortalecer nuestra comunidad",
  },
  listTitle: "Programas Disponibles",
  listIntro: "Selecciona un programa para conocer más detalles",
  helpTitle: "¿Necesitas ayuda?",
  helpText: "Nuestro equipo está listo para orientarte y ayudarte a encontrar la mejor forma de participar",
  detailCtaTitle: "¿Listo para participar?",
  detailCtaText: "Únete a nosotros y forma parte del cambio en tu comunidad",
  detailLink: { label: "Contactar ahora", url: "/contacto" },
};

// Menú principal y pie de página, tal como estaban escritos en el sitio.
export const navigationDefaults = {
  menuLinks: [
    { label: "Inicio", url: "/" },
    { label: "Nosotros", url: "/nosotros" },
    { label: "Programas", url: "/programas" },
    { label: "Beneficiarios", url: "/beneficiarios" },
    { label: "Apadrinamiento", url: "/apadrinamiento" },
    { label: "Contacto", url: "/contacto" },
  ],
  donateButton: { label: "Dona Ahora", url: "/donar" },
  footerProgramsTitle: "Programas",
  // Programas del pie, por su slug (se buscan en la colección Programas al cargar).
  footerProgramSlugs: ["apadrinamiento", "comedor-comunitario", "talleres", "beneficiarios"],
  footerLinksTitle: "Enlaces útiles",
  footerLinks: [
    { label: "Nosotros", url: "/nosotros" },
    { label: "Preguntas frecuentes", url: "/preguntas" },
    { label: "Donar", url: "/donar" },
    { label: "Voluntariado", url: "/programas#voluntariado" },
    { label: "Contacto", url: "/contacto" },
  ],
  footerLocationTitle: "Ubicación",
  footerContactLabel: "Contacto",
  footerSocialText: "¡Síguenos en nuestras redes sociales para estar al tanto de nuestras últimas noticias y actividades!",
  // Distintivos del pie (la imagen se sube a la biblioteca en la carga inicial).
  footerBadges: [
    { image: { src: "/assets/images/red-bamx.png", alt: "Distintivo de la Red BAMX" }, label: "Miembro de la Red BAMX", url: "https://bamx.org.mx" },
  ],
  footerCopyright: "Banco de Alimentos de Zamora A. C.",
};
