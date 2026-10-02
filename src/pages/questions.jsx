import Breadcrumb from "components/breadcrumb/Breadcrumb";
import PageContent from "components/cms/PageContent";
import FAQs from "components/faqs/FAQS";

export function PageBody({ content }) {
  return (
    <>
      <Breadcrumb titulo={content.pageTitle} subtitulo={content.pageSubtitle || undefined} />
      <FAQs {...content} />
    </>
  );
}

const QuestionsPage = () => <PageContent contentKey="faq" Body={PageBody} />;

export default QuestionsPage;
