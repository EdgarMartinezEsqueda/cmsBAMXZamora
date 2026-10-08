import useCmsContent from 'utils/useCmsContent.js';
import { SiteContext } from 'utils/useSite.js';
import { useEffect } from 'react';
import { saveLoadingScreen } from 'utils/loadingScreen.js';
import CmsStatus from './CmsStatus';

const isSiteContent = (content) => ['contact', 'social', 'impact', 'seo'].every((key) => content[key] && typeof content[key] === 'object');
const isProgramsContent = (content) => Array.isArray(content.programs);
const isPartnersContent = (content) => Array.isArray(content.partners);
const isNavigationContent = (content) => Array.isArray(content.menu?.links) && Array.isArray(content.footer?.links) && Array.isArray(content.footer?.programs);

/** Datos del sitio, programas, aliados y menú: los usan todas las páginas (encabezado, pie, cifras). */
export default function SiteContentProvider({ children }) {
  const site = useCmsContent('site', isSiteContent);
  const programs = useCmsContent('programs', isProgramsContent);
  const partners = useCmsContent('partners', isPartnersContent);
  const navigation = useCmsContent('navigation', isNavigationContent);
  // La pantalla de carga elegida en el panel se recuerda para la siguiente visita.
  const loadingScreen = site.status === 'ready' ? site.content.loadingScreen : undefined;
  useEffect(() => { if (loadingScreen) saveLoadingScreen(loadingScreen); }, [loadingScreen]);
  // Sin estos datos no hay página que mostrar.
  for (const request of [site, programs, partners, navigation]) {
    if (request.status !== 'ready') return <CmsStatus status={request.status} onRetry={request.retry} />;
  }
  return (
    <SiteContext.Provider value={{ ...site.content, programs: programs.content.programs, partnerLogos: partners.content.partners, navigation: navigation.content }}>
      {children}
    </SiteContext.Provider>
  );
}
