import { useEffect } from "react";

// heading: encabezado de la sección desde el CMS. El widget de Elfsight es configuración (.env).
const InstagramSection = ({ heading }) => {
  useEffect(() => {
    if (!document.querySelector("script[src*='elfsight']")) {
      const script = document.createElement("script");
      script.src = "https://apps.elfsight.com/p/platform.js";
      script.defer = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <section className="relative pb-20 ">
      <section className="relative  text-dark-gray overflow-hidden">
        <div className="container mx-auto px-4">
          {/* Encabezado */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-verdeLogo">
              {heading?.lead}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              {heading?.intro}
            </p>
          </div>

          {/* Widget con estilo */}
          <div className="bg-white rounded-2xl shadow-lg border border-verdeLogo/30 p-6">
            <div className={import.meta.env.VITE_InstagramApp} data-elfsight-app-lazy></div>
          </div>
        </div>
      </section>

      {/* Estilos globales opcionales */}
      <style jsx global>{`
        @media (max-width: 1199px) {
          .instagram-section {
            background: #f74f22 !important;
          }
        }
      `}</style>
    </section>
  );
};

export default InstagramSection;
