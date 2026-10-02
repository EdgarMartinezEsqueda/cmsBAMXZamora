import test from "node:test";
import assert from "node:assert/strict";
import { mapStrapiContactPage, mapStrapiProgramsPage } from "../shared/content/pages.js";

test("Contacto y Programas: textos, enlace seguro y respuesta incompleta rechazada", () => {
  const contact = mapStrapiContactPage({ data: { pageTitle: "Contáctanos", heading: { highlight: "Contáctanos" }, formTitle: "Envía", updatedBy: "admin" } });
  assert.equal(contact.heading.highlight, "Contáctanos");
  assert.equal(JSON.stringify(contact).includes("admin"), false);
  assert.throws(() => mapStrapiContactPage({ data: { pageTitle: "C" } }), /populate de heading/);

  const programs = mapStrapiProgramsPage({ data: { pageTitle: "Programas", heading: null, detailLink: { label: "Ir", url: "vbscript:x" } } });
  assert.equal(programs.detailLink, null);
  assert.throws(() => mapStrapiProgramsPage({ data: { pageTitle: "P", heading: null } }), /populate de detailLink/);
});
