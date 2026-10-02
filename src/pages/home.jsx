import AboutSection from "components/about/AboutSection";
import CallToAction from "components/cta/CallToAction";
import Footer from "components/footer/Footer";
import FunFact from "components/funfact/Funfact";
import Header from "components/header/Header";
import InstagramSection from "components/media/InstagramSection";
import PartnersSection from "components/media/PartnersSection";
import LatestNewsletter from "components/newsletter/LatestNewsletter";
import ProcessSection from "components/process/Process";
import Programs from "components/programs/ProgramsSection";
import Hero from "components/sliders/Hero";
import useSite from "utils/useSite";

// content llega de Strapi (mapStrapiHome). El teléfono del Hero sale de "Datos del sitio".
// Una sección en null no se pinta.
function App({ content: home }) {
  const { contact } = useSite();
  return (
    <div className={`min-h-screen`}>
      <div className="dark:bg-gray-900 dark:text-white">
        <Header />
        <main>
          {home.hero && <Hero {...home.hero} supportPhone={contact.phone} />}
          {home.about && <AboutSection {...home.about} />}
          {home.process && <ProcessSection {...home.process} />}
          {home.newsletterIntro && <LatestNewsletter {...home.newsletterIntro} />}
          <CallToAction />
          {home.programsIntro && <Programs {...home.programsIntro} />}
          {home.impactSection && <FunFact {...home.impactSection} />}
          <PartnersSection />
          {home.instagram && <InstagramSection heading={home.instagram} />}
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default App
