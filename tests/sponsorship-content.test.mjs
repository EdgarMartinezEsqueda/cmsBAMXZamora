import test from "node:test";
import assert from "node:assert/strict";
import { mapStrapiBeneficiaries, mapStrapiSponsoredCases, mapStrapiSponsorship } from "../shared/content/sponsorship.js";

const origin = { mediaOrigin: "https://media.example.org" };

test("catálogo: solo casos con consentimiento y vigentes, y solo imagen y texto alternativo", () => {
  const { cases } = mapStrapiSponsoredCases({ data: [
    { consent: true, validUntil: "2026-12-31", order: 20, image: { url: "/uploads/b.webp" }, alt: "B", internalName: "Nombre real", notes: "diagnóstico" },
    { consent: true, validUntil: "2026-09-28", order: 10, image: { url: "/uploads/a.webp" }, alt: "A" },
    { consent: true, validUntil: "2026-09-27", image: { url: "/uploads/vencido.webp" }, alt: "Vencido" },
    { consent: false, validUntil: "2027-01-01", image: { url: "/uploads/sin.webp" }, alt: "Sin consentimiento" },
    { consent: true, validUntil: null, image: { url: "/uploads/sin-fecha.webp" }, alt: "Sin fecha" },
    { consent: true, validUntil: "2027-01-01", image: null, alt: "Sin imagen" },
  ] }, { ...origin, today: "2026-09-28" });
  assert.deepEqual(cases, [
    { src: "https://media.example.org/uploads/a.webp", alt: "A" },
    { src: "https://media.example.org/uploads/b.webp", alt: "B" },
  ]);
  assert.equal(JSON.stringify(cases).includes("Nombre real") || JSON.stringify(cases).includes("diagnóstico"), false);
  assert.throws(() => mapStrapiSponsoredCases({ data: [] }, origin), /fecha de hoy/);
});

test("pasos con imagen: un paso sin imagen no entra al carrusel", () => {
  const page = mapStrapiBeneficiaries({ data: {
    pageTitle: "Beneficiarios", heading: null, documents: [{ text: "INE" }],
    steps: [{ title: "Registro", description: "D", image: { url: "/uploads/1.webp", alternativeText: "Paso 1" } }, { title: "Sin imagen", image: null }],
    galleryHeading: null, gallery: [{ url: "/uploads/g.webp", alternativeText: "Foto" }, null],
  } }, origin);
  assert.deepEqual(page.steps.map((step) => step.title), ["Registro"]);
  assert.deepEqual(page.gallery, [{ src: "https://media.example.org/uploads/g.webp", alt: "Foto" }]);
  assert.deepEqual(page.documents, ["INE"]);
  assert.throws(() => mapStrapiSponsorship({ data: { pageTitle: "A" } }, origin), /populate de heading/);
});
