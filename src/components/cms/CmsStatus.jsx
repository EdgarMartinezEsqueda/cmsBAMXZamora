import LoadingScreen from './LoadingScreen';

const MESSAGES = {
  loading: 'Cargando contenido…',
  unpublished: 'Esta página no está disponible por ahora.',
  error: 'No pudimos cargar la página. Intenta de nuevo.',
};

/**
 * Estado de un contenido que espera a Strapi: cargando, no publicado o error.
 * `inline` lo pinta como sección dentro de una página que ya tiene encabezado y pie.
 */
export default function CmsStatus({ status, onRetry, inline = false }) {
  if (status === 'loading') return <LoadingScreen inline={inline} />;
  const Tag = inline ? 'section' : 'main';
  return (
    <Tag className={`${inline ? 'min-h-[40vh] py-16' : 'min-h-screen'} flex flex-col items-center justify-center gap-6 px-6 text-center`}>
      <p role={status === 'error' ? 'alert' : 'status'}>{MESSAGES[status] ?? MESSAGES.error}</p>
      {status !== 'loading' && (
        <button type="button" className="rounded-lg bg-green-700 px-6 py-3 text-white" onClick={onRetry}>
          Reintentar
        </button>
      )}
    </Tag>
  );
}
