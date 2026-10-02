import useCmsContent from "utils/useCmsContent";
import NewsletterSection from "./Newsletter";

const isList = (content) => Array.isArray(content.items);

/** Sección de boletín de Inicio con el boletín más reciente de la colección Boletines. */
export default function LatestNewsletter(props) {
  const { status, content } = useCmsContent("newsletters", isList);
  const item = status === "ready" ? content.items[0] : null;
  // Mientras carga o si no hay boletines, la sección se muestra sin botones (no bloquea Inicio).
  const latest = item ? {
    title: item.title,
    viewUrl: `/boletines/${item.slug}`,
    downloadUrl: item.pdfUrl,
    shareUrl: `${window.location.origin}/boletines/${item.slug}`,
  } : null;
  return <NewsletterSection {...props} latest={latest} archiveUrl={item ? "/boletines" : null} />;
}
