import { FiChevronDown } from "react-icons/fi";

const FAQAccordion = ({ faqs, activeIndex, onToggle, searchTerm = "" }) => {
  const highlightText = (text, highlight) => {
    // Si no hay término de búsqueda, devolver el texto normal
    if (!highlight || !highlight.trim()) return text;

    // Se escapa lo que escribe el visitante: "(" o "?" romperían el RegExp. Se compara sin la
    // bandera g porque regex.test() con g guarda estado entre llamadas y salta coincidencias.
    const needle = highlight.trim();
    const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const parts = text.split(new RegExp(`(${escaped})`, "gi"));

    return parts.map((part, index) =>
      part.toLowerCase() === needle.toLowerCase() ? (
        <mark
          key={index}
          className="bg-yellow-200 text-yellow-900 px-1 rounded"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => {
        const Icon = faq.icon;
        return (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            style={{
              animation: `fadeInUp 0.4s ease-out ${index * 0.05}s both`,
            }}
          >
            <button
              onClick={() => onToggle(index)}
              className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors group cursor-pointer"
            >
              <div className="flex items-center flex-1">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mr-4 group-hover:bg-blue-100 transition-colors">
                  {Icon ? (
                    <Icon className="w-5 h-5 text-blue-600" />
                  ) : (
                    <span className="text-gray-400">?</span> // fallback si no hay icono
                  )}
                </div>
                <span className="font-semibold text-gray-800 pr-4 group-hover:text-blue-700 transition-colors">
                  {highlightText(faq.question, searchTerm)}
                </span>
              </div>
              <FiChevronDown
                className={`text-blue-600 transition-all duration-300 group-hover:text-blue-700 ${
                  activeIndex === index
                    ? "rotate-180 scale-110"
                    : "group-hover:scale-110"
                }`}
              />
            </button>

            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                activeIndex === index
                  ? "max-h-96 opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="px-6 pb-6">
                <div className="border-l-4 border-blue-200 pl-4 ml-8">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {highlightText(faq.answer, searchTerm)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FAQAccordion;
