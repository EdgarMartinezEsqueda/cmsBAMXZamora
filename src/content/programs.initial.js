// Contenido inicial de migración de la colección Programas. No usar como fallback de errores de Strapi.
// Fuente única que sustituye a programasData.js, ProgramsSection.jsx, ProgramsAbout.jsx y los enlaces
// del pie de página, generada a partir de esas cuatro copias.
// published: false se importa como borrador (Servicio Social estaba comentado en el sitio).

export const programsDefaults = [
  {
    "category": "programa",
    "shortTitle": "",
    "badge": "",
    "period": "",
    "description": "El voluntariado en BAMX Zamora es el corazón de nuestras acciones. A través del compromiso y solidaridad de personas como tú, logramos que los alimentos lleguen a quienes más los necesitan. Puedes ayudar en clasificación y empaque de alimentos, apoyo en eventos, programas y campañas de sensibilización. Dona tu tiempo, talento y energía para transformar vidas.",
    "videoUrl": "",
    "image": {
      "src": "/assets/images/programas/voluntariado.webp",
      "alt": "Personas voluntarias preparando despensas"
    },
    "keyPoints": [
      "Actividades desde clasificación hasta eventos especiales",
      "Flexibilidad de horarios según tu disponibilidad",
      "Orientación y capacitación inicial",
      "Ambiente seguro de trabajo en equipo que marca la diferencia"
    ],
    "faqs": [
      {
        "question": "¿Necesito experiencia previa?",
        "answer": "No, solo las ganas de ayudar. Te capacitamos en el área que elijas."
      },
      {
        "question": "¿Cuántas horas debo comprometerme?",
        "answer": "Puedes participar según tu disponibilidad, cada esfuerzo cuenta."
      }
    ],
    "highlights": [
      "Clasificación de alimentos",
      "Eventos y campañas",
      "Apoyo en programas"
    ],
    "showOnHome": true,
    "showOnAbout": true,
    "showOnProgramsPage": true,
    "published": true,
    "slug": "voluntariado",
    "title": "Voluntariado",
    "icon": "hands-helping",
    "summary": "El corazón de nuestras acciones. Personas comprometidas que donan tiempo, talento y energía para transformar vidas a través del servicio comunitario.",
    "order": 10
  },
  {
    "category": "programa",
    "shortTitle": "Apadrinamiento",
    "badge": "",
    "period": "",
    "description": "Programa de apadrinamiento que nace en abril 2024 como respuesta a las necesidades de nuestro entorno. Alcanzamos a personas en marginación sin redes de apoyo que viven con desnutrición, abandono, rezago educativo o enfermedades. El padrino se compromete a apoyar la alimentación mientras brindamos herramientas, seguimiento nutricional, psicológico y consejería para mejorar su calidad de vida.",
    "videoUrl": "https://www.youtube.com/embed/WSaNPe_lJEQ?si=RSvSs7gGaNzYp4JR",
    "image": {
      "src": "/assets/images/beneficiarios/18.webp",
      "alt": "Entrega de apoyo del programa de apadrinamiento"
    },
    "keyPoints": [
      "Apoyo integral: alimentación, salud y educación",
      "Seguimiento nutricional y psicológico profesional",
      "Reportes periódicos del impacto de tu apoyo",
      "Impulsa el empoderamiento e independencia del apadrinado"
    ],
    "faqs": [
      {
        "question": "¿Cómo funciona el apadrinamiento?",
        "answer": "Puedes apadrinar de manera monetaria o en especie. Nosotros nos encargamos del seguimiento integral del caso."
      },
      {
        "question": "¿Puedo elegir a quién apadrinar?",
        "answer": "Sí, difundimos casos vulnerables en redes sociales o podemos asignarte uno según las necesidades actuales."
      },
      {
        "question": "Beneficios de ser padrino",
        "answer": "Apoyas una causa vital, contribuyes al crecimiento personal y te conviertes en red de apoyo. Al ser Donataria Autorizada, podremos entregarte un recibo deducible al realizar tu donativo."
      }
    ],
    "highlights": [
      "Seguimiento nutricional",
      "Apoyo psicológico",
      "Consejería personalizada"
    ],
    "showOnHome": true,
    "showOnAbout": true,
    "showOnProgramsPage": true,
    "published": true,
    "slug": "apadrinamiento",
    "title": "Por Menos Hambre y Más Sonrisas",
    "icon": "gift",
    "summary": "\"Por menos hambre y más sonrisas\" conecta a padrinos con casos vulnerables, brindando alimentación y acompañamiento integral para mejorar su calidad de vida.",
    "order": 20
  },
  {
    "category": "programa",
    "shortTitle": "Comedor comunitario",
    "badge": "",
    "period": "",
    "description": "Iniciativa diseñada para brindar apoyo a personas en situación de vulnerabilidad y ofrecer una opción accesible y nutritiva. Ofrecemos desayunos completos a bajo costo para que trabajadores y voluntarios comiencen su día con la energía y bienestar necesarios. Este espacio se ha convertido en un símbolo de solidaridad donde la alimentación es un acto de apoyo mutuo y colaboración.",
    "videoUrl": "https://drive.google.com/file/d/1sqTezYc-u_Ahg8IA0_KdPor4mplGJ26Y/preview",
    "image": {
      "src": "/assets/images/programas/comedor.webp",
      "alt": "Comedor comunitario sirviendo desayunos"
    },
    "keyPoints": [
      "Desayunos nutritivos y accesibles",
      "Opción para personas vulnerables y colaboradores",
      "Contribuye a la seguridad alimentaria comunitaria",
      "Espacio de solidaridad y convivencia"
    ],
    "faqs": [
      {
        "question": "¿Quiénes pueden acceder al comedor?",
        "answer": "Personas en situación de vulnerabilidad, trabajadores y voluntarios del banco de alimentos."
      },
      {
        "question": "¿Cuál es el costo?",
        "answer": "Los desayunos tienen un costo simbólico accesible para facilitar el acceso a todos."
      }
    ],
    "highlights": [
      "Desayunos a bajo costo",
      "Menú nutritivo",
      "Atención diaria"
    ],
    "showOnHome": true,
    "showOnAbout": true,
    "showOnProgramsPage": true,
    "published": true,
    "slug": "comedor-comunitario",
    "title": "Comedor comunitario móvil",
    "icon": "utensils",
    "summary": "Brindamos desayunos nutritivos y accesibles a personas en situación de vulnerabilidad y trabajadores. Un espacio de solidaridad donde la alimentación se convierte en apoyo mutuo.",
    "order": 30
  },
  {
    "category": "programa",
    "shortTitle": "Talleres",
    "badge": "Gratuitos o costo simbólico",
    "period": "",
    "description": "Fomentamos el desarrollo integral de la comunidad a través de talleres y actividades formativas que se realizan de manera periódica. Estos programas se ofrecen mensualmente, en modalidad gratuita o con costo simbólico, para que estén al alcance de todas las personas. Su propósito es brindar herramientas prácticas que fortalezcan el bienestar, la autosuficiencia y la participación activa de la comunidad.",
    "videoUrl": "",
    "image": {
      "src": "/assets/images/programas/talleres.webp",
      "alt": "Taller comunitario en sesión"
    },
    "keyPoints": [
      "Talleres mensuales variados y formativos",
      "Gratuitos o con costo simbólico accesible",
      "Enfoque en bienestar y autosuficiencia",
      "Herramientas prácticas para el desarrollo personal y familiar"
    ],
    "faqs": [
      {
        "question": "¿Qué tipo de talleres ofrecen?",
        "answer": "Talleres de nutrición, educación, desarrollo personal, consejería y otras actividades formativas según las necesidades de la comunidad."
      },
      {
        "question": "¿Necesito ser beneficiario para participar?",
        "answer": "No necesariamente, los talleres están abiertos a la comunidad en general."
      }
    ],
    "highlights": [
      "Nutrición",
      "Desarrollo personal",
      "Habilidades prácticas"
    ],
    "showOnHome": true,
    "showOnAbout": true,
    "showOnProgramsPage": true,
    "published": true,
    "slug": "talleres",
    "title": "Talleres BAMX Zamora",
    "icon": "chalkboard",
    "summary": "Ofrecemos talleres mensuales gratuitos o a bajo costo que fortalecen el bienestar, la autosuficiencia y la participación activa de la comunidad.",
    "order": 40
  },
  {
    "category": "campana",
    "shortTitle": "",
    "badge": "",
    "period": "Semanal",
    "description": "Nos esforzamos por preparar las mentes de nuestros niños para actuar y transformar los espacios donde se desenvuelven. Nuestro compromiso es crear ambientes de formación donde cada niño tenga la oportunidad de crecer y convertirse en un verdadero agente de cambio en su entorno. Dirigido principalmente a niños de 6 a 12 años de la Colonia Valencia.",
    "videoUrl": "",
    "image": {
      "src": "/assets/images/programas/sabadoCultural.webp",
      "alt": "Niños participando en actividades culturales"
    },
    "keyPoints": [
      "Formación integral para niños de 6 a 12 años",
      "Actividades culturales y educativas semanales",
      "Fomenta agentes de cambio en la comunidad",
      "Espacios de crecimiento y transformación personal"
    ],
    "faqs": [
      {
        "question": "¿Dónde se realiza?",
        "answer": "En la Colonia Valencia, un espacio preparado para el desarrollo de los niños."
      },
      {
        "question": "¿Tiene algún costo?",
        "answer": "Los detalles de participación puedes consultarlos directamente con el banco de alimentos."
      }
    ],
    "highlights": [],
    "showOnHome": false,
    "showOnAbout": true,
    "showOnProgramsPage": true,
    "published": true,
    "slug": "sabado-cultural",
    "title": "Sábado Cultural BAMX Zamora",
    "icon": "palette",
    "summary": "Programa de formación para niños de 6 a 12 años de la Colonia Valencia, transformando espacios educativos y creando agentes de cambio.",
    "order": 50
  },
  {
    "category": "programa",
    "shortTitle": "",
    "badge": "",
    "period": "",
    "description": "Creemos que la lectura es una herramienta poderosa para el crecimiento personal y comunitario. Abrimos un espacio dedicado a voluntarias y al público en general, donde cada semana nos reunimos para compartir historias, reflexiones y aprendizajes en un ambiente relajante y acogedor, ideal para disfrutar de la lectura y la convivencia.",
    "videoUrl": "",
    "image": {
      "src": "/assets/images/programas/tallerLectura.webp",
      "alt": "Grupo de personas en taller de lectura"
    },
    "keyPoints": [
      "Sesiones semanales todos los jueves a las 11:00 am",
      "Espacio abierto a voluntarias y público en general",
      "Ambiente relajante y acogedor",
      "Momento para nutrir la mente y fortalecer lazos comunitarios"
    ],
    "faqs": [
      {
        "question": "¿Necesito llevar algún libro?",
        "answer": "Puedes traer tu libro favorito o disfrutar de los que compartimos en el taller."
      },
      {
        "question": "¿Puedo asistir aunque no sea voluntaria?",
        "answer": "Sí, el taller está abierto a toda la comunidad."
      }
    ],
    "highlights": [
      "Todos los jueves",
      "Ambiente relajante",
      "Abierto al público"
    ],
    "showOnHome": false,
    "showOnAbout": true,
    "showOnProgramsPage": true,
    "published": true,
    "slug": "taller-lectura",
    "title": "Taller de Lectura",
    "icon": "book",
    "summary": "Cada jueves a las 11:00 am nos reunimos en un ambiente acogedor para compartir historias, reflexiones y nutrir la mente en comunidad.",
    "order": 60
  },
  {
    "category": "programa",
    "shortTitle": "Padrón de Beneficiarios",
    "badge": "",
    "period": "",
    "description": "Si tú o alguien que conoces necesita apoyo alimentario, pueden acercarse al banco de alimentos para unirse al padrón. Atendemos a más de 10,000 familias en 70 grupos comunitarios distribuidos en 7 municipios: Zamora, Jacona, Tangancícuaro, Ixtlán, Chavinda, Santiago y Chilchota. Nuestro equipo te guiará en el proceso de registro.",
    "videoUrl": "",
    "image": {
      "src": "/assets/images/beneficiarios/2.webp",
      "alt": "Entrega de despensas a beneficiarios"
    },
    "keyPoints": [
      "Proceso de registro sencillo y confidencial",
      "Entrega mensual de apoyos alimentarios nutritivos",
      "Más de 70,124 kg de alimentos entregados mensualmente entre 10,000 familias",
      "Acceso a programas de desarrollo biopsicosocial"
    ],
    "faqs": [
      {
        "question": "¿Cuáles son los requisitos?",
        "answer": "Identificación oficial, CURP y comprobante de domicilio actual."
      },
      {
        "question": "¿En qué municipios tienen cobertura?",
        "answer": "Zamora, Jacona, Tangancícuaro, Ixtlán, Chavinda, Santiago y Chilchota, en 70 grupos comunitarios."
      }
    ],
    "highlights": [],
    "showOnHome": false,
    "showOnAbout": false,
    "showOnProgramsPage": true,
    "published": true,
    "slug": "beneficiarios",
    "title": "Padrón de Beneficiarios",
    "icon": "first-aid",
    "summary": "Si tú o alguien que conoces necesita apoyo alimentario, pueden acercarse al banco de alimentos para registrarse en el padrón de beneficiarios.",
    "order": 70
  },
  {
    "category": "programa",
    "shortTitle": "",
    "badge": "",
    "period": "",
    "description": "",
    "videoUrl": "",
    "image": {
      "src": "/assets/images/beneficiarios/22.webp",
      "alt": "Boletín Manitas"
    },
    "keyPoints": [],
    "faqs": [],
    "highlights": [
      "Noticias mensuales",
      "Testimonios",
      "Resultados de impacto"
    ],
    "showOnHome": false,
    "showOnAbout": true,
    "showOnProgramsPage": false,
    "published": true,
    "slug": "boletin-manitas",
    "title": "Boletín Manitas",
    "icon": "newspaper",
    "summary": "Nuestro espacio de comunicación donde compartimos noticias, testimonios y resultados de impacto, fortaleciendo la transparencia y cercanía.",
    "order": 80
  },
  {
    "category": "campana",
    "shortTitle": "",
    "badge": "",
    "period": "Anual",
    "description": "",
    "videoUrl": "",
    "image": null,
    "keyPoints": [],
    "faqs": [],
    "highlights": [],
    "showOnHome": false,
    "showOnAbout": true,
    "showOnProgramsPage": false,
    "published": true,
    "slug": "dispensario-medicamento",
    "title": "Dispensario de Medicamento",
    "icon": "gift",
    "summary": "Colecta anual de medicamentos que entregamos gratuitamente con receta vigente, apoyando la economía de nuestros beneficiarios.",
    "order": 90
  },
  {
    "category": "campana",
    "shortTitle": "",
    "badge": "",
    "period": "Navideña",
    "description": "",
    "videoUrl": "",
    "image": null,
    "keyPoints": [],
    "faqs": [],
    "highlights": [],
    "showOnHome": false,
    "showOnAbout": true,
    "showOnProgramsPage": false,
    "published": true,
    "slug": "pequenas-sonrisas",
    "title": "Pequeñas Sonrisas",
    "icon": "heart",
    "summary": "Rescate de juguetes y ropa invernal para niños de colonias vulnerables. Identificamos factores de riesgo e implementamos estrategias de apoyo.",
    "order": 100
  },
  {
    "category": "campana",
    "shortTitle": "",
    "badge": "",
    "period": "Invernal",
    "description": "",
    "videoUrl": "",
    "image": null,
    "keyPoints": [],
    "faqs": [],
    "highlights": [],
    "showOnHome": false,
    "showOnAbout": true,
    "showOnProgramsPage": false,
    "published": true,
    "slug": "abrigando-corazones",
    "title": "Abrigando Corazones",
    "icon": "hands-helping",
    "summary": "Colecta invernal de cobijas y ropa abrigadora para adultos mayores en situación de calle, alcanzando casos vulnerables no identificados.",
    "order": 110
  },
  {
    "category": "campana",
    "shortTitle": "",
    "badge": "",
    "period": "Escolar",
    "description": "",
    "videoUrl": "",
    "image": null,
    "keyPoints": [],
    "faqs": [],
    "highlights": [],
    "showOnHome": false,
    "showOnAbout": true,
    "showOnProgramsPage": false,
    "published": true,
    "slug": "rescaton",
    "title": "Rescatón",
    "icon": "utensils",
    "summary": "Campaña educativa en escuelas para generar conciencia sobre reducción de desperdicio de alimentos a través de dinámicas lúdicas y teatro.",
    "order": 120
  },
  {
    "category": "programa",
    "shortTitle": "",
    "badge": "",
    "period": "",
    "description": "Contamos con convenios con preparatorias y universidades. Dependiendo del perfil del alumno, sus necesidades y las del banco, se le asignan tareas en áreas como producción, logística, comunicación, trabajo social, nutrición, psicología, administración y más. Es una oportunidad para obtener experiencia práctica mientras contribuyes a nuestra misión.",
    "videoUrl": "",
    "image": null,
    "keyPoints": [
      "Horarios flexibles adaptados a tu escuela",
      "Experiencia práctica en proyectos de impacto social",
      "Diversas áreas: producción, logística, comunicación, trabajo social",
      "Cartas de recomendación y posibilidad de continuar como voluntario"
    ],
    "faqs": [
      {
        "question": "¿Cuántas horas necesito completar?",
        "answer": "Depende de tu institución: desde 50 horas para preparatoria hasta 240-480 horas para universitarios."
      },
      {
        "question": "¿Puedo elegir el área donde trabajaré?",
        "answer": "Sí, según tus habilidades, intereses y las necesidades actuales del banco."
      }
    ],
    "highlights": [],
    "showOnHome": false,
    "showOnAbout": false,
    "showOnProgramsPage": true,
    "published": false,
    "slug": "servicio-social",
    "title": "Servicio Social",
    "icon": "heartbeat",
    "summary": "Convenios con preparatorias y universidades para realizar servicio social en áreas como producción, logística, comunicación y trabajo social.",
    "order": 130
  }
];
