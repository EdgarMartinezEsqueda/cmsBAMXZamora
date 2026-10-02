import React, { useEffect, useRef } from "react";

// logos: [{ name, logo: { src, alt }, url }] desde la colección "Aliados". La lista va duplicada
// para el desplazamiento infinito: la copia no lleva texto alternativo ni recibe el foco.
const PartnersSlider = ({ logos, bgColor = "bg-gray-50" }) => {
  const containerRef = useRef(null);

  const duplicatedLogos = [...logos, ...logos]; // duplicado para scroll infinito

  useEffect(() => {
    const container = containerRef.current;
    let scrollAmount = 0;

    let animationFrameId;

    const scroll = () => {
      scrollAmount += 0.3; // velocidad
      if (scrollAmount >= container.scrollWidth / 2) 
        scrollAmount = 0;

      container.scrollLeft = scrollAmount;
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <section className={`py-12 overflow-hidden relative ${bgColor}`}>
      <h2 className="sr-only">Aliados</h2>
      <div className="max-w-7xl mx-auto px-4 relative overflow-hidden">
        <div className="absolute inset-0 z-10 pointer-events-none bg-transparent" />
        <div
          ref={containerRef}
          className="flex gap-8 whitespace-nowrap overflow-x-scroll no-scrollbar"
          style={{ scrollBehavior: "auto" }}
        >
          {duplicatedLogos.map((partner, i) => (
            <div
              key={i}
              className="w-[120px] h-[100px] sm:w-[140px] sm:h-[110px] md:w-[160px] md:h-[120px] flex items-center justify-center shrink-0"
            >
              {partner.url ? (
                <a href={partner.url} target="_blank" rel="noopener noreferrer" className="relative z-20 flex h-full w-full items-center justify-center"
                  {...(i < logos.length ? {} : { tabIndex: -1, "aria-hidden": true })}>
                  <img
                    src={partner.logo.src}
                    alt={i < logos.length ? (partner.logo.alt || partner.name) : ""}
                    className="max-w-full max-h-full object-contain select-none pointer-events-none"
                    draggable="false"
                  />
                </a>
              ) : (
                <img
                  src={partner.logo.src}
                  alt={i < logos.length ? (partner.logo.alt || partner.name) : ""}
                  className="max-w-full max-h-full object-contain select-none pointer-events-none"
                  draggable="false"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(PartnersSlider);
