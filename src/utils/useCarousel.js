import { useCallback, useEffect, useRef, useState } from 'react';

const TRANSITION_MS = 500;

/**
 * Estado de un carrusel de `total` elementos con avance automático.
 * Devuelve `onKeyDown` para ponerlo en el contenedor (con tabIndex={0}): las flechas del teclado
 * mueven solo el carrusel que tiene el foco, no todos los de la página.
 */
export default function useCarousel(total, { autoplayMs = 5000 } = {}) {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const locked = useRef(false);
  const timer = useRef(null);

  const move = useCallback((getIndex) => {
    if (locked.current || total < 2) return;
    locked.current = true;
    setIsAnimating(true);
    setCurrent((index) => getIndex(index));
    timer.current = setTimeout(() => {
      locked.current = false;
      setIsAnimating(false);
    }, TRANSITION_MS);
  }, [total]);

  const next = useCallback(() => move((index) => (index + 1) % total), [move, total]);
  const prev = useCallback(() => move((index) => (index - 1 + total) % total), [move, total]);
  const goTo = useCallback((target) => move(() => target), [move]);

  useEffect(() => {
    if (!autoplayMs || total < 2) return undefined;
    const interval = setInterval(next, autoplayMs);
    return () => clearInterval(interval);
  }, [next, autoplayMs, total]);

  useEffect(() => () => clearTimeout(timer.current), []);

  // Si cambia el número de elementos (el editor quitó imágenes), no quedar fuera de rango.
  const index = total > 0 ? Math.min(current, total - 1) : 0;

  const onKeyDown = useCallback((event) => {
    if (event.key === 'ArrowLeft') prev();
    if (event.key === 'ArrowRight') next();
  }, [prev, next]);

  return { current: index, isAnimating, next, prev, goTo, onKeyDown };
}
