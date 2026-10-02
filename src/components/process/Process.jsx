import { FaAppleAlt, FaArrowRight, FaBoxes, FaHandsHelping, FaPeopleCarry, FaTruck, FaUserCheck, FaWarehouse } from "react-icons/fa";
import { FiCheckCircle, FiHeart } from "react-icons/fi";
import { formatNumber, formatPlus } from "utils/format";
import useSite from "utils/useSite";

// Estilo de cada paso por posición: el contenido viene del CMS, el diseño se queda aquí.
const STEP_STYLES = [
  { icon: <FaAppleAlt />, color: "from-red-500 to-red-600", bgColor: "bg-red-50", borderColor: "border-red-200" },
  { icon: <FaBoxes />, color: "from-orange-500 to-orange-600", bgColor: "bg-orange-50", borderColor: "border-orange-200" },
  { icon: <FaWarehouse />, color: "from-green-500 to-green-600", bgColor: "bg-green-50", borderColor: "border-green-200" },
  { icon: <FaPeopleCarry />, color: "from-red-500 to-red-600", bgColor: "bg-red-50", borderColor: "border-red-200" },
  { icon: <FaTruck />, color: "from-purple-500 to-purple-600", bgColor: "bg-purple-50", borderColor: "border-purple-200" },
  { icon: <FaUserCheck />, color: "from-yellow-500 to-yellow-600", bgColor: "bg-yellow-50", borderColor: "border-yellow-200" },
  { icon: <FaHandsHelping />, color: "from-green-500 to-green-600", bgColor: "bg-green-50", borderColor: "border-green-200" },
];

// Cifra del paso: texto libre o tomada de "Cifras de impacto" (una sola fuente para los números).
function stepStat(step, impact) {
  switch (step.statSource) {
    case "familias": return `${formatPlus(impact.familiesPerMonth)} familias`;
    case "kilos": return `${formatNumber(impact.foodKgPerMonth)} kg/mes`;
    case "grupos": return `${formatNumber(impact.communityGroups)} comunidades`;
    case "municipios": return `${formatNumber(impact.municipalities)} municipios`;
    default: return step.statText;
  }
}

