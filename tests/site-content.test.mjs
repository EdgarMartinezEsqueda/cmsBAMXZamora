import test from "node:test";
import assert from "node:assert/strict";
import { mapStrapiSite, mapsEmbedUrl } from "../shared/content/site.js";
import { isValidClabe, mapStrapiBank } from "../shared/content/bank.js";

const impact = { familiesPerMonth: 10000, foodKgPerMonth: 70124, municipalities: 7, communityGroups: 70, deliveryPoints: 90, foundedYear: 2013 };

test("datos del sitio: filtra enlaces peligrosos, redes desconocidas y campos privados", () => {
  const site = mapStrapiSite({ data: {
    phone: "351", email: "a@b.org", createdBy: { email: "admin@x" }, privateField: "secreto",
    mapsLink: "javascript:alert(1)", linktreeUrl: "http://linktr.ee/x",
    mapsEmbedUrl: "https://evil.example/maps/embed?pb=1",
    socialLinks: [
      { network: "facebook", url: "https://facebook.com/bamx" },
      { network: "myspace", url: "https://myspace.com/x" },
      { network: "instagram", url: "/relativo" },
    ],
    impact,
    seo: [{ page: "inicio", title: "Inicio", description: "D" }, { page: "__proto__", title: "x", description: "y" }],
    callToAction: { title: "Súmate", link: { label: "Ir", url: "data:text/html,x" } },
    partners: { heading: { highlight: "Aliados" }, logos: [{ name: "A", logo: { url: "/uploads/a.webp" } }, { name: "Sin logo", logo: null }] },
  } }, { mediaOrigin: "https://media.example.org" });
  assert.equal(site.contact.mapsLink, "");
  assert.equal(site.contact.linktreeUrl, "", "solo https");
  assert.equal(site.contact.mapsEmbedUrl, "");
  assert.deepEqual(site.social, [{ network: "facebook", url: "https://facebook.com/bamx" }]);
  assert.deepEqual(Object.keys(site.seo), ["inicio"]);
  assert.equal(JSON.stringify(site).includes("secreto") || JSON.stringify(site).includes("admin@x"), false);
  assert.deepEqual(site.impact, impact);
  assert.equal(site.callToAction.link, null);
  assert.deepEqual(site.partners.logos, [{ name: "A", logo: { src: "https://media.example.org/uploads/a.webp", alt: "" } }]);
});

test("datos del sitio: exige populate y cifras completas", () => {
  const rest = { callToAction: null, partners: null };
  assert.throws(() => mapStrapiSite({ data: { impact, seo: [], ...rest } }), /populate de socialLinks/);
  assert.throws(() => mapStrapiSite({ data: { socialLinks: [], seo: [], impact } }), /populate de callToAction/);
  assert.throws(() => mapStrapiSite({ data: { socialLinks: [], seo: [], ...rest, impact: { ...impact, municipalities: "7" } } }), /Cifras/);
  assert.throws(() => mapStrapiSite({ data: { socialLinks: [], seo: [], ...rest, impact: null } }), /Cifras/);
});

test("mapa insertado: solo google.com/maps/embed", () => {
  assert.ok(mapsEmbedUrl("https://www.google.com/maps/embed?pb=!1m14"));
  for (const url of ["https://www.google.com.evil.test/maps/embed", "https://www.google.com/search?q=x", "http://www.google.com/maps/embed?pb=1", "javascript:alert(1)"]) {
    assert.equal(mapsEmbedUrl(url), "", url);
  }
});

test("datos bancarios: nunca muestra una CLABE con dígito de control inválido", () => {
  const clabe = "002010077777777771";
  assert.equal(isValidClabe(clabe), true);
  assert.equal(isValidClabe("002010077777777772"), false);
  assert.equal(isValidClabe("00201007777777777"), false);
  assert.deepEqual(mapStrapiBank({ data: { bankName: " BANBAJÍO ", clabe, accountNumber: "1234567", updatedBy: "x" } }),
    { bankName: "BANBAJÍO", clabe, accountNumber: "1234567" });
  assert.throws(() => mapStrapiBank({ data: { bankName: "B", clabe: "002010077777777772", accountNumber: "1234567" } }), /CLABE/);
  assert.throws(() => mapStrapiBank({ data: { bankName: "B", clabe, accountNumber: "12-34" } }), /cuenta/);
  assert.throws(() => mapStrapiBank({ data: { bankName: "", clabe, accountNumber: "1234567" } }), /banco/);
});
