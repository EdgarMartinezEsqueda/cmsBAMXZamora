import { useEffect, useRef, useState } from 'react';
import { CMS_URL, PREVIEW_TOKEN } from './cms.js';

/**
 * Lee un contenido publicado de GET /api/content/:key. Sin fallback silencioso: si el
 * contenido no está publicado o falla la red, lo dice (status) en vez de mostrar datos viejos.
 * `isValid` comprueba la forma mínima de la respuesta antes de pintarla.
 */
export default function useCmsContent(key, isValid, query) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState({ status: 'loading' });
  const validate = useRef(isValid);
  // Parámetros opcionales (p. ej. { year, page }); vacíos se omiten.
  const search = new URLSearchParams(Object.entries({ ...query, preview: PREVIEW_TOKEN }).filter(([, value]) => value !== undefined && value !== null && value !== '')).toString();
  validate.current = isValid;

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    let active = true;
    setState({ status: 'loading' });
    // La clave puede tener segmentos ("pages/mi-pagina"): se codifica cada uno por separado.
    const path = key.split('/').map(encodeURIComponent).join('/');
    fetch(`${CMS_URL}/api/content/${path}${search ? `?${search}` : ''}`, { signal: controller.signal })
      .then(async (response) => {
        if (response.status === 404) return { status: 'unpublished' };
        if (!response.ok) throw new Error('Contenido no disponible');
        const content = await response.json();
        if (!content || typeof content !== 'object' || !validate.current(content)) throw new Error('Contenido inválido');
        return { status: 'ready', content };
      })
      .then((result) => { if (active) setState(result); })
      .catch(() => { if (active) setState({ status: 'error' }); })
      .finally(() => clearTimeout(timeout));
    return () => { active = false; clearTimeout(timeout); controller.abort(); };
  }, [key, search, attempt]);

  return { ...state, retry: () => setAttempt((value) => value + 1) };
}
