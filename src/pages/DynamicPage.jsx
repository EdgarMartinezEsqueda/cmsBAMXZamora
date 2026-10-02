import { useParams } from "react-router";
import Breadcrumb from "components/breadcrumb/Breadcrumb";
import CmsStatus from "components/cms/CmsStatus";
import PageBlocks from "components/cms/PageBlocks";
import Footer from "components/footer/Footer";
import Header from "components/header/Header";
import PageName from "components/title/PageName";
import { PAGE_SLUG, RESERVED_SLUGS } from "../../shared/content/page.js";
import useCmsContent from "utils/useCmsContent";
import ErrorPage from "./404";

const isPage = (content) => typeof content.pageTitle === "string" && Array.isArray(content.blocks);

export function PageBody({ content }) {
  return (
    <>
      <Breadcrumb titulo={content.pageTitle} subtitulo={content.pageSubtitle || undefined} />
      <PageBlocks blocks={content.blocks} />
    </>
  );
}

function NotFound() {
  return (
    <PageName title="Ha surgido un error" description="Página no encontrada. Vuelve al inicio del Banco de Alimentos de Zamora.">
      <ErrorPage />
    </PageName>
  );
}

function StrapiPage({ slug }) {
  const { status, content, retry } = useCmsContent(`pages/${slug}`, isPage);
  if (status === "unpublished") return <NotFound />;
  return (
    <main className="bg-gray-50">
      <Header />
      {status === "ready" ? (
        <PageName title={content.seo.title} description={content.seo.description}>
          <PageBody content={content} />
        </PageName>
      ) : <CmsStatus status={status} onRetry={retry} inline />}
      <Footer />
    </main>
  );
}

/** Página creada desde el panel en /:slug. Slug inválido o reservado: 404. */
export default function DynamicPage() {
  const { slug } = useParams();
  if (!PAGE_SLUG.test(slug ?? "") || RESERVED_SLUGS.includes(slug)) return <NotFound />;
  return <StrapiPage key={slug} slug={slug} />;
}
