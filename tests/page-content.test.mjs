import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mapStrapiPage, RESERVED_SLUGS, sanitizeRichText } from "../shared/content/page.js";

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
