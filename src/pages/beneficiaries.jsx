import Breadcrumb from "components/breadcrumb/Breadcrumb";
import PageContent from "components/cms/PageContent";
import Gallery from "components/gallery/Gallery";
import BeneficiariesSection from "components/media/Beneficiaries";

export function PageBody({ content }) {
  return (
    <>
      <Breadcrumb titulo={content.pageTitle} subtitulo={content.pageSubtitle || undefined} />
      <BeneficiariesSection {...content} />
      {content.gallery.length > 0 && <Gallery heading={content.galleryHeading} images={content.gallery} />}
    </>
  );
}

const BeneficiariesPage = () => <PageContent contentKey="beneficiaries" Body={PageBody} />;

export default BeneficiariesPage;
