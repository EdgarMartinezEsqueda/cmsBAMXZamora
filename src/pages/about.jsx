import About from "components/about/About";
import HistoryTimeline from "components/about/HistoryTimeline";
import IntegralApproach from "components/about/IntegralApproach";
import ProgramsSection from "components/about/ProgramsAbout";
import SupportNetworks from "components/about/SupportNetworks";
import Breadcrumb from "components/breadcrumb/Breadcrumb";
import PageContent from "components/cms/PageContent";
import CallToAction from "components/cta/CallToAction";
import Map from "components/map/Mapa";
import PartnersSection from "components/media/PartnersSection";

// Una sección en null no se pinta (el editor la vació en el CMS).
export function PageBody({ content }) {
  return (
    <>
      <Breadcrumb titulo={content.pageTitle} subtitulo={content.pageSubtitle || undefined} />
      {content.intro && <About {...content.intro} />}
      {content.history && <HistoryTimeline {...content.history} />}
      {content.approach && <IntegralApproach {...content.approach} />}
      {content.coverage && <Map conMapa={true} {...content.coverage} />}
      {content.programsIntro && <ProgramsSection {...content.programsIntro} />}
      {content.networks && <SupportNetworks {...content.networks} />}
      <PartnersSection />
      <CallToAction />
    </>
  );
}

const AboutUs = () => <PageContent contentKey="about" Body={PageBody} />;

export default AboutUs;
