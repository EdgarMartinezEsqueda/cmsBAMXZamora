import { useState } from "react";
import { FiHeart, FiHelpCircle, FiPhone, FiSearch, FiUsers, FiX } from "react-icons/fi";
import FAQAccordion from "./FAQAccordion";

import { FaHandHoldingHeart } from "react-icons/fa";

// Icono por categoría: las preguntas vienen del CMS, el diseño se queda aquí.
const CATEGORY_ICONS = { general: FiHelpCircle, donacion: FiHeart, beneficiario: FiUsers, voluntario: FaHandHoldingHeart };

const categories = [
  { id: "all", name: "Todas", color: "bg-gray-100 text-gray-700", activeColor: "bg-blue-600 text-white" },
  { id: "general", name: "Información General", color: "bg-blue-50 text-blue-700", activeColor: "bg-blue-600 text-white" },
  { id: "donacion", name: "Donaciones", color: "bg-green-50 text-green-700", activeColor: "bg-green-600 text-white" },
  { id: "beneficiario", name: "Beneficiarios", color: "bg-purple-50 text-purple-700", activeColor: "bg-purple-600 text-white" },
  { id: "voluntario", name: "Voluntariado", color: "bg-orange-50 text-orange-700", activeColor: "bg-orange-600 text-white" }
];

const FAQs = ({ heading, entries, ctaTitle, ctaText, link }) => {
  const preguntas = entries.map((entry) => ({ ...entry, icon: CATEGORY_ICONS[entry.category] }));
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const filteredPreguntas = preguntas.filter(faq => {
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const clearFilters = () => {
    setSelectedCategory("all");
    setSearchTerm("");
    setActiveAccordion(null);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            <FiHelpCircle className="w-8 h-8 text-blue-600" />
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              {heading?.highlight}
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {heading?.intro}
          </p>
        </div>

        {/* Buscador */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar preguntas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-gray-700 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-lg"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                aria-label="Borrar búsqueda"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        {/* Filtros por categoría */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === category.id 
                    ? category.activeColor + " shadow-lg" 
                    : category.color + " hover:shadow-md"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
          
          {(selectedCategory !== "all" || searchTerm) && (
            <div className="text-center mt-4">
              <p className="text-gray-600 mb-2">
                Mostrando {filteredPreguntas.length} de {preguntas.length} preguntas
                {searchTerm && ` para "${searchTerm}"`}
              </p>
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>

        {/* FAQs */}
        {filteredPreguntas.length > 0 ? (
          <FAQAccordion
            faqs={filteredPreguntas}
            activeIndex={activeAccordion}
            onToggle={toggleAccordion}
            searchTerm={searchTerm}
          />
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiSearch className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">No se encontraron preguntas</h3>
            <p className="text-gray-500 mb-6">
              No hay preguntas que coincidan con tu búsqueda o filtro seleccionado.
            </p>
            <button
              onClick={clearFilters}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition-colors"
            >
              Ver todas las preguntas
            </button>
          </div>
        )}

        {/* Call to action */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-3xl p-8 text-white text-center">
          <FiPhone className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-4">{ctaTitle}</h3>
          <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
            {ctaText}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {link && (
              <a href={link.url} className="bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 px-8 rounded-full transition-colors cursor-pointer">
                {link.label}
              </a>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default FAQs;