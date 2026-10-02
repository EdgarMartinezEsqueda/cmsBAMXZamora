import ContactBanner from "components/contact/ContactBanner";
import ProgramDetail from "components/programs/ProgramDetail";
import ProgramList from "components/programs/ProgramList";
import { useEffect, useMemo, useState } from "react";
import { FaUsers } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router";
import useSite from "utils/useSite";

// Anclas antiguas que siguen circulando (enlaces guardados, redes) → slug actual.
const LEGACY_ANCHORS = { "talleres-BAMX Zamora": "talleres", "talleres-bazac": "talleres", comedor: "comedor-comunitario" };

const Programas = ({ heading, listTitle, listIntro, helpTitle, helpText, detailCtaTitle, detailCtaText, detailLink }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { programs } = useSite();
  const programas = useMemo(() => programs.filter((program) => program.showOnProgramsPage), [programs]);
  const [activeId, setActiveId] = useState(programas[0]?.slug);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Efecto para manejar cambios en el hash de la URL
  useEffect(() => {
    let raw = location.hash.replace("#", "");
    try { raw = decodeURIComponent(raw); } catch { /* ancla mal formada: se usa tal cual */ }
    const hash = LEGACY_ANCHORS[raw] ?? raw;
    if (hash) {
      const programExists = programas.find(p => p.slug === hash);
      if (programExists) {
        setActiveId(hash);
        
        // Scroll suave a la sección después de un pequeño delay
        setTimeout(() => {
          const programasSection = document.getElementById("programas-section");
          if (programasSection) {
            programasSection.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      }
    }
  }, [location.hash, location.pathname, programas]);

  const handleSelect = (id) => {
    setIsLoading(true);
    setActiveId(id);
    navigate(`#${id}`, { replace: true });
    
    // Simular loading para transición suave
    setTimeout(() => setIsLoading(false), 100);
    
    const programasSection = document.getElementById("programas-section");
    if (programasSection) {
      programasSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const activeProgram = programas.find(p => p.slug === activeId);

  return (
    <section id="programas-section" className="py-16 px-4 max-w-7xl mx-auto bg-gradient-to-br from-gray-50 to-white">
      {/* Header mejorado */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-verdeLogo/10 to-amarilloLogo/10 border border-verdeLogo/20 rounded-full px-6 py-3 mb-6">
          <FaUsers className="text-verdeLogo text-lg" />
          <span className="text-verdeLogo font-semibold text-sm tracking-wide">
            {heading?.eyebrow}
          </span>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          <span className="text-gray-800">{heading?.lead}</span>
          <span className="text-transparent bg-gradient-to-r from-verdeLogo to-amarilloLogo bg-clip-text"> {heading?.highlight}</span>
        </h1>
        
        <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
          {heading?.intro}
        </p>
      </div>
      
      <div className="flex flex-col xl:flex-row gap-8">
        {/* Sidebar mejorado */}
        <div className="xl:w-1/3">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 sticky top-8">
            <ProgramList 
              programas={programas} 
              activeId={activeId} 
              onSelect={handleSelect}
              title={listTitle}
              intro={listIntro}
            />
            <ContactBanner title={helpTitle} text={helpText} />
          </div>
        </div>

        {/* Contenido principal mejorado */}
        <div className="xl:w-2/3">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {activeProgram && (
              <ProgramDetail 
                program={activeProgram} 
                activeAccordion={activeAccordion}
                toggleAccordion={toggleAccordion}
                isLoading={isLoading}
                ctaTitle={detailCtaTitle}
                ctaText={detailCtaText}
                link={detailLink}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Programas;