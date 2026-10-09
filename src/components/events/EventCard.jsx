import { FiArrowRight, FiClock, FiMapPin } from "react-icons/fi";
import { categoryLabel, categoryStyle, dayNumber, monthShort, timeOf } from "./eventFormat";

const STATUS_BANNER = { cancelado: "Cancelado", pospuesto: "Pospuesto" };

// Tarjeta de un evento (listado de /eventos y bloque "Próximos eventos"). En un evento ya
// realizado, en lugar de la hora destaca su primera cifra de resultados.
export default function EventCard({ event, featured = false }) {
  const { Icon, badge } = categoryStyle(event.category);
  const banner = STATUS_BANNER[event.status];
  const done = event.timing === "realizado";
  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-gray-100 transition hover:-translate-y-0.5 hover:shadow-xl ${featured ? "md:flex-row" : ""}`}
    >
      <div className={`relative overflow-hidden bg-gray-100 ${featured ? "h-56 md:h-auto md:w-1/2" : "h-44"}`}>
        {event.coverImage
          ? <img src={event.coverImage.src} alt="" loading="lazy" className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${banner || done ? "grayscale-[35%]" : ""}`} />
          : <div className={`flex h-full w-full items-center justify-center ${badge}`}><Icon className="h-14 w-14 opacity-60" aria-hidden="true" /></div>}
        {/* Fecha grande sobre la imagen */}
        <div className="absolute left-4 top-4 flex w-16 flex-col items-center rounded-xl bg-white/95 py-2 shadow-lg">
          <span className="text-2xl font-extrabold leading-none text-gray-900">{dayNumber(event.startDate)}</span>
          <span className="mt-1 text-xs font-bold tracking-wider text-verdeLogo">{monthShort(event.startDate)}</span>
        </div>
        {banner && (
          <div className={`absolute inset-x-0 bottom-0 py-1.5 text-center text-sm font-bold uppercase tracking-wider text-white ${event.status === "cancelado" ? "bg-rojoLogo" : "bg-amarillo-600"}`}>
            {banner}
          </div>
        )}
        {featured && !banner && (
          <span className="absolute right-4 top-4 rounded-full bg-amarilloLogo px-3 py-1 text-xs font-bold uppercase tracking-wider text-gray-900 shadow">Destacado</span>
        )}
      </div>

      <div className={`flex flex-1 flex-col gap-3 p-5 ${featured ? "md:p-8" : ""}`}>
        <span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${badge}`}>
          <Icon aria-hidden="true" /> {categoryLabel(event.category)}
        </span>
        <h3 className={`font-bold leading-snug text-gray-900 ${featured ? "text-2xl md:text-3xl" : "text-xl"}`}>{event.title}</h3>
        {event.summary && <p className={`text-gray-600 ${featured ? "" : "line-clamp-2"}`}>{event.summary}</p>}

        {done && event.highlight ? (
          <p className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-verdeLogo">{event.highlight.value}</span>
            <span className="font-medium text-gray-600">{event.highlight.label}</span>
          </p>
        ) : (
          <ul className="space-y-1 text-sm text-gray-600">
            <li className="flex items-center gap-2"><FiClock className="shrink-0 text-verdeLogo" aria-hidden="true" /> {timeOf(event.startDate)}</li>
            {event.locationName && <li className="flex items-center gap-2"><FiMapPin className="shrink-0 text-verdeLogo" aria-hidden="true" /> {event.locationName}</li>}
          </ul>
        )}

        {event.tags.length > 0 && (
          <ul className="flex flex-wrap gap-2" aria-label="Etiquetas">
            {event.tags.map((tag) => <li key={tag} className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">{tag}</li>)}
          </ul>
        )}

        <a href={`/eventos/${event.slug}`} className="mt-auto inline-flex items-center gap-2 pt-2 font-semibold text-verdeLogo after:absolute after:inset-0 hover:text-verde-700">
          {done ? "Ver resultados" : "Ver detalles"} <FiArrowRight className="transition group-hover:translate-x-1" aria-hidden="true" />
          <span className="sr-only">: {event.title}</span>
        </a>
      </div>
    </article>
  );
}
