import { FaAppleAlt, FaArrowRight, FaAward, FaBalanceScale, FaBook, FaBox, FaBoxes, FaBrain, FaBreadSlice, FaBriefcase, FaBroom, FaBuilding, FaBullhorn, FaCalendarAlt, FaCamera, FaCarrot, FaChalkboardTeacher, FaCheckCircle, FaChild, FaChurch, FaClipboardList, FaClock, FaDonate, FaEnvelope, FaFileAlt, FaFirstAid, FaFutbol, FaGift, FaGraduationCap, FaHandHoldingHeart, FaHandsHelping, FaHandshake, FaHeart, FaHeartbeat, FaHome, FaHospital, FaIdCard, FaLaptop, FaLeaf, FaMapMarkerAlt, FaMedal, FaMoneyBillWave, FaMusic, FaNewspaper, FaPalette, FaPeopleCarry, FaPhone, FaPills, FaRecycle, FaSchool, FaSeedling, FaShieldAlt, FaShoePrints, FaShoppingBasket, FaSmile, FaStar, FaStore, FaTools, FaTractor, FaTrophy, FaTruck, FaTshirt, FaUser, FaUsers, FaUtensils, FaWarehouse, FaWhatsapp } from 'react-icons/fa';

// Catálogo del selector de iconos del panel: clave guardada, dibujo, nombre y palabras para
// buscar. Mismas claves que shared/content/icons.js y src/content/icons.js (una prueba lo verifica).
export const ICON_CATALOG = [
  { key: 'hands-helping', Icon: FaHandsHelping, label: 'Manos que ayudan', keywords: 'voluntario voluntariado apoyo ayuda' },
  { key: 'hand-holding-heart', Icon: FaHandHoldingHeart, label: 'Mano con corazón', keywords: 'donación apoyo cuidado' },
  { key: 'heart', Icon: FaHeart, label: 'Corazón', keywords: 'amor cariño solidaridad' },
  { key: 'handshake', Icon: FaHandshake, label: 'Apretón de manos', keywords: 'alianza acuerdo convenio aliado' },
  { key: 'users', Icon: FaUsers, label: 'Personas', keywords: 'familias grupo comunidad equipo' },
  { key: 'user', Icon: FaUser, label: 'Persona', keywords: 'beneficiario usuario' },
  { key: 'child', Icon: FaChild, label: 'Niño', keywords: 'niñez infancia niños' },
  { key: 'people-carry', Icon: FaPeopleCarry, label: 'Cargando juntos', keywords: 'voluntarios carga equipo trabajo' },
  { key: 'gift', Icon: FaGift, label: 'Regalo', keywords: 'apadrinamiento obsequio' },
  { key: 'donate', Icon: FaDonate, label: 'Donación', keywords: 'dinero moneda aportación' },
  { key: 'money', Icon: FaMoneyBillWave, label: 'Dinero', keywords: 'pago efectivo precio costo' },
  { key: 'utensils', Icon: FaUtensils, label: 'Cubiertos', keywords: 'comida comedor alimento' },
  { key: 'basket', Icon: FaShoppingBasket, label: 'Despensa', keywords: 'canasta compras víveres' },
  { key: 'apple', Icon: FaAppleAlt, label: 'Manzana', keywords: 'fruta nutrición alimento sano' },
  { key: 'carrot', Icon: FaCarrot, label: 'Zanahoria', keywords: 'verdura hortaliza nutrición' },
  { key: 'bread', Icon: FaBreadSlice, label: 'Pan', keywords: 'panadería alimento' },
  { key: 'warehouse', Icon: FaWarehouse, label: 'Almacén', keywords: 'bodega inventario' },
  { key: 'truck', Icon: FaTruck, label: 'Camión', keywords: 'reparto chofer entrega transporte logística' },
  { key: 'box', Icon: FaBox, label: 'Caja', keywords: 'paquete envío' },
  { key: 'boxes', Icon: FaBoxes, label: 'Cajas', keywords: 'inventario acopio almacén' },
  { key: 'balance', Icon: FaBalanceScale, label: 'Báscula', keywords: 'peso kilos medir' },
  { key: 'recycle', Icon: FaRecycle, label: 'Reciclaje', keywords: 'rescate desperdicio medio ambiente' },
  { key: 'leaf', Icon: FaLeaf, label: 'Hoja', keywords: 'medio ambiente naturaleza ecología' },
  { key: 'seedling', Icon: FaSeedling, label: 'Planta', keywords: 'crecimiento huerto siembra' },
  { key: 'tractor', Icon: FaTractor, label: 'Tractor', keywords: 'campo agricultura productores' },
  { key: 'first-aid', Icon: FaFirstAid, label: 'Botiquín', keywords: 'primeros auxilios salud' },
  { key: 'heartbeat', Icon: FaHeartbeat, label: 'Salud', keywords: 'latido médico bienestar' },
  { key: 'pills', Icon: FaPills, label: 'Medicamentos', keywords: 'dispensario medicina farmacia' },
  { key: 'hospital', Icon: FaHospital, label: 'Hospital', keywords: 'clínica salud' },
  { key: 'book', Icon: FaBook, label: 'Libro', keywords: 'lectura estudio' },
  { key: 'chalkboard', Icon: FaChalkboardTeacher, label: 'Pizarrón', keywords: 'clase taller maestro capacitación' },
  { key: 'graduation', Icon: FaGraduationCap, label: 'Birrete', keywords: 'estudiantes servicio social prácticas universidad' },
  { key: 'school', Icon: FaSchool, label: 'Escuela', keywords: 'universidad institución educativa' },
  { key: 'brain', Icon: FaBrain, label: 'Cerebro', keywords: 'aprendizaje mente educación' },
  { key: 'laptop', Icon: FaLaptop, label: 'Computadora', keywords: 'oficina sistemas tecnología' },
  { key: 'briefcase', Icon: FaBriefcase, label: 'Maletín', keywords: 'empleo trabajo vacante oficina' },
  { key: 'id-card', Icon: FaIdCard, label: 'Credencial', keywords: 'identificación ine documento' },
  { key: 'file', Icon: FaFileAlt, label: 'Documento', keywords: 'requisito papeles trámite' },
  { key: 'clipboard', Icon: FaClipboardList, label: 'Lista', keywords: 'registro formulario requisitos' },
  { key: 'newspaper', Icon: FaNewspaper, label: 'Periódico', keywords: 'boletín noticias' },
  { key: 'bullhorn', Icon: FaBullhorn, label: 'Megáfono', keywords: 'campaña aviso anuncio difusión' },
  { key: 'calendar', Icon: FaCalendarAlt, label: 'Calendario', keywords: 'fecha evento' },
  { key: 'clock', Icon: FaClock, label: 'Reloj', keywords: 'horario tiempo' },
  { key: 'location', Icon: FaMapMarkerAlt, label: 'Ubicación', keywords: 'mapa lugar dirección' },
  { key: 'phone', Icon: FaPhone, label: 'Teléfono', keywords: 'llamada contacto' },
  { key: 'envelope', Icon: FaEnvelope, label: 'Correo', keywords: 'email mensaje' },
  { key: 'whatsapp', Icon: FaWhatsapp, label: 'WhatsApp', keywords: 'mensaje chat' },
  { key: 'store', Icon: FaStore, label: 'Tienda', keywords: 'bazar venta negocio' },
  { key: 'shirt', Icon: FaTshirt, label: 'Ropa', keywords: 'playera vestido bazar' },
  { key: 'shoe', Icon: FaShoePrints, label: 'Calzado', keywords: 'zapatos huellas bazar' },
  { key: 'home', Icon: FaHome, label: 'Hogar', keywords: 'casa vivienda familia' },
  { key: 'building', Icon: FaBuilding, label: 'Edificio', keywords: 'empresa oficina institución' },
  { key: 'church', Icon: FaChurch, label: 'Iglesia', keywords: 'parroquia templo' },
  { key: 'star', Icon: FaStar, label: 'Estrella', keywords: 'destacado especial' },
  { key: 'trophy', Icon: FaTrophy, label: 'Trofeo', keywords: 'logro premio' },
  { key: 'medal', Icon: FaMedal, label: 'Medalla', keywords: 'reconocimiento premio' },
  { key: 'award', Icon: FaAward, label: 'Distintivo', keywords: 'reconocimiento certificado' },
  { key: 'shield', Icon: FaShieldAlt, label: 'Escudo', keywords: 'seguridad confianza protección' },
  { key: 'check', Icon: FaCheckCircle, label: 'Palomita', keywords: 'listo cumplido requisito' },
  { key: 'tools', Icon: FaTools, label: 'Herramientas', keywords: 'mantenimiento reparación' },
  { key: 'broom', Icon: FaBroom, label: 'Limpieza', keywords: 'escoba aseo' },
  { key: 'camera', Icon: FaCamera, label: 'Cámara', keywords: 'fotografía foto' },
  { key: 'music', Icon: FaMusic, label: 'Música', keywords: 'concierto cultura' },
  { key: 'palette', Icon: FaPalette, label: 'Paleta', keywords: 'arte pintura cultura' },
  { key: 'football', Icon: FaFutbol, label: 'Balón', keywords: 'deporte fútbol' },
  { key: 'smile', Icon: FaSmile, label: 'Sonrisa', keywords: 'alegría felicidad' },
  { key: 'arrow', Icon: FaArrowRight, label: 'Flecha', keywords: 'siguiente ir' },
];

const normalize = (value) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

/** Iconos cuyo nombre o palabras contienen la búsqueda (sin importar acentos ni mayúsculas). */
export function searchIcons(query) {
  const terms = normalize(query.trim()).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return ICON_CATALOG;
  return ICON_CATALOG.filter((icon) => {
    const haystack = normalize(`${icon.label} ${icon.keywords} ${icon.key}`);
    return terms.every((term) => haystack.includes(term));
  });
}

export const findIcon = (key) => ICON_CATALOG.find((icon) => icon.key === key) ?? null;
