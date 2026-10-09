import { FiArrowRight, FiCheckCircle, FiChevronLeft, FiChevronRight, FiDollarSign, FiHeart, FiPackage, FiShoppingBag } from "react-icons/fi";
import useCarousel from "utils/useCarousel";
import { CONTENT_ICONS } from "../../content/icons.js";

// Iconos por posición: el contenido y las imágenes vienen del CMS.
const STEP_ICONS = [FiHeart, FiDollarSign, FiDollarSign, FiPackage, FiHeart, FiShoppingBag];
const OBJECTIVE_STYLES = [
  { Icon: FiHeart, box: "bg-pink-100", icon: "text-pink-600" },
  { Icon: FiCheckCircle, box: "bg-orange-100", icon: "text-orange-600" },
  { Icon: FiArrowRight, box: "bg-pink-100", icon: "text-pink-600" },
  { Icon: FiHeart, box: "bg-orange-100", icon: "text-orange-600" },
];

// steps: [{ title, description, image }]: cada paso trae su imagen, así no pueden desalinearse.
const Apadrinamiento = ({ heading, includesTitle, includes, stepsTitle, steps: items, objectivesTitle, objectives }) => {
  const steps = items.map((step, index) => ({ ...step, icon: CONTENT_ICONS[step.icon] ?? STEP_ICONS[index % STEP_ICONS.length] }));
  const totalImages = steps.length;
  const { current: currentSlide, isAnimating, next: nextSlide, prev: prevSlide, goTo: goToSlide, onKeyDown } = useCarousel(totalImages);

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-full mb-6">
            <FiHeart className="w-8 h-8 text-pink-600" />
          </div>
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
            <span className="text-pink-500 relative inline-block">
              {heading?.lead}
              <svg 
                className="absolute -bottom-2 left-0 w-full h-3 text-pink-400 hidden md:block" 
                viewBox="0 0 200 12" 
                fill="currentColor"
              >
                <path d="M0 8c40 0 60-6 100-6s60 6 100 6v4c-40 0-60-6-100-6S40 12 0 12V8z"/>
              </svg>
            </span>
            <span className="block mt-2 text-rojoLogo">
              {heading?.highlight}
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-6">
            {heading?.intro}
          </p>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg max-w-3xl mx-auto border border-gray-100">
            <div className="flex items-center justify-center mb-4">
              <FiHeart className="w-6 h-6 text-pink-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">{includesTitle}</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
              {includes.map((item) => (
                <div key={item} className="flex items-center">
                  <FiCheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Carrusel y opciones de apadrinamiento */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Carrusel */}
          <div className="relative">
            <div 
              className="relative overflow-hidden rounded-3xl shadow-2xl bg-white"
              tabIndex={0}
              onKeyDown={onKeyDown}
              aria-roledescription="carrusel"
            >
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {steps.map((step, index) => (
                  <div key={step.title} className="w-full flex-shrink-0">
                    <img
                      src={step.image?.src}
                      alt={step.image?.alt || step.title}
                      className="w-full object-cover"
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={prevSlide}
                disabled={isAnimating}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white shadow-lg rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              
              <button
                onClick={nextSlide}
                disabled={isAnimating}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white shadow-lg rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiChevronRight className="w-5 h-5 text-gray-700" />
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {Array.from({ length: totalImages }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`transition-all duration-300 ${
                      index === currentSlide
                        ? "w-8 h-2 bg-white rounded-full"
                        : "w-2 h-2 bg-white/60 hover:bg-white/80 rounded-full"
                    }`}
                  />
                ))}
              </div>

              <div className="absolute top-4 right-4 bg-black/50 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm">
                {currentSlide + 1} / {totalImages}
              </div>
            </div>
          </div>

          {/* Opciones de apadrinamiento */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-8">{stepsTitle}</h3>
            
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentSlide;
              
              return (
                <div
                  key={index}
                  className={`relative flex items-start p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
                    isActive 
                      ? "bg-gradient-to-r from-pink-50 to-orange-50 border-2 border-pink-200 shadow-lg transform scale-105" 
                      : "bg-white hover:bg-gray-50 border border-gray-200 hover:shadow-md"
                  }`}
                  onClick={() => goToSlide(index)}
                >
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                    isActive 
                      ? "bg-gradient-to-r from-pink-500 to-orange-500 text-white" 
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {isActive ? (
                      <span className="text-lg font-bold">{index + 1}</span>
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </div>
                  
                  <div className="ml-4 flex-1">
                    <h4 className={`font-semibold text-lg mb-1 transition-colors ${
                      isActive ? "text-pink-700" : "text-gray-800"
                    }`}>
                      {step.title}
                    </h4>
                    <p className={`transition-colors ${
                      isActive ? "text-pink-600" : "text-gray-600"
                    }`}>
                      {step.description}
                    </p>
                  </div>
                  
                  {isActive && (
                    <FiArrowRight className="w-5 h-5 text-pink-500 animate-pulse" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Objetivos del programa */}
        <div className="bg-gradient-to-br from-pink-50 to-orange-50 rounded-3xl p-8 md:p-12 mb-16">
          <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">{objectivesTitle}</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {objectives.map((objective, index) => {
              const style = OBJECTIVE_STYLES[index % OBJECTIVE_STYLES.length];
              return (
                <div key={objective.title} className="bg-white rounded-xl p-6 shadow-md">
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 w-10 h-10 ${style.box} rounded-lg flex items-center justify-center mr-4`}>
                      {(() => { const Icon = CONTENT_ICONS[objective.icon] ?? style.Icon; return <Icon className={`w-5 h-5 ${style.icon}`} aria-hidden="true" />; })()}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">{objective.title}</h4>
                      <p className="text-gray-600 text-sm">{objective.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Apadrinamiento;