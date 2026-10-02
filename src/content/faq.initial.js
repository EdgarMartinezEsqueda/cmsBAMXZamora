// Contenido inicial de migración de Preguntas frecuentes. No usar como fallback de errores de Strapi.
// Mismos campos que el single type "Página Preguntas" (faq-page) tras pasar por su mapper.

export const faqDefaults = {
  pageTitle: "Preguntas frecuentes",
  pageSubtitle: "",
  heading: {
    eyebrow: "",
    lead: "",
    highlight: "Preguntas Frecuentes",
    tail: "",
    intro: "Todo lo que necesitas saber sobre cómo apoyar o recibir ayuda del Banco de Alimentos de Zamora A. C.",
  },
  entries: [
    {
      "question": "¿Qué es el Banco de Alimentos de Zamora A.C.?",
      "answer": "Es una organización con más de 13 años de trabajo en la región, comprometida en rescatar, clasificar y distribuir alimentos a familias en situación vulnerable, además de implementar programas sociales y comunitarios.",
      "category": "general"
    },
    {
      "question": "¿Cómo puedo donar alimentos?",
      "answer": "Puedes llevar alimentos no perecederos a nuestras instalaciones o puntos de recolección. También recibimos frutas, verduras, pan del día y excedentes de empresas aliadas.",
      "category": "donacion"
    },
    {
      "question": "¿Aceptan donaciones monetarias?",
      "answer": "Sí, las donaciones económicas son esenciales para cubrir transporte, operación y compra de alimentos que escasean. Puedes donar de manera individual o como empresa.",
      "category": "donacion"
    },
    {
      "question": "¿Puedo recibir un comprobante fiscal por mi donación?",
      "answer": "Sí, como donataria autorizada por el SAT podemos emitir recibos deducibles de impuestos para personas físicas y empresas.",
      "category": "donacion"
    },
    {
      "question": "¿Qué programas tienen activos?",
      "answer": "Actualmente contamos con Comedor Comunitario BAMX Zamora, Apadrinamientos 'Por menos hambre y más sonrisas', Talleres comunitarios, Voluntariado y campañas como Abrigando Corazones, Pequeñas Sonrisas y el Rescatón.",
      "category": "general"
    },
    {
      "question": "¿Cómo puedo ser voluntario?",
      "answer": "Puedes unirte apoyando en clasificación de alimentos, armado de despensas, actividades comunitarias o en nuestras campañas. Solo necesitas disposición y ganas de ayudar.",
      "category": "voluntario"
    },
    {
      "question": "¿Cómo funciona el programa de apadrinamiento?",
      "answer": "A través de 'Por menos hambre y más sonrisas' puedes apoyar directamente a un caso vulnerable cubriendo sus necesidades básicas de alimentación, salud y educación, mientras nosotros damos seguimiento integral.",
      "category": "donacion"
    },
    {
      "question": "¿Cómo solicito apoyo alimentario?",
      "answer": "Debes acercarte a nuestro equipo de trabajo social. Evaluamos cada caso y, si cumples los criterios, se te incluye en el padrón de beneficiarios. Necesitas identificación oficial, CURP y comprobante de domicilio.",
      "category": "beneficiario"
    },
    {
      "question": "¿Qué impacto tiene su labor?",
      "answer": "Cada mes entregamos más de 70,000 kg de alimentos a más de 10,000 familias en Zamora y municipios aledaños, reduciendo la inseguridad alimentaria y promoviendo hábitos más saludables.",
      "category": "general"
    },
    {
      "question": "¿Qué hacen con los alimentos rescatados?",
      "answer": "Son clasificados y revisados bajo normas de seguridad alimentaria. Solo distribuimos lo que es apto para consumo, reduciendo el desperdicio y cuidando el medio ambiente.",
      "category": "general"
    },
    {
      "question": "¿Puedo donar en nombre de una empresa?",
      "answer": "Sí, las empresas pueden aportar alimentos, donaciones económicas o participar en campañas. Además, pueden sumarse prestando vehículos o voluntarios para distribución.",
      "category": "donacion"
    }
  ],
  ctaTitle: "¿No encontraste lo que buscas?",
  ctaText: "Nuestro equipo está aquí para ayudarte. No dudes en contactarnos directamente.",
  link: { label: "Contactar ahora", url: "/contacto" },
};
