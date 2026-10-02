import { useCallback, useEffect, useRef, useState } from "react";
import { FiCalendar, FiChevronLeft, FiChevronRight, FiHeart, FiUsers, FiX } from "react-icons/fi";

// images: [{ src, alt }] desde el CMS (Beneficiarios → Galería).
const Gallery = ({ heading, images }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [visibleImages, setVisibleImages] = useState(8);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const lightboxRef = useRef(null);

  const visibleImagesData = images.slice(0, visibleImages);
  const selectedImage = images[currentIndex];

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    document.body.style.overflow = "auto";
  }, []);

  const navigateImage = useCallback((direction) => {
    setCurrentIndex((index) => direction === "next"
      ? (index + 1) % images.length
      : (index - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (lightboxOpen && lightboxRef.current && !lightboxRef.current.contains(e.target)) {
        closeLightbox();
      }
    };

    const handleKeyPress = (e) => {
      if (!lightboxOpen) return;
      
      switch(e.key) {
        case "Escape":
          closeLightbox();
          break;
        case "ArrowLeft":
          navigateImage("prev");
          break;
        case "ArrowRight":
          navigateImage("next");
          break;
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyPress);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [lightboxOpen, closeLightbox, navigateImage]);

  const loadMore = () => {
    setLoading(true);
    setTimeout(() => {
      setVisibleImages((prev) => prev + 8);
      setLoading(false);
    }, 500);
  };

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header mejorado */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
            <FiHeart className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-green-700 to-yellow-600 bg-clip-text text-transparent">
            {heading?.highlight}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {heading?.intro}
          </p>
          <div className="flex items-center justify-center gap-8 mt-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <FiUsers className="w-4 h-4" />
              <span>{images.length} historias</span>
            </div>
            <div className="flex items-center gap-2">
              <FiCalendar className="w-4 h-4" />
              <span>Actualizado {new Date().getFullYear()}</span>
            </div>
          </div>
        </div>

        {/* Grid mejorado con animaciones */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {visibleImagesData.map((image, index) => (
            <div
              key={image.src}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
              onClick={() => openLightbox(index)}
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
              }}
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              
              {/* Efecto de brillo */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </div>
          ))}
        </div>

        {/* Botón cargar más mejorado */}
        {visibleImages < images.length && (
          <div className="text-center mt-16">
            <button
              onClick={loadMore}
              disabled={loading}
              className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Cargando...
                </>
              ) : (
                <>
                  Ver más historias
                  <div className="ml-2 transition-transform group-hover:translate-x-1">→</div>
                </>
              )}
            </button>
            <p className="text-sm text-gray-500 mt-3">
              Mostrando {visibleImages} de {images.length} imágenes
            </p>
          </div>
        )}
      </div>

      {/* Lightbox mejorado */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm"
          style={{
            animation: "fadeIn 0.3s ease-out"
          }}
        >
          <div className="h-full flex items-center justify-center p-4">
            <div
              ref={lightboxRef}
              className="relative max-w-6xl w-full max-h-[90vh] flex flex-col"
              style={{
                animation: "scaleIn 0.4s ease-out"
              }}
            >
              {/* Controles superiores */}
              <div className="flex justify-between items-center mb-4 text-white">
                <div>
                  <p className="text-sm opacity-70">{currentIndex + 1} de {images.length}</p>
                </div>
                <button
                  onClick={closeLightbox}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              {/* Imagen principal */}
              <div className="flex-grow flex items-center justify-center relative">
                <img
                  src={selectedImage?.src}
                  alt={selectedImage?.alt}
                  className="max-w-full max-h-[75vh] object-contain rounded-lg"
                />
                
                {/* Navegación */}
                <button
                  onClick={() => navigateImage("prev")}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all backdrop-blur-sm cursor-pointer"
                >
                  <FiChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => navigateImage("next")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all backdrop-blur-sm cursor-pointer"
                >
                  <FiChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Indicadores */}
              <div className="flex justify-center mt-4 space-x-2">
                {images.slice(Math.max(0, currentIndex - 2), Math.min(images.length, currentIndex + 3)).map((_, idx) => {
                  const actualIndex = Math.max(0, currentIndex - 2) + idx;
                  return (
                    <button
                      key={actualIndex}
                      onClick={() => setCurrentIndex(actualIndex)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        actualIndex === currentIndex 
                          ? "bg-white w-8" 
                          : "bg-white/40 hover:bg-white/60"
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </section>
  );
};

export default Gallery;