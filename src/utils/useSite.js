import { createContext, useContext } from 'react';

export const SiteContext = createContext(null);

/** Datos globales del sitio: { contact, social, impact, seo, callToAction, partners, programs, partnerLogos, navigation }. */
export default function useSite() {
  const site = useContext(SiteContext);
  if (!site) throw new Error('useSite requiere <SiteContentProvider>');
  return site;
}
