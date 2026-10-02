import { FaAppleAlt, FaBrain, FaHandsHelping } from "react-icons/fa";

// Ícono y colores de cada pilar por posición: el contenido viene del CMS, el diseño se queda aquí.
const PILLAR_STYLES = [
  { icon: <FaAppleAlt className="w-8 h-8" />, color: "from-green-500 to-green-600", iconBg: "bg-green-500" },
  { icon: <FaBrain className="w-8 h-8" />, color: "from-amarilloLogo to-yellow-500", iconBg: "bg-amarilloLogo" },
  { icon: <FaHandsHelping className="w-8 h-8" />, color: "from-verdeLogo to-green-700", iconBg: "bg-verdeLogo" },
];

const IntegralApproach = ({ heading, pillars: items, quote, quoteAuthor }) => {
  const pillars = items.map((pillar, index) => ({ ...PILLAR_STYLES[index % PILLAR_STYLES.length], ...pillar }));

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-20 left-20 w-64 h-64 bg-verdeLogo rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-amarilloLogo rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-verdeLogo font-edu-hand text-xl font-semibold mb-3 flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-amarilloLogo rounded-full animate-pulse"></span>
            {heading?.eyebrow}
          </h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4">
            {heading?.lead} <span className="text-amarilloLogo">{heading?.highlight}</span>
          </h3>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
            {heading?.intro}
          </p>
        </div>

        {/* Tres Pilares */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {pillars.map((pillar, index) => (
            <div key={index} className="group relative">
              {/* Card */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 h-full border border-gray-100 group-hover:border-verdeLogo/30">
                {/* Icono */}
                <div className={`${pillar.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {pillar.icon}
                </div>

                {/* Título */}
                <h4 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-verdeLogo transition-colors">
                  {pillar.title}
                </h4>

                {/* Descripción */}
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {pillar.description}
                </p>

                {/* Features */}
                <ul className="space-y-3">
                  {pillar.items.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-700">
                      <span className={`w-1.5 h-1.5 ${pillar.iconBg} rounded-full mt-2 flex-shrink-0`}></span>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Decoración inferior */}
                <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${pillar.color} rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Quote destacado */}
        {quote && <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-gradient-to-r from-verdeLogo to-verdeLogo/90 rounded-2xl p-8 md:p-12 shadow-xl relative overflow-hidden">
            {/* Decoración */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full -ml-20 -mb-20"></div>

            <div className="relative z-10">
              <svg className="w-12 h-12 text-amarilloLogo mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
              </svg>
              
              <blockquote className="text-white text-xl md:text-2xl font-semibold mb-4 leading-relaxed">
                "{quote}"
              </blockquote>
              
              <p className="text-amarilloLogo font-bold">{quoteAuthor}</p>
            </div>
          </div>
        </div>}
      </div>
    </section>
  );
};

export default IntegralApproach;