import Breadcrumb from "components/breadcrumb/Breadcrumb";
import PageContent from "components/cms/PageContent";
import Programs from "components/programs/Programs";

// Los programas vienen de la colección (useSite().programs); aquí solo los textos de la página.
export function PageBody({ content }) {
  return (
    <>
      <Breadcrumb titulo={content.pageTitle} subtitulo={content.pageSubtitle || undefined} />
      <Programs {...content} />
    </>
  );
}

const ProgramsRoute = () => <PageContent contentKey="programsPage" Body={PageBody} />;

export default ProgramsRoute;
