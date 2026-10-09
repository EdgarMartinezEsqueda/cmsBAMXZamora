import type { Schema, Struct } from '@strapi/strapi';

export interface AboutApproach extends Struct.ComponentSchema {
  collectionName: 'components_about_approaches';
  info: {
    displayName: 'Tarjetas con cita';
  };
  attributes: {
    heading: Schema.Attribute.Component<'shared.heading', false>;
    pillars: Schema.Attribute.Component<'shared.feature', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 6;
        },
        number
      >;
    quote: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 400;
      }>;
    quoteAuthor: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
  };
}

export interface AboutCoverage extends Struct.ComponentSchema {
  collectionName: 'components_about_coverages';
  info: {
    displayName: 'Mapa de cobertura';
  };
  attributes: {
    closingText: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 600;
      }>;
    heading: Schema.Attribute.Component<'shared.heading', false>;
    listIntro: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 600;
      }>;
    mapText: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 800;
      }>;
    mapTextSecondary: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 800;
      }>;
    municipalities: Schema.Attribute.Component<'about.municipality', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 30;
        },
        number
      >;
  };
}

export interface AboutHistory extends Struct.ComponentSchema {
  collectionName: 'components_about_histories';
  info: {
    displayName: 'L\u00EDnea de tiempo';
  };
  attributes: {
    ctaText: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    ctaTitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    heading: Schema.Attribute.Component<'shared.heading', false>;
    link: Schema.Attribute.Component<'shared.link', false>;
    milestones: Schema.Attribute.Component<'about.milestone', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 12;
        },
        number
      >;
  };
}

export interface AboutIntro extends Struct.ComponentSchema {
  collectionName: 'components_about_intros';
  info: {
    displayName: 'Pesta\u00F1as con im\u00E1genes y video';
  };
  attributes: {
    heading: Schema.Attribute.Component<'shared.heading', false>;
    images: Schema.Attribute.Media<'images', true>;
    tabs: Schema.Attribute.Component<'shared.feature', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 4;
        },
        number
      >;
    videoImage: Schema.Attribute.Media<'images'>;
    videoLabel: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    videoUrl: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }>;
  };
}

export interface AboutMilestone extends Struct.ComponentSchema {
  collectionName: 'components_about_milestones';
  info: {
    displayName: 'Hito';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 400;
      }>;
    period: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 40;
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
  };
}

export interface AboutMunicipality extends Struct.ComponentSchema {
  collectionName: 'components_about_municipalities';
  info: {
    displayName: 'Municipio';
  };
  attributes: {
    communities: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    families: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    isMain: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    state: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
  };
}

export interface AboutNetworks extends Struct.ComponentSchema {
  collectionName: 'components_about_networks';
  info: {
    displayName: 'Tarjetas y pasos para sumarse';
  };
  attributes: {
    heading: Schema.Attribute.Component<'shared.heading', false>;
    impactText: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 600;
      }>;
    impactTitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    joinHeading: Schema.Attribute.Component<'shared.heading', false>;
    joinSteps: Schema.Attribute.Component<'shared.card', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 6;
        },
        number
      >;
    link: Schema.Attribute.Component<'shared.link', false>;
    linkHint: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    types: Schema.Attribute.Component<'shared.feature', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 8;
        },
        number
      >;
  };
}

export interface BlocksCta extends Struct.ComponentSchema {
  collectionName: 'components_blocks_ctas';
  info: {
    displayName: 'Llamada a la acci\u00F3n';
  };
  attributes: {
    link: Schema.Attribute.Component<'shared.link', false>;
    text: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 400;
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
  };
}

export interface BlocksDonate extends Struct.ComponentSchema {
  collectionName: 'components_blocks_donates';
  info: {
    displayName: 'Datos para donar';
  };
  attributes: {
    note: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
  };
}

