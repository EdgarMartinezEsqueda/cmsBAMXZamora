import { readLoadingScreen } from "utils/loadingScreen";

// Pantalla de carga. La animación vive en src/index.css, sección "Pantalla de carga" (clases
// .bamx-loader-*): ahí se ajustan tiempos, colores y movimientos. Aparece con un pequeño
// retraso: si el contenido llega rápido, no se ve ningún parpadeo.
// Imagen y colores se eligen en el panel (Datos del sitio → Pantalla de carga) y se leen de lo
// guardado en este navegador (utils/loadingScreen.js); sin elección, el logo con el pez.
const LOGO = "/assets/images/logo.png";

export default function LoadingScreen({ inline = false }) {
  const { image, barColors } = readLoadingScreen();
  return (
    <div
      role="status"
      aria-live="polite"
      className={`bamx-loader ${inline ? "min-h-[50vh] py-16" : "fixed inset-0 z-[90] bg-white"} flex flex-col items-center justify-center`}
    >
      {image ? (
        // Imagen elegida en el panel: aparece, flota y un brillo la recorre.
        <div className={`bamx-loader-logo bamx-loader-logo--custom ${inline ? "w-56" : "w-72 sm:w-80"}`}>
          <img src={image.src} alt="" className="bamx-loader-image" draggable="false" />
          <span className="bamx-loader-shine" aria-hidden="true"
            style={{ WebkitMaskImage: `url("${image.src}")`, maskImage: `url("${image.src}")` }} />
        </div>
      ) : (
        <div className={`bamx-loader-logo ${inline ? "w-56" : "w-72 sm:w-80"}`}>
          {/* El mismo logo en dos capas: el pez (izquierda) nada y el texto se revela después. */}
          <img src={LOGO} alt="" className="bamx-loader-fish" draggable="false" />
          <img src={LOGO} alt="" className="bamx-loader-text" draggable="false" />
          <span className="bamx-loader-shine" aria-hidden="true" />
          <span className="bamx-loader-bubble" aria-hidden="true" />
          <span className="bamx-loader-bubble bamx-loader-bubble--late" aria-hidden="true" />
        </div>
      )}
      <div className={`bamx-loader-bar bamx-loader-bar--${barColors}`} aria-hidden="true"><span /></div>
      <span className="sr-only">Cargando contenido…</span>
    </div>
  );
}
