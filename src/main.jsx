import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.jsx"
import { prefetchPath } from "utils/routeContent"

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Pide a la vez los datos globales y los de la página de entrada, antes de que React arranque.
prefetchPath(window.location.pathname, window.location.search, { globals: true });

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
