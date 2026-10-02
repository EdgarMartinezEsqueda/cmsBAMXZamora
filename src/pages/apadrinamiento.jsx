import Breadcrumb from "components/breadcrumb/Breadcrumb";
import CmsStatus from "components/cms/CmsStatus";
import PageContent from "components/cms/PageContent";
import ApadrinamientoSection from "components/media/Apadrinamiento";
import CatalogoApadrinados from "components/media/CatalogoApadrinados";
import useCmsContent from "utils/useCmsContent";

const isCases = (content) => Array.isArray(content.cases);

// Textos (Página Apadrinamiento) + casos del catálogo (colección con consentimiento y vigencia).
export function PageBody({ content, cases }) {
  return (
    <>
      <Breadcrumb titulo={content.pageTitle} subtitulo={content.pageSubtitle || undefined} />
      <ApadrinamientoSection {...content} />
      <CatalogoApadrinados heading={content.catalogHeading} cases={cases} ctaTitle={content.catalogCtaTitle}
        ctaText={content.catalogCtaText} link={content.catalogLink} />
    </>
  );
}

function StrapiCasesBody({ content }) {
  const { status, content: catalog, retry } = useCmsContent("sponsoredCases", isCases);
  if (status !== "ready") return <CmsStatus status={status} onRetry={retry} inline />;
  return <PageBody content={content} cases={catalog.cases} />;
}

const Apadrinamiento = () => <PageContent contentKey="sponsorship" Body={StrapiCasesBody} />;

export default Apadrinamiento;
