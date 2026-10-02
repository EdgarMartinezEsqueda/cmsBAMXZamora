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
