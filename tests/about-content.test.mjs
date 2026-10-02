import test from "node:test";
import assert from "node:assert/strict";
import { mapStrapiAbout } from "../shared/content/about.js";

const EMPTY = { intro: null, history: null, approach: null, coverage: null, programsIntro: null, networks: null };
const about = (fields) => ({ data: { pageTitle: "Nosotros", ...EMPTY, ...fields } });

test("Nosotros: secciones vacías no se pintan y una respuesta incompleta falla", () => {
  assert.deepEqual(mapStrapiAbout(about({})), { pageTitle: "Nosotros", pageSubtitle: "", ...EMPTY });
  assert.throws(() => mapStrapiAbout({ data: { pageTitle: "Nosotros" } }), /populate de intro/);
  assert.throws(() => mapStrapiAbout({ data: null }), /no disponible/);
});

test("Nosotros: medios resueltos, enlaces seguros y municipios con cifras válidas", () => {
  const content = mapStrapiAbout(about({
    intro: {
      heading: { lead: "Unidos por una", highlight: "causa", tail: "que transforma vidas." },
      tabs: [{ title: "Misión", items: [{ text: "Rescatar" }, { text: "" }] }, { title: "" }],
      images: [{ url: "/uploads/a.webp", alternativeText: "A" }, null],
      videoImage: { url: "/uploads/v.webp" },
      videoUrl: "javascript:alert(1)",
    },
    history: { milestones: [{ period: "2013", title: "Inicios", description: "D" }, { period: "x" }], link: { label: "Únete", url: "//evil.test" } },
    coverage: { municipalities: [
      { name: "Zamora", state: "Michoacán", communities: 23, families: 2900, isMain: true, createdBy: "admin" },
      { name: "Jacona", communities: -3, families: "2100", isMain: "true" },
      { communities: 1 },
    ] },
  }), { mediaOrigin: "https://media.example.org" });
  assert.equal(content.intro.heading.tail, "que transforma vidas.");
  assert.deepEqual(content.intro.tabs, [{ title: "Misión", description: "", items: ["Rescatar"] }]);
  assert.deepEqual(content.intro.images, [{ src: "https://media.example.org/uploads/a.webp", alt: "A" }]);
  assert.equal(content.intro.videoImage.src, "https://media.example.org/uploads/v.webp");
  assert.equal(content.intro.videoUrl, "", "solo https");
  assert.equal(content.history.milestones.length, 1);
  assert.equal(content.history.link, null, "enlace ambiguo no se pinta");
  assert.deepEqual(content.coverage.municipalities, [
    { name: "Zamora", state: "Michoacán", communities: 23, families: 2900, isMain: true },
    { name: "Jacona", state: "", communities: 0, families: 0, isMain: false },
  ]);
  assert.equal(JSON.stringify(content).includes("admin"), false);
});
