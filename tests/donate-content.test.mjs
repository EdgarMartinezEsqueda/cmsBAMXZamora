import test from "node:test";
import assert from "node:assert/strict";
import { mapStrapiDonate } from "../shared/content/donate.js";

test("Donar: solo enlaces de donación https externos y nada de datos bancarios en este contrato", () => {
  const content = mapStrapiDonate({ data: {
    pageTitle: "Dona ahora", heading: { lead: "Haz la diferencia" }, clabe: "002010077777777771",
    onlineLinks: [
      { label: "PayPal", url: "https://www.paypal.com/donate?x=1" },
      { label: "Interno", url: "/donar" },
      { label: "Inseguro", url: "http://example.org" },
      { label: "", url: "https://example.org" },
    ],
    safetyPoints: [{ title: "Pagos Seguros", description: "D" }],
    closingTaglines: [{ text: "Cada donación cuenta" }],
  } });
  assert.deepEqual(content.onlineLinks, [{ label: "PayPal", url: "https://www.paypal.com/donate?x=1" }]);
  assert.equal(JSON.stringify(content).includes("002010077777777771"), false, "la CLABE nunca sale por este contrato");
  assert.deepEqual(content.closingTaglines, ["Cada donación cuenta"]);
  assert.throws(() => mapStrapiDonate({ data: { pageTitle: "D", heading: null } }), /populate de onlineLinks/);
});
