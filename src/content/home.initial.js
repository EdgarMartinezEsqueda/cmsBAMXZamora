// Contenido inicial de migración. No usar como fallback de errores de Strapi.
// Datos puros compartidos por la página estática y la carga inicial de Strapi (npm run seed).

export const heroDefaults = {
  slides: [
    {
      image: "/assets/images/beneficiarios/4.webp",
      badge: "Rescatamos alimentos, alimentamos vidas",
      headingLead: "Más de 70 mil kg de alimentos entregados cada mes",
      headingHighlight: "",
      description: "Apoyamos a más de 10,000 familias con dignidad y esperanza.",
      iconKey: "heart",
      statNumber: "10,000+",
      statLabel: "Familias beneficiadas",
    },
    {
      image: "/assets/images/beneficiarios/17.webp",
      badge: "Tu apoyo genera sonrisas",
      headingLead: "Cada donación y voluntario transforma comunidades",
      headingHighlight: "",
      description: "Súmate a campañas, programas y acciones solidarias.",
      iconKey: "users",
      statNumber: "70+",
      statLabel: "Grupos comunitarios",
    },
    {
      image: "/assets/images/beneficiarios/3.webp",
      badge: "Comprometidos con nuestra región",
      headingLead: "Llegamos a 7 municipios con programas y alimentos",
      headingHighlight: "",
      description: "Construimos entornos saludables para un futuro mejor.",
      iconKey: "heart",
      statNumber: "7",
      statLabel: "Municipios atendidos",
    },
  ],
  primaryLabel: "Conoce Más",
  primaryLink: "/nosotros",
  secondaryLabel: "Donar Ahora",
  secondaryLink: "/donar",
  supportTitle: "¿Necesitas ayuda?",
  supportDescription: "Línea de apoyo",
  previousLabel: "Diapositiva anterior",
  nextLabel: "Diapositiva siguiente",
};

