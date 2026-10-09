import test from "node:test";
import assert from "node:assert/strict";
import { mapStrapiPartners, mapStrapiSite, mapsEmbedUrl } from "../shared/content/site.js";
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
    partners: { heading: { highlight: "Aliados" }, logos: [{ name: "A", logo: { url: "/uploads/a.webp" } }] },
    pageHeaderImage: { url: "/uploads/cabecera.webp", formats: { large: { url: "/uploads/large_cabecera.webp" } } },
    loadingScreen: { image: { url: "/uploads/campana.png" }, barColors: "#ff00ff" },
  } }, { mediaOrigin: "https://media.example.org" });
  assert.equal(site.contact.mapsLink, "");
  assert.equal(site.contact.linktreeUrl, "", "solo https");
  assert.equal(site.contact.mapsEmbedUrl, "");
  assert.deepEqual(site.social, [{ network: "facebook", url: "https://facebook.com/bamx", label: "" }]);
  assert.deepEqual(site.branding, { logo: null, darkLogo: null }, "sin logos elegidos: los de siempre");
  assert.deepEqual(Object.keys(site.seo), ["inicio"]);
  assert.equal(JSON.stringify(site).includes("secreto") || JSON.stringify(site).includes("admin@x"), false);
  assert.deepEqual(site.impact, impact);
  assert.equal(site.callToAction.link, null);
  assert.deepEqual(Object.keys(site.partners), ["heading"], "los logos ya no viajan en Datos del sitio");
  assert.equal(site.partners.heading.highlight, "Aliados");
  assert.equal(site.pageHeaderImage.src, "https://media.example.org/uploads/large_cabecera.webp", "cabecera en su versión grande");
  assert.equal(site.callToAction.image, null, "banda sin imagen: fondo gris");
  assert.deepEqual(site.loadingScreen, { image: { src: "https://media.example.org/uploads/campana.png", alt: "" }, barColors: "marca" },
    "pantalla de carga: color fuera de la lista → los de la marca");
});

test("aliados: orden del editor, enlace solo https y sin campos internos", () => {
  const logo = (name) => ({ url: `/uploads/${name}.webp`, alternativeText: name });
  const { partners } = mapStrapiPartners({ data: [
    { name: "Tercero", order: 30, logo: logo("c"), url: "https://c.example.org", createdBy: { email: "admin@x" } },
    { name: "Primero", order: 10, logo: logo("a"), url: "javascript:alert(1)" },
    { name: "Segundo", order: 20, logo: logo("b"), url: "http://inseguro.example.org" },
    { name: "Sin logo", order: 5, logo: null },
  ] }, { mediaOrigin: "https://media.example.org" });
  assert.deepEqual(partners, [
    { name: "Primero", logo: { src: "https://media.example.org/uploads/a.webp", alt: "a" }, url: "" },
    { name: "Segundo", logo: { src: "https://media.example.org/uploads/b.webp", alt: "b" }, url: "" },
    { name: "Tercero", logo: { src: "https://media.example.org/uploads/c.webp", alt: "c" }, url: "https://c.example.org/" },
  ]);
  assert.throws(() => mapStrapiPartners({ data: null }), /Aliados/);
});

test("datos del sitio: exige populate y cifras completas", () => {
  const rest = { callToAction: null, partners: null, pageHeaderImage: null };
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

test("redes nuevas y logos: redes de la lista, nombre propio solo en otro, logos del origen de medios", () => {
  const site = mapStrapiSite({ data: {
    phone: "1", impact: { familiesPerMonth: 1, foodKgPerMonth: 1, municipalities: 1, communityGroups: 1, deliveryPoints: 1, foundedYear: 2013 },
    seo: [], callToAction: null, partners: null, pageHeaderImage: null,
    socialLinks: [
      { network: "threads", url: "https://threads.net/@bamx" },
      { network: "otro", url: "https://linktr.ee/bamx", label: "Todas nuestras redes" },
      { network: "myspace", url: "https://myspace.com/x" },
    ],
    branding: { logo: { url: "/uploads/logo.png", formats: { small: { url: "/uploads/small_logo.png" } } }, darkLogo: null },
  } }, { mediaOrigin: "https://media.example.org" });
  assert.deepEqual(site.social.map((item) => [item.network, item.label]), [["threads", ""], ["otro", "Todas nuestras redes"]]);
  assert.equal(site.branding.logo.src, "https://media.example.org/uploads/small_logo.png");
  assert.equal(site.branding.darkLogo, null);
});
