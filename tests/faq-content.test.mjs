import test from "node:test";
import assert from "node:assert/strict";
import { mapStrapiFaq } from "../shared/content/faq.js";

test("Preguntas: categorías conocidas, entradas completas y enlace seguro", () => {
  const content = mapStrapiFaq({ data: {
    pageTitle: "Preguntas", heading: { highlight: "Preguntas Frecuentes" }, createdBy: "admin",
    entries: [
      { question: "¿Qué es?", answer: "Un banco", category: "general" },
      { question: "¿Otra?", answer: "Sí", category: "inventada" },
      { question: "Sin respuesta", answer: "" },
    ],
    link: { label: "Contactar", url: "javascript:alert(1)" },
  } });
  assert.deepEqual(content.entries, [
    { question: "¿Qué es?", answer: "Un banco", category: "general" },
    { question: "¿Otra?", answer: "Sí", category: "general" },
  ]);
  assert.equal(content.link, null);
  assert.equal(JSON.stringify(content).includes("admin"), false);
  assert.throws(() => mapStrapiFaq({ data: { pageTitle: "P", heading: null, link: null } }), /populate de entries/);
});