export interface BlocksEmbed extends Struct.ComponentSchema {
  collectionName: 'components_blocks_embeds';
  info: {
    displayName: 'Video o mapa';
  };
  attributes: {
    kind: Schema.Attribute.Enumeration<['video', 'mapa']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'video'>;
    title: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    url: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1500;
      }>;
  };
}

export interface BlocksEvents extends Struct.ComponentSchema {
  collectionName: 'components_blocks_events';
  info: {
    displayName: 'Pr\u00F3ximos eventos';
  };
  attributes: {
    note: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
  };
}

export interface BlocksFaq extends Struct.ComponentSchema {
  collectionName: 'components_blocks_faqs';
  info: {
    displayName: 'Preguntas';
  };
  attributes: {
    items: Schema.Attribute.Component<'shared.faq', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 30;
        },
        number
      >;
    title: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
  };
}

export interface BlocksGallery extends Struct.ComponentSchema {
  collectionName: 'components_blocks_gallerys';
  info: {
    displayName: 'Galer\u00EDa';
  };
  attributes: {
    images: Schema.Attribute.Media<'images', true> & Schema.Attribute.Required;
    title: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
  };
}

export interface BlocksPartners extends Struct.ComponentSchema {
  collectionName: 'components_blocks_partners';
  info: {
    displayName: 'Aliados';
  };
  attributes: {
    note: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
  };
}

export interface BlocksProgramsDetail extends Struct.ComponentSchema {
  collectionName: 'components_blocks_programs_details';
  info: {
    displayName: 'Programas con detalle';
  };
  attributes: {
    ctaText: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 400;
      }>;
    ctaTitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    heading: Schema.Attribute.Component<'shared.heading', false>;
    primaryLink: Schema.Attribute.Component<'shared.link', false>;
    secondaryLink: Schema.Attribute.Component<'shared.link', false>;
  };
}

export interface BlocksRichText extends Struct.ComponentSchema {
  collectionName: 'components_blocks_rich_texts';
  info: {
    displayName: 'Texto';
  };
  attributes: {
    parts: Schema.Attribute.Component<'blocks.text-part', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 12;
          min: 1;
        },
        number
      >;
  };
}

export interface BlocksSiteCta extends Struct.ComponentSchema {
  collectionName: 'components_blocks_site_ctas';
  info: {
    displayName: 'Banda S\u00FAmate a nuestra misi\u00F3n';
  };
  attributes: {
    note: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
  };
}

export interface BlocksSocial extends Struct.ComponentSchema {
  collectionName: 'components_blocks_socials';
  info: {
    displayName: 'Instagram y redes';
  };
  attributes: {
    heading: Schema.Attribute.Component<'shared.heading', false>;
  };
}

export interface BlocksSteps extends Struct.ComponentSchema {
  collectionName: 'components_blocks_steps';
  info: {
    displayName: 'Pasos con imagen';
  };
  attributes: {
    heading: Schema.Attribute.Component<'shared.heading', false>;
    list: Schema.Attribute.Component<'shared.list-item', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 8;
        },
        number
      >;
    listTitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    steps: Schema.Attribute.Component<'shared.step-image', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 10;
          min: 1;
        },
        number
      >;
    stepsTitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
  };
}

export interface BlocksTextImage extends Struct.ComponentSchema {
  collectionName: 'components_blocks_text_images';
  info: {
    displayName: 'Texto con imagen';
  };
  attributes: {
    align: Schema.Attribute.Enumeration<
      ['izquierda', 'centro', 'justificado']
    > &
      Schema.Attribute.DefaultTo<'izquierda'>;
    body: Schema.Attribute.Blocks & Schema.Attribute.Required;
    color: Schema.Attribute.Enumeration<
      ['predeterminado', 'verde', 'amarillo', 'rojo', 'gris']
    > &
      Schema.Attribute.DefaultTo<'predeterminado'>;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    imagePosition: Schema.Attribute.Enumeration<['izquierda', 'derecha']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'derecha'>;
    title: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
  };
}

