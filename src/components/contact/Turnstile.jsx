import { useEffect, useRef, useState } from 'react';

let scriptPromise;
function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      const timer = setTimeout(() => fail(), 15000);
      function fail() {
        clearTimeout(timer);
        script.remove();
        scriptPromise = null;
        reject(new Error('No se pudo cargar la verificación.'));
      }
      script.onerror = fail;
      script.onload = () => {
        clearTimeout(timer);
        if (window.turnstile) resolve(window.turnstile); else fail();
      };
      document.head.appendChild(script);
    });
  }
  return scriptPromise;
}

export default function Turnstile({ siteKey, onToken, resetKey }) {
  const container = useRef(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    let widget;
    let api;
    onToken('');
    setFailed(false);
    loadTurnstile().then((loaded) => {
      if (!active) return;
      api = loaded;
      widget = api.render(container.current, {
        sitekey: siteKey, action: 'contact', language: 'es',
        callback: (token) => { if (active) onToken(token); },
        'expired-callback': () => { if (active) onToken(''); },
        'error-callback': () => { if (active) { onToken(''); setFailed(true); } },
      });
    }).catch(() => { if (active) setFailed(true); });
    return () => { active = false; if (widget !== undefined) api.remove(widget); };
  }, [siteKey, onToken, resetKey]);
  return <div><div ref={container} />{failed && <p role="alert" className="text-sm text-red-700">No se pudo cargar la verificación. Recarga la página para volver a intentarlo.</p>}</div>;
}
