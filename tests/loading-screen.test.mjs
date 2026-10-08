import test from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_LOADING_SCREEN, normalizeLoadingScreen, readLoadingScreen, saveLoadingScreen } from "../src/utils/loadingScreen.js";

test("pantalla de carga guardada: solo imágenes de la biblioteca y colores de la lista", () => {
  const store = new Map();
  globalThis.localStorage = { getItem: (key) => store.get(key) ?? null, setItem: (key, value) => store.set(key, String(value)) };
  assert.deepEqual(readLoadingScreen(), DEFAULT_LOADING_SCREEN, "sin nada guardado: la de siempre");

  saveLoadingScreen({ image: { src: "https://bamxzamora.org/uploads/campana_1a2b.png", alt: "x" }, barColors: "verde" });
  assert.deepEqual(readLoadingScreen(), { image: { src: "https://bamxzamora.org/uploads/campana_1a2b.png", alt: "" }, barColors: "verde" });

  for (const src of ["javascript:alert(1)", "https://evil.example/x.png", "https://bamxzamora.org/uploads/../x", "data:image/png;base64,AA"]) {
    assert.equal(normalizeLoadingScreen({ image: { src } }).image, null, `imagen no permitida: ${src}`);
  }
  assert.equal(normalizeLoadingScreen({ barColors: "url(x)" }).barColors, "marca");
  store.set("bamx-loading-screen", "{no es json");
  assert.deepEqual(readLoadingScreen(), DEFAULT_LOADING_SCREEN, "lo guardado roto: la de siempre");
  delete globalThis.localStorage;
});
