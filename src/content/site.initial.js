// Contenido inicial de migración de "Datos del sitio". No usar como fallback de errores de Strapi.
// Son datos públicos (ya se muestran en el sitio). Los datos bancarios NO van aquí: el repositorio
// es público y la carga inicial los toma del .env.

export const siteDefaults = {
  contact: {
    phone: "351-520-5090",
    email: "direccion@bancodealimentosdezamora.org",
    socialWorkEmail: "ts@bancodealimentosdezamora.org",
    schedule: "Lun–Vie 8:00–16:00 | Sáb 9:00–14:00",
    address: "Av. Valladolid #328, Valencia 2da Secc",
    city: "Zamora, Michoacán",
    mapsLink: "https://maps.app.goo.gl/Guux2ybcGeQ7y6bk9",
    mapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d2594.578791132544!2d-102.2912982!3d20.005118!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x842e8f2fb85b3eb5%3A0xa6537d61131d2ebb!2sBanco%20de%20Alimentos%20Zamora%20A.C..!5e1!3m2!1ses-419!2smx!4v1757570282053!5m2!1ses-419!2smx",
    linktreeUrl: "https://linktr.ee/BancodealimentosZamora",
  },
  social: [
    { network: "facebook", url: "https://www.facebook.com/p/Banco-de-Alimentos-de-Zamora-AC-100068378567561/" },
    { network: "instagram", url: "https://www.instagram.com/bazac_" },
    { network: "youtube", url: "https://www.youtube.com/@BancodeAlimentosdeZamora" },
    { network: "tiktok", url: "https://www.tiktok.com/@bancodealimentosdzamora" },
  ],
  impact: {
    familiesPerMonth: 10000,
    foodKgPerMonth: 70124,
    municipalities: 7,
    communityGroups: 70,
    deliveryPoints: 90,
    foundedYear: 2013,
  },
  callToAction: {
    eyebrow: "Alimenta esperanza, transforma vidas",
    title: "Súmate a nuestra misión y ayuda a combatir el hambre",
    link: { label: "Quiero ser voluntario", url: "/programas#voluntariado" },
  },
  partners: {
    heading: {
      eyebrow: "Alianzas que transforman",
      lead: "",
      highlight: "Nuestros Aliados",
      intro: "Agradecemos profundamente a las empresas y organizaciones que hacen posible nuestra labor. Gracias a su apoyo, podemos seguir llevando esperanza y alimento a miles de familias.",
    },
  },
  seo: {
    inicio: { title: "Inicio", description: "Banco de Alimentos de Zamora - Combatiendo el hambre con solidaridad y esperanza." },
    programas: { title: "Nuestros programas", description: "Descubre las iniciativas del BAMX Zamora que apoyan a miles de familias en Michoacán." },
    contacto: { title: "Contáctanos", description: "Comunícate con el BAMX Zamora. Estamos aquí para ayudarte y resolver tus dudas." },
    nosotros: { title: "Nosotros", description: "Conoce la misión, visión e historia del Banco de Alimentos de Zamora." },
    donar: { title: "Dona ahora", description: "Haz tu donación y ayuda a llevar alimentos a quienes más lo necesitan en Zamora y Michoacán." },
    preguntas: { title: "Preguntas frecuentes", description: "Resuelve tus dudas más comunes sobre el Banco de Alimentos de Zamora." },
    beneficiarios: { title: "Sé parte de nuestro padrón", description: "Infórmate sobre cómo registrarte como beneficiario del BAMX Zamora." },
    apadrinamiento: { title: "Por menos hambre y más sonrisas", description: "Con el programa de apadrinamiento puedes cambiar vidas con tu apoyo mensual." },
  },
};

// Aliados (colección "Aliados" en Strapi). Los nombres reales no estaban en el sitio: "Aliado N"
// es provisional y se usa como texto alternativo del logo. Corregirlos desde el panel.
export const partnersDefaults = Array.from({ length: 25 }, (_, index) => ({
  name: `Aliado ${index + 1}`,
  logo: { src: `/assets/images/partners/${index + 1}.webp`, alt: `Aliado ${index + 1}` },
}));
