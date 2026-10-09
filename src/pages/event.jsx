import { useState } from "react";
import { FiAlertTriangle, FiArrowLeft, FiCalendar, FiCheck, FiClipboard, FiCopy, FiDollarSign, FiExternalLink, FiMapPin, FiMessageCircle, FiShare2, FiUsers } from "react-icons/fi";
import { Link, useParams } from "react-router";
import { EVENT_COSTS, EVENT_SLUG } from "../../shared/content/events.js";
import Breadcrumb from "components/breadcrumb/Breadcrumb";
import CmsStatus from "components/cms/CmsStatus";
import RichText from "components/cms/RichText";
import EventCard from "components/events/EventCard";
import { audienceLabel, categoryLabel, googleCalendarUrl, isEventList, whatsappContactUrl, whatsappShareUrl, whenText } from "components/events/eventFormat";
import Footer from "components/footer/Footer";
import Gallery from "components/gallery/Gallery";
import Header from "components/header/Header";
import PageName from "components/title/PageName";
import useCmsContent from "utils/useCmsContent";
import useSite from "utils/useSite";
import ErrorPage from "./404";

const isEvent = (content) => typeof content.slug === "string" && typeof content.startDate === "string" && Array.isArray(content.results);
const pageUrlOf = (slug) => (typeof window === "undefined" ? `/eventos/${slug}` : `${window.location.origin}/eventos/${slug}`);

function Fact({ icon: Icon, label, children }) {
  return (
    <div className="flex gap-3">
      <Icon className="mt-1 h-5 w-5 shrink-0 text-verdeLogo" aria-hidden="true" />
      <div>
        <dt className="text-sm font-semibold text-gray-500">{label}</dt>
        <dd className="text-gray-900">{children}</dd>
      </div>
    </div>
  );
}

function Actions({ event, pageUrl }) {
  const { contact } = useSite();
  const [copied, setCopied] = useState(false);
  const open = event.timing !== "realizado" && event.status !== "cancelado";
  const whatsapp = whatsappContactUrl(event.contactPhone || contact.phone, event.title);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* Sin portapapeles: el enlace sigue en la barra de direcciones. */ }
  };
  const button = "flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold transition";
  return (
    <div className="space-y-3">
      {open && event.registrationUrl && (
        <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer" className={`${button} bg-verdeLogo text-white shadow hover:bg-verde-700`}>
          <FiClipboard aria-hidden="true" /> Registrarme <FiExternalLink className="text-sm" aria-hidden="true" />
        </a>
      )}
      {open && (
        <a href={googleCalendarUrl(event, pageUrl)} target="_blank" rel="noopener noreferrer" className={`${button} bg-gray-900 text-white hover:bg-gray-700`}>
          <FiCalendar aria-hidden="true" /> Agregar a Google Calendar
        </a>
      )}
      {whatsapp && (
        <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={`${button} bg-[#25D366] text-gray-900 hover:brightness-95`}>
          <FiMessageCircle aria-hidden="true" /> Preguntar por WhatsApp
        </a>
      )}
      <div className="grid grid-cols-2 gap-3">
        <a href={whatsappShareUrl(event.title, pageUrl)} target="_blank" rel="noopener noreferrer"
          className={`${button} bg-white text-gray-800 ring-1 ring-gray-200 hover:ring-verdeLogo`}>
          <FiShare2 aria-hidden="true" /> Compartir
        </a>
        <button type="button" onClick={copy} className={`${button} bg-white text-gray-800 ring-1 ring-gray-200 hover:ring-verdeLogo`}>
          {copied ? <><FiCheck aria-hidden="true" /> ¡Copiado!</> : <><FiCopy aria-hidden="true" /> Copiar enlace</>}
        </button>
      </div>
    </div>
  );
}

function RelatedEvents({ event }) {
  const related = useCmsContent("events", isEventList, { scope: "proximos", category: event.category, page: undefined });
  const items = related.status === "ready" ? related.content.items.filter((item) => item.slug !== event.slug).slice(0, 3) : [];
  if (items.length === 0) return null;
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16">
      <h2 className="mb-6 text-2xl font-bold text-gray-900">Otras actividades de {categoryLabel(event.category).toLowerCase()}</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{items.map((item) => <EventCard key={item.slug} event={item} />)}</div>
    </section>
  );
}

