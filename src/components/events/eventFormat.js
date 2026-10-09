import { FiAward, FiBookOpen, FiHeart, FiPackage, FiShoppingBag, FiStar } from "react-icons/fi";
import { EVENT_AUDIENCES, EVENT_CATEGORIES, mexicoDay } from "../../../shared/content/events.js";

/** Forma mínima de una respuesta de /api/content/events. */
export const isEventList = (content) => Array.isArray(content.items) && Number.isInteger(content.page);

// Fechas y enlaces de los eventos. Todo se muestra en la hora del centro de México.
const TIME_ZONE = "America/Mexico_City";
const format = (date, options) => new Intl.DateTimeFormat("es-MX", { timeZone: TIME_ZONE, ...options }).format(new Date(date));

export const dayNumber = (date) => format(date, { day: "numeric" });
export const monthShort = (date) => format(date, { month: "short" }).replace(".", "").toUpperCase();
export const longDate = (date) => format(date, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
export const timeOf = (date) => format(date, { hour: "numeric", minute: "2-digit" });
export const monthTitle = (month) => format(`${month}-15T12:00:00Z`, { month: "long", year: "numeric" });

/** "jueves 15 de octubre de 2026 · 10:00 a. m. – 2:00 p. m." (o con otra fecha de término). */
export function whenText(startDate, endDate) {
  const start = `${longDate(startDate)} · ${timeOf(startDate)}`;
  if (!endDate) return start;
  return mexicoDay(startDate) === mexicoDay(endDate) ? `${start} – ${timeOf(endDate)}` : `${start} – ${longDate(endDate)} · ${timeOf(endDate)}`;
}

export const categoryLabel = (category) => EVENT_CATEGORIES[category] ?? EVENT_CATEGORIES.especiales;
export const audienceLabel = (audience) => EVENT_AUDIENCES[audience] ?? EVENT_AUDIENCES.publico;

// Color e icono por categoría (colores de la marca).
export const CATEGORY_STYLES = {
  entregas: { Icon: FiPackage, badge: "bg-verde-100 text-verde-800", dot: "bg-verdeLogo" },
  bazares: { Icon: FiShoppingBag, badge: "bg-amarillo-100 text-amarillo-900", dot: "bg-amarilloLogo" },
  campanas: { Icon: FiHeart, badge: "bg-rojo-100 text-rojo-800", dot: "bg-rojoLogo" },
  institucionales: { Icon: FiAward, badge: "bg-gris-100 text-gris-800", dot: "bg-grisLogo" },
  talleres: { Icon: FiBookOpen, badge: "bg-verde-50 text-verde-900", dot: "bg-verde-700" },
  especiales: { Icon: FiStar, badge: "bg-amarillo-50 text-amarillo-900", dot: "bg-amarillo-600" },
};
export const categoryStyle = (category) => CATEGORY_STYLES[category] ?? CATEGORY_STYLES.especiales;

const calendarStamp = (date) => new Date(date).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

/** Enlace "Agregar a Google Calendar" (plantilla pública, sin API). Sin término: dos horas. */
export function googleCalendarUrl(event, pageUrl) {
  const start = new Date(event.startDate);
  const end = event.endDate ? new Date(event.endDate) : new Date(start.getTime() + 2 * 60 * 60 * 1000);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${calendarStamp(start)}/${calendarStamp(end)}`,
    details: [event.summary, pageUrl].filter(Boolean).join("\n\n"),
    location: [event.locationName, event.address].filter(Boolean).join(", "),
    ctz: TIME_ZONE,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

/** WhatsApp para dudas, con el nombre del evento ya escrito. Números de 10 dígitos: México (+52). */
export function whatsappContactUrl(phone, title) {
  const digits = String(phone ?? "").replace(/\D/g, "");
  if (digits.length < 10) return "";
  const number = digits.length === 10 ? `52${digits}` : digits;
  return `https://wa.me/${number}?text=${encodeURIComponent(`Hola, quiero información sobre «${title}».`)}`;
}

/** Compartir el evento por WhatsApp (el visitante elige a quién). */
export const whatsappShareUrl = (title, pageUrl) => `https://wa.me/?text=${encodeURIComponent(`${title} ${pageUrl}`)}`;
