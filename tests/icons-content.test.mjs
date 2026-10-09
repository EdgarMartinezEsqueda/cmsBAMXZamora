import test from "node:test";
import assert from "node:assert/strict";
import { ICON_CATALOG, findIcon, searchIcons } from "../cms/src/admin/components/iconCatalog.js";
import { mapCards, mapFeatures } from "../shared/content/core.js";
import { ICON_KEYS, iconKey } from "../shared/content/icons.js";
import { CONTENT_ICONS } from "../src/content/icons.js";

test("iconos: el panel, el sitio y el contrato tienen las mismas claves", () => {
  assert.deepEqual(ICON_CATALOG.map((icon) => icon.key).sort(), [...ICON_KEYS].sort());
  assert.deepEqual(Object.keys(CONTENT_ICONS).sort(), [...ICON_KEYS].sort());
  assert.equal(new Set(ICON_KEYS).size, ICON_KEYS.length, "sin claves repetidas");
  for (const key of ["hands-helping", "gift", "utensils", "chalkboard", "palette", "book", "first-aid", "heartbeat", "heart",
    "newspaper", "handshake", "hand-holding-heart", "donate", "users", "phone", "arrow"]) {
    assert.ok(ICON_KEYS.includes(key), `se conserva la clave que ya usaban Programas o la Portada: ${key}`);
  }
  for (const icon of ICON_CATALOG) assert.equal(typeof icon.Icon, "function", `dibujo de ${icon.key}`);
});

test("iconos: solo claves del catálogo; búsqueda en español sin acentos", () => {
  assert.equal(iconKey("truck"), "truck");
  for (const bad of ["Truck", "camion", "", null, 5, "<script>", "__proto__"]) assert.equal(iconKey(bad), null, String(bad));
  assert.ok(searchIcons("camion").some((icon) => icon.key === "truck"), "sin acento encuentra Camión");
  assert.ok(searchIcons("chofer").some((icon) => icon.key === "truck"), "por palabra clave");
  assert.ok(searchIcons("SALUD").some((icon) => icon.key === "heartbeat"));
  assert.equal(searchIcons("").length, ICON_CATALOG.length, "sin búsqueda: todos");
  assert.deepEqual(searchIcons("xyz-no-existe"), []);
  assert.equal(findIcon("warehouse").label, "Almacén");
  assert.equal(findIcon("nope"), null);
});

test("iconos: las tarjetas llevan el icono elegido o null (automático)", () => {
  assert.deepEqual(mapCards([{ title: "Chofer", description: "D", icon: "truck" }, { title: "Otro", description: "D", icon: "inventado" }])
    .map((card) => card.icon), ["truck", null]);
  assert.deepEqual(mapFeatures([{ title: "Vacante", items: [], icon: "briefcase" }]).map((feature) => feature.icon), ["briefcase"]);
});
