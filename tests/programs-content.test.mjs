import test from "node:test";
import assert from "node:assert/strict";
import { embedVideoUrl, mapStrapiPrograms } from "../shared/content/programs.js";

const item = (over = {}) => ({ slug: "voluntariado", title: "Voluntariado", summary: "S", order: 10, icon: "gift",
  image: null, highlights: [], keyPoints: [], faqs: [], ...over });

test("programas: ordena, filtra campos privados y medios fuera del contrato", () => {
  const { programs } = mapStrapiPrograms({ data: [
    item({ slug: "b", title: "B", order: 20, createdBy: { email: "admin@x" } }),
    item({ slug: "a", title: "A", order: 10, image: { url: "/uploads/a.webp", alternativeText: "Alt" },
      keyPoints: [{ text: "uno" }, { text: "" }], faqs: [{ question: "¿Q?", answer: "R" }, { question: "sin respuesta" }],
      icon: "no-existe", category: "otra", showOnHome: "true" }),
  ] }, { mediaOrigin: "https://media.example.org" });
  assert.deepEqual(programs.map((p) => p.slug), ["a", "b"]);
  assert.deepEqual(programs[0].image, { src: "https://media.example.org/uploads/a.webp", alt: "Alt" });
  assert.deepEqual(programs[0].keyPoints, ["uno"]);
  assert.deepEqual(programs[0].faqs, [{ question: "¿Q?", answer: "R" }]);
  assert.equal(programs[0].icon, "");
  assert.equal(programs[0].category, "programa");
  assert.equal(programs[0].showOnHome, false, "solo true literal");
  assert.equal(JSON.stringify(programs).includes("admin@x"), false);
});

test("programas: exige populate y slugs seguros para anclas", () => {
  assert.throws(() => mapStrapiPrograms({ data: null }), /no disponibles/);
  assert.throws(() => mapStrapiPrograms({ data: [{ slug: "a" }] }), /populate/);
  for (const slug of ["talleres-BAMX Zamora", "a/b", "", "<x>", "A"]) {
    assert.throws(() => mapStrapiPrograms({ data: [item({ slug })] }), /slug/, slug);
  }
  assert.deepEqual(mapStrapiPrograms({ data: [] }), { programs: [] });
});

test("video: solo YouTube /embed/ y Google Drive /preview por https", () => {
  assert.ok(embedVideoUrl("https://www.youtube.com/embed/WSaNPe_lJEQ?si=x"));
  assert.ok(embedVideoUrl("https://drive.google.com/file/d/1sqTe-z_Y/preview"));
  for (const url of ["https://www.youtube.com/watch?v=x", "https://evil.test/embed/x", "http://www.youtube.com/embed/x",
    "https://drive.google.com/file/d/1/view", "https://www.youtube.com.evil.test/embed/x", "javascript:alert(1)"]) {
    assert.equal(embedVideoUrl(url), "", url);
  }
});
