import { useState } from "react";
import { FaGift, FaUtensils } from "react-icons/fa";
import { PROGRAM_ICONS } from "../../content/icons.js";
import useSite from "utils/useSite";

// Colores por posición: el contenido viene del CMS, el diseño se queda en el código.
const PROGRAM_COLORS = ["bg-green-500", "bg-red-500", "bg-blue-500", "bg-purple-500", "bg-amarilloLogo", "bg-indigo-500"];
const CAMPAIGN_COLORS = ["bg-blue-600", "bg-red-500", "bg-cyan-500", "bg-green-600", "bg-purple-600"];

const toCard = (colors) => (program, index) => {
  const Icon = PROGRAM_ICONS[program.icon];
  return {
    slug: program.slug,
    title: program.title,
    description: program.summary,
    image: program.image,
    features: program.highlights,
    period: program.period,
    icon: Icon ? <Icon className="w-6 h-6" /> : null,
    color: colors[index % colors.length],
  };
};

const ProgramsAbout = ({ heading, ctaTitle, ctaText, primaryLink, secondaryLink }) => {
  const [activeCategory, setActiveCategory] = useState("programas");

  const categories = [
    { id: "programas", label: "Programas", icon: <FaUtensils /> },
    { id: "campanas", label: "Campañas", icon: <FaGift /> }
  ];

  const shown = useSite().programs.filter((program) => program.showOnAbout);
  const programs = shown.filter((program) => program.category === "programa").map(toCard(PROGRAM_COLORS));
  const campaigns = shown.filter((program) => program.category === "campana").map(toCard(CAMPAIGN_COLORS));

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amarilloLogo/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-verdeLogo/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-verdeLogo font-edu-hand text-xl font-semibold mb-3 flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-amarilloLogo rounded-full animate-pulse"></span>
            {heading?.eyebrow}
          </h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4">
            {heading?.lead} <span className="text-amarilloLogo">{heading?.highlight}</span>
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            {heading?.intro}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-white rounded-full shadow-lg p-1 border border-gray-200">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 ${
                  activeCategory === category.id
                    ? "bg-verdeLogo text-white shadow-md"
                    : "text-gray-600 hover:text-verdeLogo"
                }`}
              >
                <span className="text-lg">{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Programas */}
        {activeCategory === "programas" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program) => (
              <div 
                key={program.slug} 
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group border border-gray-100"
              >
                {/* Imagen */}
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  {program.image && <img 
                    src={program.image.src} 
                    alt={program.image.alt || program.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  
                  {/* Icono flotante */}
                  <div className={`absolute top-4 right-4 ${program.color} w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg`}>
                    {program.icon}
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-6">
                  <h4 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-verdeLogo transition-colors">
                    {program.title}
                  </h4>
                  
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {program.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2">
                    {program.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                        <span className={`w-1.5 h-1.5 ${program.color} rounded-full`}></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Campañas */}
        {activeCategory === "campanas" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <div 
                key={campaign.slug}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 group border border-gray-100 relative overflow-hidden"
              >
                {/* Decoración de fondo */}
                <div className={`absolute top-0 right-0 w-32 h-32 ${campaign.color} opacity-5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`}></div>

                <div className="relative z-10">
                  {/* Icono y periodo */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${campaign.color} w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      {campaign.icon}
                    </div>
                    <span className={`${campaign.color} text-white text-xs px-3 py-1 rounded-full font-semibold`}>
                      {campaign.period}
                    </span>
                  </div>

                  {/* Título */}
                  <h4 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-verdeLogo transition-colors">
                    {campaign.title}
                  </h4>

                  {/* Descripción */}
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {campaign.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-16">
          <div className="inline-block bg-gradient-to-r from-verdeLogo to-green-600 rounded-2xl p-8 shadow-xl">
            <h4 className="text-white text-2xl font-bold mb-3">
              {ctaTitle}
            </h4>
            <p className="text-white/90 mb-6 max-w-xl">
              {ctaText}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              {primaryLink && <a
                href={primaryLink.url}
                className="bg-white text-verdeLogo px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {primaryLink.label}
              </a>}
              {secondaryLink && <a
                href={secondaryLink.url}
                className="bg-amarilloLogo text-white px-8 py-3 rounded-full font-bold hover:bg-yellow-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {secondaryLink.label}
              </a>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProgramsAbout;