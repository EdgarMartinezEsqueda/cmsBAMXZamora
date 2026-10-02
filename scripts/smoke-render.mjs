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
  const site = { ...(await get("site")), programs: (await get("programs")).programs };

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
  ];
  const { mapStrapiNewsletter, mapStrapiNewsletterList } = await vite.ssrLoadModule("/shared/content/newsletter.js");
  const exampleNewsletterData = { title: "Boletín de ejemplo", slug: "ejemplo", edition: "Edición #1", period: "2026-09-01",
    summary: "Resumen", cover: null, pdf: { url: "/uploads/ejemplo.pdf", mime: "application/pdf", name: "ejemplo.pdf", size: 1024 } };
  const examples = {
    "example-newsletters": mapStrapiNewsletterList({ data: [exampleNewsletterData, { ...exampleNewsletterData, slug: "otro", period: "2025-05-01" }] },
      { mediaOrigin: "http://127.0.0.1:1337", page: 1, pageCount: 2, total: 13, years: [2026, 2025], year: null }),
    "example-newsletter": mapStrapiNewsletter({ data: exampleNewsletterData }, { mediaOrigin: "http://127.0.0.1:1337" }),
  };
  const { mapStrapiPage } = await vite.ssrLoadModule("/shared/content/page.js");
  const examplePage = mapStrapiPage({ data: {
    title: "Página de ejemplo", subtitle: "Todos los bloques", slug: "pagina-de-ejemplo",
    body: [
      { __component: "blocks.rich-text", body: [
        { type: "heading", level: 2, children: [{ type: "text", text: "Título" }] },
        { type: "paragraph", children: [{ type: "text", text: "Texto ", bold: true }, { type: "link", url: "/donar", children: [{ type: "text", text: "enlace" }] }] },
        { type: "list", format: "ordered", children: [{ type: "list-item", children: [{ type: "text", text: "uno" }] }] },
        { type: "quote", children: [{ type: "text", text: "cita", italic: true }] },
      ] },
      { __component: "blocks.text-image", title: "Con imagen", imagePosition: "izquierda",
        body: [{ type: "paragraph", children: [{ type: "text", text: "Texto" }] }], image: { url: "/uploads/a.webp", alternativeText: "A" } },
      { __component: "blocks.gallery", title: "Galería", images: [{ url: "/uploads/b.webp", alternativeText: "B" }] },
      { __component: "blocks.faq", title: "Preguntas", items: [{ question: "¿Q?", answer: "R" }] },
      { __component: "blocks.cta", title: "Únete", text: "Texto", link: { label: "Contacto", url: "/contacto" } },
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
      const props = { content, ...extra };
      const exportName = key === "home" ? "default" : "PageBody";
      const Page = (await vite.ssrLoadModule(file))[exportName];
      const html = renderToString(h(MemoryRouter, { initialEntries: [path] },
        h(SiteContext.Provider, { value: site }, h(Page, props))));
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
