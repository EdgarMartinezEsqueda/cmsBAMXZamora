import { useRef, useState } from "react";
import Turnstile from './Turnstile.jsx';
import { CMS_URL } from '../../utils/cms.js';
import { displayUrl } from '../../utils/format.js';
import useSite from '../../utils/useSite.js';
import { FaArrowRight, FaCheckCircle, FaEdit, FaEnvelope, FaExclamationCircle, FaHome, FaPhone, FaUser } from "react-icons/fa";
import { IoSend, IoShareSocial } from "react-icons/io5";

const ContactPage = ({ heading, formTitle, formIntro }) => {
  const { contact } = useSite();
  const submitting = useRef(false);
  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaReset, setCaptchaReset] = useState(0);
  const [website, setWebsite] = useState('');
  const [submitError, setSubmitError] = useState('');
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
  // Sin la clave pública de Turnstile no hay forma de pasar la verificación anti-bots que exige
  // el servidor, así que el formulario no puede enviarse: se ofrecen los canales directos. Aplica
  // también en desarrollo; antes ahí se podía llenar el formulario y fallaba al enviarlo.
  const formUnavailable = !siteKey;
  const captchaPending = Boolean(siteKey) && !captchaToken;
  const captchaMissing = captchaPending || formUnavailable;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // "success", "error", null
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    mensaje: ""
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    }
    
    if (!formData.correo.trim()) {
      newErrors.correo = "El correo es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      newErrors.correo = "Ingresa un correo válido";
    }
    
    if (!formData.mensaje.trim()) {
      newErrors.mensaje = "El mensaje es obligatorio";
    } else if (formData.mensaje.trim().length < 10) {
      newErrors.mensaje = "El mensaje debe tener al menos 10 caracteres";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
    
    // Limpiar status si hay alguno
    if (submitStatus) {
      setSubmitStatus(null);
    }
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    if (submitting.current || captchaMissing) return;
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    submitting.current = true;
    setSubmitStatus(null);

    try {
      const response = await fetch(`${CMS_URL}/api/contact`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, website, captchaToken }),
        signal: AbortSignal.timeout(15000),
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true) throw new Error(typeof result.error === 'string' ? result.error : 'No se pudo enviar el mensaje.');
      
      setSubmitStatus("success");
      setFormData({ nombre: "", correo: "", mensaje: "" });
      
    } catch (error) {
      setSubmitError(error.name === 'TimeoutError' ? 'No pudimos confirmar el envío. Espera antes de intentarlo otra vez.' : error.message);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
      submitting.current = false;
      setCaptchaToken('');
      setCaptchaReset((value) => value + 1);
    }
  };

  const contactInfo = [
    {
      icon: <FaHome />,
      title: "Domicilio",
      content: contact.address,
      subtitle: contact.city,
      color: "from-rojo-500 to-rojo-600"
    },
    {
      icon: <FaPhone />,
      title: "Teléfono",
      content: contact.phone,
      subtitle: contact.schedule,
      color: "from-verde-500 to-verde-600",
      action: `tel:${contact.phone}`
    },
    {
      icon: <FaEnvelope />,
      title: "Correos Electrónicos",
      content: contact.email,
      subtitle: contact.socialWorkEmail,
      color: "from-amarillo-500 to-amarillo-600",
      action: `mailto:${contact.email}`
    },
    {
      icon: <IoShareSocial />,
      title: "Enlaces útiles",
      content: "Síguenos en redes sociales",
      subtitle: contact.linktreeUrl ? displayUrl(contact.linktreeUrl) : "",
      color: "from-gris-500 to-gris-600",
      action: contact.linktreeUrl
    }
  ];

  // Teléfono y correo, reutilizados del mismo arreglo que pinta las tarjetas.
  const directChannels = contactInfo.filter(
    (item) => item.action?.startsWith("tel:") || item.action?.startsWith("mailto:")
  );

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-rojo-50">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Información de contacto */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((item, index) => (
            <div 
              key={index} 
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
              }}
            >
              <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>

              <div className="text-center">
                <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-gray-900">
                  {item.title}
                </h3>
                <p className="text-gray-600 font-medium mb-1">
                  {item.content}
                </p>
                <p className="text-sm text-gray-500">
                  {item.subtitle}
                </p>
                {item.action && (
                  <a
                    href={item.action}
                    target="_blank"
                    className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-rojo-600 hover:text-rojo-800 transition-colors"
                  >
                    {item.action.startsWith("http") ? "Visitar" : "Contactar"} <FaArrowRight className="text-xs" aria-hidden="true" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Sección principal de contacto */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Información y mapa */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                <span className="bg-gradient-to-r from-rojo-600 to-verde-600 bg-clip-text text-transparent">
                  {heading?.highlight}
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                {heading?.intro}
              </p>
            </div>

            {/* Mapa: solo una dirección de google.com/maps/embed validada en shared/content/site.js */}
            {contact.mapsEmbedUrl && (
              <div className="relative overflow-hidden rounded-2xl shadow-xl">
                <iframe
                  src={contact.mapsEmbedUrl}
                  className="w-full h-80 border-0"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación del Banco de Alimentos de Zamora"
                />
              </div>
            )}
          </div>

          {/* Formulario de contacto */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">{formTitle}</h2>
              <p className="text-gray-600">
                {formIntro}
              </p>
            </div>

            {/* Status del envío */}
            {submitStatus === "success" && (
              <div className="mb-6 p-4 bg-verde-50 border border-verde-200 rounded-xl flex items-center">
                <FaCheckCircle className="text-verde-500 text-xl mr-3" />
                <div>
                  <p className="text-verde-800 font-medium">¡Mensaje enviado con éxito!</p>
                  <p className="text-verde-600 text-sm">Te contactaremos a la brevedad.</p>
                </div>
              </div>
            )}

            {submitStatus === "error" && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center">
                <FaExclamationCircle className="text-red-500 text-xl mr-3" />
                <div>
                  <p className="text-red-800 font-medium">Error al enviar el mensaje</p>
                  <p className="text-red-600 text-sm">{submitError || 'Por favor, inténtalo más tarde.'}</p>
                </div>
              </div>
            )}

            {formUnavailable ? (
              <div role="alert" className="rounded-xl border border-amarillo-200 bg-amarillo-50 p-6">
                <p className="flex items-center text-lg font-semibold text-gray-900">
                  <FaExclamationCircle className="mr-2 text-amarillo-600" />
                  El formulario no está disponible por ahora
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  Escríbenos o llámanos directamente: te respondemos igual de rápido.
                </p>
                {import.meta.env.DEV && (
                  <p className="mt-2 text-xs text-gray-500">
                    Desarrollo: falta VITE_TURNSTILE_SITE_KEY en el .env raíz (la clave pública del mismo widget de
                    Cloudflare Turnstile cuya clave secreta está en cms/.env). Reinicia npm run dev tras agregarla.
                  </p>
                )}
                <div className="mt-5 flex flex-col gap-3">
                  {directChannels.map((canal) => (
                    <a
                      key={canal.title}
                      href={canal.action}
                      className="flex items-center font-medium text-verde-700 transition-colors hover:text-verde-800 hover:underline"
                    >
                      <span className="mr-3 text-gray-400">{canal.icon}</span>
                      {canal.content}
                    </a>
                  ))}
                </div>
              </div>
            ) : (
            <form className="space-y-6" onSubmit={sendEmail}>
              <div className="hidden" aria-hidden="true">
                <label>Sitio web<input name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} /></label>
              </div>
              {/* Campo Nombre */}
              <div className="relative">
                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    type="text"
                    name="nombre"
                    maxLength={120}
                    placeholder="Tu nombre completo*"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-4 py-4 text-gray-700 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                      errors.nombre 
                        ? "border-red-300 focus:ring-red-500" 
                        : "border-gray-200 focus:ring-rojo-500 focus:border-rojo-500"
                    }`}
                  />
                </div>
                {errors.nombre && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <FaExclamationCircle className="mr-1" />
                    {errors.nombre}
                  </p>
                )}
              </div>

              {/* Campo Email */}
              <div className="relative">
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    type="email"
                    name="correo"
                    maxLength={200}
                    placeholder="tu.email@ejemplo.com*"
                    value={formData.correo}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-4 py-4 text-gray-700 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                      errors.correo 
                        ? "border-red-300 focus:ring-red-500" 
                        : "border-gray-200 focus:ring-rojo-500 focus:border-rojo-500"
                    }`}
                  />
                </div>
                {errors.correo && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <FaExclamationCircle className="mr-1" />
                    {errors.correo}
                  </p>
                )}
              </div>

              {/* Campo Mensaje */}
              <div className="relative">
                <div className="relative">
                  <FaEdit className="absolute left-4 top-4 text-gray-400 text-lg" />
                  <textarea
                    name="mensaje"
                    maxLength={2000}
                    placeholder="Escribe tu mensaje aquí... (mínimo 10 caracteres)*"
                    rows="5"
                    value={formData.mensaje}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-4 py-4 text-gray-700 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:bg-white transition-all resize-none ${
                      errors.mensaje 
                        ? "border-red-300 focus:ring-red-500" 
                        : "border-gray-200 focus:ring-rojo-500 focus:border-rojo-500"
                    }`}
                  ></textarea>
                </div>
                {errors.mensaje && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <FaExclamationCircle className="mr-1" />
                    {errors.mensaje}
                  </p>
                )}
                <p className="mt-2 text-xs text-gray-500">
                  {formData.mensaje.length}/2000 caracteres
                </p>
              </div>

              {/* Botón de envío */}
              {siteKey && <Turnstile siteKey={siteKey} onToken={setCaptchaToken} resetKey={captchaReset} />}
              <button
                type="submit"
                disabled={isSubmitting || captchaMissing}
                className="w-full bg-gradient-to-r from-verde-600 to-verde-700 hover:from-verde-700 hover:to-verde-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Enviando mensaje...
                  </>
                ) : (
                  <>
                    <IoSend className="mr-2 text-lg" />
                    Enviar mensaje
                  </>
                )}
              </button>
            </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
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
      `}</style>
    </section>
  );
};

export default ContactPage;
