import { useState } from "react";
import FAQAccordion from "components/faqs/FAQAccordion";
import Gallery from "components/gallery/Gallery";
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

const BLOCKS = {
  "rich-text": ({ body }) => (
    <section className="mx-auto max-w-4xl px-4 py-10"><RichText blocks={body} /></section>
  ),
  "text-image": ({ title, body, image, imagePosition }) => (
    <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-10 lg:grid-cols-2">
      <div className={imagePosition === "izquierda" ? "lg:order-2" : ""}>
        {title && <h2 className="mb-4 text-3xl font-bold text-gray-800">{title}</h2>}
        <RichText blocks={body} />
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
};

/** Bloques de una página creada desde el panel, en el orden que eligió el editor. */
export default function PageBlocks({ blocks }) {
  return blocks.map((block, index) => {
    const Block = BLOCKS[block.type];
    return Block ? <Block key={index} {...block} /> : null;
  });
}
