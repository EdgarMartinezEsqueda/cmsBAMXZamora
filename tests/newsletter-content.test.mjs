import test from "node:test";
import assert from "node:assert/strict";
import { mapStrapiNewsletter, mapStrapiNewsletterList } from "../shared/content/newsletter.js";

const origin = { mediaOrigin: "https://media.example.org" };
const pdf = { url: "/uploads/boletin.pdf", mime: "application/pdf", name: "boletin.pdf", size: 2048.4 };

test("boletín: solo PDF real, tamaño en KB y campos privados fuera", () => {
  const item = mapStrapiNewsletter({ data: { title: "Septiembre", slug: "septiembre-2026", period: "2026-09-01", cover: null, pdf, createdBy: "admin" } }, origin);
  assert.deepEqual(item.pdf, { url: "https://media.example.org/uploads/boletin.pdf", name: "boletin.pdf", sizeKb: 2048 });
  assert.equal(item.period, "2026-09-01");
  assert.equal(JSON.stringify(item).includes("admin"), false);
  assert.throws(() => mapStrapiNewsletter({ data: { title: "x", slug: "x", cover: null, pdf: { ...pdf, mime: "text/html" } } }, origin), /PDF válido/);
  assert.throws(() => mapStrapiNewsletter({ data: { title: "x", slug: "../x", cover: null, pdf } }, origin), /slug/);
  assert.throws(() => mapStrapiNewsletter({ data: { title: "x", slug: "x" } }, origin), /populate/);
});

test("listado: años únicos y ordenados, y enlace de descarga solo si es PDF", () => {
  const list = mapStrapiNewsletterList({ data: [
    { title: "A", slug: "a", period: "2026-09-01", cover: null, pdf },
    { title: "B", slug: "b", period: "2025-01-01", cover: null, pdf: { ...pdf, mime: "image/png" } },
  ] }, { ...origin, years: [2025, 2026, 2026, NaN], page: 1, pageCount: 1, total: 2 });
  assert.deepEqual(list.years, [2026, 2025]);
  assert.equal(list.items[0].pdfUrl, "https://media.example.org/uploads/boletin.pdf");
  assert.equal(list.items[1].pdfUrl, "");
});
