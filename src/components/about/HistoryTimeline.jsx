import { FaCalendarAlt, FaHeart, FaTrophy, FaUsers } from "react-icons/fa";
import { chosenIcon } from "../../content/icons.js";

// Ícono y color de cada hito por posición: el contenido viene del CMS, el diseño se queda aquí.
const MILESTONE_STYLES = [
  { icon: <FaHeart className="w-5 h-5" />, color: "bg-verdeLogo" },
  { icon: <FaUsers className="w-5 h-5" />, color: "bg-amarilloLogo" },
  { icon: <FaTrophy className="w-5 h-5" />, color: "bg-verdeLogo" },
  { icon: <FaCalendarAlt className="w-5 h-5" />, color: "bg-amarilloLogo" },
];

const HistoryTimeline = ({ heading, milestones: items, ctaTitle, ctaText, link }) => {
  const milestones = items.map((milestone, index) => {
    const style = MILESTONE_STYLES[index % MILESTONE_STYLES.length];
    return { ...style, ...milestone, icon: chosenIcon(milestone.icon, "w-5 h-5") ?? style.icon };
  });

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-amarilloLogo/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-verdeLogo/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-verdeLogo font-edu-hand text-xl font-semibold mb-3 flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-amarilloLogo rounded-full animate-pulse"></span>
            {heading?.eyebrow}
          </h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4">
            {heading?.lead} <span className="text-amarilloLogo">{heading?.highlight}</span> {heading?.tail}
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            {heading?.intro}
          </p>
        </div>

        {/* Timeline */}
        <div className="relative max-w-5xl mx-auto">
          {/* Línea central - desktop */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-verdeLogo via-amarilloLogo to-verdeLogo"></div>

          {/* Milestones */}
          <div className="space-y-12 md:space-y-16">
            {milestones.map((milestone, index) => (
              <div key={index} className={`relative flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                {/* Contenido */}
                <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:pl-12'}`}>
                  <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 group border border-gray-100">
                    {/* Año */}
                    <div className={`inline-block ${milestone.color} text-white px-4 py-2 rounded-full text-sm font-bold mb-3`}>
                      {milestone.period}
                    </div>
                    
                    {/* Título */}
                    <h4 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-verdeLogo transition-colors">
                      {milestone.title}
                    </h4>
                    
                    {/* Descripción */}
                    <p className="text-gray-600 leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                </div>

                {/* Icono central */}
                <div className="my-4 md:my-0 md:absolute md:left-1/2 md:transform md:-translate-x-1/2 z-10">
                  <div className={`${milestone.color} w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg ring-4 ring-white group-hover:scale-110 transition-transform duration-300`}>
                    {milestone.icon}
                  </div>
                </div>

                {/* Espacio vacío para balance en desktop */}
                <div className="hidden md:block w-5/12"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-verdeLogo to-amarilloLogo rounded-2xl p-8 shadow-xl max-w-3xl mx-auto">
            <h4 className="text-white text-2xl font-bold mb-3">
              {ctaTitle}
            </h4>
            <p className="text-white/90 mb-6">
              {ctaText}
            </p>
            {link && <a 
              href={link.url} 
              className="inline-block bg-white text-verdeLogo px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {link.label}
            </a>}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HistoryTimeline;