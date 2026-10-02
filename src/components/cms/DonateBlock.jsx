import DonatePage from "components/donate/Donate";
import useCmsContent from "utils/useCmsContent";
import CmsStatus from "./CmsStatus";

const isDonate = (content) => typeof content.pageTitle === "string";
const isBank = (content) => ["bankName", "clabe", "accountNumber"].every((key) => typeof content[key] === "string");

// Lo mismo que la página Donar: textos de "Página: Donar" y datos bancarios (solo administrador).
export default function DonateBlock() {
  const donate = useCmsContent("donate", isDonate);
  const bank = useCmsContent("bank", isBank);
  for (const request of [donate, bank]) {
    if (request.status !== "ready") return <CmsStatus status={request.status} onRetry={request.retry} inline />;
  }
  return <DonatePage {...donate.content} bank={bank.content} />;
}
