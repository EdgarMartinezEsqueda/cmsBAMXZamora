import test from "node:test";
import assert from "node:assert/strict";
import { mapStrapiHome, safeContentUrl } from "../src/content/hero.js";

// Respuesta de Inicio con todas las secciones pedidas en populate (vacías salvo las indicadas).
const EMPTY = { about: null, process: null, programsIntro: null, impactSection: null, instagram: null, newsletterIntro: null };
const home = (fields) => ({ data: { ...EMPTY, ...fields } });

test("rechaza protocolos activos, credenciales y URLs ambiguas", () => {
  for (const url of ["javascript:alert(1)", "data:text/html,hi", "//evil.test", "/\\evil.test",
    "java\nscript:alert(1)", "https://user:pass@example.org", null]) {
    assert.equal(safeContentUrl(url), "");
  }
  assert.equal(safeContentUrl("/donar"), "/donar");
  assert.equal(safeContentUrl("https://example.org/donar"), "https://example.org/donar");
});

test("normaliza medios públicos y conserva comas, campos vacíos y orden editorial", () => {
  const payload = home({ hero: { primaryLabel: "", primaryLink: "javascript:alert(1)",
    slides: [
      { id: 7, image: { url: "/uploads/a.webp" }, headingLead: "10,000 familias" },
      { id: 2, image: { url: "https://cdn.example.org/b.webp" } },
    ] } });
  const { hero } = mapStrapiHome(payload, { mediaOrigin: "https://media.example.org" });
  assert.equal(hero.slides[0].image, "https://media.example.org/uploads/a.webp");
  assert.equal(hero.slides[1].image, "https://cdn.example.org/b.webp");
  assert.deepEqual(hero.slides.map(({ id }) => id), [7, 2]);
  assert.equal(hero.slides[0].headingLead, "10,000 familias");
  assert.equal(hero.primaryLabel, "");
  assert.equal(hero.primaryLink, "");
});

test("no resucita contenido eliminado ni oculta una respuesta incompleta", () => {
  assert.deepEqual(mapStrapiHome(home({ hero: null })), { hero: null, ...EMPTY });
  assert.deepEqual(mapStrapiHome(home({ hero: { slides: [] } })).hero.slides, []);
  assert.throws(() => mapStrapiHome({ data: null }));
  assert.throws(() => mapStrapiHome({ data: {} }), /populate/);
  assert.throws(() => mapStrapiHome({ data: { hero: null } }), /populate de about/);
  assert.throws(() => mapStrapiHome(home({ hero: {} })), /populate/);
  assert.throws(() => mapStrapiHome(home({ hero: { slides: [{ image: null }] } })), /imagen/);
  assert.throws(() => mapStrapiHome(home({ hero: { slides: [{ image: { url: "/uploads/a.webp" } }] } })), /origen/);
});

test("secciones de Inicio: enlaces seguros, cifras por fuente y campos privados fuera", () => {
  const content = mapStrapiHome(home({ hero: null,
    about: { heading: { lead: "Construyendo", highlight: "futuro", createdBy: "admin" }, features: [{ title: "A", description: "B" }, { title: "" }],
      achievements: [{ text: "uno" }], primaryLink: { label: "Ir", url: "javascript:alert(1)" }, secondaryLink: { label: "Voluntario", url: "/programas#voluntariado" },
      image: { url: "/uploads/a.webp", alternativeText: "Alt" }, videoUrl: "http://facebook.com/x" },
    process: { steps: [{ title: "Acopio", description: "D", statSource: "kilos" }, { title: "X", statSource: "inventada" }, { description: "sin título" }] },
    instagram: { lead: "Síguenos", intro: "Texto" },
  }), { mediaOrigin: "https://media.example.org" });
  assert.equal(content.about.primaryLink, null, "enlace peligroso no se pinta");
  assert.deepEqual(content.about.secondaryLink, { label: "Voluntario", url: "/programas#voluntariado" });
  assert.deepEqual(content.about.features, [{ title: "A", description: "B" }]);
  assert.deepEqual(content.about.image, { src: "https://media.example.org/uploads/a.webp", alt: "Alt" });
  assert.equal(content.about.videoUrl, "", "solo https");
  assert.deepEqual(content.process.steps.map((step) => step.statSource), ["kilos", "texto"]);
  assert.equal(content.instagram.lead, "Síguenos");
  assert.equal(content.programsIntro, null);
  assert.equal(JSON.stringify(content).includes("admin"), false);
});
