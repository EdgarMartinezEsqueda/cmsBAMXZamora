import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { prefetchPath } from "utils/routeContent";

// Los enlaces internos del sitio (menú, pie, botones, textos del CMS) son <a href> normales. Aquí
// se cambian de página sin recargar: los datos globales ya están y la página nueva se pinta en
// cuanto llega su contenido (o al instante si ya se visitó). Al pasar el cursor se adelanta la
// petición. Se dejan al navegador: otra pestaña, descargas, archivos, el panel y otros dominios.
const NOT_ROUTES = /^\/(uploads|api|gestion-bamx|assets)(\/|$)|\.[a-z0-9]{2,4}$/i;

function internalLink(event) {
  const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null;
  if (!anchor || anchor.hasAttribute("download")) return null;
  if (anchor.target && anchor.target !== "_self") return null;
  const url = new URL(anchor.href, window.location.href);
  if (url.origin !== window.location.origin || NOT_ROUTES.test(url.pathname)) return null;
  return url;
}

export default function SiteNavigation() {
  const navigate = useNavigate();
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const onClick = (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const url = internalLink(event);
      if (!url) return;
      event.preventDefault();
      navigate(`${url.pathname}${url.search}${url.hash}`);
    };
    const onIntent = (event) => {
      const url = internalLink(event);
      if (url) prefetchPath(url.pathname, url.search);
    };
    document.addEventListener("click", onClick);
    document.addEventListener("mouseover", onIntent, { passive: true });
    document.addEventListener("touchstart", onIntent, { passive: true });
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("mouseover", onIntent);
      document.removeEventListener("touchstart", onIntent);
    };
  }, [navigate]);

  // Página nueva: arriba del todo (como al recargar). Con #ancla, cada página la maneja
  // (Programas) o el navegador la busca cuando el contenido ya está pintado.
  useEffect(() => {
    if (hash) {
      const timer = setTimeout(() => document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({ behavior: "smooth" }), 400);
      return () => clearTimeout(timer);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
