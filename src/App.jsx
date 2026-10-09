import { Route, BrowserRouter as Router, Routes } from "react-router";

import PreviewBanner from "components/cms/PreviewBanner";
import SiteNavigation from "components/cms/SiteNavigation";
import SiteContentProvider from "components/cms/SiteContentProvider";
import PageName from "components/title/PageName";
import ErrorPage from "pages/404";
import AboutUs from "pages/about";
import Apadrinamiento from "pages/apadrinamiento";
import Beneficiaries from "pages/beneficiaries";
import Contact from "pages/contact";
import Donate from "pages/donate";
import DynamicPage from "pages/DynamicPage";
import NewsletterPage from "pages/newsletter";
import NewslettersPage from "pages/newsletters";
import EventPage from "pages/event";
import EventsPage from "pages/events";
import HomePage from "pages/HomeRoute";
import Programs from "pages/programs";
import FAQs from "pages/questions";
import useSite from "utils/useSite";

// El título y la descripción salen de "Datos del sitio"; los de la ruta solo cubren una
// página sin entrada de SEO en el CMS (y la 404, que no es editable).
function RoutePage({ route }) {
  const { seo } = useSite();
  // Las páginas creadas desde el panel ponen su propio título al cargar su contenido.
  if (route.dynamic) return route.element;
  const meta = (route.page && seo[route.page]) || route;
  return <PageName title={meta.title} description={meta.description}>{route.element}</PageName>;
}

function App() {

  const routes = [
    { path: "/", page: "inicio", element: <HomePage />, title: "Inicio", description: "Banco de Alimentos de Zamora - Combatiendo el hambre con solidaridad y esperanza." },
    { path: "/programas", page: "programas", element: <Programs />,  title: "Nuestros programas", description: "Descubre las iniciativas del BAMX Zamora que apoyan a miles de familias en Michoacán." },
    { path: "/contacto", page: "contacto", element: <Contact />,  title: "Contáctanos", description: "Comunícate con el BAMX Zamora. Estamos aquí para ayudarte y resolver tus dudas." },
    { path: "/nosotros", page: "nosotros", element: <AboutUs />,  title: "Nosotros", description: "Conoce la misión, visión e historia del Banco de Alimentos de Zamora." },
    { path: "/donar", page: "donar", element: <Donate />,  title: "Dona ahora", description: "Haz tu donación y ayuda a llevar alimentos a quienes más lo necesitan en Zamora y Michoacán." },
    { path: "/preguntas", page: "preguntas", element: <FAQs />,  title: "Preguntas frecuentes", description: "Resuelve tus dudas más comunes sobre el Banco de Alimentos de Zamora." },
    { path: "/beneficiarios", page: "beneficiarios", element: <Beneficiaries />,  title: "Sé parte de nuestro padrón", description: "Infórmate sobre cómo registrarte como beneficiario del BAMX Zamora." },
    { path: "/apadrinamiento", page: "apadrinamiento", element: <Apadrinamiento />,  title: "Por menos hambre y más sonrisas", description: "Con el programa de apadrinamiento puedes cambiar vidas con tu apoyo mensual." },
    { path: "/boletines", element: <NewslettersPage />, title: "Boletines", description: "Boletines mensuales del Banco de Alimentos de Zamora: logros, historias e impacto." },
    { path: "/boletines/:slug", dynamic: true, element: <NewsletterPage /> },
    { path: "/eventos", element: <EventsPage />, title: "Eventos y actividades", description: "Próximas actividades, entregas, bazares y campañas del Banco de Alimentos de Zamora, y los resultados de las ya realizadas." },
    { path: "/eventos/:slug", dynamic: true, element: <EventPage /> },
    // Después de las rutas fijas: React Router prefiere siempre un segmento fijo a uno dinámico.
    { path: "/:slug", dynamic: true, element: <DynamicPage /> },
    { path: "*", element: <ErrorPage />,  title: "Ha surgido un error", description: "Página no encontrada. Vuelve al inicio del Banco de Alimentos de Zamora." },
];

//     { path: "/faqs", element: < FAQs /> },
  return (
      <div className="min-h-screen dark:bg-slate-800 dark:text-white">
        <PreviewBanner />
        <Router>
          <SiteNavigation />
          <SiteContentProvider>
          <Routes>
            { routes.map( route => {
              return <Route
                key={route.path}
                path={route.path}
                element={<RoutePage route={route} />}
              /> } 
            )}
          </Routes>
          </SiteContentProvider>
        </Router>
      </div>
  );
}

export default App;
