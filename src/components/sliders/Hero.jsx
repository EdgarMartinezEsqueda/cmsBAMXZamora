import { FiArrowRight, FiHeart, FiPhone, FiUsers } from "react-icons/fi";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useId } from "react";
import { safeContentUrl } from "../../content/hero.js";

const ICONS = { heart: FiHeart, users: FiUsers, phone: FiPhone, arrow: FiArrowRight };

const HeroSlider = ({
  slides = [], primaryLabel = "", primaryLink = "", secondaryLabel = "", secondaryLink = "",
  supportTitle = "", supportDescription = "", supportPhone = "",
  previousLabel = "Diapositiva anterior", nextLabel = "Diapositiva siguiente",
} = {}) => {
  const navigationId = `hero-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  if (!Array.isArray(slides) || slides.length === 0) return null;
  const primaryHref = safeContentUrl(primaryLink);
  const secondaryHref = safeContentUrl(secondaryLink);
  const hasMultipleSlides = slides.length > 1;

  return (
    <section className="hero-slider relative h-screen -mt-10 overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        autoplay={hasMultipleSlides ? { delay: 7000, disableOnInteraction: false } : false}
        pagination={hasMultipleSlides ? { clickable: true } : false}
        navigation={hasMultipleSlides ? {
          prevEl: `.${navigationId}-prev`,
          nextEl: `.${navigationId}-next`,
        } : false}
        effect="fade"
        loop={hasMultipleSlides}
        className="h-full"
      >
        {slides.map((slide, index) => {
          const IconComponent = ICONS[slide.iconKey] || FiHeart;
          return (
            <SwiperSlide key={slide.id ?? index}>
              <div
                className="relative h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${JSON.stringify(safeContentUrl(slide.image))})` }}
              >
                {/* Overlay con gradiente más sofisticado */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/40" />
                <div className="absolute inset-0 bg-gradient-to-t from-verdeLogo/20 via-transparent to-amarilloLogo/10" />

                {/* Elementos decorativos */}
                <div className="absolute top-20 right-20 w-64 h-64 bg-amarilloLogo/5 rounded-full blur-3xl animate-pulse-slow hidden lg:block" />
                <div className="absolute bottom-32 left-20 w-48 h-48 bg-verdeLogo/5 rounded-full blur-3xl animate-pulse-slow delay-1000 hidden lg:block" />

                <div className="container mx-auto h-full flex items-center px-6 lg:px-12 xl:px-20 relative z-20">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
                    
                    {/* Contenido principal */}
                    <div className="lg:col-span-8 space-y-8">
                      
                      {/* Badge con icono */}
                      <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 animate-slide-down">
                        <div className="bg-amarilloLogo p-2 rounded-full">
                          <IconComponent className="text-black text-lg" />
                        </div>
                        <span className="text-white font-semibold text-sm tracking-wide">
                          {slide.badge}
                        </span>
                      </div>

                      {/* Título principal */}
                      <h1 className="text-white text-4xl md:text-5xl lg:text-7xl font-bold leading-tight animate-slide-up">
                        <span className="block">{slide.headingLead}</span>
                        <span className="block text-amarilloLogo mt-2">
                          {slide.headingHighlight}
                        </span>
                      </h1>

                      {/* Descripción */}
                      <p className="text-gray-200 text-xl md:text-2xl leading-relaxed max-w-2xl animate-slide-up delay-200">
                        {slide.description}
                      </p>

                      {/* Botones de acción */}
                      <div className="flex flex-col sm:flex-row gap-6 animate-slide-up delay-300">
                        {primaryLabel && primaryHref && <a
                          href={primaryHref}
                          className="group bg-gradient-to-r from-verdeLogo to-green-600 hover:from-green-700 hover:to-green-800 text-white px-10 py-5 rounded-2xl transition-all duration-500 text-lg font-bold tracking-wide shadow-2xl hover:shadow-verdeLogo/25 hover:scale-105 flex items-center gap-3"
                        >
                          {primaryLabel}
                          <FiArrowRight className="text-xl group-hover:translate-x-1 transition-transform" />
                        </a>}

                        {secondaryLabel && secondaryHref && <a
                          href={secondaryHref}
                          className="group border-2 border-amarilloLogo text-amarilloLogo hover:bg-amarilloLogo hover:text-black px-10 py-5 rounded-2xl transition-all duration-500 text-lg font-bold tracking-wide backdrop-blur-sm bg-black/20 hover:scale-105 flex items-center gap-3"
                        >
                          <FiHeart className="text-xl" />
                          {secondaryLabel}
                        </a>}
                      </div>
                    </div>

                    {/* Panel lateral con estadísticas y contacto */}
                    <div className="lg:col-span-4 space-y-6">
                      
                      {/* Estadística destacada */}
                      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 animate-slide-left">
                        <div className="text-center">
                          <div className="text-4xl lg:text-5xl font-black text-amarilloLogo mb-2">
                            {slide.statNumber}
                          </div>
                          <div className="text-white font-semibold text-lg">
                            {slide.statLabel}
                          </div>
                        </div>
                      </div>

                      {/* Información de contacto mejorada */}
                      <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md border border-white/20 rounded-3xl p-8 animate-slide-left delay-200">
                        <div className="flex items-center gap-4">
                          <div className="bg-verdeLogo p-4 rounded-2xl flex-shrink-0">
                            <FiPhone className="text-3xl text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-white text-xl mb-1">{supportTitle}</h3>
                            <p className="text-gray-300 text-sm mb-2">{supportDescription}</p>
                            <span className="text-amarilloLogo text-2xl font-black">{supportPhone}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}

        {/* Navegación personalizada */}
        {hasMultipleSlides && <button type="button" aria-label={previousLabel} className={`${navigationId}-prev max-md:hidden custom-prev absolute left-8 top-1/2 -translate-y-1/2 z-30 w-16 h-16 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center cursor-pointer hover:bg-amarilloLogo hover:border-amarilloLogo transition-all duration-300 group`}>
          <svg className="w-6 h-6 text-white group-hover:text-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>}

        {hasMultipleSlides && <button type="button" aria-label={nextLabel} className={`${navigationId}-next max-md:hidden custom-next absolute right-8 top-1/2 -translate-y-1/2 z-30 w-16 h-16 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center cursor-pointer hover:bg-amarilloLogo hover:border-amarilloLogo transition-all duration-300 group`}>
          <svg className="w-6 h-6 text-white group-hover:text-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>}

        {/* Indicadores de paginación personalizados */}
        {hasMultipleSlides && <div className="swiper-pagination !bottom-12 !left-1/2 !-translate-x-1/2" />}
      </Swiper>

      {/* Estilos globales mejorados */}
      <style>{`
        .hero-slider .swiper-pagination {
          display: flex !important;
          justify-content: center !important;
          gap: 12px !important;
          width: auto !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
        }
        
        .hero-slider .swiper-pagination-bullet {
          width: 12px !important;
          height: 12px !important;
          background: rgba(255, 255, 255, 0.3) !important;
          border: 2px solid rgba(255, 255, 255, 0.5) !important;
          opacity: 1 !important;
          transition: all 0.3s ease !important;
          border-radius: 50% !important;
        }
        
        .hero-slider .swiper-pagination-bullet-active {
          background: #F59E0B !important;
          border-color: #F59E0B !important;
          transform: scale(1.3) !important;
          box-shadow: 0 0 20px rgba(245, 158, 11, 0.5) !important;
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-left {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.1);
          }
        }

        .animate-slide-down {
          animation: slide-down 0.8s ease-out forwards;
        }

        .animate-slide-up {
          opacity: 0;
          animation: slide-up 0.8s ease-out forwards;
        }

        .animate-slide-left {
          opacity: 0;
          animation: slide-left 0.8s ease-out forwards;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .delay-200 {
          animation-delay: 0.3s;
        }

        .delay-300 {
          animation-delay: 0.5s;
        }

        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </section>
  );
};

export default HeroSlider;
