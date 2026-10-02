import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mapStrapiPage, pageMediaUrls, RESERVED_SLUGS, sanitizeRichText } from "../shared/content/page.js";

const require = createRequire(import.meta.url);

test("texto enriquecido: lista cerrada de nodos y enlaces seguros", () => {
  const blocks = sanitizeRichText([
    { type: "paragraph", children: [
      { type: "text", text: "Hola ", bold: true, onclick: "x" },
      { type: "link", url: "javascript:alert(1)", children: [{ type: "text", text: "malo" }] },
      { type: "link", url: "/donar", children: [{ type: "text", text: "bueno" }] },
      { type: "image", image: { url: "https://evil.test/x.png" } },
    ] },
    { type: "heading", level: 1, children: [{ type: "text", text: "Título" }] },
    { type: "heading", level: 6, children: [{ type: "text", text: "Sub" }] },
    { type: "list", format: "ordered", children: [{ type: "list-item", children: [{ type: "text", text: "uno" }] }, { type: "paragraph" }] },
    { type: "image", image: { url: "https://evil.test/x.png" } },
    { type: "code", children: [{ type: "text", text: "<script>" }] },
    { type: "html", value: "<script>alert(1)</script>" },
  ]);
  assert.deepEqual(blocks[0].children, [
    { type: "text", text: "Hola ", bold: true },
    { type: "text", text: "malo" },
    { type: "link", url: "/donar", children: [{ type: "text", text: "bueno" }] },
  ]);
  assert.deepEqual(blocks.map((block) => block.type), ["paragraph", "heading", "heading", "list"]);
  assert.deepEqual(blocks.slice(1, 3).map((block) => block.level), [2, 4], "el h1 es del título de la página");
  assert.equal(blocks[3].children.length, 1);
  assert.equal(JSON.stringify(blocks).includes("script"), false);
});

test("página: bloques conocidos en orden, slug válido y populate exigido", () => {
  const page = mapStrapiPage({ data: {
    title: "Voluntariado escolar", slug: "voluntariado-escolar", seoTitle: "", createdBy: "admin",
    body: [
      { __component: "blocks.cta", title: "Únete", link: { label: "Ir", url: "/contacto" } },
      { __component: "blocks.desconocido", html: "<script>" },
      { __component: "blocks.gallery", title: "Fotos", images: [{ url: "/uploads/a.webp", alternativeText: "A" }] },
    ],
  } }, { mediaOrigin: "https://media.example.org" });
  assert.deepEqual(page.blocks.map((block) => block.type), ["cta", "gallery"]);
  assert.equal(page.seo.title, "Voluntariado escolar", "sin título SEO se usa el título");
  assert.equal(page.blocks[1].images[0].src, "https://media.example.org/uploads/a.webp");
  assert.equal(JSON.stringify(page).includes("admin"), false);
  assert.throws(() => mapStrapiPage({ data: { title: "x", slug: "../admin", body: [] } }), /slug/);
  assert.throws(() => mapStrapiPage({ data: { title: "x", slug: "x" } }), /populate de body/);
});

test("los slugs reservados del frontend y del CMS son los mismos", () => {
  const cms = require("../cms/src/setup/pages.js");
  assert.deepEqual([...cms.RESERVED_SLUGS].sort(), [...RESERVED_SLUGS].sort());
});

