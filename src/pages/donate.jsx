import Breadcrumb from "components/breadcrumb/Breadcrumb";
import CmsStatus from "components/cms/CmsStatus";
import PageContent from "components/cms/PageContent";
import DonatePage from "components/donate/Donate";
import useCmsContent from "utils/useCmsContent";

const isBank = (content) => ["bankName", "clabe", "accountNumber"].every((key) => typeof content[key] === "string");

// Textos (Página Donar, la edita el editor) + datos bancarios (solo administrador).
export function PageBody({ content, bank }) {
  return (
    <>
      <Breadcrumb titulo={content.pageTitle} subtitulo={content.pageSubtitle || undefined} />
      <DonatePage {...content} bank={bank} />
    </>
  );
}

function StrapiBankBody({ content }) {
  const { status, content: bank, retry } = useCmsContent("bank", isBank);
  if (status !== "ready") return <CmsStatus status={status} onRetry={retry} inline />;
  return <PageBody content={content} bank={bank} />;
}

const DonateRoute = () => <PageContent contentKey="donate" Body={StrapiBankBody} />;

export default DonateRoute;
