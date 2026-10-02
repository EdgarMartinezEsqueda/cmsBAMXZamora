import { FaBook, FaChalkboardTeacher, FaDonate, FaFacebook, FaFirstAid, FaGift, FaHandHoldingHeart, FaHandshake, FaHandsHelping, FaHeart, FaHeartbeat, FaInstagram, FaLinkedin, FaNewspaper, FaPalette, FaTiktok, FaUtensils, FaWhatsapp, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

// Íconos que el CMS elige por clave (enumeración en Strapi). Una clave sin ícono no se pinta.
export const SOCIAL_ICONS = {
  facebook: { Icon: FaFacebook, label: 'Facebook' },
  instagram: { Icon: FaInstagram, label: 'Instagram' },
  youtube: { Icon: FaYoutube, label: 'YouTube' },
  tiktok: { Icon: FaTiktok, label: 'TikTok' },
  x: { Icon: FaXTwitter, label: 'X' },
  whatsapp: { Icon: FaWhatsapp, label: 'WhatsApp' },
  linkedin: { Icon: FaLinkedin, label: 'LinkedIn' },
};

// Íconos de la colección Programas (enumeración `icon` en Strapi).
export const PROGRAM_ICONS = {
  'hands-helping': FaHandsHelping,
  gift: FaGift,
  utensils: FaUtensils,
  chalkboard: FaChalkboardTeacher,
  palette: FaPalette,
  book: FaBook,
  'first-aid': FaFirstAid,
  heartbeat: FaHeartbeat,
  heart: FaHeart,
  newspaper: FaNewspaper,
  handshake: FaHandshake,
  'hand-holding-heart': FaHandHoldingHeart,
  donate: FaDonate,
};
