import test from "node:test";
import assert from "node:assert/strict";
import { contentForPath } from "../src/utils/routeContent.js";
import { contentUrl, forgetContent, peekContent, requestContent } from "../src/utils/cmsStore.js";

test("precarga: cada ruta pide las mismas claves que su página", () => {
  const keys = (path, search) => contentForPath(path, search).map((item) => item.key);
  assert.deepEqual(keys("/"), ["home", "newsletters"]);
  assert.deepEqual(keys("/nosotros/"), ["about"], "la barra final no cambia la ruta");
  assert.deepEqual(keys("/donar"), ["donate", "bank"]);
  assert.deepEqual(keys("/apadrinamiento"), ["sponsorship", "sponsoredCases"]);
  assert.deepEqual(contentForPath("/boletines", "?year=2026&page=2"), [{ key: "newsletters", query: { year: "2026", page: "2" } }]);
  assert.deepEqual(keys("/boletines/octubre-2026"), ["newsletters/octubre-2026"]);
  assert.deepEqual(keys("/voluntariado-escolar"), ["pages/voluntariado-escolar"]);
  for (const path of ["/gestion-bamx", "/uploads/x.pdf", "/Mayusculas", "/a/b/c", "/boletines/../admin"]) {
    assert.deepEqual(keys(path), [], `sin contenido: ${path}`);
  }
});

test("caché de peticiones: una sola petición por dirección; los errores no se guardan", async () => {
  const calls = [];
  const responses = [new Response("x", { status: 500 }), Response.json({ ok: 1 }), new Response("", { status: 404 })];
  globalThis.fetch = async (url) => { calls.push(url); return responses.shift(); };
  const url = contentUrl("prueba", { year: 2026, page: undefined });
  assert.match(url, /\/api\/content\/prueba\?year=2026$/);

  assert.deepEqual(await requestContent(url), { status: "error" });
  assert.equal(peekContent(url), null, "un error no se guarda: el siguiente intento vuelve a pedir");
  const [first, second] = await Promise.all([requestContent(url), requestContent(url)]);
  assert.deepEqual(first, { status: "ready", content: { ok: 1 } });
  assert.equal(first, second);
  assert.equal(calls.length, 2, "dos componentes con la misma dirección: una sola petición");
  assert.deepEqual(peekContent(url), first, "ya disponible: se pinta sin esperar");

  forgetContent(url);
  assert.deepEqual(await requestContent(url), { status: "unpublished" });
  assert.equal(calls.length, 3);
});
