import Breadcrumb from "components/breadcrumb/Breadcrumb";
import PageContent from "components/cms/PageContent";
import ContactUs from "components/contact/ContactUs";

export function PageBody({ content }) {
  return (
    <>
      <Breadcrumb titulo={content.pageTitle} subtitulo={content.pageSubtitle || undefined} />
      <ContactUs {...content} />
    </>
  );
}

const ContactRoute = () => <PageContent contentKey="contactPage" Body={PageBody} />;

export default ContactRoute;
