
import { FiArrowRight, FiCheckCircle, FiChevronLeft, FiChevronRight, FiFileText, FiHeart, FiMapPin, FiUsers } from "react-icons/fi";
import useCarousel from "utils/useCarousel";

// Icono de cada paso por posición: el contenido y las imágenes vienen del CMS.
const STEP_ICONS = [FiFileText, FiCheckCircle, FiUsers, FiMapPin, FiHeart];

// steps: [{ title, description, image: { src, alt } }]; cada paso trae su imagen del carrusel.
const Beneficiaries = ({ heading, documentsTitle, documents, stepsTitle, steps: items }) => {
  const steps = items.map((step, index) => ({ ...step, icon: STEP_ICONS[index % STEP_ICONS.length] }));
  const totalImages = steps.length;
  const { current: currentSlide, isAnimating, next: nextSlide, prev: prevSlide, goTo: goToSlide, onKeyDown } = useCarousel(totalImages);

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header mejorado */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            <FiUsers className="w-8 h-8 text-blue-600" />
          </div>
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
            <span className="text-yellow-500 relative inline-block">
              {heading?.lead}
              <svg 
                className="absolute -bottom-2 left-0 w-full h-3 text-yellow-400 hidden md:block" 
                viewBox="0 0 200 12" 
                fill="currentColor"
              >
                <path d="M0 8c40 0 60-6 100-6s60 6 100 6v4c-40 0-60-6-100-6S40 12 0 12V8z"/>
              </svg>
            </span>
            <span className="block mt-2 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              {heading?.highlight}
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-6">
            {heading?.intro}
          </p>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg max-w-3xl mx-auto border border-gray-100">
            <div className="flex items-center justify-center mb-4">
              <FiFileText className="w-6 h-6 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">{documentsTitle}</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
              {documents.map((document) => (
                <div key={document} className="flex items-center">
                  <FiCheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span>{document}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Carrusel mejorado y pasos del proceso */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
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
                      alt={step.image?.alt || `Paso ${index + 1}: ${step.title}`}
                      className="w-full h-96 object-cover"
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                  </div>
                ))}
              </div>

              {/* Navegación */}
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

              {/* Indicadores */}
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

              {/* Contador */}
              <div className="absolute top-4 right-4 bg-black/50 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm">
                {currentSlide + 1} / {totalImages}
              </div>
            </div>
          </div>

          {/* Pasos del proceso */}
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
                      ? "bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200 shadow-lg transform scale-105" 
                      : "bg-white hover:bg-gray-50 border border-gray-200 hover:shadow-md"
                  }`}
                  onClick={() => goToSlide(index)}
                >
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                    isActive 
                      ? "bg-gradient-to-r from-blue-500 to-green-500 text-white" 
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
                      isActive ? "text-blue-700" : "text-gray-800"
                    }`}>
                      {step.title}
                    </h4>
                    <p className={`transition-colors ${
                      isActive ? "text-blue-600" : "text-gray-600"
                    }`}>
                      {step.description}
                    </p>
                  </div>
                  
                  {isActive && (
                    <FiArrowRight className="w-5 h-5 text-blue-500 animate-pulse" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Beneficiaries;