export interface BlocksTextPart extends Struct.ComponentSchema {
  collectionName: 'components_blocks_text_parts';
  info: {
    displayName: 'Secci\u00F3n de texto';
  };
  attributes: {
    align: Schema.Attribute.Enumeration<
      ['izquierda', 'centro', 'justificado']
    > &
      Schema.Attribute.DefaultTo<'izquierda'>;
    body: Schema.Attribute.Blocks & Schema.Attribute.Required;
    color: Schema.Attribute.Enumeration<
      ['predeterminado', 'verde', 'amarillo', 'rojo', 'gris']
    > &
      Schema.Attribute.DefaultTo<'predeterminado'>;
  };
}

export interface ContactRecipient extends Struct.ComponentSchema {
  collectionName: 'components_contact_recipients';
  info: {
    displayName: 'Destinatario';
  };
  attributes: {
    email: Schema.Attribute.Email &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
  };
}

export interface EventResult extends Struct.ComponentSchema {
  collectionName: 'components_event_results';
  info: {
    displayName: 'Cifra de resultado';
  };
  attributes: {
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    value: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 40;
      }>;
  };
}

export interface FaqEntry extends Struct.ComponentSchema {
  collectionName: 'components_faq_entries';
  info: {
    displayName: 'Pregunta con categor\u00EDa';
  };
  attributes: {
    answer: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1500;
      }>;
    category: Schema.Attribute.Enumeration<
      ['general', 'donacion', 'beneficiario', 'voluntario']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'general'>;
    question: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
  };
}

export interface HomeAbout extends Struct.ComponentSchema {
  collectionName: 'components_home_abouts';
  info: {
    displayName: 'Presentaci\u00F3n con imagen y logros';
  };
  attributes: {
    achievements: Schema.Attribute.Component<'shared.list-item', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
        },
        number
      >;
    achievementsTitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    features: Schema.Attribute.Component<'shared.card', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 2;
        },
        number
      >;
    heading: Schema.Attribute.Component<'shared.heading', false>;
    image: Schema.Attribute.Media<'images'>;
    primaryLink: Schema.Attribute.Component<'shared.link', false>;
    secondaryLink: Schema.Attribute.Component<'shared.link', false>;
    videoLabel: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    videoUrl: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }>;
  };
}

export interface HomeImpact extends Struct.ComponentSchema {
  collectionName: 'components_home_impacts';
  info: {
    displayName: 'Secci\u00F3n de cifras de impacto';
  };
  attributes: {
    closingText: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    heading: Schema.Attribute.Component<'shared.heading', false>;
    helpSubtitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    helpTitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    primaryLink: Schema.Attribute.Component<'shared.link', false>;
    secondaryLink: Schema.Attribute.Component<'shared.link', false>;
    statsSubtitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    statsTitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
  };
}

export interface HomeNewsletter extends Struct.ComponentSchema {
  collectionName: 'components_home_newsletters';
  info: {
    displayName: 'Bolet\u00EDn m\u00E1s reciente';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 800;
      }>;
    features: Schema.Attribute.Component<'shared.list-item', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 6;
        },
        number
      >;
    featuresTitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    heading: Schema.Attribute.Component<'shared.heading', false>;
    title: Schema.Attribute.Component<'shared.heading', false>;
  };
}

export interface HomeProcess extends Struct.ComponentSchema {
  collectionName: 'components_home_processes';
  info: {
    displayName: 'Proceso por pasos';
  };
  attributes: {
    heading: Schema.Attribute.Component<'shared.heading', false>;
    steps: Schema.Attribute.Component<'home.process-step', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 8;
        },
        number
      >;
    summaryEyebrow: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    summaryText: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 800;
      }>;
    summaryTitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
  };
}

