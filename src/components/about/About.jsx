import { useState } from "react";
import { formatPlus, formatThousandsPlus } from "utils/format";
import useSite from "utils/useSite";
import { FaCheck, FaHandHoldingHeart, FaHeart, FaPlay, FaUsers } from "react-icons/fa";

// Ícono y color de cada pestaña por posición: el contenido viene del CMS, el diseño se queda aquí.
const TAB_STYLES = [
  { icon: <FaHeart className="w-4 h-4" />, color: "bg-red-500" },
  { icon: <FaUsers className="w-4 h-4" />, color: "bg-blue-500" },
  { icon: <FaHandHoldingHeart className="w-4 h-4" />, color: "bg-purple-500" },
];

const AboutSection = ({ heading, tabs: tabItems, images, videoImage, videoUrl, videoLabel }) => {
  const { contact, impact } = useSite();
  const [activeTab, setActiveTab] = useState(0);
  const tabs = tabItems.map((tab, index) => ({ ...TAB_STYLES[index % TAB_STYLES.length], id: index, title: tab.title, items: tab.items }));
  const [mainImage, secondaryImage] = images;

  const stats = [
    { number: formatPlus(impact.familiesPerMonth), label: "Familias beneficiadas cada mes" },
    { number: formatPlus(impact.communityGroups), label: "Grupos comunitarios" },
    { number: `${formatThousandsPlus(impact.foodKgPerMonth)} kg`, label: "Alimentos entregados mensualmente" }
  ];

  return (
    <section className="relative py-10 z-10 text-gray-800">
      {/* Elementos decorativos mejorados */}
      <div className="absolute left-0 top-0 z-[-1] hidden lg:block opacity-60">
        <img src="assets/images/about/shape7.svg" alt="" />
      </div>
      <div className="absolute right-0 bottom-12 z-[-1] hidden lg:block opacity-60">
        <img src="assets/images/about/shape8.svg" alt="" />
      </div>
      
      {/* Elementos de fondo adicionales */}
      <div className="absolute top-32 right-20 w-16 h-16 bg-amarilloLogo/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-40 left-20 w-24 h-24 bg-verdeLogo/10 rounded-full blur-xl"></div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col xl:flex-row items-center gap-12">
          {/* Sección de imágenes mejorada */}
          <div className="w-full xl:w-1/2 relative mb-8 lg:mb-0 hidden xl:flex justify-center lg:justify-start">
            <div className="relative max-w-[532px] group">
              {/* Imagen principal con efectos mejorados */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-500 group-hover:scale-[1.02]
                after:absolute after:right-14 after:-bottom-7 after:w-[419px] after:h-[522px] 
                after:border-2 after:border-verdeLogo after:rounded-2xl after:z-[-1] after:transition-all after:duration-500
                before:absolute before:-left-6 before:top-14 before:w-1 before:h-52 before:bg-gradient-to-b before:from-verdeLogo before:to-amarilloLogo before:z-[-1] before:rounded-full">
                
                {mainImage && <img 
                  src={mainImage.src} 
                  alt={mainImage.alt} 
                  className="w-[537px] max-h-[780px] rounded-2xl object-cover transition-transform duration-500"
                />}
                
                {/* Overlay sutil */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Imagen secundaria mejorada */}
              <div className="absolute -right-10 -bottom-24 rounded-2xl shadow-xl hidden lg:block overflow-hidden group/secondary">
                {secondaryImage && <img 
                  src={secondaryImage.src} 
                  alt={secondaryImage.alt} 
                  className="w-[297px] h-[307px] object-cover transition-transform duration-300 group-hover/secondary:scale-110"
                />}
                <div className="absolute inset-0 bg-gradient-to-t from-verdeLogo/20 to-transparent"></div>
              </div>

              {/* Shape decorativo */}
              <img 
                src="assets/images/about/shape4.svg" 
                alt="" 
                className="absolute right-28 top-5 hidden lg:block opacity-80 animate-pulse"
              />

              {/* Badge "Desde 2013" mejorado */}
              <div className="absolute -left-12 bottom-0 w-52 h-52 flex flex-col items-center justify-center z-10 sm:left-0 sm:w-36 sm:h-36 group/badge">
                <div className="relative text-center transform transition-transform duration-300 group-hover/badge:scale-110">
                  <img 
                    src="assets/images/about/shape11.svg" 
                    alt="" 
                    className="absolute inset-0 w-full h-full -z-10 filter drop-shadow-lg"
                  />
                  <h2 className="text-white font-edu-hand text-xl uppercase drop-shadow-md">Desde</h2>
                  <h3 className="text-amarilloLogo text-5xl font-bold mt-1 drop-shadow-lg">{impact.foundedYear}</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Contenido mejorado */}
          <div className="w-full xl:w-1/2 px-4 lg:pl-8">
            <div className="text-center lg:text-left">
              {/* Header con animación */}
              <div className="mb-6">
                <h2 className="text-verdeLogo font-edu-hand text-xl font-semibold mb-3 flex items-center justify-center lg:justify-start gap-2">
                  <span className="w-2 h-2 bg-amarilloLogo rounded-full animate-pulse"></span>
                  {heading?.eyebrow}
                </h2>

                <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-4 text-gray-800">
                  {heading?.lead}
                  <span className="text-amarilloLogo relative inline-block ml-2 group/highlight">
                    {heading?.highlight}
                    <img 
                      src="assets/images/about/shape9.svg" 
                      alt="" 
                      className="absolute -bottom-2 hidden md:block transition-transform group-hover/highlight:scale-110"
                    />
                    <div className="absolute inset-0 bg-amarilloLogo/10 rounded-lg scale-0 group-hover/highlight:scale-100 transition-transform duration-300"></div>
                  </span>
                  <br />
                  {heading?.tail}
                </h3>
              </div>

              {/* Descripción mejorada */}
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 text-balance leading-relaxed text-lg">
                {heading?.intro}
              </p>

              {/* Stats destacados */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 group/stat border border-gray-100">
                    <div className="text-2xl font-bold text-verdeLogo mb-1">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Tabs mejorados */}
              <div className="mt-10">
                <div className="flex justify-center lg:justify-start border-b border-gray-200 bg-gray-50 rounded-t-xl p-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      className={`py-3 px-6 font-semibold text-sm transition-all duration-300 cursor-pointer rounded-lg flex items-center gap-2 relative overflow-hidden ${
                        activeTab === tab.id 
                          ? "bg-verdeLogo text-white shadow-lg transform scale-105" 
                          : "text-gray-700 hover:bg-white hover:shadow-md"
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <span className={`p-1.5 rounded-full ${activeTab === tab.id ? 'bg-white/20' : tab.color}`}>
                        {activeTab === tab.id ? 
                          <span className="text-white">{tab.icon}</span> : 
                          <span className="text-white">{tab.icon}</span>
                        }
                      </span>
                      {tab.title}
                      
                      {/* Efecto de ondas en activo */}
                      {activeTab === tab.id && (
                        <div className="absolute inset-0 bg-white/10 rounded-lg animate-ping"></div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Contenido de tabs con animación */}
                <div className="bg-white rounded-b-xl shadow-lg p-6 border border-gray-100">
                  <div className="flex flex-col lg:flex-row gap-6 items-start">
                    {/* Video mejorado */}
                    <div className="relative w-full lg:w-64 h-48 rounded-xl overflow-hidden shadow-lg group/video order-2 lg:order-1 mx-auto lg:mx-0">
                      {videoImage && <img 
                        src={videoImage.src} 
                        alt={videoImage.alt} 
                        className="w-full h-full object-cover group-hover/video:scale-110 transition-transform duration-500"
                      />}
                      
                      {/* Overlay con gradiente */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      
                      {/* Botón de play mejorado */}
                      {videoUrl && <a 
                        href={videoUrl} 
                        aria-label={videoLabel || "Ver video"}
                        className="absolute inset-0 flex items-center justify-center group/play"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="bg-white/90 backdrop-blur-sm w-16 h-16 rounded-full flex items-center justify-center text-verdeLogo shadow-lg transform transition-all duration-300 group-hover/play:scale-110 group-hover/play:bg-white">
                          <FaPlay className="text-xl ml-1" />
                        </div>
                        
                        {/* Efecto de pulso */}
                        <div className="absolute inset-0 rounded-full border-4 border-white/50 animate-ping"></div>
                      </a>}
                      
                      {/* Label del video */}
                      <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
                        {videoLabel}
                      </div>
                    </div>

                    {/* Lista de puntos mejorada */}
                    <div className="flex-1 order-1 lg:order-2">
                      <ul className="space-y-4">
                        {(tabs[activeTab]?.items ?? []).map((item, index) => (
                          <li key={index} className="flex items-start group/item animate-fadeIn" style={{animationDelay: `${index * 100}ms`}}>
                            <div className="bg-amarilloLogo/10 p-2 rounded-full mr-4 group-hover/item:bg-amarilloLogo/20 transition-colors duration-300">
                              <FaCheck className="text-amarilloLogo text-sm" />
                            </div>
                            <span className="text-gray-700 leading-relaxed group-hover/item:text-gray-900 transition-colors duration-200">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información de contacto mejorada */}
              <div className="flex flex-col sm:flex-row items-center mt-8 gap-6 justify-center lg:justify-start bg-gradient-to-r from-verdeLogo/5 to-amarilloLogo/5 rounded-xl p-6">
                <div className="relative font-bold text-base text-verdeLogo group/contact">
                  <span className="relative z-10">Más de {impact.deliveryPoints} puntos de entrega</span>
                  <img 
                    src="assets/images/about/shape10.svg" 
                    alt="" 
                    className="absolute -bottom-3 -right-4 group-hover/contact:scale-110 transition-transform duration-300"
                  />
                </div>

                <div className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 shadow-md hover:shadow-lg transition-all duration-300">
                  <div className="bg-verdeLogo/10 p-2 rounded-full">
                    <img src="assets/images/about/call.svg" alt="" className="w-5 h-5" />
                  </div>
                  <div className="text-center lg:text-left">
                    <span className="block text-gray-600 text-sm font-medium">Teléfono:</span>
                    <a href={`tel:${contact.phone}`} className="font-bold text-verdeLogo hover:text-amarilloLogo transition-colors">
                      {contact.phone}
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Estilos CSS para animaciones */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default AboutSection;