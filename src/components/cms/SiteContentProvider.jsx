import useCmsContent from 'utils/useCmsContent.js';
import { SiteContext } from 'utils/useSite.js';
import CmsStatus from './CmsStatus';

const isSiteContent = (content) => ['contact', 'social', 'impact', 'seo'].every((key) => content[key] && typeof content[key] === 'object');
const isProgramsContent = (content) => Array.isArray(content.programs);

/** Datos del sitio y programas: los usan todas las páginas (encabezado, pie, cifras). */
export default function SiteContentProvider({ children }) {
  const site = useCmsContent('site', isSiteContent);
  const programs = useCmsContent('programs', isProgramsContent);
  // Sin estos datos no hay página que mostrar.
  for (const request of [site, programs]) {
    if (request.status !== 'ready') return <CmsStatus status={request.status} onRetry={request.retry} />;
  }
  return (
    <SiteContext.Provider value={{ ...site.content, programs: programs.content.programs }}>
      {children}
    </SiteContext.Provider>
  );
}
