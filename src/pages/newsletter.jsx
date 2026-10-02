import { FiArrowLeft, FiDownload, FiExternalLink } from "react-icons/fi";
import { Link, useParams } from "react-router";
import Breadcrumb from "components/breadcrumb/Breadcrumb";
import CmsStatus from "components/cms/CmsStatus";
import Footer from "components/footer/Footer";
import Header from "components/header/Header";
import PageName from "components/title/PageName";
import { NEWSLETTER_SLUG } from "../../shared/content/newsletter.js";
import useCmsContent from "utils/useCmsContent";
import ErrorPage from "./404";

const isNewsletter = (content) => typeof content.slug === "string" && typeof content.pdf?.url === "string";

export function PageBody({ content }) {
  const sizeMb = content.pdf.sizeKb ? ` (${(content.pdf.sizeKb / 1024).toFixed(1)} MB)` : "";
  return (
    <>
      <Breadcrumb titulo={content.title} subtitulo={content.edition || undefined} />
      <section className="mx-auto max-w-5xl px-4 py-10">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Link to="/boletines" className="flex items-center gap-2 font-semibold text-verdeLogo hover:underline"><FiArrowLeft /> Todos los boletines</Link>
          <span className="flex-1" />
          <a href={content.pdf.url} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl bg-verdeLogo px-4 py-2 font-semibold text-white hover:bg-green-700">
            <FiExternalLink /> Abrir
          </a>
          <a href={content.pdf.url} download target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50">
            <FiDownload /> Descargar{sizeMb}
          </a>
        </div>
        {content.summary && <p className="mb-6 text-lg text-gray-700">{content.summary}</p>}
        {/* Visor nativo del navegador. En móviles que no lo soportan se muestran los enlaces. */}
        <object data={content.pdf.url} type="application/pdf" className="h-[80vh] w-full rounded-2xl bg-white shadow-lg" aria-label={content.title}>
          <p className="p-6 text-gray-700">
            Tu navegador no puede mostrar el PDF aquí. <a href={content.pdf.url} className="font-semibold text-verdeLogo underline">Ábrelo o descárgalo</a>.
          </p>
        </object>
      </section>
    </>
  );
}

function StrapiNewsletter({ slug }) {
  const { status, content, retry } = useCmsContent(`newsletters/${slug}`, isNewsletter);
  if (status === "unpublished") return <ErrorPage />;
  return (
    <main className="bg-gray-50">
      <Header />
      {status === "ready"
        ? <PageName title={content.title} description={content.summary || "Boletín del Banco de Alimentos de Zamora."}><PageBody content={content} /></PageName>
        : <CmsStatus status={status} onRetry={retry} inline />}
      <Footer />
    </main>
  );
}

/** Un boletín (/boletines/:slug) con visor de PDF. */
export default function NewsletterPage() {
  const { slug } = useParams();
  if (!NEWSLETTER_SLUG.test(slug ?? "")) return <ErrorPage />;
  return <StrapiNewsletter key={slug} slug={slug} />;
}
