import Partners from "components/sliders/Partners";
import useSite from "utils/useSite";

const PartnersSection = () => {
  const { partners } = useSite();
  if (!partners || partners.logos.length === 0) return null;
  const { heading } = partners;
  return (
    <section className="relative py-10 bg-gradient-to-b overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-14 space-y-6">
          
          {/* Badge introductorio */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-verdeLogo/10 to-amarilloLogo/10 px-4 py-2 rounded-full border border-verdeLogo/20 shadow-sm">
            <span className="text-verdeLogo font-semibold text-sm tracking-wide">
              {heading?.eyebrow}
            </span>
          </div>

          {/* Título */}
          <h2 className="text-4xl md:text-5xl font-extrabold">
            <span className="text-transparent bg-gradient-to-r from-verdeLogo via-amarilloLogo to-rojoLogo bg-clip-text">
              {heading?.lead} {heading?.highlight}
            </span>
          </h2>

          {/* Texto descriptivo */}
          <p className="text-lg max-w-3xl mx-auto text-gray-700 leading-relaxed">
            {heading?.intro}
          </p>
        </div>

        {/* Slider envuelto en un card */}
        <div >
          <Partners logos={partners.logos} />
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;