// Secciones de Inicio además del Hero. Mismos campos que los componentes home.* de Strapi.
export const homeSectionsDefaults = {
  about: {
    heading: {
      eyebrow: "Más de 13 años luchando contra el hambre",
      lead: "Construyendo un",
      highlight: "futuro mejor",
      intro: "En el Banco de Alimentos de Zamora A.C. rescatamos y distribuimos alimentos para mejorar la calidad de vida de miles de familias, promoviendo programas comunitarios, educativos y de salud.",
    },
    features: [
      { title: "Solidaridad en acción", description: "Más de 70 grupos comunitarios reciben apoyo constante para combatir la desnutrición en la región." },
      { title: "Compromiso integral", description: "Además de alimentos, ofrecemos programas de nutrición, talleres comunitarios y acompañamiento social." },
    ],
    achievementsTitle: "Nuestros logros destacados",
    achievements: [
      "Más de 70,000 kg de alimentos entregados cada mes",
      "Programas como “Por menos hambre y más sonrisas” apoyan a casos en extrema vulnerabilidad",
      "Campañas comunitarias de salud, cultura y desarrollo social",
    ],
    primaryLink: { label: "Conoce más sobre nosotros", url: "/nosotros" },
    secondaryLink: { label: "Únete como voluntario", url: "/programas#voluntariado" },
    image: { src: "/assets/images/beneficiarios/19.webp", alt: "Banco de Alimentos en acción" },
    videoUrl: "https://www.facebook.com/share/v/19jCqWF62H/",
    videoLabel: "Conoce nuestro trabajo",
  },
  process: {
    heading: {
      eyebrow: "Proceso transparente y eficiente",
      lead: "Nuestro",
      highlight: "Proceso",
      intro: "Desde la recolección de alimentos hasta los programas comunitarios, cada paso está diseñado para combatir el hambre y mejorar la calidad de vida en Zamora y municipios de Michoacán.",
    },
    steps: [
      { title: "Acopio de Alimentos", description: "Rescatamos y recibimos excedentes de alimentos de empresas, agricultores y donadores particulares.", statSource: "kilos", statText: "", link: "" },
      { title: "Clasificación y Selección", description: "Cada producto es revisado para asegurar que llegue en óptimas condiciones a nuestras familias.", statSource: "texto", statText: "100% verificados", link: "" },
      { title: "Almacenamiento", description: "Conservamos los alimentos en nuestra bodega hasta que son distribuidos a las comunidades.", statSource: "texto", statText: "Capacidad regional", link: "" },
      { title: "Preparación de Despensas", description: "Voluntarios y personal arman apoyos alimentarios equilibrados y nutritivos.", statSource: "familias", statText: "", link: "" },
      { title: "Distribución", description: "Entregamos despensas a 70 grupos comunitarios en 7 municipios de Michoacán.", statSource: "grupos", statText: "", link: "" },
      { title: "Seguimiento Social", description: "Acompañamos a las familias con programas de nutrición, talleres y asesorías.", statSource: "texto", statText: "Apoyo integral", link: "" },
      { title: "Programas Comunitarios", description: "Implementamos diversas actividades para nuestros beneficiarios.", statSource: "texto", statText: "Impacto biopsicosocial", link: "/programas" },
    ],
    summaryEyebrow: "Impacto mensual",
    summaryTitle: "Un proceso que transforma vidas en Michoacán",
    summaryText: "Cada mes entregamos más de 70,000 kg de alimentos a 10,000 familias en 70 comunidades de 7 municipios, beneficiando a más de 10,000 personas con programas de apoyo integral.",
  },
  programsIntro: {
    heading: {
      eyebrow: "Transformando comunidades",
      lead: "Nuestros",
      highlight: "Programas",
      intro: "Conoce las iniciativas con las que llevamos alimento y esperanza a miles de familias en la región.",
    },
    ctaTitle: "¿Listo para hacer la diferencia?",
    ctaText: "Cada acción cuenta. Únete a nosotros y ayuda a transformar vidas en tu comunidad.",
    primaryLink: { label: "Contáctanos", url: "/contacto" },
    secondaryLink: { label: "Hacer donación", url: "/donar" },
  },
  impactSection: {
    heading: {
      eyebrow: "Esperanza y alimento para quienes más lo necesitan",
      lead: "Unidos",
      highlight: "transformamos vidas",
      intro: "Cada apoyo que entregamos lleva más que alimento: lleva esperanza, dignidad y el respaldo de una comunidad comprometida. En 7 municipios de la región, trabajamos día a día para que las familias más vulnerables mejoren su calidad de vida.",
    },
    helpTitle: "¿Necesitas ayuda?",
    helpSubtitle: "Línea directa de atención",
    statsTitle: "Nuestro impacto en números",
    statsSubtitle: "Resultados que transforman comunidades",
    closingText: "Cada número representa vidas transformadas",
    primaryLink: { label: "Conoce más", url: "/nosotros" },
    secondaryLink: { label: "Únete", url: "/programas#voluntariado" },
  },
  newsletterIntro: {
    heading: {
      eyebrow: "Mantente informado mensualmente",
      lead: "Nuestro",
      highlight: "Boletín",
      tail: "",
      intro: "Cada mes compartimos contigo logros, historias de esperanza y el impacto de tu apoyo en las familias de Zamora y la región de Michoacán.",
    },
    title: { eyebrow: "", lead: "Historias que inspiran, datos que", highlight: "importan", tail: "", intro: "" },
    description: "Nuestro boletín mensual es una forma de mantenerte cerca de lo que juntos hacemos posible. Aquí encontrarás estadísticas de impacto, testimonios de familias beneficiadas, información sobre nuestras campañas y próximos eventos. Al mantenerte informado, también formas parte de esta red solidaria que transforma vidas todos los días.",
    featuresTitle: "¿Qué puedes encontrar cada mes?",
    features: [
      "Estadísticas de impacto",
      "Historias y testimonios reales",
      "Próximas campañas y eventos",
      "Reconocimientos a donadores y voluntarios",
    ],
  },
  instagram: {
    eyebrow: "",
    lead: "Síguenos en nuestras redes",
    highlight: "",
    intro: "Comparte con nosotros los momentos de entrega, solidaridad y esperanza. Conoce de cerca nuestro trabajo diario.",
  },
};