const ProcessSection = ({ heading, steps, summaryEyebrow, summaryTitle, summaryText }) => {
  const { impact } = useSite();
  const processItems = steps.map((step, index) => ({
    ...STEP_STYLES[index % STEP_STYLES.length],
    number: String(index + 1).padStart(2, "0"),
    title: step.title,
    description: step.description,
    link: step.link,
    stats: stepStat(step, impact),
  }));

  return (
    <section className="relative py-10 overflow-hidden">
      
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-40 left-20 w-96 h-96 bg-green-500/8 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-32 right-32 w-80 h-80 bg-yellow-500/6 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-500/4 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      {/* Líneas conectoras decorativas */}
      <div className="absolute inset-0 opacity-10 hidden lg:block">
        <svg className="w-full h-full" viewBox="0 0 1200 800" fill="none">
          <path 
            d="M200 400 Q600 200 1000 400" 
            stroke="url(#gradient1)" 
            strokeWidth="2" 
            strokeDasharray="10,10"
            className="animate-dash"
          />
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Header de la sección */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500/10 to-yellow-500/10 border border-green-500/20 rounded-full px-6 py-3 mb-6">
            <div className="bg-green-500 p-2 rounded-full">
              <FiCheckCircle className="text-white text-sm" />
            </div>
            <span className="text-green-600 font-semibold text-sm tracking-wide">
              {heading?.eyebrow}
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-gray-800">{heading?.lead}</span>
            <span className="text-transparent bg-gradient-to-r from-green-500 to-yellow-500 bg-clip-text"> {heading?.highlight}</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            {heading?.intro}
          </p>
        </div>

        {/* Timeline del proceso */}
        <div className="relative">
          
          {/* Línea de conexión central - visible en desktop */}
          <div className="hidden lg:block absolute top-32 left-1/2 -translate-x-1/2 w-1 h-full bg-gradient-to-b from-green-500 via-yellow-500 to-red-500 rounded-full opacity-20"></div>
          
          {/* Grid de pasos del proceso - ACTUALIZADO A 4 COLUMNAS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {processItems.map((item, index) => (
              <div
                key={index}
                className="group relative"
                style={{
                  animationDelay: `${index * 0.2}s`
                }}
              >
                {/* Tarjeta principal */}
                <div className={`relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border ${item.borderColor} hover:border-opacity-60 transform-gpu will-change-transform backface-hidden perspective-1000`}>
                  
                  {/* Número y conexión - CENTRADO */}
                  <div className="flex flex-col gap-6 mb-6">
                    <div className={`relative w-20 h-20 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center text-white shadow-lg transition-all duration-300 transform-gpu will-change-transform mx-auto`}>
                      <div className="text-2xl">
                        {item.icon}
                      </div>
                      
                      {/* Número del paso */}
                      <div className="absolute -top-3 -right-3 w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                        {item.number}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-green-600 transition-colors">
                        {item.link ? 
                          <a href={item.link}>
                            {item.title}
                          </a>
                        : item.title
                        }

                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">
                        {item.description}
                      </p>
                      
                      {/* Estadística */}
                      <div className={`inline-flex items-center gap-2 ${item.bgColor} border ${item.borderColor} rounded-xl px-4 py-2`}>
                        <FiCheckCircle className="text-green-500 text-sm" />
                        <span className="text-gray-700 font-semibold text-sm">{item.stats}</span>
                      </div>
                    </div>
                  </div>

                  {/* Flecha conectora - solo visible en desktop */}
                  {index < processItems.length - 1 && (
                    <div className="hidden lg:block absolute -bottom-4 left-1/2 -translate-x-1/2">
                      <div className="w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center shadow-md">
                        <FaArrowRight className="text-gray-400 text-sm" />
                      </div>
                    </div>
                  )}
                  
                  {/* Efecto de brillo en hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        
        {/* Impacto */}
        <div className="mt-20">
          <div className="bg-gradient-to-r from-green-500/5 via-yellow-500/5 to-red-500/5 rounded-3xl p-8 md:p-12 border border-green-500/10">
            <div className="text-center max-w-4xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-3 bg-white/70 backdrop-blur-sm border border-green-500/20 rounded-full px-6 py-3">
                <div className="bg-green-500 p-2 rounded-full">
                  <FiHeart className="text-white text-sm" />
                </div>
                <span className="text-green-600 font-semibold text-sm">
                  {summaryEyebrow}
                </span>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
                {summaryTitle}
              </h3>
              
              <p className="text-gray-600 text-lg leading-relaxed">
                {summaryText}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                <div className="bg-white/70 rounded-2xl p-6 ">
                  <div className="text-3xl font-black text-green-500 mb-2">{formatNumber(Math.floor(impact.foodKgPerMonth / 1000))}K+</div>
                  <div className="text-gray-700 font-semibold text-sm">Kg mensuales</div>
                </div>
                <div className="bg-white/70 rounded-2xl p-6 ">
                  <div className="text-3xl font-black text-yellow-500 mb-2">{formatPlus(impact.familiesPerMonth)}</div>
                  <div className="text-gray-700 font-semibold text-sm">Familias</div>
                </div>
                <div className="bg-white/70 rounded-2xl p-6 ">
                  <div className="text-3xl font-black text-red-500 mb-2">{formatNumber(impact.communityGroups)}</div>
                  <div className="text-gray-700 font-semibold text-sm">Grupos comunitarios</div>
                </div>
                <div className="bg-white/70 rounded-2xl p-6 ">
                  <div className="text-3xl font-black text-purple-600 mb-2">{formatNumber(impact.municipalities)}</div>
                  <div className="text-gray-700 font-semibold text-sm">Municipios</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estilos CSS */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-30px);
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-25px);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.8;
          }
        }

        @keyframes dash {
          0% {
            stroke-dashoffset: 20;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float 10s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 12s ease-in-out infinite 3s;
        }

        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }

        .animate-dash {
          animation: dash 3s linear infinite;
        }

        /* Mejoras para prevenir el efecto de "temblor" */
        .transform-gpu {
          transform: translate3d(0, 0, 0);
        }

        .will-change-transform {
          will-change: transform;
        }

        .backface-hidden {
          backface-visibility: hidden;
        }

        .perspective-1000 {
          perspective: 1000px;
        }

        /* Hover suave y estable */
        .group:hover > div {
          transform: scale(1.02) translate3d(0, 0, 0);
        }

        .group:hover .w-20.h-20 {
          transform: scale(1.1) rotate(3deg) translate3d(0, 0, 0);
        }

        /* Animaciones en cascada para las tarjetas */
        .grid > div:nth-child(1) {
          animation: slide-up 0.8s ease-out forwards;
          animation-delay: 0.1s;
          opacity: 0;
        }
        
        .grid > div:nth-child(2) {
          animation: slide-up 0.8s ease-out forwards;
          animation-delay: 0.3s;
          opacity: 0;
        }
        
        .grid > div:nth-child(3) {
          animation: slide-up 0.8s ease-out forwards;
          animation-delay: 0.5s;
          opacity: 0;
        }
        
        .grid > div:nth-child(4) {
          animation: slide-up 0.8s ease-out forwards;
          animation-delay: 0.7s;
          opacity: 0;
        }
        
        .grid > div:nth-child(5) {
          animation: slide-up 0.8s ease-out forwards;
          animation-delay: 0.9s;
          opacity: 0;
        }
        
        .grid > div:nth-child(6) {
          animation: slide-up 0.8s ease-out forwards;
          animation-delay: 1.1s;
          opacity: 0;
        }

        .grid > div:nth-child(7) {
          animation: slide-up 0.8s ease-out forwards;
          animation-delay: 1.3s;
          opacity: 0;
        }
      `}</style>
    </section>
  );
};

export default ProcessSection;