import { useState } from "react";
import { FiCalendar, FiX } from "react-icons/fi";
import { useSearchParams } from "react-router";
import { EVENT_CATEGORIES, mexicoDay } from "../../shared/content/events.js";
import Breadcrumb from "components/breadcrumb/Breadcrumb";
import CmsStatus from "components/cms/CmsStatus";
import EventCalendar from "components/events/EventCalendar";
import EventCard from "components/events/EventCard";
import { isEventList, longDate } from "components/events/eventFormat";
import Footer from "components/footer/Footer";
import Header from "components/header/Header";
import useCmsContent from "utils/useCmsContent";
import { eventsView } from "utils/routeContent";

const TABS = [["proximos", "Próximos"], ["realizados", "Realizados"]];

const chipClass = (active) => `rounded-full px-4 py-2 text-sm font-semibold transition ${active ? "bg-verdeLogo text-white shadow" : "bg-white text-gray-700 shadow-sm ring-1 ring-gray-200 hover:ring-verdeLogo"}`;

function Pagination({ content, onPage }) {
  if (content.pageCount <= 1) return null;
  return (
    <nav className="mt-10 flex items-center justify-center gap-4" aria-label="Páginas de eventos">
      <button type="button" disabled={content.page <= 1} onClick={() => onPage(content.page - 1)}
        className="rounded-xl bg-white px-4 py-2 font-semibold shadow disabled:opacity-40">Anterior</button>
      <span className="text-gray-600">Página {content.page} de {content.pageCount}</span>
      <button type="button" disabled={content.page >= content.pageCount} onClick={() => onPage(content.page + 1)}
        className="rounded-xl bg-white px-4 py-2 font-semibold shadow disabled:opacity-40">Siguiente</button>
    </nav>
  );
}

function EmptyState({ scope, onSwitch }) {
  return (
    <div className="rounded-2xl bg-white px-6 py-14 text-center shadow-sm ring-1 ring-gray-100">
      <FiCalendar className="mx-auto mb-4 h-10 w-10 text-verdeLogo" aria-hidden="true" />
      <p className="text-lg text-gray-700">
        {scope === "proximos" ? "Por ahora no hay actividades próximas en esta categoría." : "Aún no hay actividades realizadas en esta categoría."}
      </p>
      <button type="button" onClick={onSwitch} className="mt-4 font-semibold text-verdeLogo hover:underline">
        {scope === "proximos" ? "Ver actividades realizadas" : "Ver próximas actividades"}
      </button>
    </div>
  );
}

/** Lista de eventos: con un día elegido en el calendario, los de ese día; si no, la pestaña. */
function EventList({ view, list, calendar, selectedDay, onClearDay, onScope, onPage }) {
  if (selectedDay) {
    const dayEvents = calendar.status === "ready" ? calendar.content.items.filter((event) => mexicoDay(event.startDate) === selectedDay) : [];
    return (
      <div>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-bold text-gray-900">Actividades del {longDate(`${selectedDay}T18:00:00Z`)}</h2>
          <button type="button" onClick={onClearDay} className="inline-flex items-center gap-1 font-semibold text-verdeLogo hover:underline">
            <FiX aria-hidden="true" /> Ver todas
          </button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">{dayEvents.map((event) => <EventCard key={event.slug} event={event} />)}</div>
      </div>
    );
  }
  if (list.status !== "ready") return <CmsStatus status={list.status} onRetry={list.retry} inline />;
  const items = list.content.items;
  if (items.length === 0) return <EmptyState scope={view.scope} onSwitch={() => onScope(view.scope === "proximos" ? "realizados" : "proximos")} />;
  // El destacado va arriba y a lo ancho, solo en la primera página de próximos.
  const featured = view.scope === "proximos" && list.content.page === 1 ? items.find((event) => event.featured) : null;
  const rest = featured ? items.filter((event) => event !== featured) : items;
  return (
    <div className="space-y-6">
      {featured && <EventCard event={featured} featured />}
      {rest.length > 0 && <div className="grid gap-6 sm:grid-cols-2">{rest.map((event) => <EventCard key={event.slug} event={event} />)}</div>}
      <Pagination content={list.content} onPage={onPage} />
    </div>
  );
}

function EventsPage() {
  const [params, setParams] = useSearchParams();
  const view = eventsView(params.toString());
  const list = useCmsContent("events", isEventList, view.listQuery);
  const calendar = useCmsContent("events", isEventList, view.calendarQuery);
  const [selectedDay, setSelectedDay] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);

  // Cambia la dirección (se puede compartir o volver atrás); vacíos y valores por defecto se omiten.
  const update = (changes) => {
    const next = { ver: view.scope, categoria: view.category, pagina: view.page, mes: params.get("mes") ?? undefined, ...changes };
    setParams(Object.fromEntries(Object.entries(next).filter(([key, value]) => value && !(key === "ver" && value === "proximos"))));
  };

  return (
    <main className="bg-gray-50">
      <Header />
      <Breadcrumb titulo="Eventos y actividades" subtitulo="Conoce nuestras próximas actividades y participa" />
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8 flex flex-col gap-5">
          <div className="inline-flex w-fit rounded-2xl bg-white p-1 shadow-sm ring-1 ring-gray-200" role="tablist" aria-label="Mostrar">
            {TABS.map(([value, label]) => (
              <button key={value} type="button" role="tab" aria-selected={view.scope === value}
                onClick={() => { setSelectedDay(null); update({ ver: value, pagina: undefined }); }}
                className={`rounded-xl px-6 py-2.5 font-semibold transition ${view.scope === value ? "bg-verdeLogo text-white shadow" : "text-gray-600 hover:text-gray-900"}`}>
                {label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoría">
            <button type="button" className={chipClass(!view.category)} aria-pressed={!view.category}
              onClick={() => { setSelectedDay(null); update({ categoria: undefined, pagina: undefined }); }}>Todas</button>
            {Object.entries(EVENT_CATEGORIES).map(([value, label]) => (
              <button key={value} type="button" className={chipClass(view.category === value)} aria-pressed={view.category === value}
                onClick={() => { setSelectedDay(null); update({ categoria: value, pagina: undefined }); }}>{label}</button>
            ))}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <EventList view={view} list={list} calendar={calendar} selectedDay={selectedDay}
              onClearDay={() => setSelectedDay(null)}
              onScope={(scope) => update({ ver: scope, pagina: undefined })}
              onPage={(page) => { update({ pagina: page > 1 ? String(page) : undefined }); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            {/* En el teléfono el calendario va plegado: lo principal son las tarjetas. */}
            <button type="button" onClick={() => setShowCalendar((value) => !value)} aria-expanded={showCalendar}
              className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 font-semibold text-gray-800 shadow-sm ring-1 ring-gray-200 lg:hidden">
              <FiCalendar aria-hidden="true" /> {showCalendar ? "Ocultar calendario" : "Ver calendario"}
            </button>
            <div className={`${showCalendar ? "block" : "hidden"} lg:block`}>
              {calendar.status === "error"
                ? <p className="rounded-2xl bg-white p-5 text-gray-600 shadow-sm">No se pudo cargar el calendario.</p>
                : <EventCalendar month={view.month} events={calendar.status === "ready" ? calendar.content.items : []}
                    loading={calendar.status === "loading"} selectedDay={selectedDay}
                    onSelectDay={setSelectedDay}
                    onChangeMonth={(month) => { setSelectedDay(null); update({ mes: month }); }} />}
            </div>
          </aside>
        </div>
      </section>
      <Footer />
    </main>
  );
}

/** Eventos y actividades (/eventos). */
export default EventsPage;
