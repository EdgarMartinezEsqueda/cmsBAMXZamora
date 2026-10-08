import { useEffect, useRef, useState } from 'react';
import { contentUrl, forgetContent, peekContent, requestContent } from './cmsStore.js';

const check = (result, isValid) => (result.status === 'ready' && !isValid(result.content) ? { status: 'error' } : result);

/**
 * Lee un contenido publicado de GET /api/content/:key. Sin fallback silencioso: si el
 * contenido no está publicado o falla la red, lo dice (status) en vez de mostrar datos viejos.
 * `isValid` comprueba la forma mínima de la respuesta antes de pintarla. Si el contenido ya se
 * pidió en esta visita (precarga o página anterior), se pinta sin pasar por "cargando".
 */
export default function useCmsContent(key, isValid, query) {
  const url = contentUrl(key, query);
  const validate = useRef(isValid);
  validate.current = isValid;
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState(() => {
    const cached = peekContent(url);
    return cached ? { url, ...check(cached, isValid) } : { url, status: 'loading' };
  });

  useEffect(() => {
    let active = true;
    const cached = peekContent(url);
    if (cached) setState({ url, ...check(cached, validate.current) });
    else {
      setState({ url, status: 'loading' });
      requestContent(url).then((result) => { if (active) setState({ url, ...check(result, validate.current) }); });
    }
    return () => { active = false; };
  }, [url, attempt]);

  // Mientras llega una dirección nueva (otra página, otro filtro), no se pinta la anterior.
  const current = state.url === url ? state : { status: 'loading' };
  const { url: _url, ...result } = current;
  return { ...result, retry: () => { forgetContent(url); setAttempt((value) => value + 1); } };
}
