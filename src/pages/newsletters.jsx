import { FiCalendar, FiDownload, FiFileText } from "react-icons/fi";
import { Link, useSearchParams } from "react-router";
import Breadcrumb from "components/breadcrumb/Breadcrumb";
import CmsStatus from "components/cms/CmsStatus";
import Footer from "components/footer/Footer";
import Header from "components/header/Header";
import useCmsContent from "utils/useCmsContent";

const isList = (content) => Array.isArray(content.items) && Array.isArray(content.years);
const monthYear = (period) => period
  ? new Date(`${period}T12:00:00`).toLocaleDateString("es-MX", { month: "long", year: "numeric" })
  : "";

export function PageBody({ content, onYear, onPage }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      {content.years.length > 1 && (
        <div className="mb-8 flex flex-wrap items-center gap-2" role="group" aria-label="Filtrar por año">
          <button type="button" onClick={() => onYear(null)}
            className={`rounded-full px-4 py-2 font-semibold ${content.year === null ? "bg-verdeLogo text-white" : "bg-white text-gray-700 shadow"}`}>
            Todos
          </button>
          {content.years.map((year) => (
            <button key={year} type="button" onClick={() => onYear(year)}
              className={`rounded-full px-4 py-2 font-semibold ${content.year === year ? "bg-verdeLogo text-white" : "bg-white text-gray-700 shadow"}`}>
              {year}
            </button>
          ))}
        </div>
      )}

      {content.items.length === 0 ? (
        <p className="py-16 text-center text-lg text-gray-600">Aún no hay boletines publicados.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {content.items.map((item) => (
            <article key={item.slug} className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-lg">
              {item.cover
                ? <img src={item.cover.src} alt={item.cover.alt} className="h-48 w-full object-cover" loading="lazy" />
                : <div className="flex h-48 items-center justify-center bg-verdeLogo/10"><FiFileText className="h-12 w-12 text-verdeLogo" /></div>}
              <div className="flex flex-1 flex-col gap-3 p-6">
                <p className="flex items-center gap-2 text-sm capitalize text-gray-500">
                  <FiCalendar /> {monthYear(item.period)}{item.edition && ` · ${item.edition}`}
                </p>
                <h2 className="text-xl font-bold text-gray-800">{item.title}</h2>
                {item.summary && <p className="text-gray-600">{item.summary}</p>}
                <div className="mt-auto flex gap-3 pt-2">
                  <Link to={`/boletines/${item.slug}`} className="rounded-xl bg-verdeLogo px-4 py-2 font-semibold text-white hover:bg-green-700">Leer</Link>
                  {item.pdfUrl && (
                    <a href={item.pdfUrl} target="_blank" rel="noopener noreferrer" download
                      className="flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50">
                      <FiDownload /> PDF
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {content.pageCount > 1 && (
        <nav className="mt-10 flex items-center justify-center gap-4" aria-label="Páginas de boletines">
          <button type="button" disabled={content.page <= 1} onClick={() => onPage(content.page - 1)}
            className="rounded-xl bg-white px-4 py-2 font-semibold shadow disabled:opacity-40">Anterior</button>
          <span className="text-gray-600">Página {content.page} de {content.pageCount}</span>
          <button type="button" disabled={content.page >= content.pageCount} onClick={() => onPage(content.page + 1)}
            className="rounded-xl bg-white px-4 py-2 font-semibold shadow disabled:opacity-40">Siguiente</button>
        </nav>
      )}
    </section>
  );
}

function StrapiNewsletters() {
  const [params, setParams] = useSearchParams();
  const query = { year: params.get("year") ?? undefined, page: params.get("page") ?? undefined };
  const { status, content, retry } = useCmsContent("newsletters", isList, query);
  const setQuery = (next) => setParams(Object.fromEntries(Object.entries(next).filter(([, value]) => value)));
  return (
    <main className="bg-gray-50">
      <Header />
      <Breadcrumb titulo="Boletines" subtitulo="Noticias, historias e impacto de cada mes" />
      {status === "ready"
        ? <PageBody content={content} onYear={(year) => setQuery({ year })} onPage={(page) => setQuery({ year: query.year, page })} />
        : <CmsStatus status={status} onRetry={retry} inline />}
      <Footer />
    </main>
  );
}

/** Listado de boletines (/boletines). */
export default StrapiNewsletters;
