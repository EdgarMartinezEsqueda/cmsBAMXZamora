import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const enlaces = [
    { nombre: "Inicio", href: "/" },
    { nombre: "Nosotros", href: "/nosotros" },
    { nombre: "Programas", href: "/programas" },
    { nombre: "Beneficiarios", href: "/beneficiarios" },
    { nombre: "Apadrinamiento", href: "/apadrinamiento" },
    { nombre: "Contacto", href: "/contacto" },
  ];

  return (
    <nav className="bg-gris-800 text-white sticky top-0 z-50 shadow-md lg:w-[75%] lg:m-auto lg:rounded-b-lg">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 xl:px-32">
        <div className="flex justify-between items-center h-16">
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex flex-1 justify-center">
            <div className="flex gap-8 max-w-[75%] mx-auto justify-center items-center">
              {enlaces.map((item, key) => (
                <a
                  key={key}
                  href={item.href}
                  className="relative group py-4 font-medium"
                >
                  {item.nombre}
                  <span className="absolute left-0 bottom-2 w-0 h-[2px] bg-amarilloLogo transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </div>
          </div>
          
          {/* Right Section */}
          <div className="flex items-center">
            <a
              href="/donar"
              className="bg-verde-500 text-white px-6 py-2 rounded-full font-medium hover:bg-verde-700 transition-colors shadow-md"
            >
              Dona Ahora
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-gris-800 text-white transform transition-transform duration-300 z-50 lg:hidden ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center px-4 py-4 border-b border-gray-700">
          <a href="/">
            <img
              src="/assets/images/logoOscuro.webp"
              alt="Logo"
              className="h-10"
            />
          </a>
          <button onClick={() => setIsMenuOpen(false)} className="text-2xl">
            ×
          </button>
        </div>

        <nav className="flex flex-col space-y-2 p-4">
          {enlaces.map((item, i) => (
            <a
              key={i}
              href={item.href}
              className="py-3 px-2 rounded-md hover:bg-gray-800 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.nombre}
            </a>
          ))}
        </nav>
      </div>
    </nav>
  );
};

export default Navigation;