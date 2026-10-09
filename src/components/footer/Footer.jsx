import { SOCIAL_ICONS } from "../../content/icons.js";
import useSite from "utils/useSite";

const Footer = () => {
  // Títulos, enlaces y textos: "Menú y pie de página". Contacto y redes: "Datos del sitio".
  const { contact, social, navigation, branding } = useSite();
  const { footer } = navigation;
  // Redes de "Datos del sitio" y, si no está ya como red, su Linktree.
  const networks = [...social];
  if (contact.linktreeUrl && !networks.some((item) => item.network === "linktree" || item.url === contact.linktreeUrl)) {
    networks.push({ network: "linktree", url: contact.linktreeUrl, label: "" });
  }
  const socialLinks = networks
    .filter((item) => SOCIAL_ICONS[item.network])
    .map((item) => {
      const { Icon, label } = SOCIAL_ICONS[item.network];
      return { icon: <Icon />, label: (item.network === "otro" && item.label) || label, link: item.url };
    });
  const darkLogo = branding.darkLogo ?? { src: "/assets/images/logoOscuro.webp" };

  const services = footer.programs.map((program) => ({ title: program.label, link: program.url }));

  const usefulLinks = footer.links.map((link) => ({ title: link.label, link: link.url }));

  return (
    <footer className="relative z-10 text-white">
      {/* Fondo overlay */}
      <div className="absolute inset-0 bg-[#63696a] z-[-1]" />

      {/* Contenido principal del footer */}
      <div className="container mx-auto px-4 pt-10 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
        {/* Servicios */}
        <div>
          <h3 className="text-2xl font-bold mb-6">{footer.programsTitle}</h3>
          <ul className="space-y-3">
            {services.map((service, index) => (
              <li key={index}>
                <a href={service.link} className="text-gray-100 hover:text-verdeLogo transition-colors" >
                  {service.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Enlaces útiles */}
        <div>
          <h3 className="text-2xl font-bold mb-6">{footer.linksTitle}</h3>
          <ul className="space-y-3">
            {usefulLinks.map((link, index) => (
              <li key={index}>
                <a href={link.link} className="text-gray-100 hover:text-verdeLogo transition-colors" >
                  {link.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Ubicación */}
        <div>
          <h3 className="text-2xl font-bold mb-6">{footer.locationTitle}</h3>
          <p className="text-gray-100 mb-6 leading-relaxed">
            <a href={contact.mapsLink || undefined} target="_blank" rel="noopener noreferrer">
              {contact.address}<br/>
              {contact.city}
            </a>
          </p>
          <ul className="space-y-2">
            <li className="font-semibold">{footer.contactLabel}</li>
            <li className="text-verdeLogo">
              <a href={`mailto:${contact.email}`}>
                {contact.email}
              </a>
            </li>
            <li className="text-gray-100">
              <a href={`tel:${contact.phone}`}>{contact.phone}</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Redes sociales */}
      <div className=" py-4">
        {footer.socialText && (
          <p className="mx-auto mb-4 max-w-xl px-4 text-center text-sm text-gray-100">{footer.socialText}</p>
        )}
        <ul className="flex flex-wrap justify-center gap-6">
          {socialLinks.map(({ icon, label, link }) => (
            <li key={link}>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white hover:text-amarilloLogo transition-colors"
              >
                <span className="text-2xl">{icon}</span>
                <span className="hidden sm:inline text-gray-200 text-base hover:text-amarilloLogo">
                  {label}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Logo y certificaciones */}
      <div className="py-4 ">
        <div className="flex justify-center items-center flex-wrap gap-8">
          {/* Logo del Banco (Datos del sitio → Logos) */}
          <img src={darkLogo.src} alt="Banco de Alimentos de Zamora" className="h-14 object-contain" />

          {/* Distintivos (Menú y pie de página → Pie: distintivos) */}
          {footer.badges.length > 0 && (
            <ul className="flex flex-wrap justify-center items-center gap-6">
              {footer.badges.map((badge) => {
                const content = (
                  <>
                    <img src={badge.image.src} alt={badge.label || badge.image.alt} className="h-12 object-contain" />
                    {badge.label && <span className="text-xs text-gray-200 text-center mt-1 max-w-[160px]">{badge.label}</span>}
                  </>
                );
                return (
                  <li key={badge.image.src} className="flex flex-col items-center">
                    {badge.url
                      ? <a href={badge.url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center hover:opacity-80">{content}</a>
                      : content}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Footer inferior */}
      <div className="py-6">
        <div className="container mx-auto px-4 text-center text-sm text-gray-200">
          &copy; {new Date().getFullYear()}{" "} <a href="/" className="text-amarilloLogo font-medium"> {footer.copyright} </a>{" "} - Todos los derechos reservados.
        </div>
      </div>

      {/* Figuras decorativas */}
      <div className="absolute left-0 top-1/4 animate-leaf hidden lg:block">
        <img src="assets/images/f-shape1.svg" alt="" />
      </div>
      <div className="absolute left-12 bottom-0 animate-leaf hidden lg:block">
        <img src="assets/images/f-shape-2.svg" alt="" />
      </div>
    </footer>
  );
};

export default Footer;