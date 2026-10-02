import Footer from 'components/footer/Footer';
import Header from 'components/header/Header';
import useCmsContent from 'utils/useCmsContent.js';
import CmsStatus from './CmsStatus';

const isPageContent = (content) => typeof content.pageTitle === 'string';

/**
 * Página con contenido del CMS: encabezado y pie fijos, y el cuerpo con el contenido publicado
 * de `contentKey`. Sin fallback: si Strapi falla o la página no está publicada, se dice.
 */
export default function PageContent({ contentKey, Body }) {
  const { status, content, retry } = useCmsContent(contentKey, isPageContent);
  return (
    <main className="bg-gray-50">
      <Header />
      {status === 'ready' ? <Body content={content} /> : <CmsStatus status={status} onRetry={retry} inline />}
      <Footer />
    </main>
  );
}
