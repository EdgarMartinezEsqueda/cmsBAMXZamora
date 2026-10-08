import test from "node:test";
import assert from "node:assert/strict";
import { mapStrapiNavigation } from "../shared/content/navigation.js";

test("menú y pie: solo enlaces seguros, en su orden, sin campos internos", () => {
  const nav = mapStrapiNavigation({ data: {
    menuLinks: [
      { label: "Inicio", url: "/" },
      { label: "Malo", url: "javascript:alert(1)" },
      { label: "", url: "/sin-texto" },
      { label: "Página nueva", url: "/voluntariado-escolar" },
      { label: "Externo", url: "https://bamx.org.mx" },
    ],
    donateButton: { label: "Dona", url: "data:text/html,x" },
    footerLinks: [{ label: "Donar", url: "/donar" }, { label: "Otro", url: "//evil.example" }],
    footerPrograms: [
      { title: "Comedor comunitario", shortTitle: "Comedor", slug: "comedor-comunitario", consent: "interno" },
      { title: "Talleres", shortTitle: "", slug: "talleres" },
      { title: "Malo", slug: "../admin" },
    ],
    footerProgramsTitle: "Programas", footerCopyright: "BAMX", createdBy: { email: "admin@x" },
  } });
  assert.deepEqual(nav.menu.links.map((link) => link.label), ["Inicio", "Página nueva", "Externo"]);
  assert.equal(nav.menu.donateButton, null, "un botón con dirección insegura no se pinta");
  assert.deepEqual(nav.footer.links, [{ label: "Donar", url: "/donar" }]);
  assert.equal(nav.footer.programsTitle, "Programas");
  assert.deepEqual(nav.footer.programs, [
    { label: "Comedor", url: "/programas#comedor-comunitario" },
    { label: "Talleres", url: "/programas#talleres" },
  ], "en el orden del panel, título corto si existe, sin slugs inválidos ni campos internos");
  assert.equal(nav.footer.socialText, "");
  assert.equal(JSON.stringify(nav).includes("admin@x"), false);
});

test("menú y pie: exige el documento y sus listas", () => {
  assert.throws(() => mapStrapiNavigation({ data: null }), /Menú y pie/);
  assert.throws(() => mapStrapiNavigation({ data: { footerLinks: [] } }), /populate de menuLinks/);
  assert.throws(() => mapStrapiNavigation({ data: { menuLinks: [], footerLinks: [] } }), /populate de footerPrograms/);
});
