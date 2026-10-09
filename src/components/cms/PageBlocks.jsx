import { useState } from "react";
import About from "components/about/About";
import AboutSection from "components/about/AboutSection";
import HistoryTimeline from "components/about/HistoryTimeline";
import IntegralApproach from "components/about/IntegralApproach";
import ProgramsAbout from "components/about/ProgramsAbout";
import SupportNetworks from "components/about/SupportNetworks";
import CallToAction from "components/cta/CallToAction";
import FAQAccordion from "components/faqs/FAQAccordion";
import FunFact from "components/funfact/Funfact";
import Gallery from "components/gallery/Gallery";
import Mapa from "components/map/Mapa";
import Beneficiaries from "components/media/Beneficiaries";
import InstagramSection from "components/media/InstagramSection";
import PartnersSection from "components/media/PartnersSection";
import LatestNewsletter from "components/newsletter/LatestNewsletter";
import ProcessSection from "components/process/Process";
import ProgramsSection from "components/programs/ProgramsSection";
import Hero from "components/sliders/Hero";
import useSite from "utils/useSite";
import DonateBlock from "./DonateBlock";
import EmbedBlock from "./EmbedBlock";
import EventsBlock from "./EventsBlock";
import RichText from "./RichText";

function FaqBlock({ title, items }) {
  const [active, setActive] = useState(null);
  return (
    <section className="mx-auto max-w-4xl px-4 py-10">
      {title && <h2 className="mb-6 text-3xl font-bold text-gray-800">{title}</h2>}
      <FAQAccordion faqs={items} activeIndex={active} onToggle={(index) => setActive(active === index ? null : index)} />
    </section>
  );
}

// Igual que en Inicio: el teléfono de la portada sale de "Datos del sitio".
function HeroBlock(props) {
  const { contact } = useSite();
  return <Hero {...props} supportPhone={contact.phone} />;
}

// Cada tipo de bloque (shared/content/page.js) con el componente del sitio que lo pinta. Los
// bloques que vienen de secciones del sitio reutilizan su componente tal cual.
const BLOCKS = {
  "rich-text": ({ parts }) => (
    <section className="mx-auto max-w-4xl space-y-6 px-4 py-10">
      {parts.map((part, index) => <RichText key={index} blocks={part.body} align={part.align} color={part.color} />)}
    </section>
  ),
  "text-image": ({ title, body, image, imagePosition, align, color }) => (
    <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-10 lg:grid-cols-2">
      <div className={imagePosition === "izquierda" ? "lg:order-2" : ""}>
        {title && <h2 className="mb-4 text-3xl font-bold text-gray-800">{title}</h2>}
        <RichText blocks={body} align={align} color={color} />
      </div>
      {image && <img src={image.src} alt={image.alt} className="w-full rounded-2xl object-cover shadow-lg" loading="lazy" />}
    </section>
  ),
  gallery: ({ title, images }) => images.length > 0 && <Gallery heading={{ highlight: title }} images={images} />,
  faq: FaqBlock,
  cta: ({ title, text, link }) => (
    <section className="mx-auto max-w-4xl px-4 py-10">
      <div className="rounded-3xl bg-verdeLogo p-8 text-center text-white shadow-xl md:p-12">
        <h2 className="mb-3 text-3xl font-bold">{title}</h2>
        {text && <p className="mb-6 text-lg text-white/90">{text}</p>}
        {link && (
          <a href={link.url} className="inline-block rounded-full bg-white px-8 py-3 font-bold text-verdeLogo shadow-lg hover:bg-gray-100">
            {link.label}
          </a>
        )}
      </div>
    </section>
  ),
  hero: HeroBlock,
  presentation: AboutSection,
  process: ProcessSection,
  impact: FunFact,
  programs: ProgramsSection,
  newsletter: LatestNewsletter,
  timeline: HistoryTimeline,
  pillars: IntegralApproach,
  partners: PartnersSection,
  steps: ({ heading, listTitle, list, stepsTitle, steps }) => steps.length > 0 && (
    <Beneficiaries heading={heading} documentsTitle={listTitle} documents={list} stepsTitle={stepsTitle} steps={steps} />
  ),
  embed: EmbedBlock,
  tabs: About,
  join: SupportNetworks,
  coverage: Mapa,
  "programs-detail": ProgramsAbout,
  social: InstagramSection,
  "site-cta": CallToAction,
  donate: DonateBlock,
  events: EventsBlock,
};

/** Bloques de una página creada desde el panel, en el orden que eligió el editor. */
export default function PageBlocks({ blocks }) {
  return blocks.map((block, index) => {
    const Block = BLOCKS[block.type];
    return Block ? <Block key={index} {...block} /> : null;
  });
}