export interface HomeProcessStep extends Struct.ComponentSchema {
  collectionName: 'components_home_process_steps';
  info: {
    displayName: 'Paso del proceso';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }>;
    link: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }>;
    statSource: Schema.Attribute.Enumeration<
      ['texto', 'familias', 'kilos', 'grupos', 'municipios']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'texto'>;
    statText: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
  };
}

export interface HomeProgramsIntro extends Struct.ComponentSchema {
  collectionName: 'components_home_programs_intros';
  info: {
    displayName: 'Programas destacados';
  };
  attributes: {
    ctaText: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 400;
      }>;
    ctaTitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    heading: Schema.Attribute.Component<'shared.heading', false>;
    primaryLink: Schema.Attribute.Component<'shared.link', false>;
    secondaryLink: Schema.Attribute.Component<'shared.link', false>;
  };
}

export interface SectionsHero extends Struct.ComponentSchema {
  collectionName: 'components_sections_heroes';
  info: {
    displayName: 'Portada con diapositivas';
  };
  attributes: {
    nextLabel: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }> &
      Schema.Attribute.DefaultTo<'Diapositiva siguiente'>;
    previousLabel: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }> &
      Schema.Attribute.DefaultTo<'Diapositiva anterior'>;
    primaryLabel: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    primaryLink: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    secondaryLabel: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    secondaryLink: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    slides: Schema.Attribute.Component<'sections.hero-slide', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 6;
          min: 1;
        },
        number
      >;
    supportDescription: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    supportTitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
  };
}

export interface SectionsHeroSlide extends Struct.ComponentSchema {
  collectionName: 'components_sections_hero_slides';
  info: {
    displayName: 'Diapositiva';
  };
  attributes: {
    badge: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    description: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    headingHighlight: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    headingLead: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
    iconKey: Schema.Attribute.Enumeration<
      ['heart', 'users', 'phone', 'arrow']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'heart'>;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    statLabel: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    statNumber: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 30;
      }>;
  };
}

export interface SharedCard extends Struct.ComponentSchema {
  collectionName: 'components_shared_cards';
  info: {
    displayName: 'Tarjeta';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 600;
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
  };
}

export interface SharedFaq extends Struct.ComponentSchema {
  collectionName: 'components_shared_faqs';
  info: {
    displayName: 'Pregunta frecuente';
  };
  attributes: {
    answer: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1500;
      }>;
    question: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
  };
}

export interface SharedFeature extends Struct.ComponentSchema {
  collectionName: 'components_shared_features';
  info: {
    displayName: 'Bloque con lista';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 600;
      }>;
    items: Schema.Attribute.Component<'shared.list-item', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 6;
        },
        number
      >;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
  };
}

export interface SharedHeading extends Struct.ComponentSchema {
  collectionName: 'components_shared_headings';
  info: {
    displayName: 'Encabezado de secci\u00F3n';
  };
  attributes: {
    eyebrow: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    highlight: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    intro: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 800;
      }>;
    lead: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    tail: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
  };
}

export interface SharedLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_links';
  info: {
    displayName: 'Bot\u00F3n o enlace';
  };
  attributes: {
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    url: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }>;
  };
}

export interface SharedListItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_list_items';
  info: {
    displayName: 'Elemento de lista';
  };
  attributes: {
    text: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
  };
}

export interface SharedStepImage extends Struct.ComponentSchema {
  collectionName: 'components_shared_step_images';
  info: {
    displayName: 'Paso con imagen';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 400;
      }>;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
  };
}

export interface SiteCallToAction extends Struct.ComponentSchema {
  collectionName: 'components_site_call_to_actions';
  info: {
    displayName: 'Llamada a la acci\u00F3n';
  };
  attributes: {
    eyebrow: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    image: Schema.Attribute.Media<'images'>;
    link: Schema.Attribute.Component<'shared.link', false>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
  };
}

