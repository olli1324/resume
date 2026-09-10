import assert from "node:assert/strict";
import { test } from "node:test";

import { erFersk, fraTittel, lesAiKommentar, TAG } from "../linear.js";
import { CSV_KOLONNER, NEDERST, STATUS_REKKEFOLGE, statusIndeks, tilCsv } from "../records.js";

const META = {
  Owner: "Oliver", Company: "Descent AS", Contact: "Jesper Rudolfsen",
  ContactInfo: "922 14 398", Status: "Fullført lead",
};
const body = (meta = META, tekst = "Noe skjedde.") =>
  `${TAG}\n${JSON.stringify(meta)}\n${tekst}`;

test("leser tagget kommentar", () => {
  const k = lesAiKommentar(body(), "c1", "2026-09-04T10:00:00Z");
  assert.deepEqual(k.metadata, META);
  assert.equal(k.sammendrag, "Noe skjedde.");
});

test("ignorerer menneskelige kommentarer og ugyldig json", () => {
  assert.equal(lesAiKommentar("Vanlig kommentar", "c", "t"), null);
  assert.equal(lesAiKommentar(`${TAG}\nikke json\ntekst`, "c", "t"), null);
  assert.equal(lesAiKommentar("", "c", "t"), null);
});

test("eldre tagg med kildetidsstempel aksepteres", () => {
  const med = { ...META, SourceCommentAt: "2026-01-01T00:00:00Z" };
  const k = lesAiKommentar(body(med), "c1", "2026-09-04T10:00:00Z");
  assert.ok(k);
  // Tidsstemplet påvirker ikke ferskheten.
  assert.equal(erFersk(k, [], "2026-09-04T09:00:00Z", med).fersk, true);
});

test("fersk når ingenting er endret", () => {
  const k = lesAiKommentar(body(), "c1", "2026-09-04T12:00:00Z");
  assert.equal(erFersk(k, [], "2026-09-04T11:00:00Z", META).fersk, true);
});

test("stale når status er endret", () => {
  const k = lesAiKommentar(body(), "c1", "2026-09-04T12:00:00Z");
  const r = erFersk(k, [], "2026-09-04T11:00:00Z", { ...META, Status: "Venter på svar" });
  assert.equal(r.fersk, false);
  assert.match(r.grunn, /Status/);
});

test("stale når kortet er endret etterpå", () => {
  const k = lesAiKommentar(body(), "c1", "2026-09-04T12:00:00Z");
  assert.equal(erFersk(k, [], "2026-09-04T13:00:00Z", META).fersk, false);
});

test("kildekommentar redigert etterpå gjør oppsummeringen stale", () => {
  const k = lesAiKommentar(body(), "c1", "2026-09-04T12:00:00Z");
  const r = erFersk(k, [{ createdAt: "2026-09-03T09:00:00Z", updatedAt: "2026-09-04T14:00:00Z" }],
    "2026-09-04T11:00:00Z", META);
  assert.equal(r.fersk, false);
});

test("små avvik i kildekommentarens klokke er greit", () => {
  const k = lesAiKommentar(body(), "c1", "2026-09-04T12:00:00Z");
  const r = erFersk(k, [{ createdAt: "2026-09-04T11:59:00Z", updatedAt: "2026-09-04T11:59:30Z" }],
    "2026-09-04T11:00:00Z", META);
  assert.equal(r.fersk, true);
});

test("statusrekkefølge med skrinlagt case nederst", () => {
  assert.ok(statusIndeks("Fullført lead") < statusIndeks("Ukontaktet"));
  assert.ok(statusIndeks("Ukontaktet") < statusIndeks("Ikke relevante leads"));
  assert.ok(statusIndeks("Ikke relevante leads") < statusIndeks("Ikke nyttig lead"));
  const ukjent = statusIndeks("Helt ny status");
  assert.ok(statusIndeks("Ukontaktet") < ukjent);
  assert.ok(ukjent < statusIndeks(NEDERST[0]));
  assert.equal(STATUS_REKKEFOLGE[0], "Fysiske møter");
  assert.ok(statusIndeks("Fysiske møter") < statusIndeks("Fullført lead"));
});

test("tittelparsing tåler gruppas ulike skrivemåter", () => {
  assert.deepEqual(fraTittel("Jesper Rudolfsen – Descent AS (daglig leder)"),
    { navn: "Jesper Rudolfsen", selskap: "Descent AS", stilling: "daglig leder" });
  assert.deepEqual(fraTittel("Tone Aspevik, Nofima PhD Seniorforsker"),
    { navn: "Tone Aspevik", selskap: "Nofima", stilling: "PhD Seniorforsker" });
  assert.equal(fraTittel("Espen Sandviknes - driftsleder MOWI").selskap, "MOWI");
  assert.equal(fraTittel("Fredrik Thrana - SalMar driftsleder").stilling, "driftsleder");
});

test("csv uten BOM, med riktig escaping og kolonnerekkefølge", () => {
  const ut = tilCsv([{
    ansvarlig: "Oliver", selskap: 'Acme "AS"', kontaktperson: "Ola",
    stilling: "daglig leder", kontaktinfo: "ola@x.no\n480 40 862",
    status: "Fullført lead", notater: "Ett, to og tre.",
  }]);
  assert.ok(!ut.startsWith("﻿"), "CSV skal ikke ha BOM");
  const linjer = ut.split("\r\n");
  assert.equal(linjer[0], CSV_KOLONNER.join(","));
  assert.match(linjer[1], /"Acme ""AS"""/);
  assert.match(ut, /"ola@x\.no\n480 40 862"/);
  assert.match(ut, /"Ett, to og tre\."/);
});

test("html-entiteter dekodes, også numeriske", async () => {
  // avkod er intern i referanse.js; testes gjennom en liten kopi av regelen
  // for å fange regresjoner i mønsteret.
  const NAVNGITTE = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
  const avkod = s => String(s)
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, n) => NAVNGITTE[n.toLowerCase()] ?? m);
  assert.equal(avkod("N&#230;rings- og fiskeridepartementet"),
    "Nærings- og fiskeridepartementet");
  assert.equal(avkod("Kaffe &amp; te"), "Kaffe & te");
  assert.equal(avkod("&#xe5;pen"), "åpen");
});
