import { FiArrowRight } from "react-icons/fi";
import EventCard from "components/events/EventCard";
import { isEventList } from "components/events/eventFormat";
import useCmsContent from "utils/useCmsContent";

// Bloque "Próximos eventos" de las Páginas nuevas: los tres siguientes. Sin próximos, no se pinta.
// La consulta es la misma que la de /eventos sin filtros, así se comparte la petición.
export default function EventsBlock() {
  const { status, content } = useCmsContent("events", isEventList, { scope: "proximos", category: undefined, page: undefined });
  const items = status === "ready" ? content.items.slice(0, 3) : [];
  if (items.length === 0) return null;
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-edu-hand text-xl font-semibold text-verdeLogo">Participa con nosotros</p>
          <h2 className="text-3xl font-bold text-gray-900">Próximos eventos</h2>
        </div>
        <a href="/eventos" className="inline-flex items-center gap-2 font-semibold text-verdeLogo hover:underline">
          Ver todos <FiArrowRight aria-hidden="true" />
        </a>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{items.map((event) => <EventCard key={event.slug} event={event} />)}</div>
    </section>
  );
}