export interface SiteImpact extends Struct.ComponentSchema {
  collectionName: 'components_site_impacts';
  info: {
    displayName: 'Cifras de impacto';
  };
  attributes: {
    communityGroups: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    deliveryPoints: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    familiesPerMonth: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    foodKgPerMonth: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    foundedYear: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 2100;
          min: 1900;
        },
        number
      >;
    municipalities: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
  };
}

export interface SiteLoadingScreen extends Struct.ComponentSchema {
  collectionName: 'components_site_loading_screens';
  info: {
    displayName: 'Pantalla de carga';
  };
  attributes: {
    barColors: Schema.Attribute.Enumeration<
      ['marca', 'verde', 'amarillo', 'rojo']
    > &
      Schema.Attribute.DefaultTo<'marca'>;
    image: Schema.Attribute.Media<'images'>;
  };
}

export interface SitePartners extends Struct.ComponentSchema {
  collectionName: 'components_site_partners';
  info: {
    displayName: 'Encabezado de aliados';
  };
  attributes: {
    heading: Schema.Attribute.Component<'shared.heading', false>;
  };
}

export interface SiteSeoEntry extends Struct.ComponentSchema {
  collectionName: 'components_site_seo_entries';
  info: {
    displayName: 'SEO de p\u00E1gina';
  };
  attributes: {
    description: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 170;
      }>;
    page: Schema.Attribute.Enumeration<
      [
        'inicio',
        'programas',
        'contacto',
        'nosotros',
        'donar',
        'preguntas',
        'beneficiarios',
        'apadrinamiento',
      ]
    > &
      Schema.Attribute.Required;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 70;
      }>;
  };
}

export interface SiteSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_site_social_links';
  info: {
    displayName: 'Red social';
  };
  attributes: {
    network: Schema.Attribute.Enumeration<
      [
        'facebook',
        'instagram',
        'youtube',
        'tiktok',
        'x',
        'whatsapp',
        'linkedin',
      ]
    > &
      Schema.Attribute.Required;
    url: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }>;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'about.approach': AboutApproach;
      'about.coverage': AboutCoverage;
      'about.history': AboutHistory;
      'about.intro': AboutIntro;
      'about.milestone': AboutMilestone;
      'about.municipality': AboutMunicipality;
      'about.networks': AboutNetworks;
      'blocks.cta': BlocksCta;
      'blocks.donate': BlocksDonate;
      'blocks.embed': BlocksEmbed;
      'blocks.events': BlocksEvents;
      'blocks.faq': BlocksFaq;
      'blocks.gallery': BlocksGallery;
      'blocks.partners': BlocksPartners;
      'blocks.programs-detail': BlocksProgramsDetail;
      'blocks.rich-text': BlocksRichText;
      'blocks.site-cta': BlocksSiteCta;
      'blocks.social': BlocksSocial;
      'blocks.steps': BlocksSteps;
      'blocks.text-image': BlocksTextImage;
      'blocks.text-part': BlocksTextPart;
      'contact.recipient': ContactRecipient;
      'event.result': EventResult;
      'faq.entry': FaqEntry;
      'home.about': HomeAbout;
      'home.impact': HomeImpact;
      'home.newsletter': HomeNewsletter;
      'home.process': HomeProcess;
      'home.process-step': HomeProcessStep;
      'home.programs-intro': HomeProgramsIntro;
      'sections.hero': SectionsHero;
      'sections.hero-slide': SectionsHeroSlide;
      'shared.card': SharedCard;
      'shared.faq': SharedFaq;
      'shared.feature': SharedFeature;
      'shared.heading': SharedHeading;
      'shared.link': SharedLink;
      'shared.list-item': SharedListItem;
      'shared.step-image': SharedStepImage;
      'site.call-to-action': SiteCallToAction;
      'site.impact': SiteImpact;
      'site.loading-screen': SiteLoadingScreen;
      'site.partners': SitePartners;
      'site.seo-entry': SiteSeoEntry;
      'site.social-link': SiteSocialLink;
    }
  }
}
