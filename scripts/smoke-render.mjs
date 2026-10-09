// Prueba de humo: renderiza cada página en Node (react-dom/server) con el cargador de Vite y el
// contenido que devuelve Strapi (debe estar corriendo). Detecta errores de ejecución que el build
// no ve (props undefined, datos con otra forma). No sustituye la revisión visual en el navegador.
//
// Uso: npm run smoke    (VITE_CMS_URL, por defecto http://127.0.0.1:1337)
import { Window } from "happy-dom";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { createServer } from "vite";

// Librerías de navegador (odómetro, Highcharts) tocan window/document al importarse.
const browser = new Window({ url: "http://localhost/" });
for (const key of ["window", "document", "navigator", "HTMLElement", "Element", "Node", "getComputedStyle", "requestAnimationFrame", "cancelAnimationFrame"]) {
  if (!(key in globalThis) || key === "window" || key === "document") {
    Object.defineProperty(globalThis, key, { value: key === "window" ? browser : browser[key], configurable: true, writable: true });
  }
}

const cmsUrl = process.env.VITE_CMS_URL || "http://127.0.0.1:1337";
// highcharts-react-official es un bundle UMD que solo funciona en el navegador: el gráfico se
// sustituye por un componente vacío (el mapa no es lo que esta prueba revisa).
const vite = await createServer({ server: { middlewareMode: true }, appType: "custom", logLevel: "error",
  resolve: { alias: { "highcharts-react-official": new URL("./smoke-highcharts-stub.js", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1") } } });

try {
  const { SiteContext } = await vite.ssrLoadModule("/src/utils/useSite.js");
  // El router debe ser la misma instancia que importan los componentes.
  const { MemoryRouter } = await vite.ssrLoadModule("/scripts/smoke-router.js");

  const get = async (key) => {
    const response = await fetch(`${cmsUrl}/api/content/${key}`);
    if (!response.ok) throw new Error(`${key}: HTTP ${response.status}`);
    return response.json();
  };
  const site = { ...(await get("site")), programs: (await get("programs")).programs, partnerLogos: (await get("partners")).partners,
    navigation: await get("navigation") };

  // [ruta, archivo, clave de contenido]. Las páginas piden su contenido en un efecto (no corre en
  // Node): se renderiza su PageBody (o la home) con la respuesta real del CMS.
  const pages = [
    ["/", "/src/pages/home.jsx", "home"],
    ["/nosotros", "/src/pages/about.jsx", "about"],
    ["/programas", "/src/pages/programs.jsx", "programsPage"],
    ["/contacto", "/src/pages/contact.jsx", "contactPage"],
    ["/preguntas", "/src/pages/questions.jsx", "faq"],
    ["/donar", "/src/pages/donate.jsx", "donate"],
    ["/beneficiarios", "/src/pages/beneficiaries.jsx", "beneficiaries"],
    ["/apadrinamiento", "/src/pages/apadrinamiento.jsx", "sponsorship"],
    // Página creada desde el panel: un ejemplo con los cinco tipos de bloque, ya saneado.
    ["/pagina-de-ejemplo", "/src/pages/DynamicPage.jsx", "example-page"],
    // Boletines: listado y visor con un ejemplo ya mapeado (no dependen de que haya boletines).
    ["/boletines", "/src/pages/newsletters.jsx", "example-newsletters"],
    ["/boletines/ejemplo", "/src/pages/newsletter.jsx", "example-newsletter"],
    // Eventos: listado (con la caché del sitio ya llena) y detalle de un evento realizado.
    ["/eventos", "/src/pages/events.jsx", "example-events"],
    ["/eventos/ejemplo", "/src/pages/event.jsx", "example-event"],
  ];
  const { mapStrapiNewsletter, mapStrapiNewsletterList } = await vite.ssrLoadModule("/shared/content/newsletter.js");
  const exampleNewsletterData = { title: "Boletín de ejemplo", slug: "ejemplo", edition: "Edición #1", period: "2026-09-01",
    summary: "Resumen", cover: null, pdf: { url: "/uploads/ejemplo.pdf", mime: "application/pdf", name: "ejemplo.pdf", size: 1024 } };
  const examples = {
    "example-newsletters": mapStrapiNewsletterList({ data: [exampleNewsletterData, { ...exampleNewsletterData, slug: "otro", period: "2025-05-01" }] },
      { mediaOrigin: "http://127.0.0.1:1337", page: 1, pageCount: 2, total: 13, years: [2026, 2025], year: null }),
    "example-newsletter": mapStrapiNewsletter({ data: exampleNewsletterData }, { mediaOrigin: "http://127.0.0.1:1337" }),
  };
  const { mapStrapiEvent, mapStrapiEventList } = await vite.ssrLoadModule("/shared/content/events.js");
  const { contentUrl, primeContent } = await vite.ssrLoadModule("/src/utils/cmsStore.js");
  const { eventsView } = await vite.ssrLoadModule("/src/utils/routeContent.js");
  const exampleEventData = { title: "Entrega de despensas de ejemplo", slug: "ejemplo", category: "entregas", audience: "beneficiarios",
    startDate: "2026-01-10T15:00:00.000Z", eventStatus: "programado", summary: "Resumen del evento", locationName: "Centro comunitario",
    coverImage: null, gallery: [], requirements: [{ text: "Credencial de beneficiario" }],
    results: [{ value: "150", label: "Familias atendidas" }], resultsSummary: "Gracias a todos.", featured: true };
  examples["example-event"] = mapStrapiEvent({ data: exampleEventData }, { mediaOrigin: "http://127.0.0.1:1337" });
  const exampleEvents = mapStrapiEventList({ data: [
    { ...exampleEventData, slug: "proximo", title: "Venta de calzado de ejemplo", category: "bazares", audience: "publico", startDate: "2099-01-15T16:00:00.000Z", costType: "gratuito" },
    { ...exampleEventData, slug: "cancelado", title: "Taller de ejemplo", category: "talleres", startDate: "2099-01-20T16:00:00.000Z", eventStatus: "cancelado", featured: false },
  ] }, { mediaOrigin: "http://127.0.0.1:1337" });
  const eventsListView = eventsView("");
  primeContent(contentUrl("events", eventsListView.listQuery), { status: "ready", content: exampleEvents });
  primeContent(contentUrl("events", eventsListView.calendarQuery), { status: "ready", content: { ...exampleEvents, month: eventsListView.month } });
  examples["example-events"] = exampleEvents;
  const { mapStrapiPage } = await vite.ssrLoadModule("/shared/content/page.js");
  const examplePage = mapStrapiPage({ data: {
    title: "Página de ejemplo", subtitle: "Todos los bloques", slug: "pagina-de-ejemplo",
    body: [
      { __component: "blocks.rich-text", parts: [{ align: "justificado", color: "rojo", body: [
        { type: "paragraph", children: [{ type: "text", text: "Segunda sección del mismo bloque" }] }] }, { align: "centro", color: "verde", body: [
        { type: "heading", level: 2, children: [{ type: "text", text: "Título" }] },
        { type: "paragraph", children: [{ type: "text", text: "Texto ", bold: true }, { type: "link", url: "/donar", children: [{ type: "text", text: "enlace" }] }] },
        { type: "list", format: "ordered", children: [{ type: "list-item", children: [{ type: "text", text: "uno" }] }] },
        { type: "quote", children: [{ type: "text", text: "cita", italic: true }] },
      ] }] },
      { __component: "blocks.text-image", title: "Con imagen", imagePosition: "izquierda",
        body: [{ type: "paragraph", children: [{ type: "text", text: "Texto" }] }], image: { url: "/uploads/a.webp", alternativeText: "A" } },
      { __component: "blocks.gallery", title: "Galería", images: [{ url: "/uploads/b.webp", alternativeText: "B" }] },
      { __component: "blocks.faq", title: "Preguntas", items: [{ question: "¿Q?", answer: "R" }] },
      { __component: "blocks.cta", title: "Únete", text: "Texto", link: { label: "Contacto", url: "/contacto" } },
      // Secciones del sitio reutilizadas como bloques.
      { __component: "sections.hero", primaryLabel: "Conoce más", primaryLink: "/nosotros", supportTitle: "¿Ayuda?",
        previousLabel: "Anterior", nextLabel: "Siguiente",
        slides: [{ id: 1, image: { url: "/uploads/h.webp" }, badge: "Portada de bloque", headingLead: "Título de portada", description: "Texto", iconKey: "heart" }] },
      { __component: "home.about", heading: { eyebrow: "Etiqueta", lead: "Presentación", highlight: "de bloque", intro: "Texto" },
        features: [{ title: "Tarjeta", description: "Texto" }], achievementsTitle: "Logros", achievements: [{ text: "Logro de bloque" }],
        primaryLink: { label: "Ir", url: "/nosotros" }, image: { url: "/uploads/p.webp", alternativeText: "P" } },
      { __component: "home.process", heading: { lead: "Proceso", highlight: "de bloque" },
        steps: [{ title: "Paso de proceso", description: "Texto", statSource: "familias" }], summaryTitle: "Resumen" },
      { __component: "home.impact", heading: { lead: "Cifras", highlight: "de bloque" }, statsTitle: "Impacto de bloque" },
      { __component: "home.programs-intro", heading: { lead: "Programas", highlight: "de bloque" }, ctaTitle: "Cierre de programas" },
      { __component: "home.newsletter", heading: { lead: "Boletín", highlight: "de bloque" }, title: { lead: "Historias" }, features: [{ text: "Noticias" }] },
      { __component: "about.history", heading: { eyebrow: "Historia de bloque", lead: "Más de" },
        milestones: [{ period: "2013", title: "Hito de bloque", description: "Texto" }], ctaTitle: "Cierre" },
      { __component: "about.approach", heading: { eyebrow: "Enfoque de bloque" },
        pillars: [{ title: "Pilar de bloque", description: "Texto", items: [{ text: "uno" }] }], quote: "Cita de bloque", quoteAuthor: "BAMX" },
      { __component: "blocks.partners" },
      { __component: "about.intro", heading: { lead: "Pestañas", highlight: "de bloque" },
        tabs: [{ title: "Pestaña de bloque", description: "Texto", items: [{ text: "uno" }] }],
        images: [{ url: "/uploads/t1.webp", alternativeText: "T1" }, { url: "/uploads/t2.webp", alternativeText: "T2" }] },
      { __component: "about.networks", heading: { lead: "Sumarse", highlight: "de bloque" }, types: [{ title: "Red de bloque", items: [{ text: "uno" }] }],
        joinHeading: { lead: "Cómo" }, joinSteps: [{ title: "Paso para sumarse", description: "Texto" }], link: { label: "Ir", url: "/contacto" } },
      { __component: "about.coverage", heading: { lead: "Cobertura", highlight: "de bloque" }, mapText: "Texto del mapa",
        municipalities: [{ name: "Municipio de bloque", state: "Michoacán", communities: 2, families: 10, isMain: true }] },
      { __component: "blocks.programs-detail", heading: { lead: "Detalle", highlight: "de bloque" }, ctaTitle: "Cierre de detalle" },
      { __component: "blocks.social", heading: { lead: "Redes", highlight: "de bloque" } },
      { __component: "blocks.site-cta" },
      { __component: "blocks.donate" },
      { __component: "blocks.steps", heading: { lead: "Pasos", highlight: "de bloque" }, stepsTitle: "Lista de pasos",
        steps: [{ title: "Paso con imagen", description: "Texto", image: { url: "/uploads/s.webp", alternativeText: "S" } }] },
      { __component: "blocks.embed", kind: "video", url: "https://www.youtube.com/embed/abc123", title: "Video de bloque" },
      { __component: "blocks.embed", kind: "mapa", url: "https://www.google.com/maps/embed?pb=1", title: "Mapa de bloque" },
    ],
  } }, { mediaOrigin: "http://127.0.0.1:1337" });
  let failed = 0;
  for (const [path, file, key] of pages) {
    try {
      const content = key === "example-page" ? examplePage
        : examples[key] ?? await get(key);
      // Donar y Apadrinamiento necesitan además otra clave (datos bancarios; casos del catálogo).
      const extra = key === "donate" ? { bank: await get("bank") }
        : key === "sponsorship" ? { cases: (await get("sponsoredCases")).cases } : {};
      const props = key === "example-event" ? { event: content } : { content, ...extra };
      const exportName = key === "home" || key === "example-events" ? "default" : key === "example-event" ? "EventBody" : "PageBody";
      const Page = (await vite.ssrLoadModule(file))[exportName];
      const html = renderToString(h(MemoryRouter, { initialEntries: [path] },
        h(SiteContext.Provider, { value: site }, h(Page, props))));
      if (key === "example-events") {
        for (const expected of ["Venta de calzado de ejemplo", "Cancelado", "Destacado", "Gratuito"]) {
          if (!html.includes(expected)) throw new Error(`/eventos no contiene ${expected}`);
        }
      }
      if (key === "example-event") {
        for (const expected of ["Familias atendidas", "Credencial de beneficiario", "Beneficiarios registrados"]) {
          if (!html.includes(expected)) throw new Error(`El evento no contiene ${expected}`);
        }
      }
      if (key === "example-page") {
        // Alineación y color del bloque de texto, y los aliados de la colección.
        for (const expected of ["text-center", "text-verde-700", "text-justify", "text-rojo-700", site.partnerLogos[0].logo.src]) {
          if (!html.includes(expected)) throw new Error(`La página de ejemplo no contiene ${expected}`);
        }
      }
      console.log(`OK   ${path.padEnd(16)} ${String(html.length).padStart(7)} caracteres`);
      // SMOKE_DUMP=carpeta guarda el texto visible de cada página, para comparar static y strapi.
      if (process.env.SMOKE_DUMP) {
        const { mkdir, writeFile } = await import("node:fs/promises");
        const visible = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, "").replace(/<[^>]+>/g, "\n")
          .split("\n").map((line) => line.trim()).filter(Boolean).join("\n");
        await mkdir(process.env.SMOKE_DUMP, { recursive: true });
        await writeFile(`${process.env.SMOKE_DUMP}/${path === "/" ? "inicio" : path.slice(1).replaceAll("/", "-")}.txt`, visible + "\n");
      }
    } catch (error) {
      failed += 1;
      console.log(`FALLA ${path.padEnd(15)} ${error.message.split("\n")[0]}`);
    }
  }
  process.exitCode = failed ? 1 : 0;
} finally {
  await vite.close();
}
