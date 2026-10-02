// Contenido inicial de migración de la página Donar. No usar como fallback de errores de Strapi.
// Los datos bancarios NO van aquí (repositorio público): ver "Datos bancarios" en Strapi.

export const donateDefaults = {
  pageTitle: "Dona ahora",
  pageSubtitle: "",
  heading: {
    eyebrow: "",
    lead: "Haz la diferencia",
    highlight: "hoy mismo",
    tail: "",
    intro: "Con tu apoyo, podemos continuar nuestra misión de combatir el hambre y brindar esperanza a quienes más lo necesitan en Michoacán.",
  },
  methodsTitle: "Formas de donar",
  methodsIntro: "Elige el método que más te convenga. Tu donación es 100% segura y va directamente a ayudar a las familias que más lo necesitan.",
  onlineLinks: [],
  onlineEmptyText: "Actualmente no hay métodos de donación en línea disponibles. Por favor, considera hacer una transferencia bancaria.",
  missionTitle: "Nuestra Misión",
  missionText: "Combatimos el hambre rescatando alimentos en la región y distribuyéndolos a familias, comunidades e instituciones que más lo necesitan.",
  missionTextSecondary: "Cada donación contribuye directamente a ampliar nuestro impacto. Nos comprometemos a usar tu apoyo de forma responsable y transparente, asegurando que cada peso se transforme en alimentos y esperanza.",
  safetyTitle: "Tu Donación es Segura",
  safetyPoints: [
    { title: "Pagos Seguros", description: "Todas las transacciones están protegidas y encriptadas por tu banca en línea" },
    { title: "Impacto Directo", description: "El 100% de tu donación va directamente a programas de alimentación" },
  ],
  closingTitle: "¡Gracias por tu generosidad!",
  closingText: "Juntos estamos construyendo un futuro donde nadie pase hambre.",
  closingTaglines: ["Cada donación cuenta", "Cada familia importa"],
};
