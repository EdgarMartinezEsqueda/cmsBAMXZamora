import FAQAccordion from "components/faqs/FAQAccordion";
import MediaRenderer from "components/media/MediaRenderer";
import { FaArrowRight, FaCheck, FaChevronDown, FaClock, FaMapMarkerAlt, FaUsers } from "react-icons/fa";
import { PROGRAM_ICONS } from "../../content/icons.js";

const ProgramDetail = ({ program, activeAccordion, toggleAccordion, isLoading, ctaTitle, ctaText, link }) => {
  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  const IconComponent = PROGRAM_ICONS[program.icon];
  // Si hay video, reemplaza a la imagen (ya validado en shared/content/programs.js).
  const media = program.videoUrl ? { type: "video", src: program.videoUrl }
    : program.image ? { type: "image", src: program.image.src, alt: program.image.alt } : null;

  return (
    <div className="p-8 space-y-8">
      {/* Header del programa */}
      <div className="relative">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-gradient-to-br from-verdeLogo to-green-600 p-4 rounded-2xl text-white shadow-lg">
            {IconComponent && <IconComponent className="text-2xl" />}
          </div>
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">{program.title}</h2>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <FaClock className="text-xs" />
                Programa activo
              </span>
              <span className="flex items-center gap-1">
                <FaMapMarkerAlt className="text-xs" />
                Zamora, Michoacán
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl border-l-4 border-verdeLogo">
          <p className="text-gray-700 text-lg leading-relaxed">{program.description || program.summary}</p>
        </div>
      </div>

      {/* Media mejorada */}
      {media && <div className="relative">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <div className="w-1 h-6 bg-gradient-to-b from-amarilloLogo to-orange-500 rounded-full"></div>
          Conoce más sobre este programa
        </h3>
        <MediaRenderer
          media={media}
          alt={media.alt || program.title}
          title={program.title}
        />
      </div>}

      {/* Beneficios */}
      {program.keyPoints.length > 0 && <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
        <h3 className="text-2xl font-semibold text-rojoLogo mb-6 flex items-center gap-3">
          <div className="bg-rojoLogo/10 p-2 rounded-lg">
            <FaCheck className="text-rojoLogo text-lg" />
          </div>
          ¿Por qué participar?
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          {program.keyPoints.map((point, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="bg-verdeLogo/20 p-1.5 rounded-full mt-1">
                <FaCheck className="text-verdeLogo text-xs" />
              </div>
              <span className="text-gray-700 leading-relaxed">{point}</span>
            </div>
          ))}
        </div>
      </div>}

      {/* FAQs mejoradas */}
      {program.faqs.length > 0 && <div>
        <h3 className="text-2xl font-semibold text-rojoLogo mb-6 flex items-center gap-3">
          <div className="bg-rojoLogo/10 p-2 rounded-lg">
            <FaChevronDown className="text-rojoLogo text-lg" />
          </div>
          Preguntas Frecuentes
        </h3>
        
        <FAQAccordion
          faqs={program.faqs} 
          activeIndex={activeAccordion} 
          onToggle={toggleAccordion} 
        />
      </div>}

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-verdeLogo/5 via-amarilloLogo/5 to-rojoLogo/5 rounded-xl p-6 border border-verdeLogo/10">
        <div className="text-center space-y-4">
          <h4 className="text-xl font-bold text-gray-800">{ctaTitle}</h4>
          <p className="text-gray-600">{ctaText}</p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {link && (
              <a href={link.url} className="bg-gradient-to-r from-verdeLogo to-green-600 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg flex items-center justify-center gap-2 cursor-pointer">
                <FaUsers />
                {link.label}
                <FaArrowRight className="text-sm" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramDetail;