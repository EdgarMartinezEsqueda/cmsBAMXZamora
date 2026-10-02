// Contenido inicial de migración de Beneficiarios y Apadrinamiento. No usar como fallback de
// errores de Strapi. Mismos campos que los single types tras pasar por su mapper.

// Cada paso con la imagen de su posición; `alt` (opcional) es el texto alternativo de esa imagen.
const withImages = (steps, folder) => steps.map(({ alt, ...step }, index) => ({
  ...step,
  image: { src: `/assets/images/${folder}/${index + 1}.webp`, alt: alt ?? step.title },
}));

export const beneficiariesDefaults = {
  pageTitle: "Beneficiarios",
  pageSubtitle: "Apoyo alimentario para quienes más lo necesitan",
  heading: {
    eyebrow: "",
    lead: "Únete",
    highlight: "a nuestro padrón de beneficiarios",
    tail: "",
    intro: "Si tú o tu familia necesitan apoyo alimentario, aquí te mostramos cómo formar parte de nuestro padrón de beneficiarios. Conoce los pasos necesarios para unirte a nuestra comunidad.",
  },
  documentsTitle: "Documentos necesarios",
  documents: [
    "Identificación oficial del titular (INE)",
    "CURP de todos los integrantes",
    "Comprobante de domicilio actualizado",
  ],
  stepsTitle: "Proceso de registro",
  steps: withImages([
    { title: "Registro Inicial", description: "Acércate a nuestras oficinas con tu documentación completa", alt: "Paso 1: Registro Inicial" },
    { title: "Verificación", description: "Nuestro equipo validará tu información y documentos", alt: "Paso 2: Verificación" },
    { title: "Evaluación", description: "Realizamos una evaluación socioeconómica de tu situación", alt: "Paso 3: Evaluación" },
    { title: "Ubicación", description: "Te asignamos al punto de distribución más cercano", alt: "Paso 4: Ubicación" },
    { title: "Bienvenida", description: "¡Ya formas parte de nuestra comunidad de beneficiarios!", alt: "Paso 5: Bienvenida" },
  ], "unirse"),
  galleryHeading: {
    eyebrow: "",
    lead: "",
    highlight: "Galería de Beneficiarios",
    tail: "",
    intro: "Cada imagen cuenta una historia de esperanza. Conoce los rostros y momentos que nos inspiran a seguir construyendo un futuro sin hambre.",
  },
  // El texto alternativo "Beneficiario N" es el que tenía el sitio: conviene describir cada foto.
  gallery: Array.from({ length: 28 }, (_, index) => ({
    src: `/assets/images/beneficiarios/${index + 1}.webp`,
    alt: `Beneficiario ${index + 1}`,
  })),
};

export const sponsorshipDefaults = {
  pageTitle: "Apadrinamiento",
  pageSubtitle: "Por menos hambre y más sonrisas",
  heading: {
    eyebrow: "",
    lead: "Apadrina",
    highlight: "Por menos hambre y más sonrisas",
    tail: "",
    intro: "Nuestro programa de apadrinamiento nace como respuesta a las necesidades de personas en situación de extrema vulnerabilidad. Tu apoyo puede transformar vidas y brindar esperanza a quienes más lo necesitan.",
  },
  includesTitle: "¿Qué incluye el apadrinamiento?",
  includes: [
    "Seguimiento nutricional personalizado",
    "Acompañamiento psicológico",
    "Consejería y herramientas para mejorar su calidad de vida",
  ],
  stepsTitle: "Formas de apadrinar",
  steps: withImages([
    { title: "¿Qué es el programa?", description: "Conoce cómo funciona 'Por menos hambre y más sonrisas' y su impacto en la comunidad" },
    { title: "Opción 1: $50 semanales", description: "Tu apadrinado recibe 1 paquete alimentario en la semana que donas" },
    { title: "Opción 2: $200 mensuales", description: "Garantiza 4 paquetes al mes (1 por semana) para tu apadrinado" },
    { title: "Opción 3: Donativos en especie", description: "Alimentos no perecederos, medicamentos, estudios médicos o necesidades específicas" },
    { title: "Beneficios de ser padrino", description: "Apoya una causa vital y recibe un recibo deducible. Mantente al tanto del progreso de tu apadrinado." },
    { title: "Métodos de donación", description: "Cuenta CLABE y número de cuenta para realizar tu aportación" },
  ], "apadrinamiento"),
  objectivesTitle: "Objetivos del programa",
  objectives: [
    { title: "Alcanzar a personas en marginación", description: "Llegamos a quienes viven sin redes de apoyo y necesitan una mano para salir adelante" },
    { title: "Cubrir necesidades básicas", description: "Educación, alimentación y salud a través de colectas, apadrinamientos y servicios" },
    { title: "Impulsar el empoderamiento", description: "Desarrollamos habilidades y recursos propios para lograr independencia y mejor calidad de vida" },
    { title: "Inspirar agentes de cambio", description: "Cada apadrinado se convierte en inspiración para otros en su comunidad" },
  ],
  catalogHeading: {
    eyebrow: "",
    lead: "",
    highlight: "Conoce a quienes necesitan tu apoyo",
    tail: "",
    intro: "Cada historia es única y cada apoyo marca una diferencia. Conoce las historias de quienes buscan un padrino.",
  },
  catalogCtaTitle: "¿Listo para transformar una vida?",
  catalogCtaText: "Tu apoyo marca la diferencia. Conoce a quienes buscan un padrino y elige cómo quieres ayudar.",
  catalogLink: { label: "Contáctanos para apadrinar", url: "/contacto" },
};

// Catálogo del modo estático (el que tenía el sitio). En Strapi estos casos se importan como
// BORRADORES sin consentimiento: alguien del banco debe confirmarlo y fijar su vigencia.
export const sponsoredCasesDefaults = Array.from({ length: 9 }, (_, index) => ({
  src: `/assets/images/apadrinamiento/catalogo/${index + 1}.webp`,
  alt: `Historia ${index + 1}`,
}));
