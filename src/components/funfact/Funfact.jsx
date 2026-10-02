import { useEffect, useState } from "react";
import { FaBoxes, FaHandHoldingHeart, FaHome, FaTruck } from "react-icons/fa";
import { FiHeart, FiPhoneCall } from "react-icons/fi";
import Odometer from "react-odometerjs";
import { toTonnes } from "utils/format";
import useSite from "utils/useSite";

const FunFact = ({ heading, helpTitle, helpSubtitle, statsTitle, statsSubtitle, closingText, primaryLink, secondaryLink }) => {
  const { contact, impact } = useSite();
  const [values, setValues] = useState([0, 0, 0, 0]);
  const [isVisible, setIsVisible] = useState(false);

  const stats = [
    { 
      value: impact.familiesPerMonth, 
      suffix: "+", 
      label: "Familias beneficiadas", 
      icon: FaHandHoldingHeart,
      color: "from-verdeLogo to-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    { 
      value: toTonnes(impact.foodKgPerMonth), 
      suffix: " mil", 
      label: "Kg de alimentos mensuales", 
      icon: FaBoxes,
      color: "from-amarilloLogo to-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200"
    },
    { 
      value: impact.municipalities, 
      suffix: "", 
      label: "Municipios atendidos", 
      icon: FaHome,
      color: "from-teal-500 to-teal-600",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-200"
    },
    { 
      value: impact.communityGroups, 
      suffix: "+", 
      label: "Grupos comunitarios", 
      icon: FaTruck,
      color: "from-rojoLogo to-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200"
    },
  ];

  useEffect(() => {
    // Simular intersection observer para animación
    const targets = [impact.familiesPerMonth, toTonnes(impact.foodKgPerMonth), impact.municipalities, impact.communityGroups];
    const timer = setTimeout(() => {
      setIsVisible(true);
      setValues(targets);
    }, 500);

    return () => clearTimeout(timer);
  }, [impact]);

  return (
    <section className="relative py-10 overflow-hidden">
      
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-96 h-96 bg-verdeLogo/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-32 right-32 w-80 h-80 bg-amarilloLogo/20 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-rojoLogo/15 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Contenido de texto */}
          <div className="space-y-8">
            
            {/* Badge introductorio */}
            <div className="inline-flex items-center gap-3 bg-white shadow-sm border border-gray-200 rounded-full px-6 py-3">
              <div className="bg-amarilloLogo p-2 rounded-full">
                <FiHeart className="text-black text-sm" />
              </div>
              <span className="text-amarilloLogo font-semibold text-sm tracking-wide">
                {heading?.eyebrow}
              </span>
            </div>

            {/* Título principal */}
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
                <span className="text-gray-900">{heading?.lead}</span>
                <br />
                <span className="text-transparent bg-gradient-to-r from-verdeLogo via-amarilloLogo to-rojoLogo bg-clip-text">
                  {heading?.highlight}
                </span>
              </h2>
              
              <div className="flex items-start gap-4">
                <div className="w-1 bg-gradient-to-b from-verdeLogo to-amarilloLogo rounded-full h-24 mt-2 flex-shrink-0"></div>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {heading?.intro}
                </p>
              </div>
            </div>

            {/* Información de contacto */}
            <div className="bg-white shadow-lg border border-gray-200 rounded-3xl p-8">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="bg-gradient-to-r from-verdeLogo to-green-600 p-6 rounded-2xl shadow-2xl">
                    <FiPhoneCall className="text-white text-3xl" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-amarilloLogo rounded-full animate-ping"></div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-amarilloLogo rounded-full"></div>
                </div>
                <div>
                  <h3 className="text-gray-900 font-bold text-xl mb-2">{helpTitle}</h3>
                  <p className="text-gray-600 mb-3">{helpSubtitle}</p>
                  <a 
                    href={`tel:${contact.phone}`} 
                    className="text-amarilloLogo text-3xl font-black hover:text-yellow-500 transition-colors"
                  >
                    {contact.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Grid de estadísticas */}
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-gray-900 text-2xl font-bold mb-2">{statsTitle}</h3>
              <p className="text-gray-600">{statsSubtitle}</p>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={`group relative bg-white border ${stat.borderColor} rounded-3xl p-8 hover:shadow-xl transition-all duration-500 hover:scale-[1.02]`}
                >
                  <div className={`absolute top-6 right-6 w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white shadow-md z-1`}>
                    <stat.icon className="text-lg" />
                  </div>

                  <div className="space-y-4">
                    <div className="text-5xl lg:text-5xl font-black text-gray-900 group-hover:text-amarilloLogo transition-colors duration-300">
                      <Odometer 
                        value={values[index]} 
                        format="(,ddd)" 
                        duration={2000}
                      />
                      <span className="text-amarilloLogo">{stat.suffix}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-gray-700 font-semibold text-lg leading-tight">
                        {stat.label}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-1000 ease-out`}
                          style={{
                            width: isVisible ? "100%" : "0%",
                            transitionDelay: `${index * 0.2}s`
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Call to action */}
            <div className="text-center mt-10">
              <div className="bg-gradient-to-r from-verdeLogo/5 to-amarilloLogo/5 border border-verdeLogo/20 rounded-2xl p-6 shadow-sm">
                <p className="text-gray-900 text-lg font-semibold mb-4">
                  {closingText}
                </p>
                <div className="flex justify-center gap-4">
                  {primaryLink && <a 
                    href={primaryLink.url} 
                    className="bg-gradient-to-r from-verdeLogo to-green-600 text-white px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300 font-bold text-sm"
                  >
                    {primaryLink.label}
                  </a>}
                  {secondaryLink && <a 
                    href={secondaryLink.url} 
                    className="border-2 border-amarilloLogo text-amarilloLogo hover:bg-amarilloLogo hover:text-black px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300 font-bold text-sm"
                  >
                    {secondaryLink.label}
                  </a>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estilos CSS personalizados */}
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
            transform: translateY(-20px);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.1;
          }
          50% {
            opacity: 0.3;
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
          animation: float 12s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 15s ease-in-out infinite 2s;
        }

        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }

        /* Estilos personalizados para el odómetro */
        .odometer-custom {
          display: inline-block;
        }

        .odometer.odometer-auto-theme, .odometer.odometer-theme-default {
          display: inline-block;
          vertical-align: middle;
          position: relative;
        }

        .odometer.odometer-auto-theme .odometer-digit, .odometer.odometer-theme-default .odometer-digit {
          display: inline-block;
          vertical-align: middle;
          position: relative;
        }

        .odometer.odometer-auto-theme .odometer-digit .odometer-digit-spacer, .odometer.odometer-theme-default .odometer-digit .odometer-digit-spacer {
          display: inline-block;
          vertical-align: middle;
          visibility: hidden;
        }

        .odometer.odometer-auto-theme .odometer-digit .odometer-digit-inner, .odometer.odometer-theme-default .odometer-digit .odometer-digit-inner {
          text-align: left;
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
        }

        .odometer.odometer-auto-theme .odometer-digit .odometer-ribbon, .odometer.odometer-theme-default .odometer-digit .odometer-ribbon {
          display: block;
        }

        .odometer.odometer-auto-theme .odometer-digit .odometer-ribbon-inner, .odometer.odometer-theme-default .odometer-digit .odometer-ribbon-inner {
          display: block;
          -webkit-backface-visibility: hidden;
        }

        .odometer.odometer-auto-theme .odometer-digit .odometer-value, .odometer.odometer-theme-default .odometer-digit .odometer-value {
          display: block;
          -webkit-transform: translateZ(0);
        }

        .odometer.odometer-auto-theme .odometer-digit .odometer-value.odometer-last-value, .odometer.odometer-theme-default .odometer-digit .odometer-value.odometer-last-value {
          position: absolute;
        }

        .odometer.odometer-auto-theme.odometer-animating-up .odometer-ribbon-inner, .odometer.odometer-theme-default.odometer-animating-up .odometer-ribbon-inner {
          -webkit-transition: -webkit-transform 2s;
          -moz-transition: -moz-transform 2s;
          -ms-transition: -ms-transform 2s;
          -o-transition: -o-transform 2s;
          transition: transform 2s;
        }

        .odometer.odometer-auto-theme.odometer-animating-up.odometer-animating .odometer-ribbon-inner, .odometer.odometer-theme-default.odometer-animating-up.odometer-animating .odometer-ribbon-inner {
          -webkit-transform: translateY(-100%);
          -moz-transform: translateY(-100%);
          -ms-transform: translateY(-100%);
          -o-transform: translateY(-100%);
          transform: translateY(-100%);
        }

        .odometer.odometer-auto-theme.odometer-animating-down .odometer-ribbon-inner, .odometer.odometer-theme-default.odometer-animating-down .odometer-ribbon-inner {
          -webkit-transform: translateY(-100%);
          -moz-transform: translateY(-100%);
          -ms-transform: translateY(-100%);
          -o-transform: translateY(-100%);
          transform: translateY(-100%);
        }

        .odometer.odometer-auto-theme.odometer-animating-down.odometer-animating .odometer-ribbon-inner, .odometer.odometer-theme-default.odometer-animating-down.odometer-animating .odometer-ribbon-inner {
          -webkit-transition: -webkit-transform 2s;
          -moz-transition: -moz-transform 2s;
          -ms-transition: -ms-transform 2s;
          -o-transition: -o-transform 2s;
          transition: transform 2s;
          -webkit-transform: translateY(0);
          -moz-transform: translateY(0);
          -ms-transform: translateY(0);
          -o-transform: translateY(0);
          transform: translateY(0);
        }

        /* Animaciones en cascada */
        .grid > div:nth-child(1) {
          animation: slide-up 0.8s ease-out forwards;
          animation-delay: 0.2s;
          opacity: 0;
        }
        
        .grid > div:nth-child(2) {
          animation: slide-up 0.8s ease-out forwards;
          animation-delay: 0.4s;
          opacity: 0;
        }
        
        .grid > div:nth-child(3) {
          animation: slide-up 0.8s ease-out forwards;
          animation-delay: 0.6s;
          opacity: 0;
        }
        
        .grid > div:nth-child(4) {
          animation: slide-up 0.8s ease-out forwards;
          animation-delay: 0.8s;
          opacity: 0;
        }
      `}</style>
    </section>
  );
};

export default FunFact;