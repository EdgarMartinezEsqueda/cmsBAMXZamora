import test from "node:test";
import assert from "node:assert/strict";
import { mapImage, pickImageFormat } from "../shared/content/core.js";
import { buildSitemap, STATIC_PATHS } from "../shared/content/sitemap.js";

const origin = "https://media.example.org";

test("fotos: usa la versión reducida pedida, la siguiente mayor o el original", () => {
  const photo = { url: "/uploads/foto.jpg", alternativeText: "Foto",
    formats: { small: { url: "/uploads/small_foto.jpg" }, medium: { url: "/uploads/medium_foto.jpg" } } };
  assert.equal(mapImage(photo, origin).src, `${origin}/uploads/medium_foto.jpg`, "por defecto, 1280 px");
  assert.equal(mapImage(photo, origin, { size: "small" }).src, `${origin}/uploads/small_foto.jpg`);
  assert.equal(mapImage(photo, origin, { size: "large" }).src, `${origin}/uploads/foto.jpg`, "sin versión grande: el original");
  assert.equal(mapImage({ ...photo, formats: { large: { url: "/uploads/large_foto.jpg" } } }, origin).src, `${origin}/uploads/large_foto.jpg`,
    "sin la pedida: la siguiente mayor");
  assert.equal(mapImage({ url: "/uploads/logo.png" }, origin).src, `${origin}/uploads/logo.png`, "sin versiones: el original");
  assert.equal(mapImage({ url: "/uploads/a.png", formats: { medium: { url: "javascript:x" } } }, origin), null, "una versión insegura no se usa");
  assert.equal(mapImage(photo, origin).alt, "Foto");
  assert.equal(pickImageFormat(null), null);
});

test("sitemap: rutas fijas y contenido publicado, con URLs absolutas y XML escapado", () => {
  const xml = buildSitemap({ siteUrl: "https://bamxzamora.org/ruta/ignorada",
    pages: [{ slug: "voluntariado", updatedAt: "2026-10-01T10:00:00.000Z" }, { slug: "../admin" }, { slug: "<x>" }],
    newsletters: [{ slug: "octubre-2026", updatedAt: "2026-10-02T00:00:00.000Z" }, { slug: null }] });
  assert.match(xml, /^<\?xml version="1.0" encoding="UTF-8"\?>/);
  assert.equal((xml.match(/<url>/g) ?? []).length, STATIC_PATHS.length + 2);
  assert.match(xml, /<loc>https:\/\/bamxzamora\.org\/voluntariado<\/loc><lastmod>2026-10-01<\/lastmod>/);
  assert.match(xml, /<loc>https:\/\/bamxzamora\.org\/boletines\/octubre-2026<\/loc>/);
  assert.equal(xml.includes("admin") || xml.includes("<x>") || xml.includes("ignorada"), false);
  assert.throws(() => buildSitemap({ siteUrl: "javascript:alert(1)" }));
});
