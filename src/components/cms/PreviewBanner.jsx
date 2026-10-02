import { PREVIEW_TOKEN } from "utils/cms";

// Aviso fijo cuando la página se abre desde el botón "Vista previa" del panel.
export default function PreviewBanner() {
  if (!PREVIEW_TOKEN) return null;
  return (
    <div role="status" className="fixed inset-x-0 bottom-0 z-[100] bg-amarillo-300 px-4 py-2 text-center text-sm font-semibold text-gris-900 shadow-lg">
      Vista previa: estás viendo un borrador que aún no está publicado. Si no carga, ábrela de nuevo desde el panel.
    </div>
  );
}