test("bloques reutilizados del sitio: mismo resultado que en su página y medios declarados", () => {
  const media = { mediaOrigin: "https://media.example.org" };
  const page = mapStrapiPage({ data: { title: "Todos", slug: "todos", body: [
    { __component: "sections.hero", primaryLabel: "Ir", primaryLink: "/donar", slides: [{ id: 1, image: { url: "/uploads/h.webp" }, headingLead: "Portada" }] },
    { __component: "home.about", heading: { lead: "Hola" }, features: [], achievements: [{ text: "logro" }], image: { url: "/uploads/a.webp" } },
    { __component: "home.process", steps: [{ title: "Acopio", description: "D", statSource: "kilos" }] },
    { __component: "home.impact", heading: { lead: "Unidos" } },
    { __component: "home.programs-intro", ctaTitle: "Listo" },
    { __component: "home.newsletter", features: [{ text: "Noticias" }] },
    { __component: "about.history", milestones: [{ period: "2013", title: "Inicio", description: "D" }] },
    { __component: "about.approach", pillars: [{ title: "Pilar", items: [{ text: "uno" }] }], quote: "Cita" },
    { __component: "blocks.partners", note: "interna" },
    { __component: "blocks.steps", stepsTitle: "Pasos", list: [{ text: "INE" }], steps: [{ title: "Paso 1", description: "D", image: { url: "/uploads/s.webp" } }, { title: "Sin imagen" }] },
    { __component: "blocks.embed", kind: "video", url: "https://www.youtube.com/embed/abc123", title: "Video" },
    { __component: "blocks.embed", kind: "mapa", url: "https://www.google.com/maps/embed?pb=1" },
    { __component: "about.intro", tabs: [{ title: "Misión", items: [{ text: "uno" }] }], images: [{ url: "/uploads/t1.webp" }], videoImage: { url: "/uploads/t2.webp" }, videoUrl: "javascript:x" },
    { __component: "about.networks", types: [{ title: "Red", items: [] }], joinSteps: [{ title: "Paso", description: "D" }], link: { label: "Ir", url: "/contacto" } },
    { __component: "about.coverage", municipalities: [{ name: "Zamora", families: 10, communities: 2, isMain: true }, { name: "" }] },
    { __component: "blocks.programs-detail", ctaTitle: "Cierre", primaryLink: { label: "Ver", url: "/programas" } },
    { __component: "blocks.social", heading: { lead: "Síguenos" } },
    { __component: "blocks.site-cta", note: "interna" },
    { __component: "blocks.donate", note: "interna", clabe: "000" },
  ] } }, media);
  assert.deepEqual(page.blocks.map((block) => block.type),
    ["hero", "presentation", "process", "impact", "programs", "newsletter", "timeline", "pillars", "partners", "steps", "embed", "embed",
      "tabs", "join", "coverage", "programs-detail", "social", "site-cta", "donate"]);
  assert.equal(page.blocks[12].videoUrl, "", "el video de las pestañas solo acepta https");
  assert.deepEqual(page.blocks[14].municipalities.map((item) => item.name), ["Zamora"]);
  assert.equal(page.blocks[15].primaryLink.url, "/programas");
  assert.deepEqual(page.blocks.slice(17), [{ type: "site-cta" }, { type: "donate" }], "sin nota interna ni datos bancarios en el bloque");
  assert.equal(page.blocks[0].slides[0].image, "https://media.example.org/uploads/h.webp");
  assert.equal(page.blocks[2].steps[0].statSource, "kilos");
  assert.deepEqual(page.blocks[8], { type: "partners" }, "la nota interna no sale a la web");
  assert.deepEqual(page.blocks[9].steps.map((step) => step.title), ["Paso 1"]);
  assert.deepEqual(pageMediaUrls(page).sort(), ["https://media.example.org/uploads/a.webp",
    "https://media.example.org/uploads/h.webp", "https://media.example.org/uploads/s.webp",
    "https://media.example.org/uploads/t1.webp", "https://media.example.org/uploads/t2.webp"]);
});

test("bloque de video o mapa: solo direcciones de la lista blanca; lo demás no se pinta", () => {
  const embed = (kind, url) => mapStrapiPage({ data: { title: "x", slug: "x", body: [{ __component: "blocks.embed", kind, url }] } }).blocks;
  assert.equal(embed("video", "https://drive.google.com/file/d/1AbC_d-9/preview").length, 1);
  for (const [kind, url] of [
    ["video", "https://evil.test/embed/abc"], ["video", "https://www.youtube.com/watch?v=abc"],
    ["video", "javascript:alert(1)"], ["video", "https://www.google.com/maps/embed?pb=1"],
    ["mapa", "https://www.youtube.com/embed/abc"], ["mapa", "https://maps.evil.test/maps/embed"],
    ["mapa", "<iframe src=x>"], ["otro", "https://evil.test/x"],
  ]) {
    assert.deepEqual(embed(kind, url), [], `${kind} ${url}`);
  }
});

test("bloques de texto: alineación y color solo de la lista cerrada", () => {
  const media = { mediaOrigin: "https://media.example.org" };
  const body = [{ type: "paragraph", children: [{ type: "text", text: "Hola" }] }];
  const text = (parts) => mapStrapiPage({ data: { title: "T", slug: "texto", body: [{ __component: "blocks.rich-text", parts }] } }, media).blocks;
  const style = (extra) => {
    const [part] = text([{ body, ...extra }])[0].parts;
    return [part.align, part.color];
  };
  // Varias secciones en un solo bloque, cada una con su estilo; las vacías no salen.
  const [block] = text([{ body, align: "centro", color: "verde" }, { body: [] }, { body, align: "justificado" }, {}]);
  assert.deepEqual(block.parts.map((part) => [part.align, part.color]), [["centro", "verde"], ["justificado", "predeterminado"]]);
  assert.deepEqual(Object.keys(block.parts[0]).sort(), ["align", "body", "color"]);
  assert.deepEqual(text([{ body: [] }]), [], "un bloque sin texto no se pinta");
  assert.deepEqual(text(undefined), []);
  assert.deepEqual(style({}), ["izquierda", "predeterminado"], "sin elegir: lo de siempre");
  assert.deepEqual(style({ align: "justificado", color: "verde" }), ["justificado", "verde"]);
  assert.deepEqual(style({ align: "centro", color: "rojo" }), ["centro", "rojo"]);
  for (const bad of ["right; color:red", "text-center", "#ff0000", "url(javascript:x)", 5, null]) {
    assert.deepEqual(style({ align: bad, color: bad }), ["izquierda", "predeterminado"], `valor fuera de la lista: ${bad}`);
  }
  const [withImage] = mapStrapiPage({ data: { title: "T", slug: "texto", body: [
    { __component: "blocks.text-image", body, align: "centro", color: "amarillo", image: null },
  ] } }, media).blocks;
  assert.deepEqual([withImage.align, withImage.color], ["centro", "amarillo"]);
});
