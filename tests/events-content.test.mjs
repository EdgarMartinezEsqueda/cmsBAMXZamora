import test from "node:test";
import assert from "node:assert/strict";
import { eventTiming, mapStrapiEvent, mapStrapiEventList, mexicoDay } from "../shared/content/events.js";
import { googleCalendarUrl, whatsappContactUrl, whatsappShareUrl } from "../src/components/events/eventFormat.js";
import { contentForPath, eventsView } from "../src/utils/routeContent.js";

const media = { mediaOrigin: "https://media.example.org" };
const now = new Date("2026-10-10T18:00:00Z"); // 10 de octubre, 12:00 en México
const base = {
  title: "Gran venta de calzado", slug: "venta-calzado", category: "bazares", audience: "publico",
  startDate: "2026-10-15T16:00:00.000Z", endDate: null, eventStatus: "programado",
  coverImage: { url: "/uploads/zapatos.webp" }, gallery: [{ url: "/uploads/g1.webp" }], requirements: [{ text: "INE" }],
  results: [{ value: "150", label: "Familias atendidas" }, { value: "", label: "vacía" }],
  costType: "gratuito", priceDetails: "Desde $50", registrationUrl: "javascript:alert(1)", mapsUrl: "https://evil.example/maps",
  description: [{ type: "paragraph", children: [{ type: "text", text: "Te esperamos" }] }],
  createdBy: { email: "admin@x" }, contactPhone: "<b>33 1234 5678</b>",
};

test("eventos: momento del evento en la hora de México", () => {
  assert.equal(eventTiming({ startDate: "2026-10-15T16:00:00Z" }, now), "proximo");
  assert.equal(eventTiming({ startDate: "2026-10-10T15:00:00Z" }, now), "en-curso", "sin término: dura hasta el final de su día");
  assert.equal(eventTiming({ startDate: "2026-10-09T15:00:00Z" }, now), "realizado");
  assert.equal(eventTiming({ startDate: "2026-10-10T15:00:00Z", endDate: "2026-10-10T17:00:00Z" }, now), "realizado");
  assert.equal(mexicoDay("2026-10-11T03:00:00Z"), "2026-10-10", "las 21:00 del día 10 en México");
});

test("eventos: el detalle solo publica campos seguros y resultados después del evento", () => {
  const upcoming = mapStrapiEvent({ data: base }, { ...media, now });
  assert.equal(upcoming.timing, "proximo");
  assert.deepEqual(upcoming.results, [], "un evento futuro no muestra resultados");
  assert.deepEqual(upcoming.gallery, []);
  assert.deepEqual(upcoming.requirements, [], "los bazares no llevan requisitos");
  assert.deepEqual(upcoming.cost, { type: "gratuito", details: "Desde $50" });
  assert.equal(upcoming.registrationUrl, "", "solo enlaces https");
  assert.equal(upcoming.mapsUrl, "", "solo enlaces de Google Maps");
  assert.equal(upcoming.contactPhone, "33 1234 5678");
  assert.deepEqual(upcoming.tags, ["Gratuito", "Abierto al público"]);
  assert.equal(JSON.stringify(upcoming).includes("admin@x"), false);

  const past = mapStrapiEvent({ data: { ...base, category: "entregas", startDate: "2026-10-01T15:00:00Z" } }, { ...media, now });
  assert.equal(past.timing, "realizado");
  assert.deepEqual(past.results, [{ value: "150", label: "Familias atendidas" }]);
  assert.equal(past.gallery[0].src, "https://media.example.org/uploads/g1.webp");
  assert.deepEqual(past.requirements, ["INE"], "las entregas sí llevan requisitos");
  assert.equal(past.cost, null, "las entregas no llevan costo");
  const { results: _results, ...withoutResults } = base;
  assert.throws(() => mapStrapiEvent({ data: withoutResults }, media), /populate de results/);
});

test("eventos: listado con valores por defecto y cifra destacada solo en realizados", () => {
  const list = mapStrapiEventList({ data: [
    { ...base, category: "otra", eventStatus: "borrado", audience: "nadie" },
    { ...base, slug: "entrega", startDate: "2026-10-01T15:00:00Z" },
  ] }, { ...media, now, scope: "proximos" });
  assert.equal(list.items[0].category, "especiales");
  assert.equal(list.items[0].status, "programado");
  assert.equal(list.items[0].audience, "publico");
  assert.equal(list.items[0].highlight, null);
  assert.deepEqual(list.items[1].highlight, { value: "150", label: "Familias atendidas" });
  assert.throws(() => mapStrapiEventList({ data: [{ ...base, slug: "../x" }] }, media), /slug inválido/);
  assert.throws(() => mapStrapiEventList({ data: [{ ...base, startDate: "ayer" }] }, media), /fecha/);
});

test("eventos: Google Calendar, WhatsApp y precarga de /eventos", () => {
  const calendar = new URL(googleCalendarUrl({ ...base, summary: "Calzado" }, "https://bamxzamora.org/eventos/venta-calzado"));
  assert.equal(calendar.hostname, "calendar.google.com");
  assert.equal(calendar.searchParams.get("dates"), "20261015T160000Z/20261015T180000Z", "sin término: dos horas");
  assert.match(whatsappContactUrl("33 1234 5678", "Venta"), /^https:\/\/wa\.me\/523312345678\?text=/);
  assert.equal(whatsappContactUrl("123", "Venta"), "", "un número incompleto no genera enlace");
  assert.match(whatsappShareUrl("Venta", "https://bamxzamora.org/eventos/x"), /^https:\/\/wa\.me\/\?text=Venta%20https/);

  const view = eventsView("?ver=realizados&categoria=bazares&pagina=2&mes=2026-11", now);
  assert.deepEqual(view.listQuery, { scope: "realizados", category: "bazares", page: "2" });
  assert.deepEqual(view.calendarQuery, { month: "2026-11", category: "bazares" });
  const defaults = eventsView("?categoria=inventada&pagina=0&mes=1999-13", now);
  assert.deepEqual(defaults.listQuery, { scope: "proximos", category: undefined, page: undefined });
  assert.equal(defaults.month, "2026-10", "sin mes válido: el actual en México");
  assert.deepEqual(contentForPath("/eventos/venta-calzado").map((item) => item.key), ["events/venta-calzado"]);
  assert.deepEqual(contentForPath("/eventos").map((item) => item.key), ["events", "events"], "lista y calendario");
});
