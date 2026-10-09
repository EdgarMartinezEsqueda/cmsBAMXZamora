import { createElement } from 'react';
import { FaAppleAlt, FaArrowRight, FaAward, FaBalanceScale, FaBook, FaBox, FaBoxes, FaBrain, FaBreadSlice, FaBriefcase, FaBroom, FaBuilding, FaBullhorn, FaCalendarAlt, FaCamera, FaCarrot, FaChalkboardTeacher, FaCheckCircle, FaChild, FaChurch, FaClipboardList, FaClock, FaDonate, FaEnvelope, FaFacebook, FaFileAlt, FaFirstAid, FaFutbol, FaGift, FaGraduationCap, FaHandHoldingHeart, FaHandsHelping, FaHandshake, FaHeart, FaHeartbeat, FaHome, FaHospital, FaIdCard, FaInstagram, FaLaptop, FaLeaf, FaLink, FaLinkedin, FaMapMarkerAlt, FaMedal, FaMoneyBillWave, FaMusic, FaNewspaper, FaPalette, FaPeopleCarry, FaPhone, FaPills, FaPinterest, FaRecycle, FaSchool, FaSeedling, FaShieldAlt, FaShoePrints, FaShoppingBasket, FaSmile, FaSpotify, FaStar, FaStore, FaTelegram, FaTiktok, FaTools, FaTractor, FaTrophy, FaTruck, FaTshirt, FaUser, FaUsers, FaUtensils, FaWarehouse, FaWhatsapp, FaYoutube } from 'react-icons/fa';
import { FaThreads, FaXTwitter } from 'react-icons/fa6';
import { SiLinktree } from 'react-icons/si';

// Íconos que el CMS elige por clave (enumeración en Strapi). Una clave sin ícono no se pinta.
export const SOCIAL_ICONS = {
  facebook: { Icon: FaFacebook, label: 'Facebook' },
  instagram: { Icon: FaInstagram, label: 'Instagram' },
  youtube: { Icon: FaYoutube, label: 'YouTube' },
  tiktok: { Icon: FaTiktok, label: 'TikTok' },
  x: { Icon: FaXTwitter, label: 'X' },
  whatsapp: { Icon: FaWhatsapp, label: 'WhatsApp' },
  linkedin: { Icon: FaLinkedin, label: 'LinkedIn' },
  threads: { Icon: FaThreads, label: 'Threads' },
  telegram: { Icon: FaTelegram, label: 'Telegram' },
  pinterest: { Icon: FaPinterest, label: 'Pinterest' },
  spotify: { Icon: FaSpotify, label: 'Spotify' },
  linktree: { Icon: SiLinktree, label: 'Todas nuestras redes' },
  otro: { Icon: FaLink, label: 'Más enlaces' },
};

// Iconos que se eligen en el panel (campo "Icono"; claves en shared/content/icons.js).
// Programas y Portada usan las mismas claves.
export const CONTENT_ICONS = {
  "hands-helping": FaHandsHelping,
  "hand-holding-heart": FaHandHoldingHeart,
  "heart": FaHeart,
  "handshake": FaHandshake,
  "users": FaUsers,
  "user": FaUser,
  "child": FaChild,
  "people-carry": FaPeopleCarry,
  "gift": FaGift,
  "donate": FaDonate,
  "money": FaMoneyBillWave,
  "utensils": FaUtensils,
  "basket": FaShoppingBasket,
  "apple": FaAppleAlt,
  "carrot": FaCarrot,
  "bread": FaBreadSlice,
  "warehouse": FaWarehouse,
  "truck": FaTruck,
  "box": FaBox,
  "boxes": FaBoxes,
  "balance": FaBalanceScale,
  "recycle": FaRecycle,
  "leaf": FaLeaf,
  "seedling": FaSeedling,
  "tractor": FaTractor,
  "first-aid": FaFirstAid,
  "heartbeat": FaHeartbeat,
  "pills": FaPills,
  "hospital": FaHospital,
  "book": FaBook,
  "chalkboard": FaChalkboardTeacher,
  "graduation": FaGraduationCap,
  "school": FaSchool,
  "brain": FaBrain,
  "laptop": FaLaptop,
  "briefcase": FaBriefcase,
  "id-card": FaIdCard,
  "file": FaFileAlt,
  "clipboard": FaClipboardList,
  "newspaper": FaNewspaper,
  "bullhorn": FaBullhorn,
  "calendar": FaCalendarAlt,
  "clock": FaClock,
  "location": FaMapMarkerAlt,
  "phone": FaPhone,
  "envelope": FaEnvelope,
  "whatsapp": FaWhatsapp,
  "store": FaStore,
  "shirt": FaTshirt,
  "shoe": FaShoePrints,
  "home": FaHome,
  "building": FaBuilding,
  "church": FaChurch,
  "star": FaStar,
  "trophy": FaTrophy,
  "medal": FaMedal,
  "award": FaAward,
  "shield": FaShieldAlt,
  "check": FaCheckCircle,
  "tools": FaTools,
  "broom": FaBroom,
  "camera": FaCamera,
  "music": FaMusic,
  "palette": FaPalette,
  "football": FaFutbol,
  "smile": FaSmile,
  "arrow": FaArrowRight,
};
export const PROGRAM_ICONS = CONTENT_ICONS;

/** Icono elegido en el panel como elemento (con sus clases), o null si no eligieron ninguno. */
export function chosenIcon(key, className) {
  const Icon = key ? CONTENT_ICONS[key] : null;
  return Icon ? createElement(Icon, { className, "aria-hidden": true }) : null;
}