export function EventBody({ event }) {
  const pageUrl = pageUrlOf(event.slug);
  const done = event.timing === "realizado";
  const alertStyle = event.status === "cancelado" ? "border-rojoLogo bg-rojo-50 text-rojo-900" : "border-amarilloLogo bg-amarillo-50 text-amarillo-900";
  return (
    <>
      <Breadcrumb titulo={event.title} subtitulo={categoryLabel(event.category)} image={event.coverImage ?? undefined} />
      <section className="mx-auto max-w-7xl px-4 py-12">
        <Link to="/eventos" className="mb-8 inline-flex items-center gap-2 font-semibold text-verdeLogo hover:underline">
          <FiArrowLeft aria-hidden="true" /> Todos los eventos
        </Link>

        {event.status !== "programado" && (
          <div role="alert" className={`mb-8 flex gap-3 rounded-2xl border-l-4 p-5 ${alertStyle}`}>
            <FiAlertTriangle className="mt-0.5 h-6 w-6 shrink-0" aria-hidden="true" />
            <div>
              <p className="text-lg font-bold">{event.status === "cancelado" ? "Este evento fue cancelado" : "Este evento se pospuso"}</p>
              {event.statusNote && <p className="mt-1">{event.statusNote}</p>}
            </div>
          </div>
        )}

        <div className="grid gap-10 lg:grid-cols-3">
          <div className="space-y-10 lg:col-span-2">
            {event.summary && <p className="text-xl leading-relaxed text-gray-700">{event.summary}</p>}
            {event.description.length > 0 && <RichText blocks={event.description} />}

            {event.requirements.length > 0 && (
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                <h2 className="mb-4 text-xl font-bold text-gray-900">Requisitos</h2>
                <ul className="space-y-2">
                  {event.requirements.map((item) => (
                    <li key={item} className="flex gap-3 text-gray-700"><FiCheck className="mt-1 shrink-0 text-verdeLogo" aria-hidden="true" /> {item}</li>
                  ))}
                </ul>
              </div>
            )}

            {done && event.results.length > 0 && (
              <div>
                <h2 className="mb-5 text-2xl font-bold text-gray-900">Resultados</h2>
                <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {event.results.map((result) => (
                    <div key={result.label} className="rounded-2xl bg-white p-5 text-center shadow-sm ring-1 ring-gray-100">
                      <dd className="text-3xl font-extrabold text-verdeLogo">{result.value}</dd>
                      <dt className="mt-1 text-sm font-medium text-gray-600">{result.label}</dt>
                    </div>
                  ))}
                </dl>
              </div>
            )}
            {done && event.resultsSummary && <p className="text-lg leading-relaxed text-gray-700">{event.resultsSummary}</p>}
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <dl className="space-y-5 rounded-2xl bg-white p-6 shadow-md ring-1 ring-gray-100">
              <Fact icon={FiCalendar} label="Cuándo"><span className="capitalize">{whenText(event.startDate, event.endDate)}</span></Fact>
              {(event.locationName || event.address) && (
                <Fact icon={FiMapPin} label="Dónde">
                  {event.locationName && <span className="block">{event.locationName}</span>}
                  {event.address && <span className="block text-gray-600">{event.address}</span>}
                  {event.mapsUrl && (
                    <a href={event.mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 font-semibold text-verdeLogo hover:underline">
                      Cómo llegar <FiExternalLink className="text-sm" aria-hidden="true" />
                    </a>
                  )}
                </Fact>
              )}
              <Fact icon={FiUsers} label="Dirigido a">
                {audienceLabel(event.audience)}{event.tags.includes("Cupo limitado") && " · Cupo limitado"}
              </Fact>
              {event.cost && (
                <Fact icon={FiDollarSign} label="Costo">
                  {EVENT_COSTS[event.cost.type]}
                  {event.cost.details && <span className="block text-gray-600">{event.cost.details}</span>}
                </Fact>
              )}
              {event.organizers && <Fact icon={FiUsers} label="Organizan">{event.organizers}</Fact>}
            </dl>
            <Actions event={event} pageUrl={pageUrl} />
          </aside>
        </div>
      </section>

      {done && event.gallery.length > 0 && <Gallery heading={{ eyebrow: "Así se vivió", highlight: "Galería" }} images={event.gallery} />}
      <RelatedEvents event={event} />
    </>
  );
}

function StrapiEvent({ slug }) {
  const { status, content, retry } = useCmsContent(`events/${slug}`, isEvent);
  if (status === "unpublished") {
    return <PageName title="Ha surgido un error" description="Evento no encontrado."><ErrorPage /></PageName>;
  }
  return (
    <main className="bg-gray-50">
      <Header />
      {status === "ready" ? (
        <PageName title={content.title} description={content.summary || categoryLabel(content.category)} image={content.coverImage?.src}>
          <EventBody event={content} />
        </PageName>
      ) : <CmsStatus status={status} onRetry={retry} inline />}
      <Footer />
    </main>
  );
}

/** Detalle de un evento (/eventos/:slug). Slug inválido: 404. */
export default function EventPage() {
  const { slug } = useParams();
  if (!EVENT_SLUG.test(slug ?? "")) return <PageName title="Ha surgido un error" description="Evento no encontrado."><ErrorPage /></PageName>;
  return <StrapiEvent key={slug} slug={slug} />;
}
